"use client";

import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function TracksuitsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'tracksuits');
      
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className="main-content" style={{ display: 'block', padding: '3rem 1.5rem' }}>
      <div className="welcome-card" style={{ margin: '0 auto' }}>
        <h2>Tracksuits</h2>
        <p>
          With a manufacturing capacity of 1 lakh garments per year out of Biratnagar and Damak, we ensure reliable, large-scale production. Our tracksuits adhere to standard Indian/Nepal sizes and feature premium sublimation printing for vibrant, long-lasting designs.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <style>{`
            .btn-explore {
              display: inline-block;
              background-color: #FFFFFF;
              border: 2px solid #1E3A8A;
              color: #1E3A8A;
              font-weight: bold;
              font-size: 1rem;
              padding: 0.75rem 2rem;
              border-radius: 6px;
              text-decoration: none;
              transition: all 0.3s ease;
            }
            .btn-explore:hover {
              background-color: #1E3A8A;
              color: #FFFFFF;
            }
          `}</style>
          <Link href="/catalogue" className="btn-explore">
            Explore Full Catalogue &rarr;
          </Link>
        </div>
      </div>

      
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--bg-secondary)', marginTop: '3rem', fontWeight: 'bold' }}>Loading Catalogue...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#4B5563', marginTop: '3rem' }}>
          Our Tracksuits collection is currently being updated. Please contact our Damak/Biratnagar office for immediate bulk inquiries.
        </p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              title={product.title}
              imageUrl={product.image_url}
              moq={product.moq}
              fabric={product.fabric}
              features={product.features}
              imagePlaceholder="[ Image Not Found ]"
            />
          ))}
        </div>
      )}
    </div>
  );
}