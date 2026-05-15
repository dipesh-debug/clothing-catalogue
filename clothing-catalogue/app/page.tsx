import Link from "next/link";

export const metadata = {
  title: 'Clothing Manufacturing Catalogue',
  description: 'Explore our high-quality clothing manufacturing catalogue. Discover premium materials, scalable production, and request a quote today.',
};

export default function Home() {
  return (
    <main className="hero-section">
      <h1 className="hero-title">Your Trusted Partner in Garment Manufacturing</h1>
      <p className="hero-subtitle">
        Delivering premium Tracksuits, School Vests, Montessori Clothes, and Advertising T-Shirts. Proudly serving the Damak and Biratnagar regions with an annual production capacity of over 1 Lakh garments.
      </p>
      <div className="hero-buttons">
        <Link href="/tracksuits" className="btn-primary">
          Explore Catalogue
        </Link>
        <button className="btn-secondary">Contact Us</button>
      </div>
    </main>
  );
}