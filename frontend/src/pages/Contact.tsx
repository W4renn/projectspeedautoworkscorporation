import React from 'react';
import './Contact.css';
import { FaHome, FaPhone, FaFacebookF, FaInstagram, FaTiktok, FaEnvelope } from 'react-icons/fa';
import cityBg from '../images/psac-1.png';

const ContactUs: React.FC = () => {
  return (
    <section
      className="contact-section"
      style={{ backgroundImage: `url(${cityBg})` }}
    >
      <div className="overlay">
        <h1 className="contact-heading">CONTACT US</h1>
        <p className="contact-subheading">
          Need an expert? You are more than welcomed to leave your contact info and we will be in touch shortly.
        </p>
      </div>

      <div className="contact-info">
        <div className="contact-card">
          <FaHome className="contact-icon" />
          <h3>VISIT US</h3>
          <p className="contact-description">
            Visit our physical shop for inquiries
          </p>
          <p className="contact-detail">Redpalm Pangpang, Sorsogon City</p>
        </div>

        <div className="contact-card">
          <FaPhone className="contact-icon" />
          <h3>CALL US</h3>
          <p className="contact-description">
           call or text
          </p>
          <p className="contact-detail">+0968 468 7814</p>
        </div>

        <div className="contact-card">
          <FaEnvelope className="contact-icon" />
          <h3>EMAIL US</h3>
          <p className="contact-description">
            Send us an email
          </p>
          <p className="contact-detail">projectspeedcorp@gmail.com</p>
        </div>

      
        <div className="contact-card">
          <h3>VISIT OUR SOCIAL MEDIA</h3>
          <p className="contact-description">
            Follow us for updates and promos.
          </p>
          <div className="social-icons inside-card">
            <a
              href="https://www.facebook.com/projectspeedcorp"
              className="social-link"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/projectspeedautoworkscorp/"
              className="social-link"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.tiktok.com/@project.speed.autoworks"
              className="social-link"
              aria-label="TikTok"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
