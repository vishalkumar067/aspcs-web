import Navbar       from "@/components/layout/Navbar";
import Footer       from "@/components/layout/Footer";
import WelcomePopup from "@/components/WelcomePopup";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WelcomePopup />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
