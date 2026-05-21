import { NextResponse } from "next/server";
import { verifyAdminSessionFromRequest } from "../../../../lib/admin-auth";
import { createProduct, listProducts } from "../../../../lib/db";

export async function GET(request) {
  const admin = await verifyAdminSessionFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await listProducts();
  return NextResponse.json({ products });
}

export async function POST(request) {
  const admin = await verifyAdminSessionFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const product = await createProduct(body);
  return NextResponse.json({ product });
}
