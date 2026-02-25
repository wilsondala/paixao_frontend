// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* ================= PERSISTÊNCIA ================= */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ================= ADICIONAR PRODUTO ================= */
  function addToCart(product) {
    if (!product || Number(product.stock) === 0) return;

    const productId = Number(product.id);
    const stock = Number(product.stock);

    setCart((prevCart) => {
      const existing = prevCart.find((item) => Number(item.id) === productId);

      if (existing) {
        if (existing.quantity >= stock) {
          alert("Quantidade máxima em estoque atingida");
          return prevCart;
        }

        return prevCart.map((item) =>
          Number(item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          id: productId,
          price: Number(product.price),
          stock,
          quantity: 1,
        },
      ];
    });
  }

  /* ================= REMOVER PRODUTO ================= */
  function removeFromCart(id) {
    const productId = Number(id);
    setCart((prev) => prev.filter((item) => Number(item.id) !== productId));
  }

  /* ================= LIMPAR CARRINHO ================= */
  function clearCart() {
    setCart([]);
  }

  /* ================= ATUALIZAR QUANTIDADE ================= */
  function updateQuantity(id, newQuantity) {
    const productId = Number(id);
    const quantity = Number(newQuantity);

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (Number(item.id) !== productId) return item;

        return {
          ...item,
          quantity: quantity > item.stock ? item.stock : quantity,
        };
      })
    );
  }

  /* ================= VALORES DERIVADOS ================= */
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.quantity), 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de <CartProvider>");
  }

  return context;
}