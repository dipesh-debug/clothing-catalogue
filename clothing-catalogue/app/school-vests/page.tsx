import ProductCard from '../../components/ProductCard';

export const metadata = {
  title: 'School Vests | Clothing Catalogue',
};

export default function SchoolVestsPage() {
  return (
    <div className="main-content" style={{ display: 'block', padding: '3rem 1.5rem' }}>
      <div className="welcome-card" style={{ margin: '0 auto' }}>
        <h2>School Vests</h2>
        <p>
          Explore our durable and comfortable school vests, designed perfectly for everyday student wear.
        </p>
      </div>
      
      <div className="product-grid">
        <ProductCard 
          title="Standard V-Neck Vest"
          imagePlaceholder="[ V-Neck Vest Image ]"
          moq="100 Units"
          fabric="Poly-Cotton Blend"
          features="Durable, Easy-Care, Colorfast"
        />
        <ProductCard 
          title="Winter Knit Uniform Vest"
          imagePlaceholder="[ Knit Vest Image ]"
          moq="200 Units"
          fabric="100% Acrylic"
          features="Warm, Soft, Pilling-Resistant"
        />
        <ProductCard 
          title="Premium Poly-Blend Vest"
          imagePlaceholder="[ Premium Vest Image ]"
          moq="150 Units"
          fabric="Premium Blended Wool"
          features="High-Quality, Elegant, Standard Indian/Nepal Sizing"
        />
      </div>
    </div>
  );
}