import { handlers } from "@/lib/auth";
import { NextResponse } from "next/server";

// Wrap handlers with error handling
export async function GET(request: Request) {
  try {
    const { GET } = handlers;
    return await GET(request);
  } catch (error) {
    console.error('NextAuth GET error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { POST } = handlers;
    return await POST(request);
  } catch (error) {
    console.error('NextAuth POST error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

