import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isLoggedIn = !!localStorage.getItem("token");

  const showFooter = isHome && !isLoggedIn;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      {showFooter && <Footer />}
    </>
  );
}