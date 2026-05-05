// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ContactPage from './pages/ContactPage';
import Previcy from './pages/previcy';
import Privacy from './pages/privacy';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/previcy" element={<Previcy />} />
          <Route path="/privacy" element={<Privacy />} /> 
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
