import React, { useEffect, useState } from 'react';
import axios from "axios";
import car3DImage from "../images/products/car.jpg";
import "./About.css";

interface Mechanic {
  _id?: string;
  name: string;
  desc: string;
  role: string;
  imgURL?: string;
}

interface Testimonial {
  id: string;
  text: string;
  author: string;
  rating: string;
  date: string;
}

const API = import.meta.env.VITE_API_URL;

const About: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API}/testimonials`);
      const data = res.data.map((item: any) => ({
        id: item._id || item.id,
        text: item.testimonialText || "",
        author: item.customerName || "",
        rating: "★".repeat(item.rating || 0),
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "",
      }));
      setTestimonials(data);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    }
  };

  useEffect(() => {
    fetchTestimonials();

  }, []);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/mechanics`);
        setMechanics(res.data);
      } catch (err) {
        console.error("Error fetching mechanics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMechanics();
  }, []);

  return (
    <div className="about-page">
      {/* 3D Car Image Section */}
      <section className="car-3d-section">
        <div className="car-3d-container">
          <img src={car3DImage} alt="3D Car Model" className="car-3d-image" />
          <div className="car-3d-overlay">
            <h2>Premium Automotive Excellence</h2>
            <p>Experience world-class service for your vehicle</p>
          </div>
        </div>
      </section>

      <section className="vision-mission-section">
        <div className="vision">
          <h2>Our Vision</h2>
          <p>
            To become the most trusted and innovative automotive service provider in the region,
            delivering excellence, safety, and performance in every vehicle we touch.
            We aim to build lasting relationships with our customers through integrity,
            innovation and top-quality care.
          </p>
        </div>
        <div className="mission">
          <h2>Our Mission</h2>
          <p>
            At Project Speed Autoworks Corp., our mission is to provide fast,
            reliable, and affordable automotive solutions delivered with passion and precision.
            We are dedicated to enhancing vehicle performance and safety through expert workmanship,
            advanced technology, and exceptional customer service.
          </p>
        </div>
      </section>

      <section className="technicians-section">
        <h2>Our Skilled Technicians</h2>
        <div className="technicians-grid">
          {mechanics.map((mechanic) => (
            <div key={mechanic._id} className="technician-card">
              <img 
                          src={`https://projectspeedautoworkscorporation-backend.onrender.com/${mechanic.imgURL || ''}`} 
                          alt={mechanic.name}
                          onError={(e) => {
                            e.currentTarget.src = '/vite.svg';
                            e.currentTarget.alt = 'Image not available';
                          }}
                        />
              <p className="technician-role">{mechanic.role} {mechanic.name}</p>
              <p className="technician-desc">{mechanic.desc}</p>
            </div>
          ))}
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem", width: "100%"}}>Loading mechanics...</div>
        ) : (
          <div className="container">
            {mechanics.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", width: "450%"}}>
                No mechanics found.
              </div>
            )}
          </div>
        )}
      </section>

      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <p className="testimonial-text">"{t.text}"</p>
              <p className="testimonial-author">- {t.author}</p>
              <p className="testimonial-rating">{t.rating}</p>
              <p className="testimonial-date">{t.date}</p>
            </div>
          ))}
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading testimonials...</div>
        ) : (
          <div className="container">
            {testimonials.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", width: "550%"}}>
                No testimonials found.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default About;

