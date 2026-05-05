import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartSidebar from '../cartSidebar/CartSidebar';

import './navbar.css';

const Navbar = () => {
  const { getTotalItems, setIsCartOpen } = useCart();
  const totalItems = getTotalItems();

  return (
    <>
      <header className='ashHeader'>
        
        {/* 🔥 Logo بدل ASH */}
        <div className='ashBrand'>
        <Link to="/" className='ashBrand__home' aria-label="ASH home">
          <img
            src="https://quwkcdjgmweynekggzbk.supabase.co/storage/v1/object/public/ASH/ashlogo.png"
            alt="ASH Logo"
            className="ashLogo"
          />
        </Link>
          <p className='ashBrand__tag'>Soft glow fragrance</p>
        </div>

        {/* Navigation */}
        <nav className='ashNav' aria-label="Primary">
          <Link to='/products' className='ashNav__link'>Shop</Link>
          <Link to='/contact' className='ashNav__link'>Contact</Link>
        </nav>

        {/* Right Side */}
        <div className='ashNavRight'>
          
          {/* Cart Button */}
          <button 
            className='ashIconBtn'
            onClick={() => setIsCartOpen(true)}
            aria-label='Shopping bag'
          >
            <svg 
              className='ashBagIcon' 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>

            {totalItems > 0 && (
              <span className='ashBadge'>
                {totalItems}
              </span>
            )}
          </button>

          {/* CTA */}
          <Link to='/products' className='ashBtn ashBtn--primary'>
            Shop now
          </Link>
        </div>

      </header>

      <CartSidebar />
    </>
  );
};

export default Navbar;