import { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
        </div>
        <ul className={click ? 'nav-links active' : 'nav-links'}>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/appointments" className="nav-btn">Book Appointment</a></li>
        </ul>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
