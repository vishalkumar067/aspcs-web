
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WelcomePopupController from "@/components/WelcomePopupController";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WelcomePopupController />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
