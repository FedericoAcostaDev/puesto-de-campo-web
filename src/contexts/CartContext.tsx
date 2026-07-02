import React, { createContext, useContext, useState, ReactNode } from 'react';

const isWholeChickenProduct = (product: Pick<Product, "category" | "name">): boolean => {
  const haystack = `${product.category ?? ""} ${product.name ?? ""}`.toLowerCase();
  return /pollo\s+entero|entero\s+pollo|whole chicken|pollo/i.test(haystack) && /entero|whole/i.test(haystack);
};

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  weight: string;
  saleType?: string;
  purchaseAmount?: number;
  purchaseLabel?: string;
  purchaseMode?: string;
}

export interface CartItem extends Product {
  quantity: number;
  cartKey: string;
  productId: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selection?: { price: number; label: string; amount: number; mode?: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product, selection?: { price: number; label: string; amount: number; mode?: string }) => {
    const selectedPrice = selection?.price ?? product.price;
    const shouldShowPendingPrice = isWholeChickenProduct(product);
    const selectedLabel = selection?.label ?? product.purchaseLabel ?? product.weight ?? "1 unidad";
    const selectedAmount = selection?.amount ?? product.purchaseAmount ?? 1;
    const selectedMode = selection?.mode ?? product.purchaseMode ?? "";
    const cartKey = `${product.id}-${selectedLabel}`;

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.cartKey === cartKey);
      if (existingItem) {
        return currentItems.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...currentItems,
        {
          ...product,
          id: cartKey,
          cartKey,
          productId: product.id,
          quantity: 1,
          price: shouldShowPendingPrice ? 0 : selectedPrice,
          purchaseLabel: selectedLabel,
          purchaseAmount: selectedAmount,
          purchaseMode: selectedMode,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.cartKey !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.cartKey === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
