export const metadata = {
  title: 'Clothing Manufacturing Catalogue',
  description: 'Explore our high-quality clothing manufacturing catalogue. Discover premium materials, scalable production, and request a quote today.',
};

export default function Home() {
  return (
    <div className="page-wrapper">
      <header className="catalogue-header">
        <h1>Manufacturing Catalogue</h1>
      </header>
      
      <main className="main-content">
        <section className="welcome-card">
          <h2>Welcome to Our Catalogue</h2>
          <p>
            Discover our extensive range of ethically manufactured clothing. 
            From premium raw materials to flawless finishing, we provide reliable 
            and scalable manufacturing solutions tailored to bring your brand's 
            unique vision to life.
          </p>
          <button className="btn-quote" aria-label="Request a manufacturing quote">
            Get a Quote
          </button>
        </section>
      </main>
    </div>
  );
}
