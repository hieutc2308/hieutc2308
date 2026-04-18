import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { pin } = await request.json();

  if (!pin || typeof pin !== "string") {
    return NextResponse.json({ error: "PIN required" }, { status: 400 });
  }

  const correct = pin === process.env.PLACES_PIN;
  return NextResponse.json({ success: correct }, { status: correct ? 200 : 401 });
}
