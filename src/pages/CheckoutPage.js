import { useState, useEffect } from 'react'; // ✅ FIX (دمجنا الاتنين)
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { getProducts } from '../services/productService';
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/Footer";
import ErrorAlert from '../components/ErrorAlert';
import './CheckoutPage.css';
import instapayImg from "../assets/instapay/instapay.jpg";
// Import product images

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [orderIdState, setOrderIdState] = useState(null);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    phone2: '',
    address: '',
    email: ''
  });
  
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [bogo, setBogo] = useState(null);
  const [finalTotal, setFinalTotal] = useState(0);
  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    return sum + (itemPrice * item.quantity);
  }, 0);
  const applyPromo = async () => {
    try {
      const res = await fetch("https://ashbackend-production.up.railway.app/api/promo/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: promoCode,
          totalAmount: subtotal,
          email: formData.email || null
        })
      });
      console.log("bogo:", bogo);
  console.log("calculatedTotal:", getCalculatedTotal());
console.log("cartItems:", cartItems);
  
      const data = await res.json();
      console.log("API RESPONSE:", data);
  
      if (!res.ok) {
        setPromoMessage(data.message);
        setDiscount(0);
        setBogo(null);
        return;
      }
  
      
      if (data.type === "bogo" || data.type === "bundle") {
        setBogo(data);
        setDiscount(0);
      
        // 🔥 خلي الحساب بعد render
        setTimeout(() => {
          console.log("NEW BOGO:", data);
          console.log("TOTAL AFTER BOGO:", getCalculatedTotal());
        }, 0);
      
        setPromoMessage(data.message);
        return;
      }
      // 💰 Discount
      setBogo(null);
      setDiscount(data.discount || 0);
      setFinalTotal(data.finalPrice);
      setPromoMessage(data.message);
  
    } catch (err) {
      setPromoMessage("Error applying promo");
    }
  };
  const shippingPrice = 60;
  const normalize = (val) =>
    val?.replace(/\s/g, "").toLowerCase();
  const getCalculatedTotal = () => {
    return cartItems.reduce((sum, item) => {
      let price =
        typeof item.price === "number"
          ? item.price
          : parseFloat(item.price) || 0;
  
          if (
            bogo &&
            normalize(item.selectedSize) === normalize(bogo.get) &&
            cartItems.some(
              i => normalize(i.selectedSize) === normalize(bogo.buy)
            )
          ) {
            price = 0;
          }
  
      return sum + price * item.quantity;
    }, 0);
  };
  const displayTotal =
  discount > 0
    ? subtotal + shippingPrice 
    : getCalculatedTotal() + shippingPrice; 
  // ✅ FIX الأساسي
  useEffect(() => {
    if (success) {
      navigate('/order-success', { state: { orderId: orderIdState } });
    }
  }, [success, orderIdState, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file); // للpreview
      setUploadedImageFile(file); // للإرسال
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!paymentMethod) return;
    
    const errors = {};
    if (!formData.fullName) errors.fullName = 'Full name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!paymentMethod) errors.paymentMethod = 'Please choose a payment method';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (submitted) return;
    setSubmitted(true);
    setLoading(true);
    setServerError(null);

    try {
      const items = cartItems.map(item => ({
        name: item.name,
        size: item.selectedSize,
        quantity: item.quantity,
        price: item.price
      }));

      const formDataToSend = new FormData();
      const finalPriceToSend =
      discount > 0 ? finalTotal : getCalculatedTotal();
    
    formDataToSend.append("customerName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);
    
    formDataToSend.append("totalPrice", finalPriceToSend);
    formDataToSend.append("items", JSON.stringify(items));
    formDataToSend.append("paymentMethod", paymentMethod);
    
    // 🔥 PROMO FIX
    formDataToSend.append("promoCode", promoCode || null);
    formDataToSend.append("discount", discount || 0);
    formDataToSend.append(
      "promoType",
      bogo ? bogo.type : (discount > 0 ? "percentage" : null)
    );
    
    // 🔥 image
    if (paymentMethod === "instapay" && uploadedImageFile) {
      formDataToSend.append("screenshot", uploadedImageFile);
    }
      const result = await createOrder(formDataToSend);

      console.log("ORDER RESPONSE:", result); // debug

      // ✅ FIX مهم
      const orderId = result?.orderId || result?.id;

      setOrderIdState(orderId);
      setSuccess(true);
      clearCart();

    } catch (err) {
      const message = err?.message || 'Failed to place order';
      setServerError(message);

      if (message.toLowerCase().includes('sold out') || message.toLowerCase().includes('not available')) {
        try {
          await getProducts();
        } catch (refreshError) {
          console.error('Failed to refresh products:', refreshError);
        }
      }

      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (cartKey, change) => {
    const item = cartItems.find(item => (item.cartKey || `${item.id}::default`) === cartKey);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(cartKey, newQuantity);
    }
  };

  return (
    
    <div className="checkout-page ashPage">
      <Navbar/>
      
      <main className="checkout-container ashMain">
        <div className="ashContainer">
          <div className="ashSectionHead">
            <div>
              <div className="ashEyebrow">Checkout</div>
              <h1 className="ashH1" style={{ marginTop: 10 }}>Checkout</h1>
              <p className="ashMuted" style={{ marginTop: 10, lineHeight: 1.7 }}>
                Soft, quick, premium — confirm your details and place your order.
              </p>
            </div>
          </div>

          <div className="checkout-content">
          {/* Left Side - Checkout Form */}
          <div className="checkout-form-section">
            <h2 className="checkout-title">Your details</h2>
            
            {serverError && (
              <ErrorAlert message={serverError} onClose={() => setServerError(null)} />
            )}

            <form onSubmit={handleCheckout} className="checkout-form">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="form-input ashInput"
                />
                {formErrors.fullName && (
                  <div style={{ color: '#721c24', fontSize: '0.9rem', marginTop: '0.4rem' }}>{formErrors.fullName}</div>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input ashInput"
                />
                {formErrors.email && (
                  <div style={{ color: '#721c24', fontSize: '0.9rem', marginTop: '0.4rem' }}>{formErrors.email}</div>
                )}
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input ashInput"
                />
                {formErrors.phone && (
                  <div style={{ color: '#721c24', fontSize: '0.9rem', marginTop: '0.4rem' }}>{formErrors.phone}</div>
                )}
              </div>

              {/* Phone Number 2 */}
              <div className="form-group">
                <label htmlFor="phone2">Phone Number 2 (Optional)</label>
                <input
                  type="tel"
                  id="phone2"
                  name="phone2"
                  value={formData.phone2}
                  onChange={handleInputChange}
                  className="form-input ashInput"
                />
              </div>

              {/* Address */}
              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="form-textarea ashTextarea"
                />
                {formErrors.address && (
                  <div style={{ color: '#721c24', fontSize: '0.9rem', marginTop: '0.4rem' }}>{formErrors.address}</div>
                )}
              </div>

              {/* Payment Method */}
              <div className="form-group">
                <label className="payment-label">Payment Method *</label>
                <div className="payment-methods">
                  <button
                    type="button"
                    className={`payment-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    Cash on Delivery
                  </button>
                  <button
                    type="button"
                    className={`payment-btn ${paymentMethod === 'instapay' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('instapay')}
                  >
                    InstaPay
                  </button>
                </div>
                  {formErrors.paymentMethod && (
                    <div style={{ color: '#721c24', fontSize: '0.9rem', marginTop: '0.4rem' }}>{formErrors.paymentMethod}</div>
                  )}

                {/* InstaPay Upload Section */}
                {paymentMethod === 'instapay' && (
                  <div className="instapay-section">
                    <div className="instapay-logo">
                    <img
                        src={instapayImg}
                        alt="InstaPay"
                        className="instapay-logo-img"
                      />
                      </div>
                    <p className="instapay-text">Please upload a screenshot of the transfer</p>
                    <div className="upload-section">
                      <input
                        type="file"
                        id="transfer-image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input"
                      />
                      <label htmlFor="transfer-image" className="upload-btn">
                        {uploadedImage ? 'Change Image' : 'Upload Screenshot'}
                      </label>
                      {uploadedImage && (
                        <div className="image-preview">
                          <img src={uploadedImage} alt="Transfer screenshot" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button 
                type="submit" 
                className="checkout-submit-btn ashBtn ashBtn--primary" 
                disabled={!paymentMethod || loading || success}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Right Side - Order Summary */}
          <div className="order-summary-section">
            <h3 className="summary-title">Order Summary</h3>
            
            {cartItems.length === 0 ? (
              <div className="empty-cart-message">
                <p>Your cart is empty</p>
                <button 
                  onClick={() => navigate('/products')}
                  className="shop-now-btn ashBtn ashBtn--primary"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              <>
                <div className="order-items-list">
                  {cartItems.map((item) => {
                      const itemPrice =
                        typeof item.price === "number"
                          ? item.price
                          : parseFloat(item.price) || 0;

                      const formattedPrice = `${itemPrice.toFixed(2)} EGP`;

                      const normalize = (val) =>
                        val?.replace(/\s/g, "").toLowerCase();
                      
                      const isFree =
                        bogo &&
                        normalize(item.selectedSize) === normalize(bogo.get) &&
                        cartItems.some(
                          (i) => normalize(i.selectedSize) === normalize(bogo.buy)
                        );
                      return (
                        <div
                          key={item.cartKey || `${item.id}::default`}
                          className="order-item"
                        >
                          <div className="order-item-image">
                            <img src={item.image} alt={item.name} />
                          </div>

                          <div className="order-item-details">
                            <h4 className="order-item-name">{item.name}</h4>

                            {item.selectedSize && (
                              <p className="order-item-size">
                                Size: {item.selectedSize}

                                {/* 🔥 هنا المكان الصح */}
                                {isFree && (
                                  <span style={{ color: "green", marginLeft: "8px" }}>
                                    FREE 🎁
                                  </span>
                                )}
                              </p>
                            )}

                              <p className="order-item-price">
                                {isFree ? (
                                  <>
                                    <span
                                      style={{
                                        textDecoration: "line-through",
                                        color: "#999",
                                        marginRight: "6px",
                                      }}
                                    >
                                      {formattedPrice}
                                    </span>
                                    <span style={{ color: "green", fontWeight: "bold" }}>
                                      FREE 🎁
                                    </span>
                                  </>
                                ) : (
                                  formattedPrice
                                )}
                              </p>

                            <div className="order-item-quantity">
                              <label>Quantity:</label>

                              <div className="quantity-controls">
                                <button
                                  type="button"
                                  className="quantity-btn"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.cartKey || `${item.id}::default`,
                                      -1
                                    )
                                  }
                                >
                                  -
                                </button>

                                <span className="quantity-value">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  className="quantity-btn"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.cartKey || `${item.id}::default`,
                                      1
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                className="remove-item-btn"
                                onClick={() =>
                                  removeFromCart(
                                    item.cartKey || `${item.id}::default`
                                  )
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="form-input ashInput"
                  />

                  <button
                    type="button"
                    onClick={applyPromo}
                    className="ashBtn ashBtn--primary"
                    style={{ marginTop: "10px" }}
                  >
                    Apply Promo
                  </button>

                  {promoMessage && (
                    <p style={{ marginTop: "5px", fontSize: "0.9rem" }}>
                      {promoMessage}
                    </p>
                  )}
                </div>
                <div className="summary-breakdown">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>
                      {bogo ? getCalculatedTotal().toFixed(2) : subtotal.toFixed(2)} EGP
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>{shippingPrice} EGP</span>
                  </div>
                  {discount > 0 && (
                    <div className="summary-row">
                      <span>Discount</span>
                      <span>- {discount.toFixed(2)} EGP</span>
                    </div>
                  )}
                  <div className="summary-row total-row">
                    <span>Total (including shipping)</span>
                    <span>{displayTotal.toFixed(2)} EGP</span>
                  </div>
                  {discount > 0 && (
                    <div className="summary-row total-row">
                      <span>Total After Discount</span>
                      <span>{(displayTotal - discount).toFixed(2)} EGP</span>
                    </div>
                  )}
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    Note: Shipping cost will be confirmed by admin
                  </div>
                </div>
              </>
            )}
          </div>
          </div>
        </div>
      </main>
      
      <Footer/>
    </div>
  );
}

export default CheckoutPage;

