import { useState, useEffect } from 'react';
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/Footer";
import ProductCard from "../components/productCard/ProductCard";
import ErrorAlert from '../components/ErrorAlert';
import { getProducts } from '../services/productService';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const safeParse = (data) => {
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch {
      return [];
    }
  };

  const toNumber = (v) => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []); // 🔥 حماية
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formattedProducts = products.map((product) => {
    const sizesParsed = safeParse(product.sizes);

    const sizePrices = {};
    const sizeSoldOut = {};
    let productSizes = [];

    if (Array.isArray(sizesParsed)) {
      productSizes = sizesParsed.map((s) => s.size);

      sizesParsed.forEach((s) => {
        const key = (s.size || "").replace(/\s/g, "").toLowerCase();
        sizePrices[key] = toNumber(s.price);
        sizeSoldOut[key] = Boolean(s.soldOut);
      });
    }

    else if (typeof sizesParsed === "object" && sizesParsed !== null) {
      productSizes = Object.keys(sizesParsed);

      Object.entries(sizesParsed).forEach(([key, value]) => {
        const normalized = key.replace(/\s/g, "").toLowerCase();
        sizePrices[normalized] = toNumber(value);
        sizeSoldOut[normalized] = false;
      });
    }

    if (productSizes.length === 0) {
      productSizes = ["70 ml", "250 ml"];
    }

    let prices = [];

    if (Array.isArray(sizesParsed)) {
      prices = sizesParsed.map((s) => toNumber(s.price));
    } else if (typeof sizesParsed === "object" && sizesParsed !== null) {
      prices = Object.values(sizesParsed).map((p) => toNumber(p));
    }

    prices = prices.filter((p) => p > 0);

    const minPrice =
      prices.length > 0 ? Math.min(...prices) : toNumber(product.price);

    return {
      id: product.id,
      name: product.name,
      price: minPrice,
      sizes: productSizes,
      sizePrices: sizePrices,
      sizeSoldOut: sizeSoldOut,
      available: true,
      image: product.coverImage
    };
  });

  return (
    <div className="products-page ashPage">
      <Navbar />

      <main className="products-container ashMain">
        <div className="ashContainer">

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <ErrorAlert message={error} />
          ) : (
            <div className="products-grid">
              {formattedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
