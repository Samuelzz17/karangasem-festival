import EventSection from "../../components/EventSection";
import MerchandiseClient from "../../components/MerchandiseClient";
import { listProducts } from "../../lib/db";

export const revalidate = 0;

export default async function MerchandisePage() {
  const products = await listProducts();

  return (
    <section className="page">
      <EventSection
        eyebrow="Merchandise"
        title="Toko merch dengan tampilan neo-gradient dan alur checkout real."
        copy="Halaman ini sudah siap untuk produk, cart, upload bukti transaksi, dan order yang masuk database. Kamu tinggal isi katalog dan deskripsi final nanti."
      >
        <div className="hero-grid">
          <article className="neo-card neo-card-blue">
            <span className="mini-badge">Storefront</span>
            <h3>Produk tayang real</h3>
            <p>Katalog ditarik langsung dari database dan bisa dikelola dari admin.</p>
          </article>
          <article className="neo-card neo-card-orange">
            <span className="mini-badge">Checkout</span>
            <h3>Cart dan total belanja</h3>
            <p>Pengunjung bisa menambah item, melihat subtotal, lalu lanjut pembayaran.</p>
          </article>
          <article className="neo-card neo-card-green">
            <span className="mini-badge">Payment proof</span>
            <h3>Upload bukti transaksi</h3>
            <p>File bukti pembayaran dilampirkan agar order tersimpan rapi di sistem.</p>
          </article>
        </div>
        <MerchandiseClient initialProducts={products} />
      </EventSection>
    </section>
  );
}
