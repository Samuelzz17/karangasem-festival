import { NextResponse } from "next/server";
import { listProducts } from "../../../lib/db";

export const revalidate = 0;

export async function GET() {
  const products = await listProducts();
  return NextResponse.json({ products });
}
