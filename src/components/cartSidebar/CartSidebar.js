import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartSidebar.css';

const CartSidebar = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (cartKey, newQuantity) => {
    updateQuantity(cartKey, newQuantity);
  };

  const handleRemove = (cartKey) => {
    removeFromCart(cartKey);
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2 className="cart-title">Shopping Bag</h2>
          <button 
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your bag is empty</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.cartKey || `${item.id}::default`} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      {item.selectedSize && <p className="cart-item-size">Size: {item.selectedSize}</p>}
                      <p className="cart-item-price">
                        {typeof item.price === 'number' 
                          ? `${item.price.toFixed(2)} EGP` 
                          : item.price}
                      </p>
                      <div className="cart-item-controls">
                        <div className="quantity-controls">
                          <button
                            onClick={() => handleQuantityChange(item.cartKey || `${item.id}::default`, item.quantity - 1)}
                            className="quantity-btn"
                          >
                            −
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.cartKey || `${item.id}::default`, item.quantity + 1)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item.cartKey || `${item.id}::default`)}
                          className="remove-item-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="checkout-link"
                >
                  <button className="cart-checkout-btn">Go to Checkout</button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;

