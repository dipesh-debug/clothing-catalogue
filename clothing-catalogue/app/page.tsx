import Link from "next/link";

export const metadata = {
  title: 'Clothing Manufacturing Catalogue',
  description: 'Explore our high-quality clothing manufacturing catalogue. Discover premium materials, scalable production, and request a quote today.',
};

export default function Home() {
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <section className="hero-section">
        <h1 className="hero-title">Your Trusted Partner in Garment Manufacturing</h1>
        <p className="hero-subtitle">
          Delivering premium Tracksuits, School Vests, Montessori Clothes, and Advertising T-Shirts. Proudly serving the Damak and Biratnagar regions with an annual production capacity of over 1 Lakh garments.
        </p>
        <div className="hero-buttons">
          <Link href="/tracksuits" className="btn-primary">
            Explore Catalogue
          </Link>
          <Link href="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--bg-primary)', padding: '5rem 1.5rem', borderTop: '1px solid rgba(30, 58, 138, 0.1)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ color: 'var(--bg-secondary)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginTop: 0, marginBottom: '1rem' }}>
            From Design to Doorstep: Our 4-Step Process
          </h2>
          <p style={{ color: 'var(--bg-secondary)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto 4rem auto', opacity: 0.9, lineHeight: 1.6 }}>
            Leveraging our state-of-the-art facilities in Damak and Biratnagar, we ensure precision, speed, and uncompromising quality at every stage of production.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            {/* Step 1 */}
            <div className="product-card" style={{ textAlign: 'left', position: 'relative', paddingTop: '3rem' }}>
              <div style={{ position: 'absolute', top: '-20px', left: '1.5rem', backgroundColor: 'var(--accent-color)', color: 'var(--text-light)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', border: '4px solid var(--bg-primary)' }}>01</div>
              <h3 className="product-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Custom Pattern Drafting</h3>
              <p style={{ color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
                Our expertise in Indian/Nepal standard sizing combined with automated pattern drafting ensures a perfect, consistent fit for every garment.
              </p>
            </div>
            {/* Step 2 */}
            <div className="product-card" style={{ textAlign: 'left', position: 'relative', paddingTop: '3rem' }}>
              <div style={{ position: 'absolute', top: '-20px', left: '1.5rem', backgroundColor: 'var(--accent-color)', color: 'var(--text-light)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', border: '4px solid var(--bg-primary)' }}>02</div>
              <h3 className="product-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Advanced Sublimation</h3>
              <p style={{ color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
                We utilize high-resolution jersey printing technology that guarantees vibrant, crisp colors and intricate designs that never fade.
              </p>
            </div>
            {/* Step 3 */}
            <div className="product-card" style={{ textAlign: 'left', position: 'relative', paddingTop: '3rem' }}>
              <div style={{ position: 'absolute', top: '-20px', left: '1.5rem', backgroundColor: 'var(--accent-color)', color: 'var(--text-light)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', border: '4px solid var(--bg-primary)' }}>03</div>
              <h3 className="product-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>High-Volume Production</h3>
              <p style={{ color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
                Our dedicated assembly lines in Biratnagar support an annual capacity of over 1 Lakh garments, scaling effortlessly to your B2B needs.
              </p>
            </div>
            {/* Step 4 */}
            <div className="product-card" style={{ textAlign: 'left', position: 'relative', paddingTop: '3rem' }}>
              <div style={{ position: 'absolute', top: '-20px', left: '1.5rem', backgroundColor: 'var(--accent-color)', color: 'var(--text-light)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', border: '4px solid var(--bg-primary)' }}>04</div>
              <h3 className="product-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Quality Logistics</h3>
              <p style={{ color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
                Each order undergoes rigorous QC checks before reliable, swift delivery is executed across Nepal and India.
              </p>
            </div>
          </div>

          <Link href="/contact" className="btn-primary" style={{ display: 'inline-block', fontSize: '1.25rem', padding: '1.25rem 3rem' }}>
            Start Your Bulk Order
          </Link>
        </div>
      </section>
    </main>
  );
}