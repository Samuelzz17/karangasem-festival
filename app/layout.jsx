import "../styles.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Karangasem Festival",
  description:
    "Website event Karangasem Festival dengan merchandise, admin login Firebase, CRUD produk, dan workflow order.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="page-shell">
          <SiteHeader />
          <main className="app-main">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
