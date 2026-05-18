"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { supabase } from '@/lib/supabase';

const categories = [
  { id: 'All', label: 'All' },
  { id: 'tracksuits', label: 'Tracksuits' },
  { id: 'school-vests', label: 'School Vests' },
  { id: 'montessori', label: 'Montessori' },
  { id: 'advertising-tshirts', label: 'T-Shirts' }
];

export default function ProjectGallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      // Fetch preview limit of 6 items for the homepage
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          setProducts([]);
          return;
        }
        setProducts(data);
      } catch (error) {
        console.error('Supabase Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProjects = activeCategory === 'All' 
    ? products 
    : products.filter(project => project.category === activeCategory);

  return (
    <div>
      {/* Filter Buttons */}
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

      {/* Image Grid */}
      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--bg-secondary)', fontWeight: 'bold' }}>Loading Products...</div>
      ) : filteredProjects.length === 0 ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: '#4B5563' }}>
          No products found in this category.
        </div>
      ) : (
        <div className="product-grid" style={{ marginTop: 0 }}>
          {filteredProjects.map((project) => (
            <ProductCard 
              key={project.id}
              id={project.id}
              title={project.title}
              imageUrl={project.image_url}
              fabric={project.fabric}
              features={project.features}
              imagePlaceholder="[ Image Not Found ]"
            />
          ))}
        </div>
      )}

      {/* Explore More Button */}
      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <style>{`
          .btn-explore {
            display: inline-block;
            background-color: #FFFFFF;
            border: 2px solid #1E3A8A;
            color: #1E3A8A;
            font-weight: bold;
            font-size: 1.1rem;
            padding: 1rem 3rem;
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
  );
}