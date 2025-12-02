import { NextResponse } from "next/server";

export async function GET() {
  const isAdmin = process.env.IS_ADMIN === "TRUE";
  return NextResponse.json({ isAdmin });
}






