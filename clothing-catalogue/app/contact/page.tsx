"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    category: [] as string[],
    quantity: '',
    requirements: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) return { ...prev, category: [...prev.category, value] };
      return { ...prev, category: prev.category.filter((c) => c !== value) };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToInsert = {
        fullName: formData.fullName,
        company: formData.company,
        category: formData.category,
        quantity: Number(formData.quantity),
        requirements: formData.requirements
      };

      const { error } = await supabase.from('leads').insert([dataToInsert]);
      if (error) {
        console.error("Error inserting lead:", error.message || error);
        alert(`Supabase Error: ${error.message}\n\nPlease check your Table Schema or RLS Policies.`);
        return;
      }

      const categoriesText = formData.category.length > 0 ? formData.category.join(', ') : 'items';
      const message = `Hello, I would like a quote for ${formData.quantity} ${categoriesText}.\n\nName: ${formData.fullName}\nCompany/School: ${formData.company}\n\nAdditional Requirements:\n${formData.requirements}`;
      const encodedMessage = encodeURIComponent(message);
      
      window.open(`https://wa.me/974685186?text=${encodedMessage}`, '_blank');
    } catch (err) {
      console.error("Supabase error:", err);
      alert(`Unexpected Error: ${err}`);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        
        {/* Left Column: Contact Info */}
        <div className="contact-info">
          <h1>Request a Bulk Quote</h1>
          <p>
            Partner with us for premium garment manufacturing. We proudly operate state-of-the-art facilities across <strong>Damak</strong> and <strong>Biratnagar</strong>, boasting an annual production capacity of over <strong>1 Lakh garments</strong>.
          </p>
          <p>
            Whether you need tracksuits, school uniforms, or bulk promotional t-shirts, our team is ready to deliver high-quality products tailored to your exact specifications.
          </p>
          <div style={{ marginTop: '2.5rem' }}>
            <p><strong>Email:</strong> sales@yourcompany.com</p>
            <p><strong>Phone:</strong> +977 980-0000000</p>
            <p><strong>Hours:</strong> Sunday - Friday, 9:00 AM - 6:00 PM</p>
          </div>
        </div>

        {/* Right Column: The Form */}
        <div className="contact-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" className="form-control" placeholder="John Doe" required value={formData.fullName} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="company">Company / School Name</label>
              <input type="text" id="company" className="form-control" placeholder="Everest Academy" required value={formData.company} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Product Categories</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="category" value="tracksuits" style={{ width: '1.1rem', height: '1.1rem' }} checked={formData.category.includes('tracksuits')} onChange={handleCategoryChange} />
                  <span>Tracksuits</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="category" value="school-vests" style={{ width: '1.1rem', height: '1.1rem' }} checked={formData.category.includes('school-vests')} onChange={handleCategoryChange} />
                  <span>School Vests</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="category" value="montessori" style={{ width: '1.1rem', height: '1.1rem' }} checked={formData.category.includes('montessori')} onChange={handleCategoryChange} />
                  <span>Montessori</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="category" value="t-shirts" style={{ width: '1.1rem', height: '1.1rem' }} checked={formData.category.includes('t-shirts')} onChange={handleCategoryChange} />
                  <span>Advertising T-Shirts</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="quantity">Estimated Quantity</label>
              <input type="number" id="quantity" className="form-control" placeholder="e.g. 500" min="50" required value={formData.quantity} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="requirements">Additional Requirements</label>
              <textarea id="requirements" className="form-control" rows="4" placeholder="Tell us about specific fabrics, sizes, or printing needs..." value={formData.requirements} onChange={handleChange}></textarea>
            </div>

            <button type="submit" className="btn-primary btn-block">
              Send Quote Request
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}