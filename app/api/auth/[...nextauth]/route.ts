import { handlers } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

// Wrap handlers with error handling
export async function GET(request: NextRequest) {
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

export async function POST(request: NextRequest) {
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

