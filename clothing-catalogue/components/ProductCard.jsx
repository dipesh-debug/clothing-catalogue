import Image from "next/image";

export default function ProductCard({ title, imagePlaceholder, imageUrl, moq, fabric, features, imageScale = 1 }) {
  return (
    <div className="product-card">
      <div className="product-image-placeholder" style={{ height: '250px', overflow: 'hidden', backgroundColor: '#E5E7EB', position: 'relative' }}>
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={title || 'Product Image'} 
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'contain', transform: `scale(${imageScale})` }} 
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