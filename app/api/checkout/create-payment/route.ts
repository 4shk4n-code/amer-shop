import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Telr Payment Gateway Configuration
const TELR_MERCHANT_ID = process.env.TELR_MERCHANT_ID || "";
const TELR_API_KEY = process.env.TELR_API_KEY || "";
const TELR_API_PASSWORD = process.env.TELR_API_PASSWORD || "";
const TELR_BASE_URL = process.env.TELR_BASE_URL || "https://secure.telr.com/gateway/remote.html";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Generate Telr signature for secure payment
function generateTelrSignature(params: Record<string, string>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}${params[key]}`)
    .join("");
  
  const signatureString = TELR_API_KEY + sortedParams + TELR_API_PASSWORD;
  return crypto.createHash("sha256").update(signatureString).digest("hex");
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      items,
      shippingInfo,
      billingInfo,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      paymentRequestDetails,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Validate Telr configuration
    if (!TELR_MERCHANT_ID || !TELR_API_KEY || !TELR_API_PASSWORD) {
      console.error("Telr configuration missing. Please set TELR_MERCHANT_ID, TELR_API_KEY, and TELR_API_PASSWORD in .env");
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 500 }
      );
    }

    // Create order in database with pending status
    const order = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        total,
        subtotal,
        tax,
        shipping,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: paymentMethod || "telr",
        shippingAddress: JSON.stringify(shippingInfo),
        billingAddress: JSON.stringify(billingInfo),
        notes: paymentRequestDetails ? JSON.stringify({ paymentRequestDetails }) : undefined,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Prepare Telr payment parameters
    const orderId = `ORD-${order.id}-${Date.now()}`;
    const currency = "AED";
    
    // Build product description
    const productDescription = items
      .map((item: any) => `${item.name} x${item.quantity}`)
      .join(", ")
      .substring(0, 255); // Telr has a limit on description length

    // Telr payment parameters
    const telrParams: Record<string, string> = {
      ivp_method: "create",
      ivp_store: TELR_MERCHANT_ID,
      ivp_authkey: TELR_API_KEY,
      ivp_cart: orderId,
      ivp_test: process.env.NODE_ENV === "development" ? "1" : "0", // Test mode in development
      ivp_amount: total.toFixed(2),
      ivp_currency: currency,
      ivp_desc: productDescription,
      return_auth: `${BASE_URL}/checkout/success?order_id=${order.id}`,
      return_can: `${BASE_URL}/checkout/cancel?order_id=${order.id}`,
      return_decl: `${BASE_URL}/checkout/declined?order_id=${order.id}`,
      bill_fname: shippingInfo.firstName,
      bill_lname: shippingInfo.lastName,
      bill_email: shippingInfo.email,
      bill_addr1: shippingInfo.address,
      bill_city: shippingInfo.city,
      bill_country: shippingInfo.country || "AE",
      bill_phone: shippingInfo.phone,
    };

    // Generate signature
    const signature = generateTelrSignature(telrParams);
    telrParams.ivp_signature = signature;

    // Store order reference in database for webhook verification
    await prisma.order.update({
      where: { id: order.id },
      data: {
        notes: JSON.stringify({
          telrOrderId: orderId,
          telrParams: telrParams,
        }),
      },
    });

    // Build Telr payment URL
    const paymentUrl = `${TELR_BASE_URL}?${new URLSearchParams(telrParams).toString()}`;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentUrl,
    });
  } catch (error: any) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment" },
      { status: 500 }
    );
  }
}

