import Navbar from "../components/Navbar";   // ← troquei Header por Navbar
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />          {/* ← agora usa o Navbar completo */}
      <main>{children}</main>
      <Footer />
    </>
  );
}