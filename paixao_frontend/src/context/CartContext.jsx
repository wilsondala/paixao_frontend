import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart((prevCart) => {
      const productId = Number(product.id);
      const existingProduct = prevCart.find(
        (item) => Number(item.id) === productId
      );

      if (existingProduct) {
        return prevCart.map((item) =>
          Number(item.id) === productId
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, id: productId, quantity: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  function updateQuantity(id, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart deve ser usado dentro de <CartProvider>");
  }
  return context;
}