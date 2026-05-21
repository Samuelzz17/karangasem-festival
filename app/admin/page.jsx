import { requireAdminSession } from "../../lib/admin-auth";
import { listOrders, listProducts, buildAdminMetrics } from "../../lib/db";
import AdminDashboard from "../../components/AdminDashboard";

export const revalidate = 0;

export default async function AdminPage() {
  await requireAdminSession();

  const [products, orders] = await Promise.all([listProducts(), listOrders()]);
  const metrics = await buildAdminMetrics(orders, products);

  return <AdminDashboard initialProducts={products} initialOrders={orders} initialMetrics={metrics} />;
}
