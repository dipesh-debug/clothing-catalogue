"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
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
      const isOutsideDesktop = desktopSearchRef.current && !desktopSearchRef.current.contains(event.target);
      const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target);

      if (isOutsideDesktop && isOutsideMobile) {
        setShowResults(false);
        if (searchQuery.trim().length === 0) {
          setIsSearchOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setShowResults(false);
  };

  const renderSearchBlock = (isMobile) => (
    <div className={`search-wrapper ${isMobile ? 'w-100' : ''}`} ref={isMobile ? mobileSearchRef : desktopSearchRef}>
      <div className={`search-input-container ${isSearchOpen ? 'open' : ''} ${isMobile ? 'w-100' : ''}`}>
        <div className="search-icon-btn">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        <input 
          id={isMobile ? 'mobile-search-input' : 'desktop-search-input'}
          type="text" 
          placeholder="Search products..." 
          className="search-input"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => {
            setIsSearchOpen(true);
            if (searchQuery.trim().length > 0) setShowResults(true);
          }}
          onClick={() => {
            if (!isSearchOpen) setIsSearchOpen(true);
          }}
        />

        <button 
          className="close-icon-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            closeSearch();
          }}
          aria-label="Close Search"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="search-results-container">
          {searchResults.map(product => (
            <div 
              key={product.id}
              onClick={() => {
                router.push(`/products/${product.id}`);
                closeSearch();
              }}
              className="search-result-item"
            >
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className="search-result-img" />
              ) : (
                <div className="search-result-img-placeholder"></div>
              )}
              <span className="search-result-title">
                {product.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className="navbar" aria-label="Main Navigation" style={{ justifyContent: 'space-between', position: 'relative' }}>
      <style>{`
        .search-wrapper { position: relative; display: flex; align-items: center; }
        .search-wrapper.w-100 { width: 100%; }
        
        .search-input-container {
          position: relative; display: flex; align-items: center;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          width: 40px; height: 40px; overflow: hidden;
        }
        .search-input-container.open { width: 280px; }
        .search-input-container.w-100 { width: 100% !important; }
        
        .search-input {
          background-color: var(--bg-primary); border: 1px solid var(--bg-secondary);
          border-radius: 999px; padding: 0.4rem 2.5rem; color: var(--text-dark);
          outline: none; font-size: 0.95rem; width: 100%; height: 100%;
          cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: all 0.3s ease;
        }
        .search-input-container:not(.open) .search-input::placeholder { color: transparent; }
        .search-input-container.open .search-input { cursor: text; border-color: var(--bg-primary); }
        
        .search-icon-btn {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: var(--bg-secondary); pointer-events: none; display: flex;
          align-items: center; justify-content: center; z-index: 2;
        }
        
        .close-icon-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          color: var(--bg-secondary); cursor: pointer; background: transparent; border: none;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none; transition: opacity 0.3s ease; padding: 0;
        }
        .search-input-container.open .close-icon-btn { opacity: 1; pointer-events: auto; }
        
        .desktop-nav-links {
          display: flex; align-items: center; gap: 1rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 300px; opacity: 1; overflow: hidden; white-space: nowrap;
        }
        .desktop-nav-links.hidden { max-width: 0; opacity: 0; pointer-events: none; }
        
        .mobile-actions { display: none; align-items: center; gap: 0.5rem; }
        .mobile-search-toggle {
          background: transparent; border: none; color: var(--text-light);
          cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0.25rem;
        }
        .mobile-search-overlay { display: none; }
        
        .search-results-container {
          position: absolute; top: calc(100% + 12px); right: 0; width: 100%; min-width: 280px;
          background-color: #fff; border: 1px solid var(--bg-secondary); border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15); overflow: hidden; z-index: 1002;
        }
        .search-result-item {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem;
          cursor: pointer; border-bottom: 1px solid #E5E7EB; transition: background-color 0.2s ease;
        }
        .search-result-item:last-child { border-bottom: none; }
        .search-result-item:hover { background-color: #EFF6FF; }
        .search-result-img, .search-result-img-placeholder { width: 40px; height: 40px; border-radius: 4px; }
        .search-result-img { object-fit: cover; }
        .search-result-img-placeholder { background-color: #E5E7EB; }
        .search-result-title { font-size: 0.95rem; color: var(--bg-secondary); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        @media (max-width: 768px) {
          .mobile-actions { display: flex; }
          .mobile-search-overlay.open {
            display: flex; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-color: var(--bg-secondary); align-items: center; padding: 0 1rem; z-index: 1001;
          }
          .search-results-container { top: calc(100% + 8px); left: 0; right: 0; width: 100%; min-width: unset; }
        }
      `}</style>

      {/* Left Desktop Menu */}
      <div className="desktop-menu" style={{ flex: 1 }}>
        <div className="nav-item">
          <Link href="/catalogue" className="nav-link">
            Catalogue
          </Link>
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
        {renderSearchBlock(false)}
        <div className={`desktop-nav-links ${isSearchOpen ? 'hidden' : 'visible'}`}>
          <div className="nav-item">
            <Link href="/about" className="nav-link">About Us</Link>
          </div>
          <div className="nav-item">
            <Link href="/contact" className="nav-link">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="mobile-actions">
        <button 
          className="mobile-search-toggle" 
          onClick={() => { setIsSearchOpen(true); setTimeout(() => document.getElementById('mobile-search-input')?.focus(), 100); }}
          aria-label="Open Mobile Search"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        <button className="hamburger" style={{ marginLeft: 0 }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle mobile menu">
          <span className="hamburger-line"></span><span className="hamburger-line"></span><span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Search Overlay */}
      <div className={`mobile-search-overlay ${isSearchOpen ? 'open' : ''}`}>
        {renderSearchBlock(true)}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link href="/catalogue" className="mobile-link mobile-link-main" onClick={closeMenu}>Catalogue</Link>
          <Link href="/about" className="mobile-link mobile-link-main" onClick={closeMenu}>About Us</Link>
          <Link href="/contact" className="mobile-link mobile-link-main" onClick={closeMenu}>Contact Us</Link>
        </div>
      )}
    </nav>
  );
}