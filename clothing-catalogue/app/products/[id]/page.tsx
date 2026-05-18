import Image from 'next/image';
import { supabase } from '../../../lib/supabase';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.title,
    description: `Fabric: ${product.fabric || 'N/A'} | Features: ${product.features || 'N/A'}`,
    openGraph: {
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) {
    return (
      <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', backgroundColor: 'var(--bg-primary)' }}>
        <h2 style={{ color: '#4B5563' }}>Product not found.</h2>
      </div>
    );
  }

  // Prepare WhatsApp CTA Link
  const whatsappNumber = "9779800000000"; // Using the placeholder number from your Footer
  const productUrl = `https://purbeligarments.com/products/${product.id}`;
  const whatsappMessage = encodeURIComponent(`Hello, I am interested in a bulk order for ${product.title}. Can you provide pricing and fabric availability for this item?\n\nCheck out this product: ${productUrl}`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="main-content" style={{ display: 'block', padding: '4rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', padding: '3rem' }}>
        
        {/* Left Column: Image Window */}
        <div style={{ position: 'relative', width: '100%', height: '500px', backgroundColor: '#E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
          {product.image_url ? (
            <Image 
              src={product.image_url} 
              alt={product.title} 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'contain' }}
              priority
            />
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-secondary)', fontWeight: 'bold' }}>
              [ Image Not Found ]
            </div>
          )}
        </div>

        {/* Right Column: Specifications */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ color: 'var(--bg-secondary)', fontSize: '2.5rem', marginTop: 0, marginBottom: '1.5rem' }}>{product.title}</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem', fontSize: '1.1rem', color: '#4B5563' }}>
            <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem' }}><strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '0.25rem' }}>Minimum Order Quantity (MOQ)</strong>{product.moq || 'N/A'}</div>
            <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem' }}><strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '0.25rem' }}>Fabric Type</strong>{product.fabric || 'N/A'}</div>
            <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem' }}><strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '0.25rem' }}>Special Features</strong>{product.features || 'N/A'}</div>
          </div>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textAlign: 'center', display: 'inline-block', fontSize: '1.25rem', padding: '1rem 2rem', textDecoration: 'none' }}>
            Inquire About Bulk Order
          </a>
        </div>
      </div>
    </div>
  );
}