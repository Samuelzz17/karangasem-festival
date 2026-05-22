import MerchandiseClient from "../../components/MerchandiseClient";
import { listProducts } from "../../lib/db";

export const revalidate = 0;

export default async function MerchandisePage() {
  const products = await listProducts();

  return (
    <section className="page">
      <MerchandiseClient initialProducts={products} />
    </section>
  );
}
