import Image from 'next/image';
import React from 'react';
import InquiryModal from './InquiryModal';

interface ProductCardProps {
  id?: string;
  title?: string;
  imagePlaceholder?: React.ReactNode;
  imageUrl?: string;
  fabric?: string;
  features?: string;
  imageScale?: number;
}

export default function ProductCard({ id, title, imagePlaceholder, imageUrl, fabric, features, imageScale = 1 }: ProductCardProps) {
  return (
    <div className="product-card-upgraded" style={{ backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', textAlign: 'left', position: 'relative', borderRadius: '8px', overflow: 'hidden', transition: 'transform 0.2s ease, box-shadow 0.2s ease', border: '1px solid #F1F5F9' }}>
      <style>{`
        .product-card-upgraded:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); }
        .product-card-upgraded:hover .product-image-window { background-color: #E5E7EB; }
        .heart-icon:hover { color: var(--accent-color) !important; fill: rgba(220, 38, 38, 0.1); cursor: pointer; }
      `}</style>

      <div className="product-image-window" style={{ position: 'relative', height: '280px', backgroundColor: '#F8FAFC', transition: 'background-color 0.3s ease', overflow: 'hidden' }}>
        {/* Absolute Top-Right Heart Icon */}
        <div className="heart-icon" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, color: '#9CA3AF', transition: 'color 0.2s ease, fill 0.2s ease' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>

        {imageUrl ? (
          <div style={{ width: '100%', height: '100%', position: 'relative', transform: `scale(${imageScale})` }}>
            <Image 
              src={imageUrl} 
              alt={title || 'Product Image'} 
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'contain' }} 
            />
          </div>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontWeight: 'bold' }}>
            {imagePlaceholder}
          </div>
        )}
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--bg-secondary)', margin: '0 0 0.75rem 0', fontWeight: 700, lineHeight: 1.3 }}>
          {title}
        </h3>
        
        <div style={{ fontSize: '0.85rem', color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem', flex: 1 }}>
          <span><strong style={{ color: 'var(--text-dark)' }}>Fabric:</strong> {fabric || 'N/A'}</span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><strong style={{ color: 'var(--text-dark)' }}>Features:</strong> {features || 'N/A'}</span>
        </div>

        {id ? (
          <InquiryModal productTitle={title || ''} productUrl={`https://purbeligarments.com/products/${id}`}>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'var(--accent-color)', color: '#FFF', padding: '0.6rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', transition: 'background-color 0.2s', width: '100%', boxSizing: 'border-box', border: 'none', cursor: 'pointer' }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.64-1.653-1.938-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Inquire on WhatsApp
            </button>
          </InquiryModal>
        ) : null}
      </div>
    </div>
  );
}