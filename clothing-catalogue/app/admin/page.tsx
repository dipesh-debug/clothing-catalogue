"use client";

import { useState, useEffect } from 'react';
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
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching leads:', error);
    else setLeads(data || []);
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) alert(`Error deleting lead: ${error.message}`);
    else setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const toggleFulfillment = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('leads').update({ is_fulfilled: !currentStatus }).eq('id', id);
    if (error) alert(`Error updating lead: ${error.message}`);
    else setLeads((prev) => prev.map((lead) => lead.id === id ? { ...lead, is_fulfilled: !currentStatus } : lead));
  };

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

  // Derived Analytics Data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  let monthlyVolume = 0;
  let activeInquiries = 0;
  let fulfilledThisMonth = 0;
  const categoryCounts: Record<string, number> = {};

  leads.forEach((lead) => {
    const isFulfilled = !!lead.is_fulfilled;
    const leadDate = lead.created_at ? new Date(lead.created_at) : null;
    const isThisMonth = leadDate && leadDate.getMonth() === currentMonth && leadDate.getFullYear() === currentYear;

    if (!isFulfilled) {
      activeInquiries++;
    }

    if (isThisMonth) {
      if (!isFulfilled) {
        monthlyVolume += Number(lead.quantity) || 0;
      } else {
        fulfilledThisMonth++;
      }
    }

    // Count Categories
    const categories = Array.isArray(lead.category) ? lead.category : (lead.category || '').split(',');
    categories.forEach((cat: string) => {
      const cleanCat = cat.trim();
      if (cleanCat) {
        categoryCounts[cleanCat] = (categoryCounts[cleanCat] || 0) + 1;
      }
    });
  });

  // Determine Top Category
  let topCategory = '—';
  let maxCount = 0;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topCategory = cat;
    }
  }

  return (
    <div className="contact-wrapper" style={{ flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Top Section: Analytics Overview */}
      <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--bg-secondary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--bg-secondary)', paddingBottom: '0.75rem' }}>
          Analytics Overview
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--bg-primary)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Monthly Demand (Units)</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--bg-secondary)' }}>{monthlyVolume.toLocaleString()}</div>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--bg-primary)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Inquiries</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--bg-secondary)' }}>{activeInquiries}</div>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--bg-primary)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Fulfilled This Month</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#16a34a' }}>{fulfilledThisMonth}</div>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--bg-primary)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Category</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-color)' }}>{topCategory}</div>
          </div>
        </div>
      </div>

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

      {/* Bottom Section: Recent Inquiries */}
      <div style={{ width: '100%', maxWidth: '1200px', marginTop: '4rem' }}>
        <h2 style={{ color: 'var(--bg-secondary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--bg-secondary)', paddingBottom: '0.75rem' }}>
          Recent Inquiries
        </h2>
        <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)', borderTop: '4px solid var(--bg-secondary)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--bg-secondary)', borderBottom: '2px solid rgba(30, 58, 138, 0.1)' }}>
                <th style={{ padding: '1.25rem 1rem' }}>Date</th>
                <th style={{ padding: '1.25rem 1rem' }}>Client Name</th>
                <th style={{ padding: '1.25rem 1rem' }}>Company/School</th>
                <th style={{ padding: '1.25rem 1rem' }}>Categories</th>
                <th style={{ padding: '1.25rem 1rem' }}>Quantity</th>
                <th style={{ padding: '1.25rem 1rem' }}>Requirements</th>
                <th style={{ padding: '1.25rem 1rem' }}>Status</th>
                <th style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.length > 0 ? leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid rgba(30, 58, 138, 0.1)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{lead.fullName || '—'}</td>
                  <td style={{ padding: '1rem' }}>{lead.company || '—'}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {(Array.isArray(lead.category) ? lead.category : (lead.category || '').split(',')).map((cat: string, i: number) => (
                        cat.trim() && <span key={i} style={{ border: '1px solid var(--accent-color)', color: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>{cat.trim()}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--accent-color)', fontWeight: 700 }}>{lead.quantity ? `${lead.quantity} Units` : '—'}</td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#4B5563', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.requirements || '—'}</td>
                  <td style={{ padding: '1rem' }}>
                    {lead.is_fulfilled ? (
                      <span style={{ display: 'inline-block', backgroundColor: '#16a34a', color: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 }}>Fulfilled</span>
                    ) : (
                      <button onClick={() => toggleFulfillment(lead.id, !!lead.is_fulfilled)} style={{ backgroundColor: 'transparent', border: '1px solid var(--bg-secondary)', color: 'var(--bg-secondary)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Mark as Fulfilled</button>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button onClick={() => handleDeleteLead(lead.id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 'bold' }} aria-label="Delete Lead">×</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
                    No active leads found. Marketing inquiries will appear here automatically.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}