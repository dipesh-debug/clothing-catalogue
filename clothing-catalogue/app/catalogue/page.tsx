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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(true);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('Newest Arrivals');

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

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const categoryFilteredProducts = products.filter(p => activeCategory === 'All' || p.category === activeCategory);

  const getColorCount = (color: string) => {
    return categoryFilteredProducts.filter((p) => p.color === color).length;
  };

  const colorFilteredProducts = categoryFilteredProducts.filter((p) => {
    const colorMatch = selectedColors.length === 0 || selectedColors.includes(p.color);
    return colorMatch;
  });

  const sortedProducts = [...colorFilteredProducts].sort((a, b) => {
    // For any sort option, bring products with a matching `sort_tag` to the top.
    const aIsTagged = a.sort_tag === sortOption;
    const bIsTagged = b.sort_tag === sortOption;

    if (aIsTagged && !bIsTagged) {
      return -1; // a comes first
    }
    if (!aIsTagged && bIsTagged) {
      return 1; // b comes first
    }

    // If both are tagged or neither are, use creation date as a secondary sort
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const FilterSidebar = () => (
    <div className="filter-sidebar" style={{ backgroundColor: '#FFF' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--bg-secondary)', marginBottom: '1.5rem', borderBottom: '2px solid #E5E7EB', paddingBottom: '0.75rem' }}>Filters</h2>
      
      {/* Category */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>Category</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {categories.map((cat) => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" name="category" checked={activeCategory === cat.id} onChange={() => setActiveCategory(cat.id)} style={{ accentColor: 'var(--accent-color)' }} />
              <span style={{ fontSize: '0.95rem', color: activeCategory === cat.id ? 'var(--accent-color)' : '#4B5563', fontWeight: activeCategory === cat.id ? 600 : 400 }}>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Accordion */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div onClick={() => setColorOpen(!colorOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>Color</h3>
          <span style={{ fontSize: '1.25rem', fontWeight: 300, color: '#6B7280' }}>{colorOpen ? '−' : '+'}</span>
        </div>
        {colorOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            {['Black', 'Blue', 'Red', 'Navy'].map(color => (
              <label key={color} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={selectedColors.includes(color)} onChange={() => handleColorToggle(color)} style={{ accentColor: 'var(--accent-color)' }} />
                  <span style={{ fontSize: '0.95rem', color: '#4B5563' }}>{color}</span>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>({getColorCount(color)})</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <style>{`
        .catalogue-container { max-width: 1440px; margin: 0 auto; display: flex; gap: 3rem; padding: 3rem 1.5rem; }
        .sidebar-col { flex: 0 0 250px; position: sticky; top: 100px; height: max-content; }
        .grid-col { flex: 1; min-width: 0; }
        .mobile-filter-btn { display: none; width: 100%; background-color: #FFFFFF; color: var(--bg-secondary); border: 1px solid var(--bg-secondary); padding: 0.75rem; font-weight: bold; text-align: center; border-radius: 4px; margin-bottom: 1.5rem; cursor: pointer; }
        .mobile-drawer-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; }
        .mobile-drawer { position: fixed; top: 0; left: -300px; width: 280px; height: 100%; background: #FFF; z-index: 2001; transition: left 0.3s ease; padding: 1.5rem; overflow-y: auto; box-shadow: 2px 0 8px rgba(0,0,0,0.1); }
        .mobile-drawer.open { left: 0; }
        
        @media (max-width: 900px) {
          .sidebar-col { display: none; }
          .mobile-filter-btn { display: block; }
          .mobile-drawer-overlay.open { display: block; }
        }
      `}</style>

      <div className="catalogue-container">
        {/* Desktop Sidebar */}
        <aside className="sidebar-col">
          <FilterSidebar />
        </aside>

        {/* Mobile Drawer */}
        <div className={`mobile-drawer-overlay ${isMobileFilterOpen ? 'open' : ''}`} onClick={() => setIsMobileFilterOpen(false)}></div>
        <div className={`mobile-drawer ${isMobileFilterOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--bg-secondary)' }}>Filters</h2>
            <button onClick={() => setIsMobileFilterOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: '#6B7280' }}>&times;</button>
          </div>
          <FilterSidebar />
        </div>

        {/* Right Product Grid Area */}
        <main className="grid-col">
          <button className="mobile-filter-btn" onClick={() => setIsMobileFilterOpen(true)}>
            Filter & Sort Products
          </button>

          {/* Top Sorting Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #E5E7EB', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '1.05rem', color: '#4B5563', fontWeight: 500 }}>
              <strong style={{ color: 'var(--text-dark)' }}>{sortedProducts.length}</strong> products found
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label htmlFor="sort" style={{ fontSize: '0.95rem', color: '#4B5563' }}>Sort by:</label>
              <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{ padding: '0.5rem 2rem 0.5rem 1rem', border: '1px solid #D1D5DB', borderRadius: '4px', backgroundColor: '#FFF', fontSize: '0.95rem', color: 'var(--text-dark)', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}>
                <option>Newest Arrivals</option>
                <option>Featured</option>
                <option>Best Selling</option>
                <option>Popularity</option>
              </select>
            </div>
          </div>

      {loading ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--bg-secondary)', fontWeight: 'bold' }}>Loading Catalogue...</div>
      ) : sortedProducts.length === 0 ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', color: '#4B5563' }}>
          No products found in this category. Please check back later or contact us for inquiries.
            </div>
      ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
          {sortedProducts.map((product) => (
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
        </main>
      </div>
    </div>
  );
}
