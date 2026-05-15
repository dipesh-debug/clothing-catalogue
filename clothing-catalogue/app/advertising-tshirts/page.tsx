import ProductCard from '../../components/ProductCard';

export const metadata = {
  title: 'Advertising T-Shirts | Clothing Catalogue',
};

export default function AdvertisingTShirtsPage() {
  return (
    <div className="main-content" style={{ display: 'block', padding: '3rem 1.5rem' }}>
      <div className="welcome-card" style={{ margin: '0 auto' }}>
        <h2>Advertising T-Shirts</h2>
        <p>
          High-visibility, bulk-manufactured promotional t-shirts perfect for your next marketing campaign.
        </p>
      </div>
      
      <div className="product-grid">
        <ProductCard 
          title="Full Sublimation Promo Tee"
          imagePlaceholder="[ Promo Tee Image ]"
          moq="500 Units"
          fabric="Dry-Fit Micro-Polyester"
          features="Vibrant Sublimation Printing, High-Volume Capacity, Quick-Dry"
        />
        <ProductCard 
          title="Corporate Event Polo"
          imagePlaceholder="[ Event Polo Image ]"
          moq="100 Units"
          fabric="Pique Cotton"
          features="Professional Look, Custom Embroidery/Printing"
        />
        <ProductCard 
          title="Bulk Campaign T-Shirt"
          imagePlaceholder="[ Campaign T-Shirt Image ]"
          moq="1000 Units"
          fabric="Standard Spun Polyester"
          features="Cost-Effective, Bulk Production, High-Visibility Sublimation"
        />
      </div>
    </div>
  );
}