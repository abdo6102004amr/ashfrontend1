// src/components/privacy/privacy.jsx
import React from "react";
import "./privacy.css";

const Policy = () => {
  return (
    <div className="previcy-page">
      <div className="previcy-wrapper">
        <div className="previcy-text">
          <h2>Privacy Policy</h2>

          <p>
            At <strong>Ash</strong>, we are committed to providing premium body splash
            products crafted with care and high-quality ingredients. We aim to ensure a transparent
            and enjoyable shopping experience for every customer. All product images, descriptions,
            and details on our website are displayed as accurately as possible to help you shop with
            confidence.
          </p>

          <p>
            For health and hygiene reasons, we do not accept returns on opened or used items.
            However, if your order arrives damaged, defective, or incorrect, please contact our
            customer support team within 7 days of delivery, and we will be happy to assist you.
          </p>

          <p>
            By completing a purchase on our website, you agree to our terms of service, including
            our payment, shipping, and return policies. These policies may be updated periodically
            to maintain a smooth and reliable experience for all customers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Policy;
