import Link from "next/link";

export const metadata = {
  title: 'About Us | Clothing Catalogue',
  description: 'Learn about our garment manufacturing infrastructure, technology, and precision sizing.',
};

export default function AboutPage() {
  return (
    <div className="main-content" style={{ display: 'block', padding: '4rem 1.5rem', textAlign: 'center' }}>
      {/* Hero Section */}
      <h1 className="hero-title" style={{ marginBottom: '4rem' }}>
        Engineering Quality. Manufacturing Trust.
      </h1>
      
      {/* Informational Cards Grid */}
      <div className="product-grid" style={{ marginTop: '0', alignItems: 'stretch' }}>
        <div className="product-card" style={{ textAlign: 'left', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h3 className="product-title">Our Infrastructure</h3>
          <p style={{ color: '#4B5563', lineHeight: '1.6', flexGrow: 1 }}>
            Operating out of robust manufacturing hubs in <strong>Damak</strong> and <strong>Biratnagar</strong>, we are fully equipped to support high-volume B2B clients. We boast an impressive production capacity of over <strong>1 Lakh garments annually</strong>, ensuring reliable and scalable delivery for every order.
          </p>
        </div>
        
        <div className="product-card" style={{ textAlign: 'left', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h3 className="product-title">Advanced Technology</h3>
          <p style={{ color: '#4B5563', lineHeight: '1.6', flexGrow: 1 }}>
            We leverage premium sublimation printing technology and automated design processes. This commitment to innovation allows us to guarantee flawless, vibrant finishes on every tracksuit, jersey, and promotional t-shirt we produce.
          </p>
        </div>
        
        <div className="product-card" style={{ textAlign: 'left', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h3 className="product-title">Precision Sizing</h3>
          <p style={{ color: '#4B5563', lineHeight: '1.6', flexGrow: 1 }}>
            Our deep expertise in custom pattern drafting ensures that every garment perfectly matches standard <strong>Indian/Nepal sizing</strong>. We prioritize maximum comfort, superior fit, and consistent quality across all our clothing lines.
          </p>
        </div>
      </div>

      {/* Call to Action Button */}
      <div style={{ marginTop: '4rem' }}>
        <Link href="/contact" className="btn-primary">
          Partner With Us
        </Link>
      </div>
    </div>
  );
}