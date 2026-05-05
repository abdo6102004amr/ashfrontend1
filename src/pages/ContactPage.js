import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/Footer";
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    problem: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // ============================================
  // EMAILJS CONFIGURATION
  // ============================================
  const EMAILJS_SERVICE_ID = 'service_pwzssue';
  const EMAILJS_TEMPLATE_ID = 'template_wwa5ldg';
  const EMAILJS_PUBLIC_KEY = 'vuKCUQS9sB4lMpydG';

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Check if EmailJS is configured
    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
        EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || 
        EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      // Fallback to mailto if EmailJS is not configured
      setIsSubmitting(false);
      const subject = encodeURIComponent('Contact Form Message');
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.number}\n\n` +
        `Message:\n${formData.problem}`
      );
      window.location.href = `mailto:Ashbodysplash@gmail.com?subject=${subject}&body=${body}`;
      
      setSubmitMessage('Opening your email client... If it doesn\'t open, please configure EmailJS. Check EMAILJS_SETUP.md for instructions.');
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        number: '',
        problem: ''
      });
      return;
    }

    try {
      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: 'Ashbodysplash@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.number,
          message: formData.problem,
          reply_to: formData.email
        },
        EMAILJS_PUBLIC_KEY
      );

      console.log('Email sent successfully!', response);
      setSubmitMessage('Thank you for contacting us! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        number: '',
        problem: ''
      });

      // Clear message after 5 seconds
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    } catch (error) {
      console.error('Email sending failed - Full error:', error);
      console.error('Error details:', {
        status: error?.status,
        text: error?.text,
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID
      });
      
      let errorMessage = 'Sorry, there was an error sending your message. ';
      
      if (error?.text) {
        if (error.text.includes('Invalid template ID')) {
          errorMessage += 'Please check your Template ID in ContactPage.js';
        } else if (error.text.includes('Invalid service ID')) {
          errorMessage += 'Please check your Service ID in ContactPage.js';
        } else if (error.text.includes('Invalid public key')) {
          errorMessage += 'Please check your Public Key in ContactPage.js';
        } else {
          errorMessage += `Error: ${error.text}`;
        }
      } else {
        errorMessage += 'Please check your EmailJS configuration.';
      }
      
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Navbar/>
      
      <div className="contact-wrapper">
        <div className="contact-card">
          <h2 className="contact-title">Contact Us</h2>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="number">Phone Number *</label>
              <input
                type="tel"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="problem">Problem / Message *</label>
              <textarea
                id="problem"
                name="problem"
                value={formData.problem}
                onChange={handleInputChange}
                required
                rows="6"
                className="form-textarea"
                placeholder="Describe your problem or message"
              />
            </div>

            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('error') ? 'error' : 'success'}`}>
                {submitMessage}
              </div>
            )}
            
            <button 
              type="submit" 
              className="send-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
}

export default ContactPage;

