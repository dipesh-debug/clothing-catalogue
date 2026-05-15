"use client";

import { useState } from 'react';
import Image from 'next/image';

const projectData = [
  { id: 1, title: 'Everest Academy Tracksuits', category: 'Tracksuits', image: 'https://placehold.co/600x450/e2e8f0/1e3a8a?text=Tracksuits' },
  { id: 2, title: 'Lions Club Jerseys', category: 'Jerseys', image: 'https://placehold.co/600x450/e2e8f0/1e3a8a?text=Jerseys' },
  { id: 3, title: 'Montessori Summer Uniforms', category: 'School Uniforms', image: 'https://placehold.co/600x450/e2e8f0/1e3a8a?text=School+Uniforms' },
  { id: 4, title: 'National Team Warmups', category: 'Tracksuits', image: 'https://placehold.co/600x450/e2e8f0/1e3a8a?text=Tracksuits' },
  { id: 5, title: 'City High Winter Vests', category: 'School Uniforms', image: 'https://placehold.co/600x450/e2e8f0/1e3a8a?text=School+Uniforms' },
  { id: 6, title: 'Regional Tournament Kits', category: 'Jerseys', image: 'https://placehold.co/600x450/e2e8f0/1e3a8a?text=Jerseys' },
];

const categories = ['All', 'Jerseys', 'Tracksuits', 'School Uniforms'];

export default function ProjectGallery() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projectData 
    : projectData.filter(project => project.category === activeCategory);

  return (
    <div>
      {/* Filter Buttons */}
      <div className="gallery-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="product-grid" style={{ marginTop: 0 }}>
        {filteredProjects.map((project, index) => (
          <div key={project.id} className="gallery-item" style={{ backgroundColor: '#E5E7EB' }}>
            <Image 
              src={project.image} 
              alt={project.title} 
              className="gallery-img" 
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={index < 3}
            />
            <div className="gallery-overlay">
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.15rem' }}>{project.title}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#93C5FD' }}>{project.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}