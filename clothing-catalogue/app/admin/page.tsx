"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import ProductCard from '../../components/ProductCard';

export default function AdminDashboard() {
  const [productData, setProductData] = useState({
    title: '',
    category: 'tracksuits',
    moq: '',
    fabric: '',
    features: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [imageScale, setImageScale] = useState<number>(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setProductData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select a product image to upload.');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload the image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // 2. Retrieve the public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      const imageUrl = publicUrlData.publicUrl;

      // 3. Insert the product data into the Database
      const { error: insertError } = await supabase.from('products').insert([{
        title: productData.title,
        category: productData.category,
        moq: productData.moq,
        fabric: productData.fabric,
        features: productData.features,
        image_url: imageUrl
      }]);

      if (insertError) throw insertError;

      alert('Product uploaded successfully!');
      
      // Reset the form
      setProductData({ title: '', category: 'tracksuits', moq: '', fabric: '', features: '' });
      setImageFile(null);
      setImagePreviewUrl('');
      setImageScale(1);
      if (e.target instanceof HTMLFormElement) e.target.reset();
      
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        
        {/* Left Column: Product Upload Form */}
        <div>
          <div className="contact-form-card" style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--bg-secondary)', marginTop: 0, marginBottom: '1.5rem' }}>Upload New Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="title">Product Title</label>
                <input type="text" id="title" className="form-control" placeholder="e.g., Premium Sublimated Tracksuit" required value={productData.title} onChange={handleChange} />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="category">Category</label>
                <select id="category" className="form-control" required value={productData.category} onChange={handleChange}>
                  <option value="tracksuits">Tracksuits</option>
                  <option value="school-vests">School Vests</option>
                  <option value="montessori">Montessori</option>
                  <option value="advertising-tshirts">Advertising T-Shirts</option>
                </select>
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" htmlFor="moq">MOQ</label>
                  <input type="text" id="moq" className="form-control" placeholder="e.g., 500 Sets" required value={productData.moq} onChange={handleChange} />
                </div>
                <div>
                  <label className="form-label" htmlFor="fabric">Fabric</label>
                  <input type="text" id="fabric" className="form-control" placeholder="e.g., 100% Polyester" required value={productData.fabric} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="features">Features</label>
                <input type="text" id="features" className="form-control" placeholder="e.g., Breathable, Anti-Pilling..." required value={productData.features} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="image">Product Image</label>
                <input type="file" id="image" accept="image/*" className="form-control" required onChange={handleImageChange} style={{ padding: '0.5rem' }} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="zoom">Adjust Image Zoom</label>
                <input type="range" id="zoom" min="0.5" max="2.5" step="0.1" value={imageScale} onChange={(e) => setImageScale(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
              </div>

              <button type="submit" className="btn-primary btn-block" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Publish Product'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'sticky', top: '100px' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--bg-secondary)', textAlign: 'center' }}>
              Live Card Preview
            </h3>
            <ProductCard 
              title={productData.title || 'Product Title'}
              moq={productData.moq || 'e.g., 500 Sets'}
              fabric={productData.fabric || 'e.g., 100% Polyester'}
              features={productData.features || 'e.g., Breathable, Custom Prints'}
              imageUrl={imagePreviewUrl}
              imagePlaceholder="[ Image Preview ]"
              imageScale={imageScale}
            />
          </div>
        </div>

      </div>
    </div>
  );
}