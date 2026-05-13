import React, { useState, useEffect } from "react";
import "./Service.css";
import { getServices } from "../api/services";
import type { Service } from "../api/services";
import cityBg from '../images/psac-1.png';
import axios from "axios";

const BASE_IMAGE_URL = 'https://projectspeedautoworkscorporation-backend.onrender.com';
const API = import.meta.env.VITE_API_URL;

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section
      className="service-section"
      style={{ backgroundImage: `url(${cityBg})` }}
    >

      <div className="overlay">
        <h1 className="service-heading">OUR SERVICES</h1>
        <p className="service-subheading">We provide reliable maintenance, diagnostics, and repair services to keep your vehicle safe, efficient, and road-ready.</p>
      </div>
    <div className="services-page">
      <main className="services-list">
        {services.map((service, index) => (
          <div className="service-item" key={service._id || index}>
            <img 
                          src={`${BASE_IMAGE_URL}/${service.imgURL || ''}`} 
                          alt={service.title} 
                          className="product-image"
                          onError={(e) => {
                            e.currentTarget.src = '/vite.svg'; // fallback
                            e.currentTarget.alt = 'Image not available';
                          }}
                        />
            <div className="service-info">
              <h2 className="service-title">{service.title}</h2>
              <p className="service-desc">{service.description}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
    <div className="service-loading">
      {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading services...</div>
        ) : (
          <div className="container">
            {services.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", width: "535%"}}>
                No services found.
              </div>
            )}
          </div>
        )}
    </div>
    </section>
  );
};

export default Services;
