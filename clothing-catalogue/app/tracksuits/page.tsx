import ProductCard from '../../components/ProductCard';

export const metadata = {
  title: 'Tracksuits | Clothing Catalogue',
  description: 'Premium tracksuits with standard Indian/Nepal sizes. Capacity of 1 lakh garments per year from Biratnagar and Damak.',
};

export default function TracksuitsPage() {
  return (
    <div className="main-content" style={{ display: 'block', padding: '3rem 1.5rem' }}>
      <div className="welcome-card" style={{ margin: '0 auto' }}>
        <h2>Tracksuits</h2>
        <p>
          With a manufacturing capacity of 1 lakh garments per year out of Biratnagar and Damak, we ensure reliable, large-scale production. Our tracksuits adhere to standard Indian/Nepal sizes and feature premium sublimation printing for vibrant, long-lasting designs.
        </p>
      </div>
      
      <div className="product-grid">
        <ProductCard 
          title="Premium Sublimated Tracksuit"
          imagePlaceholder="[ Tracksuit Image ]"
          moq="500 Sets"
          fabric="100% Polyester Sublimation"
          features="Breathable, Anti-Pilling, Custom Prints"
        />
        <ProductCard 
          title="Winter Fleece Tracksuit"
          imagePlaceholder="[ Fleece Image ]"
          moq="300 Sets"
          fabric="Cotton-Poly Blend Fleece"
          features="Warm, Durable, Embroidered Logo"
        />
        <ProductCard 
          title="Standard School Tracksuit"
          imagePlaceholder="[ School Image ]"
          moq="1000 Sets"
          fabric="Micro-Fibre / Super Poly"
          features="Colorfast, Standardized Sizes, Cost-Effective"
        />
      </div>
    </div>
  );
}