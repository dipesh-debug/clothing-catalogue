import ProductCard from '../../components/ProductCard';

export const metadata = {
  title: 'Montessori Uniforms | Clothing Catalogue',
};

export default function MontessoriPage() {
  return (
    <div className="main-content" style={{ display: 'block', padding: '3rem 1.5rem' }}>
      <div className="welcome-card" style={{ margin: '0 auto' }}>
        <h2>Montessori Uniforms</h2>
        <p>
          Soft, playful, and easy-to-wash uniforms tailored specifically for the comfort of Montessori students.
        </p>
      </div>
      
      <div className="product-grid">
        <ProductCard 
          title="Active Play Set"
          imagePlaceholder="[ Play Set Image ]"
          moq="50 Units"
          fabric="100% Breathable Cotton"
          features="Comfortable, Play-Friendly, Standard Indian/Nepal Sizing"
        />
        <ProductCard 
          title="Soft Cotton Pre-School Tee"
          imagePlaceholder="[ Pre-School Tee Image ]"
          moq="100 Units"
          fabric="Bio-Washed Cotton"
          features="Ultra-Soft, Hypoallergenic, Vibrant Sublimation Printing"
        />
        <ProductCard 
          title="Summer Shorts & Top Bundle"
          imagePlaceholder="[ Summer Bundle Image ]"
          moq="100 Units"
          fabric="Cotton-Spandex Blend"
          features="Stretchy, Breathable, Easy-Wash"
        />
      </div>
    </div>
  );
}