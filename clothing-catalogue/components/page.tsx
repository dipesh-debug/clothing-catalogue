"use client";

import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import { supabase } from '../../lib/supabase';

const categories = [
  { id: 'All', label: 'All' },
  { id: 'tracksuits', label: 'Tracksuits' },
  { id: 'school-vests', label: 'School Vests' },
  { id: 'montessori', label: 'Montessori Uniforms' },
  { id: 'advertising-tshirts', label: 'Advertising T-Shirts' }
];

export default function CataloguePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="main-content" style={{ display: 'block', padding: '3rem 1.5rem' }}>
      <div className="welcome-card" style={{ margin: '0 auto', marginBottom: '3rem' }}>
        <h2>Full Catalogue</h2>
        <p>
          Browse our complete range of premium manufactured garments. Use the filters below to find specific categories.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="gallery-filter">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--bg-secondary)', marginTop: '3rem', fontWeight: 'bold' }}>Loading Catalogue...</p>
      ) : filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#4B5563', marginTop: '3rem' }}>
          No products found in this category. Please check back later or contact us for inquiries.
        </p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
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