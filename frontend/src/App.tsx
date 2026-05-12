import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";  
import About from "./pages/About";
import Services from "./pages/Services";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import BookAppointment from "./Components/BookAppointment";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";

import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/Authcontext";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import logo1 from "./assets/2.png";
import Footer from "./Components/Footer";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const getLinkClass = (path: string) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo1} alt="Site Logo 2" className="logo1"/>
        </Link>
      </div>

      <ul className="nav-links">
        {user?.role === "admin" && (
          <li>
            <Link 
              to="/admin" 
              className={getLinkClass('/admin')}
            >
              DASHBOARD
            </Link>
          </li>
        )}
        <li>
          <Link 
            to="/" 
            className={getLinkClass('/')}
          >
            HOME
          </Link>
        </li>
        <li>
          <Link 
            to="/about" 
            className={getLinkClass('/about')}
          >
            ABOUT
          </Link>
        </li>
        <li>
          <Link 
            to="/services" 
            className={getLinkClass('/services')}
          >
            SERVICES
          </Link>
        </li>
        <li>
          <Link 
            to="/products" 
            className={getLinkClass('/products')}
          >
            PRODUCTS
          </Link>
        </li>
        <li>
          <Link 
            to="/contact" 
            className={getLinkClass('/contact')}
          >
            CONTACT
          </Link>
        </li>
      </ul>

      <div className="navbar-right">
        {user?.role !== "admin" && (
          <Link to="/appointment" className="nav-btn">
            Book Appointment
          </Link>
        )}
        {user ? (
          <button className="nav-btn logout-btn" onClick={logout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="nav-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

       <Routes>
  <Route path="/" element={<Landing />} /> {/* Landing now includes everything */}
  <Route path="/about" element={<About />} />
  <Route path="/services" element={<Services />} />
  <Route path="/products" element={<Products />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/appointment" element={<BookAppointment />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route
    path="/admin"
    element={
      <ProtectedRoute adminOnly={true}>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin/reports"
    element={
      <ProtectedRoute adminOnly={true}>
        <AdminReports />
      </ProtectedRoute>
    }
  />
</Routes>


        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
