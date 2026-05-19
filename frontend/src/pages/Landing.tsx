import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import axios from "axios";
import headerBg from "../images/psac-1.png";
import header2 from "../images/img3.jpg";
import header3 from "../images/img4.jpg";
import box1Img from "../images/services/enginerepair.jpg";
import { getServices } from "../api/services";
import type { Service } from "../api/services";
import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaHome,
  FaPhone,
  FaWrench,
  FaClock,
  FaCheckCircle,
  FaAward,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si"; 
import "./Landing.css";
s
interface Announcement {
  id: string;
  message: string;
  type: string;
  image?: string | null;
  createdAt: string;
}

const BASE_IMAGE_URL = 'https://projectspeedautoworkscorporation-backend.onrender.com';
const API = import.meta.env.VITE_API_URL;

const Landing: React.FC = () => {
  const { user } = useAuth();
  const isInternal = user?.role === "admin" || user?.role === "staff";
  const [loading, setLoading] = useState(true);

  const [latestAnnouncement, setLatestAnnouncement] = useState<Announcement | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API}/announcements`);
      const data: Announcement[] = res.data;

      setAnnouncements(data);

      if (data.length > 0) {
        const latest = data[0];

        // show only once per browser tab session
        const alreadyShown = sessionStorage.getItem("announcementShown");

        if (!alreadyShown && !isInternal) {
          setLatestAnnouncement(latest);
          setShowPopup(true);

          sessionStorage.setItem("announcementShown", "true");
        }
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  fetchAnnouncements();
}, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/services`);
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleClosePopup = () => {
  setShowPopup(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
  };

  const images = [headerBg, header2, header3];

  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  const features = [
    { icon: <FaWrench />, title: "Expert Technicians", description: "Certified professionals with years of experience" },
    { icon: <FaClock />, title: "Quick Service", description: "Fast turnaround times without compromising quality" },
    { icon: <FaCheckCircle />, title: "Quality Parts", description: "Genuine parts and premium products guaranteed" },
    { icon: <FaAward />, title: "Satisfaction Guaranteed", description: "Your satisfaction is our top priority" }
  ];

  return (
    <div className="landing-page">
      {/* Announcement Popup */}
      {showPopup && latestAnnouncement && !isInternal && (
        <div className="announcement-popup-overlay" onClick={handleClosePopup}>
          <div className="announcement-popup" onClick={(e) => e.stopPropagation()}>
            <button className="announcement-popup-close" onClick={handleClosePopup}>
              &times;
            </button>
            <span className={`announcement-popup-badge ${latestAnnouncement.type}`}>
              {latestAnnouncement.type}
            </span>
            <h2 className="announcement-popup-title">📣Announcement!!</h2>
            <p className="announcement-popup-message">{latestAnnouncement.message}</p>
            {latestAnnouncement.image && (
                <img
                          src={`${BASE_IMAGE_URL}/${String(latestAnnouncement.image)
                            .replace(/\\/g, '/')
                            .replace(/^\/+/, '')}`}
                          alt="Announcement"
                          className="announcement-popup-image"
                          onError={(e) => {
                            console.log('Failed image:', e.currentTarget.src);

                            e.currentTarget.src = '/vite.svg';
                            e.currentTarget.alt = 'Image not available';
                          }}
                        />
              )}
            <small className="announcement-popup-date">
              {new Date(latestAnnouncement.createdAt).toLocaleString()}
            </small>
          </div>
        </div>
      )}

      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <header className="header" style={{ backgroundImage: `url(${img})` }}>
              <div className="header-content">
                <h1>Your Trusted Automotive Partner in Sorsogon City</h1>
                <p className="desc">Professional • Reliable • Affordable</p>
                {isInternal ? (
                  <button className="cta-btn disabled" disabled>
                    Book an Appointment
                  </button>
                ) : (
                  <Link to="/appointment">
                    <button className="cta-btn">Book an Appointment</button>
                  </Link>
                )}
              </div>
            </header>
          </div>
        ))}
      </Slider>

      {/* Services and Products Section */}
      <section className="services-products-section">
        <div className="services-list-column">
          <h2 className="column-title">Our Services</h2>
          <ul className="services-list-items">
            <li>Engine Repair & Diagnostics</li>
            <li>Tire Replacement & Balancing</li>
            <li>Oil Change & Filter Replacement</li>
          </ul>
          <Link to="/services" className="see-more-link">See More →</Link>
        </div>
        <div className="products-list-column">
          <h2 className="column-title">Our Products</h2>
          <ul className="products-list-items">
            <li>Engine Oils (5W-30, 15W-40)</li>
            <li>Brake Cleaners</li>
            <li>Coolants (Green & Pink)</li>
          </ul>
          <Link to="/products" className="see-more-link orange">See More →</Link>
        </div>
      </section>

      {/* Image Box Above Services */}
      <section className="image-box-section">
        <div className="image-box-container">
          <img src={box1Img} alt="Our Workshop" className="image-box-img" />
          <div className="image-box-overlay">
            <h2>Professional Auto Services</h2>
            <p>Expert technicians ready to handle all your vehicle needs</p>
            {isInternal ? (
              <button className="image-box-btn disabled" disabled>
                Book Now
              </button>
            ) : (
              <Link to="/appointment">
                <button className="image-box-btn">Book Now</button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title1">Why Choose Us</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="boxes-wrapper">
        <div className="boxes-header">
          <h2>Our Services</h2>
          <Link to="/services">
            <button className="see-more-btn">View All Services</button>
          </Link>
        </div>
        <div className="boxes-section">
          {services.slice(0, 8).map((service, index) => (
            <div key={service._id || index} className="box">
              <img 
                          src={`${BASE_IMAGE_URL}/${service.imgURL || ''}`} 
                          alt={service.title} 
                          className="service-image"
                          onError={(e) => {
                            e.currentTarget.src = '/vite.svg'; // fallback
                            e.currentTarget.alt = 'Image not available';
                          }}
                        />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem", width: "95%" }}>Loading services...</div>
        ) : (
          <div className="container">
            {services.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", width: "500%"}}>
                No services found.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <section className="announcements-section">
<h2 className="announcements-section-title">📣Announcements!!</h2>
          <div className="announcements-list">
            {announcements.map((announcement) => (
              <div key={announcement.id} className={`announcement-item ${announcement.type}`}>
                <div className="announcement-item-header">
                  <span className={`announcement-item-badge ${announcement.type}`}>
                    {announcement.type}
                  </span>
                  <small className="announcement-item-date">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <p className="announcement-item-message">{announcement.message}</p>
                {announcement.image && (
                        <img
                          src={`${BASE_IMAGE_URL}/${String(announcement.image)
                            .replace(/\\/g, '/')
                            .replace(/^\/+/, '')}`}
                          alt="Announcement"
                          className="announcement-popup-image"
                          onError={(e) => {
                            console.log('Failed image:', e.currentTarget.src);

                            e.currentTarget.src = '/vite.svg';
                            e.currentTarget.alt = 'Image not available';
                          }}
                        />
                      )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Your Vehicle Serviced?</h2>
          <p>Book an appointment today and experience the difference!</p>
          {isInternal ? (
            <button className="cta-btn-large disabled" disabled>
              Schedule Now
            </button>
          ) : (
            <Link to="/appointment">
              <button className="cta-btn-large">Schedule Now</button>
            </Link>
          )}
        </div>
      </section>

      <section className="contact-info-section">
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
              <SiTiktok />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
