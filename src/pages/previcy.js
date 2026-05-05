import Footer from "../components/footer/Footer";
import Navbar from "../components/navbar/navbar";
import './previcy.css';

function Previcy() {
  return (
    <div className="previcy-page">
      <Navbar />

      <div className='previcy-wrapper'>
        <div className='previcy-text'>
          <h2>Return Policy</h2>

          <p>
            Due to the nature of our products, all cosmetic products cannot be returned once they have been received and opened.
            <br /><br />
            Returns are only accepted under the following conditions:
            <br />• You received the wrong item
            <br />• You received a defective item
            <br /><br />

            <strong>Return Eligibility:</strong><br />
            • The item must be unused, unopened, and in the same condition as received.<br />
            • It must be in the original packaging.<br />
            • A receipt or proof of purchase is required.<br /><br />

            <strong>Return Process:</strong><br />
            • Request a return through our customer service email: <b>ashbodysplash@gmail.com</b> within 24 hours of receiving the order.<br />
            • Send a photo of the defective or incorrect item next to the airway bill on the shipping flyer.<br />
            • The returned item will be picked up by our shipping company within 3–5 business days.<br /><br />

            For inquiries, contact us at: <b>Ashbodysplash@gmail.com</b>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Previcy;
