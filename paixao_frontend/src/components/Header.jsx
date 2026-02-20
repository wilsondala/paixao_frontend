import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>
        Minha Loja
      </Link>

      <Link to="/cart" style={styles.cart}>
        🛒
        {totalItems > 0 && (
          <span style={styles.badge}>{totalItems}</span>
        )}
      </Link>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    background: "#1e293b",
    color: "white",
  },
  logo: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "18px",
  },
  cart: {
    position: "relative",
    color: "white",
    textDecoration: "none",
    fontSize: "22px",
  },
  badge: {
    position: "absolute",
    top: "-8px",
    right: "-10px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    padding: "3px 7px",
    fontSize: "12px",
  },
};