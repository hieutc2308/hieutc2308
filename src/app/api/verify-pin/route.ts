import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let pin: unknown;

  try {
    const body = await request.json();
    pin = body.pin;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!pin || typeof pin !== "string") {
    return NextResponse.json({ error: "PIN required" }, { status: 400 });
  }

  const correct = pin === process.env.PLACES_PIN;
  return NextResponse.json({ success: correct }, { status: correct ? 200 : 401 });
}
