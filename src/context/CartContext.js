import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem('ash_cart_items');
      return raw ? JSON.parse(raw) : [];
    } catch (_error) {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ash_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    // Normalize price to number if it's a string
    const normalizedPrice = typeof product.price === 'string' 
      ? parseFloat(product.price.replace(' EGP', '').replace(',', '')) || 0
      : product.price;
    
    const selectedSize = product.selectedSize || null;
    const cartKey = `${product.id}::${selectedSize || 'default'}`;

    const normalizedProduct = {
      ...product,
      price: normalizedPrice,
      cartKey
    };
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.cartKey === cartKey);
      if (existingItem) {
        return prevItems.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...normalizedProduct, quantity: 1 }];
    });
  };

  const removeFromCart = (targetKey) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item.cartKey || `${item.id}::default`) !== targetKey)
    );
  };

  const updateQuantity = (targetKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(targetKey);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item.cartKey || `${item.id}::default`) === targetKey ? { ...item, quantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        isCartOpen,
        setIsCartOpen,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

