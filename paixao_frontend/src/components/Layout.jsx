import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();

  // Mostrar footer apenas em páginas públicas
  const showFooter = ["/", "/products", "/sobre-nos"].includes(location.pathname);

  return (
    <>
      <Header />
      <main>{children}</main>
     
    </>
  );
}