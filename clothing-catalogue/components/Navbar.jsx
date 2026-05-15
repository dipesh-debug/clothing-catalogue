import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="nav-item">
        <button className="nav-button">Catalogue ▾</button>
        <div className="dropdown-menu">
          <Link href="/tracksuits" className="dropdown-item">Tracksuits</Link>
          <Link href="/school-vests" className="dropdown-item">School Vests</Link>
          <Link href="/montessori" className="dropdown-item">Montessori</Link>
          <Link href="/advertising-tshirts" className="dropdown-item">Advertising T-Shirts</Link>
        </div>
      </div>
    </nav>
  );
}