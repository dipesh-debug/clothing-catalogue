import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Column 1: About */}
        <div className="footer-col">
          <h3>About Us</h3>
          <p>Premium garment manufacturing specializing in sublimation printing and custom pattern drafting for Indian/Nepal standard sizes.</p>
        </div>
        
        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <div className="footer-links">
            <Link href="/tracksuits" className="footer-link">Tracksuits</Link>
            <Link href="/school-vests" className="footer-link">School Vests</Link>
            <Link href="/montessori" className="footer-link">Montessori</Link>
            <Link href="/advertising-tshirts" className="footer-link">Advertising T-Shirts</Link>
          </div>
        </div>

        {/* Column 3: Operations */}
        <div className="footer-col">
          <h3>Operations</h3>
          <p>Proudly managing operations across Damak and Biratnagar.</p>
          <p>Email: info@yourcompany.com<br />Phone: +977 980-0000000</p>
        </div>
      </div>
      
      {/* Bottom Copyright Section */}
      <div className="footer-bottom">
        &copy; 2026 Your Company Name. All Rights Reserved.
      </div>
    </footer>
  );
}