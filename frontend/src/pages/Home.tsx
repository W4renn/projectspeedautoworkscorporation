import React from "react";
import { Link } from "react-router-dom";  
import { useAuth } from "../context/Authcontext";
import headerBg from "../assets/psac-1.png"; 
import "./Home.css";

const Home: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="home-page">
      <header
        className="header"
        style={{ backgroundImage: `url(${headerBg})` }}
      >
        <div className="header-content">
          <h1>Project Speed Autoworks</h1>
          <p className="desc">
            Your one stop automotive shop in Sorsogon City
          </p>
          {isAdmin ? (
            <button className="cta-btn disabled" disabled>
              Book an Appointment
            </button>
          ) : (
            <Link to="/BookAppointment.tsx"> 
              <button className="cta-btn">
                Book an Appointment
              </button>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default Home;
