"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('id, title, image_url')
        .ilike('title', `%${searchQuery}%`)
        .limit(5);

      if (!error && data) {
        setSearchResults(data);
        setShowResults(true);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar" aria-label="Main Navigation" style={{ justifyContent: 'space-between' }}>
      {/* Left Desktop Menu */}
      <div className="desktop-menu" style={{ flex: 1 }}>
        <div className="nav-item">
          <Link href="/catalogue" className="nav-button" style={{ display: 'inline-block', textDecoration: 'none' }}>Catalogue ▾</Link>
          <div className="dropdown-menu">
            <Link href="/tracksuits" className="dropdown-item">Tracksuits</Link>
            <Link href="/school-vests" className="dropdown-item">School Vests</Link>
            <Link href="/montessori" className="dropdown-item">Montessori</Link>
            <Link href="/advertising-tshirts" className="dropdown-item">Advertising T-Shirts</Link>
          </div>
        </div>
      </div>

      {/* Center Logo */}
      <div className="nav-brand" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-light)', fontSize: '1.75rem', fontWeight: '900', letterSpacing: '1px' }}>
          PG
        </Link>
      </div>

      {/* Right Desktop Menu */}
      <div className="desktop-menu" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <div className="nav-item" ref={searchRef} style={{ marginRight: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => {
              if (searchQuery.trim().length > 0) setShowResults(true);
            }}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--bg-secondary)',
              borderRadius: '999px',
              padding: '0.4rem 1rem',
              color: 'var(--text-dark)',
              outline: 'none',
              width: '220px',
              fontSize: '0.9rem'
            }}
          />
          {showResults && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '280px',
              backgroundColor: '#fff',
              border: '1px solid var(--bg-secondary)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              zIndex: 10
            }}>
              {searchResults.map(product => (
                <div 
                  key={product.id}
                  onClick={() => {
                    router.push(`/products/${product.id}`);
                    setShowResults(false);
                    setSearchQuery('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid #E5E7EB',
                    transition: 'background-color 0.2s ease',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFF6FF'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '36px', height: '36px', backgroundColor: '#E5E7EB', borderRadius: '4px' }}></div>
                  )}
                  <span style={{ fontSize: '0.9rem', color: 'var(--bg-secondary)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.title}
                  </span>
                </div>
              ))}
            </div>
          )}
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