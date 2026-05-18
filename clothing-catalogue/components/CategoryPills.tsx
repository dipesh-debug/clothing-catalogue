import Link from "next/link";

export default function CategoryPills({ activeCategory }: { activeCategory: string }) {
  return (
    <div className="gallery-filter" style={{ marginTop: '3rem' }}>
      <Link href="/catalogue" className={`filter-btn ${activeCategory === 'All' ? 'active' : ''}`}>All</Link>
      <Link href="/jerse" className={`filter-btn ${activeCategory === 'Jerseys' ? 'active' : ''}`}>Jerseys</Link>
      <Link href="/tracksuits" className={`filter-btn ${activeCategory === 'Tracksuits' ? 'active' : ''}`}>Tracksuits</Link>
      <Link href="/school-vests" className={`filter-btn ${activeCategory === 'School Uniforms' ? 'active' : ''}`}>School Uniforms</Link>
      <Link href="/montessori" className={`filter-btn ${activeCategory === 'Montessori' ? 'active' : ''}`}>Montessori</Link>
      <Link href="/advertising-tshirts" className={`filter-btn ${activeCategory === 'T-Shirts' ? 'active' : ''}`}>T-Shirts</Link>
    </div>
  );
}