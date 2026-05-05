import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductById } from "../services/productService";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/Footer";
import ReviewsSection from "../components/reviewsSection/ReviewsSection";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState("");

  const safeParse = (data) => {
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const data = await getProductById(id);
      setProduct(data);

      const parsedSizes = safeParse(data.sizes);
      setSelectedSize(parsedSizes[0]?.size || "250 ml");

      if (data.coverImage) {
        setActiveImage(data.coverImage);
      }
    };

    fetch();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const productImage = product.coverImage || "";
  const galleryImages = safeParse(product.gallery);

  const parsedSizes = safeParse(product.sizes);

  const fallbackSizes = [
    { size: "70 ml", price: product.price || 0, soldOut: false },
    { size: "250 ml", price: product.price || 0, soldOut: false },
  ];

  const finalSizes =
    parsedSizes && parsedSizes.length > 0
      ? parsedSizes
      : fallbackSizes;

  const sizeOptions = finalSizes.map((s) => s.size);

  const sizePrices = {};
  const sizeSoldOut = {};

  finalSizes.forEach((s) => {
    sizePrices[s.size] = Number(s.price) || 0;
    sizeSoldOut[s.size] = Boolean(s.soldOut);
  });

  const activeSize = sizeOptions.includes(selectedSize)
    ? selectedSize
    : sizeOptions[0];

  const selectedPrice = sizePrices[activeSize] || 0;

  return (
    <div className="ashPage">
      <Navbar />

      <main className="product-detail-page ashMain">
        <div className="product-detail-container ashContainer">
          <div className="product-detail-content">

            {/* IMAGE */}
            <div className="product-detail-image-section">
              <img
                src={activeImage || productImage}
                alt={product.name}
                className="product-detail-image"
              />

              <div>
                {product.coverImage && (
                  <img
                    src={product.coverImage}
                    alt={product.name}
                    onClick={() => setActiveImage(product.coverImage)}
                    style={{ width: 50, cursor: "pointer" }}
                  />
                )}

                {galleryImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`gallery-${i}`}
                    onClick={() => setActiveImage(img)}
                    style={{ width: 50, cursor: "pointer" }}
                  />
                ))}
              </div>
            </div>

            {/* INFO */}
            <div className="product-detail-info-section">

              <h1 className="product-detail-name">
                {product.name}
              </h1>

              <p className="product-detail-description">
                {product.description || "No description available"}
              </p>

              <p className="product-detail-price">
                {selectedPrice} EGP
              </p>

              {/* SIZE */}
              <div className="product-detail-size-picker">
                {finalSizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.soldOut}
                    className={`product-detail-size-btn 
                      ${activeSize === s.size ? "active" : ""} 
                      ${s.soldOut ? "sold-out" : ""}
                    `}
                    onClick={() => setSelectedSize(s.size)}
                  >
                    {s.size}
                    {s.soldOut && " (Sold Out)"}
                  </button>
                ))}
              </div>

              {/* ADD */}
              <button
                className="product-add-to-bag-btn ashBtn ashBtn--primary"
                disabled={sizeSoldOut[activeSize]}
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: selectedPrice,
                    image: activeImage || productImage,
                    selectedSize: activeSize,
                  })
                }
              >
                {sizeSoldOut[activeSize]
                  ? "Sold Out"
                  : "Add to bag"}
              </button>

              {/* CHECKOUT */}
              <button
                className="product-checkout-btn ashBtn ashBtn--soft"
                disabled={sizeSoldOut[activeSize]}
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </button>

            </div>
          </div>

          {product && <ReviewsSection productId={product.id} />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
