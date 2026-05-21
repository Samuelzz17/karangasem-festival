import { NextResponse } from "next/server";
import { verifyAdminSessionFromRequest } from "../../../../../lib/admin-auth";
import { deleteProduct, getProduct, updateProduct } from "../../../../../lib/db";

export async function PATCH(request, { params }) {
  const admin = await verifyAdminSessionFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const product = await updateProduct(params.id, body);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(request, { params }) {
  const admin = await verifyAdminSessionFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const product = await getProduct(params.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteProduct(params.id);
  return NextResponse.json({ ok: true });
}
