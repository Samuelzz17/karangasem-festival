import { NextResponse } from "next/server";
import { verifyAdminSessionFromRequest } from "../../../../../lib/admin-auth";
import { deleteOrder, getOrder, updateOrderStatus } from "../../../../../lib/db";

export async function PATCH(request, { params }) {
  const admin = await verifyAdminSessionFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.status) {
    return NextResponse.json({ error: "Missing status" }, { status: 400 });
  }

  const order = await getOrder(params.id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await updateOrderStatus(params.id, body.status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const admin = await verifyAdminSessionFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const order = await getOrder(params.id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteOrder(params.id);
  return NextResponse.json({ ok: true });
}
