export const metadata = {
  title: 'Request a Bulk Quote | Contact Us',
  description: 'Request a bulk manufacturing quote from our Damak and Biratnagar facilities.',
};

export default function ContactPage() {
  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        
        {/* Left Column: Contact Info */}
        <div className="contact-info">
          <h1>Request a Bulk Quote</h1>
          <p>
            Partner with us for premium garment manufacturing. We proudly operate state-of-the-art facilities across <strong>Damak</strong> and <strong>Biratnagar</strong>, boasting an annual production capacity of over <strong>1 Lakh garments</strong>.
          </p>
          <p>
            Whether you need tracksuits, school uniforms, or bulk promotional t-shirts, our team is ready to deliver high-quality products tailored to your exact specifications.
          </p>
          <div style={{ marginTop: '2.5rem' }}>
            <p><strong>Email:</strong> sales@yourcompany.com</p>
            <p><strong>Phone:</strong> +977 980-0000000</p>
            <p><strong>Hours:</strong> Sunday - Friday, 9:00 AM - 6:00 PM</p>
          </div>
        </div>

        {/* Right Column: The Form */}
        <div className="contact-form-card">
          <form>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" className="form-control" placeholder="John Doe" required />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="company">Company / School Name</label>
              <input type="text" id="company" className="form-control" placeholder="Everest Academy" required />
            </div>

            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label" htmlFor="email">Email Address</label>
                <input type="email" id="email" className="form-control" placeholder="john@example.com" required />
              </div>
              <div>
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" className="form-control" placeholder="+977..." required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Product Categories</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="category" value="tracksuits" style={{ width: '1.1rem', height: '1.1rem' }} />
                  <span>Tracksuits</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="category" value="school-vests" style={{ width: '1.1rem', height: '1.1rem' }} />
                  <span>School Vests</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="category" value="montessori" style={{ width: '1.1rem', height: '1.1rem' }} />
                  <span>Montessori</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="category" value="t-shirts" style={{ width: '1.1rem', height: '1.1rem' }} />
                  <span>Advertising T-Shirts</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="quantity">Estimated Quantity</label>
              <input type="number" id="quantity" className="form-control" placeholder="e.g. 500" min="50" required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="requirements">Additional Requirements</label>
              <textarea id="requirements" className="form-control" rows="4" placeholder="Tell us about specific fabrics, sizes, or printing needs..."></textarea>
            </div>

            <button type="submit" className="btn-primary btn-block">
              Send Quote Request
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}