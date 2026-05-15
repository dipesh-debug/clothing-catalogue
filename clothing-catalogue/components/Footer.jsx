"use client";

import Link from "next/link";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Column 1: Brand */}
        <div className="footer-col">
          <h3>Purbeli Garments</h3>
          <p>High-volume apparel manufacturing in Nepal. Engineering quality and manufacturing trust from design to doorstep.</p>
        </div>
        
        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <div className="footer-links">
            <Link href="/tracksuits" className="footer-link">Tracksuits</Link>
            <Link href="/school-vests" className="footer-link">School Vests</Link>
            <Link href="/montessori" className="footer-link">Montessori Uniforms</Link>
            <Link href="/advertising-tshirts" className="footer-link">Advertising T-Shirts</Link>
          </div>
        </div>

        {/* Column 3: Contact */}
        <div className="footer-col">
          <h3>Contact Us</h3>
          <p><strong>Damak Office</strong><br/>Jhapa, Nepal</p>
          <p><strong>Biratnagar Office</strong><br/>Morang, Nepal</p>
          <p style={{ marginTop: '1rem' }}>Email: info@purbeligarments.com</p>
          <a href="tel:+9779800000000" className="btn-call-now">Call Now: +977 980-0000000</a>
        </div>

        {/* Column 4: Newsletter/Legal */}
        <div className="footer-col">
          <h3>Legal & More</h3>
          <div className="footer-links">
            <Link href="#" className="footer-link">Privacy Policy</Link>
            <Link href="#" className="footer-link">Terms of Service</Link>
          </div>
          <button onClick={scrollToTop} className="btn-call-now" style={{ cursor: 'pointer', marginTop: '1.5rem' }}>
            ↑ Back to Top
          </button>
        </div>
      </div>
      
      {/* Bottom Copyright Section */}
      <div className="footer-bottom">
        &copy; 2026 Dipesh Karna. All rights reserved.
      </div>
    </footer>
  );
}