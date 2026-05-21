import { NextResponse } from "next/server";
import { createOrder } from "../../../lib/db";

export const revalidate = 0;

export async function POST(request) {
  const body = await request.json();

  try {
    const order = await createOrder(body);
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 400 });
  }
}
