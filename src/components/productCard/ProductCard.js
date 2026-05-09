import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const { id, image, name, price, available, sizePrices = {}, sizeSoldOut = {} } = product
  const { addToCart } = useCart();
  const sizeOptions = product.sizes || ['10 ml', '75 ml', '250 ml'];

  const [selectedSize, setSelectedSize] = useState(
    sizeOptions.includes('75 ml')
      ? '75 ml'
      : sizeOptions[0]
  );
  // 🔥 ADD (حل مشكلة اختلاف 70ml و 70 ml)
  const normalize = (s) => s.replace(/\s/g, '').toLowerCase();

  // 🔥 ADD (check sold out)
  const isSoldOut = (size) => {
    return (
      sizeSoldOut[size] ||
      sizeSoldOut[normalize(size)] ||
      sizeSoldOut[size.replace(' ', '')] ||
      false
    );
  };

  // 🔥 FIX السعر
  const resolveSelectedPrice = (size) => {
   
    // 🔥 ADD (fallback ذكي)
    const val =
      sizePrices[size] ??
      sizePrices[normalize(size)] ??
      sizePrices[size.replace(' ', '')];

    const num = Number(val);

    return isNaN(num) ? Number(price) || 0 : num;
  };

  const selectedPrice = resolveSelectedPrice(selectedSize);

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 🔥 ADD (منع لو sold out)
    if (!available || isSoldOut(selectedSize)) return;

    addToCart({
      id,
      name,
      price: selectedPrice,
      image,
      available,
      selectedSize
    });
  }

  return (
    <div className='product-card-wrapper'>
      <Link to={`/product/${id}`} className='product-card-link'>
        <div className='product-card'>
          <div className='product-image-container'>
            <img src={image} alt={name} className='product-image' />

            {/* 🔥 ADD badge */}
            {isSoldOut(selectedSize) && (
              <div className="sold-badge">SOLD OUT</div>
            )}
          </div>
          
          <div className='product-info'>
            <h3 className='product-title'>{name}</h3>

            <div className='product-size-row product-size-toggle'>
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  type='button'
                  className={`size-toggle-btn 
                    ${selectedSize === size ? 'active' : ''} 
                    ${isSoldOut(size) ? 'disabled' : ''}
                  `}
                  disabled={isSoldOut(size)} // 🔥 ADD
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // 🔥 ADD
                    if (!isSoldOut(size)) {
                      setSelectedSize(size);
                    }
                  }}
                >
                  {size}
                </button>
              ))}
            </div>

            <p className='product-price'>{selectedPrice} EGP</p>

            {!available && <p className="product-soldout">Sold Out</p>}

            <button 
              className='add-to-cart-btn'
              onClick={handleButtonClick}
              disabled={!available || isSoldOut(selectedSize)} // 🔥 ADD
            >
              {isSoldOut(selectedSize) ? 'Sold Out' : 'Add to bag'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard;
