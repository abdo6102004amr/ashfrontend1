import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../services/productService';
import './HeroSection.css';
import sweetCrushProduct from '../../assets/Screenshot 2025-12-06 002259.png';
import TypewriterText from '../typewriterText/TypewriterText';

const HeroSection = () => {
  const fullText = "Soft, lingering scents for every quiet moment.";
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts();

        const bestProduct = products.find(
          (p) => Number(p.best_seller) === 1
        );

        setProduct(bestProduct || null);

        // 🔥 set default size
        if (bestProduct?.sizes?.length > 0) {
          setSelectedSize(bestProduct.sizes[0].size);
        }

      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  // 🔥 تجهيز sizes
  const parsedSizes =
    product?.sizes && Array.isArray(product.sizes)
      ? product.sizes
      : [];

  const sizePrices = {};
  const sizeSoldOut = {};

  parsedSizes.forEach((s) => {
    sizePrices[s.size] = Number(s.price) || 0;
    sizeSoldOut[s.size] = Boolean(s.soldOut);
  });

  const selectedPrice = sizePrices[selectedSize] || 0;

  const handleAddToBag = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: selectedPrice,
      image: product.coverImage
        ? `http://localhost:5000/uploads/${product.coverImage}`
        : sweetCrushProduct,
      available: product.available,
      selectedSize: selectedSize,
    });
  };

  return (
    <section className='hero-section'>
      <div className='hero-container'>

        {/* Left Side */}
        <div className='hero-text'>
          <p className='eyebrow-text'>BODY MIST COLLECTION</p>

          <h1 className='hero-headline'>
            <TypewriterText
              phrases={[fullText]}
              typingSpeed={100}
              deletingSpeed={50}
              pauseTime={1000}
            />
          </h1>

          <p className='hero-description'>
            ASH is a collection of minimalist body mists, crafted to feel like clean skin,
            soft fabric, and late-night air. No noise, no clutter — just a subtle trail that stays with you.
          </p>

          <div className='hero-buttons'>
            <Link to='/products'>
              <button className='btn-primary'>Discover the collection</button>
            </Link>
          </div>

          <div className='hero-info'>
            <div className='info-item'>
              <h3 className='info-title'>24H</h3>
              <p className='info-subtitle'>AIRY, SKIN-LIKE WEAR</p>
            </div>
            <div className='info-item'>
              <h3 className='info-title'>CLEAN</h3>
              <p className='info-subtitle'>ALCOHOL-BASED FORMULA</p>
            </div>
          </div>
        </div>

        
          
        

      </div>
    </section>
  );
};

export default HeroSection;