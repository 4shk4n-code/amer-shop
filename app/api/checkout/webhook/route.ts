import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const TELR_API_KEY = process.env.TELR_API_KEY || "";
const TELR_API_PASSWORD = process.env.TELR_API_PASSWORD || "";

// Verify Telr webhook signature
function verifyTelrSignature(params: Record<string, string>, signature: string): boolean {
  const sortedParams = Object.keys(params)
    .filter((key) => key !== "ivp_signature") // Exclude signature from calculation
    .sort()
    .map((key) => `${key}${params[key]}`)
    .join("");
  
  const signatureString = TELR_API_KEY + sortedParams + TELR_API_PASSWORD;
  const calculatedSignature = crypto.createHash("sha256").update(signatureString).digest("hex");
  
  return calculatedSignature === signature;
}

export async function POST(request: Request) {
  try {
    // Telr sends webhook data as form data or query params
    const formData = await request.formData();
    const webhookData: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      webhookData[key] = value.toString();
    });

    // If no form data, try to get from URL params (Telr sometimes sends as GET)
    if (Object.keys(webhookData).length === 0) {
      const url = new URL(request.url);
      url.searchParams.forEach((value, key) => {
        webhookData[key] = value;
      });
    }

    const {
      ivp_cart: orderId,
      ivp_tranref: transactionRef,
      ivp_status: status,
      ivp_signature: signature,
      ivp_authcode: authCode,
      ivp_message: message,
    } = webhookData;

    if (!orderId || !signature) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Verify signature
    if (!verifyTelrSignature(webhookData, signature)) {
      console.error("Invalid Telr webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Extract order ID from Telr order ID format: ORD-{orderId}-{timestamp}
    const orderIdMatch = orderId.match(/ORD-([^-]+)-/);
    const dbOrderId = orderIdMatch ? orderIdMatch[1] : null;

    if (!dbOrderId) {
      console.error("Could not extract order ID from:", orderId);
      return NextResponse.json(
        { error: "Invalid order ID format" },
        { status: 400 }
      );
    }

    // Find order in database
    const order = await prisma.order.findUnique({
      where: { id: dbOrderId },
    });

    if (!order) {
      console.error("Order not found:", dbOrderId);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order based on payment status
    // Telr status codes: A = Authorized, P = Pending, H = Held, C = Cancelled, E = Error
    let paymentStatus = "pending";
    let orderStatus = order.status;

    if (status === "A" || status === "3") {
      // Authorized/Successful
      paymentStatus = "paid";
      orderStatus = "processing";
    } else if (status === "C" || status === "4") {
      // Cancelled
      paymentStatus = "failed";
      orderStatus = "cancelled";
    } else if (status === "E" || status === "5") {
      // Error
      paymentStatus = "failed";
    } else if (status === "H" || status === "2") {
      // Held (pending review)
      paymentStatus = "pending";
    }

    // Update order
    await prisma.order.update({
      where: { id: dbOrderId },
      data: {
        paymentStatus,
        status: orderStatus,
        notes: JSON.stringify({
          ...(order.notes ? (() => {
            try {
              return JSON.parse(order.notes);
            } catch {
              return {};
            }
          })() : {}),
          telrTransactionRef: transactionRef,
          telrAuthCode: authCode,
          telrMessage: message,
          telrStatus: status,
          webhookReceived: new Date().toISOString(),
        }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Telr also supports GET requests for webhooks
export async function GET(request: Request) {
  return POST(request);
}

