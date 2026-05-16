"use client";

import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import { supabase } from '../../lib/supabase';
import CategoryPills from '../../components/CategoryPills';

export default function SchoolVestsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
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
        <h2>School Vests</h2>
        <p>
          Explore our durable and comfortable school vests, designed perfectly for everyday student wear.
        </p>
      </div>

      <CategoryPills activeCategory="School Uniforms" />
      
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--bg-secondary)', marginTop: '3rem', fontWeight: 'bold' }}>Loading Catalogue...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#4B5563', marginTop: '3rem' }}>
          Our School Vests collection is currently being updated. Please contact our Damak/Biratnagar office for immediate bulk inquiries.
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