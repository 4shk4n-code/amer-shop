import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// This is a one-time setup route to create the first admin user
// Remove or protect this route after creating your admin user
export async function POST(request: Request) {
  try {
    // For security, you might want to add a secret token check here
    const body = await request.json();
    const { email, name, secret } = body;

    // Simple secret check (change this secret!)
    if (secret !== process.env.ADMIN_CREATE_SECRET || !secret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Update existing user to admin
      user = await prisma.user.update({
        where: { email },
        data: { role: "admin" },
      });
    } else {
      // Create new admin user
      user = await prisma.user.create({
        data: {
          email,
          name: name || email,
          role: "admin",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Admin user created/updated",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create admin user" },
      { status: 500 }
    );
  }
}

