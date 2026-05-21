import { NextResponse } from "next/server";
import { verifyAdminSessionFromRequest } from "../../../../lib/admin-auth";
import { buildAdminMetrics, listOrders, listProducts } from "../../../../lib/db";

export async function GET(request) {
  const admin = await verifyAdminSessionFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [orders, products] = await Promise.all([listOrders(), listProducts()]);
  const metrics = await buildAdminMetrics(orders, products);
  return NextResponse.json({ orders, metrics });
}
