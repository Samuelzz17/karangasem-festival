import { NextResponse } from "next/server";
import { verifyAdminSessionFromRequest } from "../../../../../lib/admin-auth";
import { bulkUpdateOrderStatus, bulkDeleteOrders } from "../../../../../lib/db";

export async function PATCH(request) {
  const admin = await verifyAdminSessionFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { ids, status } = body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Missing or invalid order IDs" }, { status: 400 });
    }
    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    await bulkUpdateOrderStatus(ids, status);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const admin = await verifyAdminSessionFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { ids } = body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Missing or invalid order IDs" }, { status: 400 });
    }

    await bulkDeleteOrders(ids);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
