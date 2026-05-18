"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ProductCard from '../../components/ProductCard';

export default function AdminDashboard() {
  const [productData, setProductData] = useState({
    title: '',
    category: 'tracksuits',
    color: 'Black',
    fabric: '',
    features: '',
    sort_tag: 'Newest Arrivals'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [imageScale, setImageScale] = useState<number>(1);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [leadFormData, setLeadFormData] = useState({
    fullName: '',
    company: '',
    phone: '',
    address: '',
    category: [] as string[],
    quantities: {} as Record<string, string>,
    requirements: ''
  });
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchLeads();
    fetchLogs();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching leads:', error);
    else setLeads(data || []);
  };

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('lead_logs')
      .select('*, leads(*)')
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) {
      console.error('Error fetching logs:', error.message || error);
    } else {
      setLogs(data || []);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) alert(`Error deleting lead: ${error.message}`);
    else setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const toggleFulfillment = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const { error: updateError } = await supabase.from('leads').update({ is_fulfilled: newStatus }).eq('id', id);
    if (updateError) {
      alert(`Error updating lead: ${updateError.message}`);
      return;
    }

    const actionType = newStatus ? 'FULFILLED' : 'REVERTED';
    const { error: logError } = await supabase.from('lead_logs').insert([{ lead_id: id, action_type: actionType }]);
    if (logError) console.error('Error inserting log:', logError);

    fetchLeads();
    fetchLogs();
  };

  const handleLeadChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setLeadFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLeadCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setLeadFormData((prev) => {
      if (checked) return { ...prev, category: [...prev.category, value] };
      
      const newQuantities = { ...prev.quantities };
      delete newQuantities[value];
      return { ...prev, category: prev.category.filter((c) => c !== value), quantities: newQuantities };
    });
  };

  const handleLeadQuantityChange = (cat: string, qty: string) => {
    setLeadFormData((prev) => ({
      ...prev,
      quantities: { ...prev.quantities, [cat]: qty }
    }));
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const items: Record<string, number> = {};
    leadFormData.category.forEach((cat) => {
      items[cat] = Number(leadFormData.quantities[cat]) || 0;
    });

    const payload = { 
      fullName: leadFormData.fullName, 
      company: leadFormData.company, 
      phone: leadFormData.phone,
      address: leadFormData.address,
      items, 
      requirements: leadFormData.requirements 
    };

    if (editingLeadId) {
      const { error } = await supabase.from('leads').update(payload).eq('id', editingLeadId);
      if (error) return alert(`Error updating lead: ${error.message}`);
    } else {
      const { error } = await supabase.from('leads').insert([payload]);
      if (error) return alert(`Error inserting lead: ${error.message}`);
    }

    setLeadFormData({ fullName: '', company: '', phone: '', address: '', category: [], quantities: {}, requirements: '' });
    setEditingLeadId(null);
    fetchLeads();
  };

  const handleEditLead = (lead: any) => {
    setEditingLeadId(lead.id);
    
    let parsedCategory = lead.items ? Object.keys(lead.items) : Array.isArray(lead.category) ? lead.category : (lead.category || '').split(',').map((c: string) => c.trim()).filter(Boolean);
    let parsedQuantities: Record<string, string> = {};
    
    if (lead.items) {
      Object.entries(lead.items).forEach(([k, v]) => parsedQuantities[k] = String(v));
    } else if (lead.quantity) {
      parsedCategory.forEach((c: string) => parsedQuantities[c] = String(lead.quantity));
    }

    setLeadFormData({ fullName: lead.fullName || '', company: lead.company || '', phone: lead.phone || '', address: lead.address || '', category: parsedCategory, quantities: parsedQuantities, requirements: lead.requirements || '' });
    setActiveTab('leads');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { id, value, type } = target;
    setProductData((prev) => ({ 
      ...prev, 
      [id]: type === 'checkbox' ? target.checked : (type === 'number' ? Number(value) : value) 
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEditProduct = (prod: any) => {
    setEditingProductId(prod.id);
    setProductData({
      title: prod.title || '',
      category: prod.category || 'tracksuits',
      color: prod.color || 'Black',
      fabric: prod.fabric || '',
      features: prod.features || '',
      sort_tag: prod.sort_tag || 'Newest Arrivals'
    });
    setImagePreviewUrl(prod.image_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert(`Error deleting product: ${error.message}`);
    else setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !editingProductId) {
      alert('Please select a product image to upload.');
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = imagePreviewUrl;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        title: productData.title,
        category: productData.category,
        color: productData.color,
        fabric: productData.fabric,
        features: productData.features,
        image_url: imageUrl,
        sort_tag: productData.sort_tag
      };

      if (editingProductId) {
        const { error: updateError } = await supabase.from('products').update(payload).eq('id', editingProductId);
        if (updateError) throw updateError;
        alert('Product updated successfully!');
      } else {
        const { error: insertError } = await supabase.from('products').insert([payload]);
        if (insertError) throw insertError;
        alert('Product uploaded successfully!');
      }

      // Reset the form
      setProductData({ title: '', category: 'tracksuits', color: 'Black', fabric: '', features: '', sort_tag: 'Newest Arrivals' });
      setImageFile(null);
      setImagePreviewUrl('');
      setImageScale(1);
      setEditingProductId(null);
      if (e.target instanceof HTMLFormElement) e.target.reset();
      
      fetchProducts(); // Refresh products table
      
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Upload/Update failed: ${error.message}`);
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
        if (lead.items) {
          Object.values(lead.items).forEach((q: any) => monthlyVolume += Number(q) || 0);
        } else {
          monthlyVolume += Number(lead.quantity) || 0;
        }
      } else {
        fulfilledThisMonth++;
      }
    }

    // Count Categories
    const categories = lead.items ? Object.keys(lead.items) : Array.isArray(lead.category) ? lead.category : (lead.category || '').split(',');
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
      
      {/* Navigation Header */}
      <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '2.5rem' }}>
        <h1 style={{ color: 'var(--bg-secondary)', marginBottom: '1.5rem', marginTop: 0, fontSize: '2.5rem' }}>Dashboard</h1>
        <nav style={{ display: 'flex', borderBottom: '1px solid #D1D5DB', gap: '1rem' }}>
          <button onClick={() => setActiveTab('overview')} style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'overview' ? '2px solid var(--accent-color)' : '2px solid transparent', color: activeTab === 'overview' ? 'var(--text-dark)' : '#6B7280', fontWeight: activeTab === 'overview' ? 600 : 500, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1rem' }}>Overview</button>
          <button onClick={() => setActiveTab('products')} style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'products' ? '2px solid var(--accent-color)' : '2px solid transparent', color: activeTab === 'products' ? 'var(--text-dark)' : '#6B7280', fontWeight: activeTab === 'products' ? 600 : 500, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1rem' }}>Products</button>
          <button onClick={() => setActiveTab('leads')} style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'leads' ? '2px solid var(--accent-color)' : '2px solid transparent', color: activeTab === 'leads' ? 'var(--text-dark)' : '#6B7280', fontWeight: activeTab === 'leads' ? 600 : 500, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1rem' }}>Leads</button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          {/* Top Section: Analytics Overview */}
          <div style={{ marginBottom: '3rem' }}>
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

          {/* Bottom Section: System Audit Log */}
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ color: '#6B7280', marginBottom: '1rem', fontSize: '1.1rem' }}>
              System Audit Log
            </h3>
            <ul style={{ listStyleType: 'none', padding: 0, color: '#9CA3AF', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {logs.length > 0 ? logs.map((log) => (
                <li key={log.id}>
                  <span style={{ fontFamily: 'monospace' }}>[{new Date(log.created_at).toLocaleString()}]</span>: <strong>{log.leads?.fullName || log.leads?.fullname || log.leads?.full_name || 'Unknown Client'}</strong> was marked as <strong style={{ color: log.action_type === 'FULFILLED' ? '#16a34a' : '#DC2626' }}>{log.action_type}</strong>
                </li>
              )) : (
                <li>No audit logs available.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <div className="contact-container">
            <div>
              <div className="contact-form-card" style={{ marginBottom: '2rem', borderTop: editingProductId ? '4px solid #1E3A8A' : 'none' }}>
                <h2 style={{ color: editingProductId ? '#1E3A8A' : 'var(--bg-secondary)', marginTop: 0, marginBottom: '1.5rem' }}>
                  {editingProductId ? 'Edit Product' : 'Upload New Product'}
                </h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="title">Product Title</label>
                  <input type="text" id="title" className="form-control" placeholder="e.g., Premium Sublimated Tracksuit" required value={productData.title} onChange={handleChange} />
                </div>
                
                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label" htmlFor="category">Category</label>
                    <select id="category" className="form-control" required value={productData.category} onChange={handleChange}>
                      <option value="tracksuits">Tracksuits</option>
                      <option value="school-vests">School Vests</option>
                      <option value="montessori">Montessori</option>
                      <option value="advertising-tshirts">Advertising T-Shirts</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="color">Product Color</label>
                    <select id="color" className="form-control" required value={productData.color} onChange={handleChange}>
                      <option value="Black">Black</option>
                      <option value="Blue">Blue</option>
                      <option value="Red">Red</option>
                      <option value="Navy">Navy</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="fabric">Fabric</label>
                  <input type="text" id="fabric" className="form-control" placeholder="e.g., 100% Polyester" required value={productData.fabric} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="features">Features</label>
                  <input type="text" id="features" className="form-control" placeholder="e.g., Breathable, Anti-Pilling..." required value={productData.features} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="sort_tag">Sort By Tag</label>
                  <select id="sort_tag" className="form-control" required value={productData.sort_tag} onChange={handleChange}>
                    <option>Newest Arrivals</option>
                    <option>Featured</option>
                    <option>Best Selling</option>
                    <option>Popularity</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="image">Product Image</label>
                  <input type="file" id="image" accept="image/*" className="form-control" required={!editingProductId} onChange={handleImageChange} style={{ padding: '0.5rem' }} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="zoom">Adjust Image Zoom</label>
                  <input type="range" id="zoom" min="0.5" max="2.5" step="0.1" value={imageScale} onChange={(e) => setImageScale(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
                </div>

                <button type="submit" className="btn-primary btn-block" disabled={isUploading} style={editingProductId ? { backgroundColor: '#1E3A8A', color: '#FFF', border: '2px solid #1E3A8A' } : {}}>
                  {isUploading ? (editingProductId ? 'Updating...' : 'Uploading...') : (editingProductId ? 'Update Product Information' : 'Publish Product')}
                </button>
                {editingProductId && (
                  <button type="button" onClick={() => { setEditingProductId(null); setProductData({ title: '', category: 'tracksuits', color: 'Black', fabric: '', features: '', sort_tag: 'Newest Arrivals' }); setImagePreviewUrl(''); }} className="btn-secondary btn-block" style={{ marginTop: '1rem' }}>
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'sticky', top: '100px' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: 'var(--bg-secondary)', textAlign: 'center' }}>
                  Live Card Preview
                </h3>
                <ProductCard 
                  title={productData.title || 'Product Title'}
                  fabric={productData.fabric || 'e.g., 100% Polyester'}
                  features={productData.features || 'e.g., Breathable, Custom Prints'}
                  imageUrl={imagePreviewUrl}
                  imagePlaceholder="[ Image Preview ]"
                  imageScale={imageScale}
                />
              </div>
            </div>
          </div>

          {/* All Products List */}
          <div style={{ marginTop: '4rem' }}>
            <h2 style={{ color: 'var(--bg-secondary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--bg-secondary)', paddingBottom: '0.75rem' }}>
              All Products
            </h2>
            <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)', borderTop: '4px solid var(--bg-secondary)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--bg-secondary)', borderBottom: '2px solid rgba(30, 58, 138, 0.1)' }}>
                    <th style={{ padding: '1.25rem 1rem' }}>Image</th>
                    <th style={{ padding: '1.25rem 1rem' }}>Title</th>
                    <th style={{ padding: '1.25rem 1rem' }}>Category</th>
                    <th style={{ padding: '1.25rem 1rem' }}>Color</th>
                    <th style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? products.map((prod) => (
                    <tr key={prod.id} style={{ borderBottom: '1px solid rgba(30, 58, 138, 0.1)' }}>
                      <td style={{ padding: '1rem' }}>
                        {prod.image_url ? (
                          <img src={prod.image_url} alt={prod.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <div style={{ width: '50px', height: '50px', backgroundColor: '#E5E7EB', borderRadius: '4px' }}></div>
                        )}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{prod.title}</td>
                      <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{prod.category}</td>
                      <td style={{ padding: '1rem' }}>{prod.color || '—'}</td>
                      <td style={{ padding: '1rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button onClick={() => handleEditProduct(prod)} style={{ background: 'transparent', border: 'none', color: 'var(--bg-secondary)', cursor: 'pointer', fontSize: '1.1rem', marginRight: '0.75rem' }} aria-label="Edit Product">✏️</button>
                        <button onClick={() => handleDeleteProduct(prod.id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 'bold' }} aria-label="Delete Product">×</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
                        No products found. Add your first product above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <div className="contact-container" style={{ marginBottom: '2rem' }}>
            <div>
              <div className="contact-form-card" style={{ borderTop: editingLeadId ? '4px solid var(--accent-color)' : '4px solid var(--bg-secondary)' }}>
                <h2 style={{ color: editingLeadId ? 'var(--accent-color)' : 'var(--bg-secondary)', marginTop: 0, marginBottom: '1.5rem' }}>
                  {editingLeadId ? 'Edit Lead' : 'Manual Lead Entry'}
                </h2>
                <form onSubmit={handleLeadSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Full Name</label>
                    <input type="text" id="fullName" className="form-control" placeholder="John Doe" required value={leadFormData.fullName} onChange={handleLeadChange} />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="company">Company / School Name</label>
                    <input type="text" id="company" className="form-control" placeholder="Everest Academy" required value={leadFormData.company} onChange={handleLeadChange} />
                  </div>

                  <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label" htmlFor="phone">Phone Number</label>
                      <input type="tel" id="phone" className="form-control" placeholder="+977..." value={leadFormData.phone} onChange={handleLeadChange} />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="address">Address</label>
                      <input type="text" id="address" className="form-control" placeholder="Damak, Jhapa" value={leadFormData.address} onChange={handleLeadChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Itemized Order</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                      {['Tracksuits', 'School Vests', 'Montessori', 'T-Shirts'].map((cat) => {
                        const isChecked = leadFormData.category.includes(cat);
                        return (
                          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', minWidth: '160px' }}>
                              <input type="checkbox" name="category" value={cat} checked={isChecked} onChange={handleLeadCategoryChange} style={{ width: '1.1rem', height: '1.1rem' }} />
                              <span style={{ fontWeight: 500, color: 'var(--text-dark)' }}>{cat}</span>
                            </label>
                            {isChecked && (
                              <input type="number" className="form-control" placeholder={`Qty for ${cat}`} min="1" required value={leadFormData.quantities[cat] || ''} onChange={(e) => handleLeadQuantityChange(cat, e.target.value)} style={{ padding: '0.4rem 0.75rem', flex: 1 }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="requirements">Additional Requirements</label>
                    <textarea id="requirements" className="form-control" rows={3} placeholder="Tell us about specific fabrics, sizes, or printing needs..." value={leadFormData.requirements} onChange={handleLeadChange}></textarea>
                  </div>

                  <button type="submit" className="btn-primary btn-block">
                    {editingLeadId ? 'Update Lead' : 'Create Lead'}
                  </button>
                  {editingLeadId && (
                    <button type="button" onClick={() => { setEditingLeadId(null); setLeadFormData({ fullName: '', company: '', phone: '', address: '', category: [], quantities: {}, requirements: '' }); }} className="btn-secondary btn-block" style={{ marginTop: '1rem' }}>
                      Cancel Edit
                    </button>
                  )}
                </form>
              </div>
            </div>
            <div></div> {/* Empty Right Column to maintain responsive grid size */}
          </div>

          {/* Recent Inquiries */}
          <div style={{ marginTop: '4rem' }}>
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
                    <th style={{ padding: '1.25rem 1rem' }}>Phone</th>
                    <th style={{ padding: '1.25rem 1rem' }}>Address</th>
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
                      <td style={{ padding: '1rem' }}>{lead.phone || '—'}</td>
                      <td style={{ padding: '1rem' }}>{lead.address || '—'}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {(lead.items ? Object.keys(lead.items) : Array.isArray(lead.category) ? lead.category : (lead.category || '').split(',')).map((cat: string, i: number) => (
                            cat.trim() && <span key={i} style={{ border: '1px solid var(--accent-color)', color: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>{cat.trim()}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--accent-color)', fontWeight: 700, minWidth: '150px' }}>{lead.items ? Object.entries(lead.items).map(([c, q]) => `${q} ${c}`).join(', ') : lead.quantity ? `${lead.quantity} Units` : '—'}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#4B5563', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.requirements || '—'}</td>
                      <td style={{ padding: '1rem' }}>
                        {lead.is_fulfilled ? (
                          <button onClick={() => toggleFulfillment(lead.id, !!lead.is_fulfilled)} style={{ backgroundColor: 'transparent', border: '1px solid #9CA3AF', color: 'var(--bg-secondary)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Revert to Active</button>
                        ) : (
                          <button onClick={() => toggleFulfillment(lead.id, !!lead.is_fulfilled)} style={{ backgroundColor: 'transparent', border: '1px solid var(--bg-secondary)', color: 'var(--bg-secondary)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Mark as Fulfilled</button>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button onClick={() => handleEditLead(lead)} style={{ background: 'transparent', border: 'none', color: 'var(--bg-secondary)', cursor: 'pointer', fontSize: '1.1rem', marginRight: '0.75rem' }} aria-label="Edit Lead">✏️</button>
                        <button onClick={() => handleDeleteLead(lead.id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 'bold' }} aria-label="Delete Lead">×</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={10} style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
                        No active leads found. Marketing inquiries will appear here automatically.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}