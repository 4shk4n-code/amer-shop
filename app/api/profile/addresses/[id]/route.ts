import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH update address
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: "Invalid address ID" },
        { status: 400 }
      );
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
    if (firstName && (typeof firstName !== 'string' || firstName.trim().length === 0)) {
      return NextResponse.json(
        { error: "First name must be a non-empty string" },
        { status: 400 }
      );
    }

    if (lastName && (typeof lastName !== 'string' || lastName.trim().length === 0)) {
      return NextResponse.json(
        { error: "Last name must be a non-empty string" },
        { status: 400 }
      );
    }

    if (email && (typeof email !== 'string' || !email.includes('@'))) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Verify address belongs to user
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    // If this is set as default, unset other defaults of the same type
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: (session.user as any).id,
          type: type || existingAddress.type,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state !== undefined && { state }),
        ...(zipCode !== undefined && { zipCode }),
        ...(country && { country }),
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error: any) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update address" },
      { status: 500 }
    );
  }
}

// DELETE address
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: "Invalid address ID" },
        { status: 400 }
      );
    }

    // Verify address belongs to user
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete address" },
      { status: 500 }
    );
  }
}

