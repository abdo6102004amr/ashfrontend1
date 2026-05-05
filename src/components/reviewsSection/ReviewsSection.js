import { useState, useEffect } from 'react';
import { getReviewsByProduct, getAllReviews, createReview } from '../../services/reviewService';
import { getProducts } from '../../services/productService';
import ErrorAlert from '../ErrorAlert';
import './ReviewsSection.css';

const ReviewsSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(productId || '');
  
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    comment: ''
  });

  useEffect(() => {
    if (!productId) {
      fetchProducts();
    }
  }, [productId]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
      setLoadError(null);
    } catch (err) {
      setProducts([]);
      setLoadError(err.message || 'Failed to load products');
    }
  };

  useEffect(() => {
    fetchReviews(); // 🔥 دايماً يشتغل
  }, [productId]);

  const fetchReviews = async () => {
    try {
      let data;

      if (productId) {
        data = await getReviewsByProduct(productId);
      } else {
        data = await getAllReviews(); // 🔥 ده المهم
      }

      setReviews(Array.isArray(data) ? data : []);
      setLoadError(null);
    } catch (err) {
      setReviews([]);
      setLoadError(err.message || 'Failed to load reviews');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'name' || name === 'comment') {
      setSubmitError(null);
    }
  };

  const handleStarClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating: rating
    }));
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.name.trim()) {
      setSubmitError('Name is required');
      return;
    }

    if (formData.rating === 0) {
      setSubmitError('Please select a rating');
      return;
    }

    const finalProductId = productId || selectedProductId;
    if (!finalProductId) {
      setSubmitError('Please select a product to review');
      return;
    }

    try {
      setSubmitting(true);
      const reviewData = {
        product_id: finalProductId,
        name: formData.name.trim(),
        rating: formData.rating,
        comment: formData.comment.trim() || null
      };

      await createReview(reviewData);
      
      // Clear form and refresh reviews
      setFormData({
        name: '',
        rating: 0,
        comment: ''
      });
      setIsPopupOpen(false);
      await fetchReviews();
    }catch (err) {
      setSubmitError(
        err?.response?.data?.message || err.message || "Server error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setFormData({
      name: '',
      rating: 0,
      comment: ''
    });
    setSelectedProductId(productId || '');
    setSubmitError(null);
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return [...Array(5)].map((_, index) => (
      <span 
        key={index} 
        className={`star ${index < rating ? 'filled' : 'empty'} ${interactive ? 'interactive' : ''}`}
        onClick={interactive ? () => onStarClick(index + 1) : undefined}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  return (
    <section className='reviews-section'>
      <div className='reviews-container ashContainer'>
        <div className='reviews-header'>
          <div>
            <div className="ashEyebrow">Reviews</div>
            <h2 className='reviews-title'>Customer love</h2>
          </div>
          <p className='reviews-subtitle'>
            Real experiences from customers — soft scents, premium feel.
          </p>
        </div>
        {loadError && <ErrorAlert message={loadError} onClose={() => setLoadError(null)} />}

        {reviews.length > 0 ? (
          <div className='reviews-grid'>
            {reviews.map((review) => (
              <div key={review.id} className='review-card'>
                <h3 className='reviewer-name'>{review.name}</h3>
                <div className='review-rating'>
                  {renderStars(review.rating)}
                </div>
                {review.comment && (
                  <p className='review-text'>{review.comment}</p>
                )}
                <p className='review-date'>{formatDate(review.created_at)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className='no-reviews-message'>
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        )}

        <div className='add-review-container'>
          <button 
            className='add-review-btn ashBtn ashBtn--primary'
            onClick={() => setIsPopupOpen(true)}
          >
            Add a review
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <div className='popup-overlay' onClick={handleClosePopup}>
          <div className='popup-content' onClick={(e) => e.stopPropagation()}>
            <button className='popup-close' onClick={handleClosePopup}>×</button>
            <h2 className='popup-title'>Add a review</h2>
            
            {submitError && (
              <div className='error-message' style={{ marginBottom: '1rem', color: 'red' }}>
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className='review-form'>
              {!productId && (
                <div className='form-group'>
                  <label htmlFor='review-product'>Product *</label>
                  <select
                    id='review-product'
                    name='product'
                    value={selectedProductId}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value);
                      setSubmitError(null);
                    }}
                    required
                    className='form-input ashInput'
                    disabled={submitting}
                  >
                    <option value=''>Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className='form-group'>
                <label htmlFor='review-name'>Name *</label>
                <input
                  type='text'
                  id='review-name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className='form-input ashInput'
                  placeholder='Enter your name'
                  disabled={submitting}
                />
              </div>

              <div className='form-group'>
                <label>Rating *</label>
                <div className='star-rating-input'>
                  {renderStars(formData.rating, true, handleStarClick)}
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='review-comment'>Comment (Optional)</label>
                <textarea
                  id='review-comment'
                  name='comment'
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows='6'
                  className='form-textarea ashTextarea'
                  placeholder='Share your experience...'
                  disabled={submitting}
                />
              </div>

              <button 
                type='submit' 
                className='submit-review-btn ashBtn ashBtn--primary'
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Add Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
