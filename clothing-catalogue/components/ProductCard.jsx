export default function ProductCard({ title, imagePlaceholder, moq, fabric, features }) {
  return (
    <div className="product-card">
      <div className="product-image-placeholder">
        {imagePlaceholder}
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