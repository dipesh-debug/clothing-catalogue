"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface InquiryModalProps {
  productTitle: string;
  productUrl: string;
}

export default function InquiryModal({ productTitle, productUrl }: InquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSend = () => {
    if (!name || !organization || !quantity) {
      alert('Please fill out all fields before sending.');
      return;
    }
    const message = `Hello Purbeli Garments, I am ${name} from ${organization}. We are interested in ordering ${quantity} units of the [${productTitle}]. Please provide a bulk quote. Product Link: ${productUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    boxSizing: 'border-box',
    marginTop: '4px'
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 500,
    fontSize: '14px',
    color: '#475569'
  };

  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleTriggerClick}
        style={{
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '6px',
          width: '100%',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          textAlign: 'center'
        }}
      >
        Inquire on WhatsApp
      </button>

      {isMounted && isOpen && createPortal(
        <div // Overlay
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '16px',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div // Modal Card
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              color: '#334155'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>B2B Inquiry</h2>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#9ca3af', lineHeight: 1 }}>
                &times;
              </button>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="name" style={labelStyle}>Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="organization" style={labelStyle}>Company / School Name</label>
                <input
                  type="text"
                  id="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  style={inputStyle}
                  placeholder="Everest Academy"
                />
              </div>
              <div>
                <label htmlFor="quantity" style={labelStyle}>Estimated Quantity</label>
                <input
                  type="text"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g., 500 units"
                />
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => setIsOpen(false)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSend} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Send</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}