import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer/Footer';

const OrderSuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderId = state?.orderId;

  return (
    <div className="ashPage">
      <Navbar />
      <main className="ashMain">
        <div className="ashContainer">
          <div className="ashCard" style={{ maxWidth: 760, margin: "0 auto", padding: 26, textAlign: "center", boxShadow: "var(--shadow-hard)" }}>
          <div style={{ fontSize: 56, marginBottom: '1rem' }} aria-hidden>✅</div>
          <h1 className="ashH2" style={{ margin: '0 0 0.5rem' }}>Your order has been placed</h1>
          {orderId ? (
            <p className="ashMuted" style={{ margin: '0.25rem 0 1rem' }}>Order ID: <strong>{orderId}</strong></p>
          ) : (
            <p className="ashMuted" style={{ margin: '0.25rem 0 1rem' }}>We received your order and are processing it now.</p>
          )}

          <p className="ashMuted" style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            Our admin will contact you soon to confirm details. You will receive updates by email or phone.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button className="ashBtn ashBtn--primary" onClick={() => navigate('/products')}>Continue shopping</button>
          </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
