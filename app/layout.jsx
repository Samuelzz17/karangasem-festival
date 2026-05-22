import "../styles.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import EnterPreloader from "../components/EnterPreloader";
import CustomCursor from "../components/CustomCursor";
import { CartProvider } from "../components/CartContext";
import { LanguageProvider } from "../components/LanguageContext";

export const metadata = {
  title: "Karangasem Festival",
  description:
    "Website event Karangasem Festival dengan merchandise, admin login Firebase, CRUD produk, dan workflow order.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <LanguageProvider>
          <EnterPreloader />
          <CustomCursor />
          <CartProvider>
            <div className="page-shell">
              <SiteHeader />
              <main className="app-main">{children}</main>
              <SiteFooter />
            </div>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

