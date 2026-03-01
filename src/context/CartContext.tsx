import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { PosterSize } from "@/data/products";

export interface CartItem {
  productId: string;
  size: PosterSize;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, size: PosterSize, quantity?: number) => void;
  removeItem: (productId: string, size: PosterSize) => void;
  updateQuantity: (productId: string, size: PosterSize, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("comicwall-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("comicwall-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (productId: string, size: PosterSize, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId, size, quantity }];
    });
  };

  const removeItem = (productId: string, size: PosterSize) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  };

  const updateQuantity = (productId: string, size: PosterSize, quantity: number) => {
    if (quantity <= 0) return removeItem(productId, size);
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
