export default function ProductCard({ title, imagePlaceholder, imageUrl, moq, fabric, features, imageScale = 1 }) {
  return (
    <div className="product-card">
      <div className="product-image-placeholder" style={{ height: '250px', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title || 'Product Image'} 
            style={{ width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${imageScale})` }} 
          />
        ) : (
          imagePlaceholder
        )}
      </div>
      <h3 className="product-title">{title}</h3>
      
      <div className="product-details">
        <p><strong>MOQ:</strong> {moq}</p>
        <p><strong>Fabric:</strong> {fabric}</p>
        <p><strong>Features:</strong> {features}</p>
      </div>
      
      <button className="btn-primary btn-block">
        Request Bulk Quote
      </button>
    </div>
  );
}