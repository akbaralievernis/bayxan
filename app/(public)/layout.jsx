import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import CartDrawer from "@/components/menu/CartDrawer";
import { LocaleProvider } from "@/components/providers/LocaleProvider";

export default function PublicLayout({ children }) {
  return (
    <LocaleProvider>
      <Navbar />

      <main className="relative pt-16 min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      <Footer />

      {/* Global overlays — only mounted in the public surface */}
      <ChatWidget />
      <CartDrawer />
    </LocaleProvider>
  );
}
