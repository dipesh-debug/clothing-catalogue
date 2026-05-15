"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar" aria-label="Main Navigation">
      {/* Desktop Menu */}
      <div className="desktop-menu">
        <div className="nav-item">
          <button className="nav-button">Catalogue ▾</button>
          <div className="dropdown-menu">
            <Link href="/tracksuits" className="dropdown-item">Tracksuits</Link>
            <Link href="/school-vests" className="dropdown-item">School Vests</Link>
            <Link href="/montessori" className="dropdown-item">Montessori</Link>
            <Link href="/advertising-tshirts" className="dropdown-item">Advertising T-Shirts</Link>
          </div>
        </div>
        <div className="nav-item">
          <Link href="/about" className="nav-link">About Us</Link>
        </div>
        <div className="nav-item">
          <Link href="/contact" className="nav-link">Contact Us</Link>
        </div>
      </div>

      {/* Mobile Hamburger Button */}
      <button 
        className="hamburger" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-group-title">Catalogue</div>
          <Link href="/tracksuits" className="mobile-link mobile-link-sub" onClick={closeMenu}>Tracksuits</Link>
          <Link href="/school-vests" className="mobile-link mobile-link-sub" onClick={closeMenu}>School Vests</Link>
          <Link href="/montessori" className="mobile-link mobile-link-sub" onClick={closeMenu}>Montessori</Link>
          <Link href="/advertising-tshirts" className="mobile-link mobile-link-sub" onClick={closeMenu}>Advertising T-Shirts</Link>
          
          <Link href="/about" className="mobile-link mobile-link-main" onClick={closeMenu}>About Us</Link>
          <Link href="/contact" className="mobile-link mobile-link-main" onClick={closeMenu}>Contact Us</Link>
        </div>
      )}
    </nav>
  );
}