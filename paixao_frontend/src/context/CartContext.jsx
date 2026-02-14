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
      // aumenta sempre a quantidade
      return prevCart.map((item) =>
        Number(item.id) === productId
          ? { ...item, quantity: (item.quantity || 0) + 1 }
          : item
      );
    }

    // adiciona produto com quantity = 1
    return [
      ...prevCart,
      { ...product, id: productId, quantity: 1 },
    ];
  });
}


  function removeFromCart(id) {
    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );
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
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
