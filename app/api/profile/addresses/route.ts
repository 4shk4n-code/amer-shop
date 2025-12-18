import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET user addresses
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: (session.user as any).id },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(addresses);
  } catch (error: any) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// POST create new address
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      type,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      isDefault,
    } = body;

    // Input validation
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      );
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
      return NextResponse.json(
        { error: "Last name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      return NextResponse.json(
        { error: "City is required" },
        { status: 400 }
      );
    }

    // If this is set as default, unset other defaults of the same type
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: (session.user as any).id,
          type,
        },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: (session.user as any).id,
        type: type || "shipping",
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country: country || "UAE",
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error: any) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create address" },
      { status: 500 }
    );
  }
}

