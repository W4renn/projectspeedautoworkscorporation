import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si"; 
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <h3>Project Speed AutoWorks</h3>
          <p>Your trusted partner for automotive maintenance and services.</p>
          <div className="social-links">
            <a href="https://www.facebook.com/projectspeedcorp" className="social-link1" title="Facebook" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/projectspeedautoworkscorp/" className="social-link1" title="Instagram" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.tiktok.com/@project.speed.autoworks" className="social-link1" title="TikTok" target="_blank" rel="noopener noreferrer">
              <SiTiktok />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <div className="footer-contact">
            <span className="contact-icon">📍</span>
            <p>Redpalm Pangpang, Sorsogon City</p>
          </div>
          <div className="footer-contact">
            <span className="contact-icon">📧</span>
            <a href="mailto:info@speedautoworks.com">projectspeedcorp@gmail.com</a>
          </div>
          <div className="footer-contact">
            <span className="contact-icon">📱</span>
            <a href="tel:+1234567890">+0968 468 7814</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Project Speed AutoWorks Corporation. All rights reserved.</p>
        <p>Designed for excellence | Built for performance</p>
      </div>
    </footer>
  );
}
