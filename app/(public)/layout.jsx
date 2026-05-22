import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import ChatWidget from "@/components/chat/ChatWidget";
import CartDrawer from "@/components/menu/CartDrawer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />

      <div className="relative pt-16">
        <PageTransition>{children}</PageTransition>
      </div>

      <Footer />

      {/* Global overlays — only mounted in the public surface */}
      <ChatWidget />
      <CartDrawer />
    </>
  );
}
