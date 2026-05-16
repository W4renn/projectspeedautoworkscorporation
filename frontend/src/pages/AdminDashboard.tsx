import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getServices, createService, updateService, deleteService } from "../api/services";
import type { Service } from "../api/services";
import { getMechanics, createMechanic, updateMechanic, deleteMechanic } from "../api/mechanics";
import type { Mechanic } from "../api/mechanics";
import "./AdminDashboard.css";

const BASE_IMAGE_URL = 'https://projectspeedautoworkscorporation-backend.onrender.com';
const API = import.meta.env.VITE_API_URL;

interface Appointment {
  id: string;
  customerName?: string;
  firstName?: string;
  surname?: string;
  contactNumber: string;
  carModel: string;
  serviceType: string;
  bookingDate: string;
  bookingTime: string;
  description?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  formattedCreatedAt?: string;
  formattedUpdatedAt?: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface Announcement {
  id: string;
  message: string;
  type: string;
  image?: string | null;
  createdAt: string;
}

interface Testimonial {
  id: string;
  text: string;
  author: string;
  rating: string;
  date: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  imgURL: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [approvedAppointments, setApprovedAppointments] = useState<Appointment[]>([]);
  const [rejectedAppointments, setRejectedAppointments] = useState<Appointment[]>([]);
  const [historyAppointments, setHistoryAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [announcementType, setAnnouncementType] = useState("info");
  const [announcementImage, setAnnouncementImage] = useState<File | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [announcementError, setAnnouncementError] = useState<string | null>(null);

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [formData, setFormData] = useState({ text: "", author: "", rating: "5" });
  const [testimonialEditingId, setTestimonialEditingId] = useState<string | null>(null);
  const [testimonialError, setTestimonialError] = useState("");
  const [testimonialSuccess, setTestimonialSuccess] = useState("");
  const [submittingTestimonial, setSubmittingTestimonial] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productFormData, setProductFormData] = useState({ title: "", description: "", imgURL: "", category: "Engine Oil and Oil Filters" });
  const [productEditingId, setProductEditingId] = useState<string | null>(null);
  const [productError, setProductError] = useState("");
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);

  // Services state
  const [services, setServices] = useState<Service[]>([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({ title: "", description: "", imgURL: "" });
  const [serviceEditingId, setServiceEditingId] = useState<string | null>(null);
  const [serviceError, setServiceError] = useState("");
  const [submittingService, setSubmittingService] = useState(false);
  const [serviceImage, setServiceImage] = useState<File | null>(null);

  // Mechanics state
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [showMechanicForm, setShowMechanicForm] = useState(false);
  const [mechanicFormData, setMechanicFormData] = useState({ name: "", role: "", imgURL: "" });
  const [mechanicEditingId, setMechanicEditingId] = useState<string | null>(null);
  const [mechanicError, setMechanicError] = useState("");
  const [submittingMechanic, setSubmittingMechanic] = useState(false);
  const [mechanicImage, setMechanicImage] = useState<File | null>(null);

  const productCategories = [
    "Engine Oil and Oil Filters",
    "Air Filters",
    "Brake Parts",
    "Engine Flushing",
    "Coolants",
  ];

  const [showAllProducts, setShowAllProducts] = useState(false);

  const visibleProducts = showAllProducts
    ? products
    : products.slice(0, 5);

  const [showAllServices, setShowAllServices] = useState(false);

  const visibleServices = showAllServices
    ? services
    : services.slice(0, 5);
  
  const customerNameFallback = (apt: Appointment) => {
    return apt.customerName || `${apt.firstName || ''} ${apt.surname || ''}`.trim() || 'Unknown';
  };

  useEffect(() => {
    fetchAllData();
    fetchAnnouncements();
    fetchTestimonials();
    fetchProducts();
    fetchServices();
    fetchMechanics();
    const interval = setInterval(() => {
      fetchAllData();
      fetchAnnouncements();
      fetchTestimonials();
      fetchProducts();
      fetchServices();
      fetchMechanics();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      setApiError(null);
      const [pendingRes, approvedRes, rejectedRes, statsRes, historyRes] = await Promise.all([
        axios.get(`${API}/appointments/pending`),
        axios.get(`${API}/appointments/approved`),
        axios.get(`${API}/appointments/rejected`),
        axios.get(`${API}/appointments/stats`),
        axios.get(`${API}/appointments/history`)
      ]);
      
      setPendingAppointments(pendingRes.data || []);
      setApprovedAppointments(approvedRes.data || []);
      setRejectedAppointments(rejectedRes.data || []);
      setStats(statsRes.data || { total: 0, pending: 0, approved: 0, rejected: 0 });
      setHistoryAppointments(historyRes.data || []);
      setNotificationCount((pendingRes.data || []).length);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setApiError(`Failed to load dashboard data: ${err.response?.data?.error || err.message || 'Unknown error. Check if backend server is running on port 5000.'}`);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API}/announcements`);
      setAnnouncements(res.data);
      setAnnouncementError(null);
    } catch (err: any) {
      console.error("Error fetching announcements:", err);
      setAnnouncementError(`Failed to load announcements: ${err.response?.data?.error || err.message}`);
    }
  };

  const fetchTestimonials = async () => {
  try {
    const res = await axios.get(`${API}/testimonials`);

    const data = res.data.map((item: any) => ({
      id: item._id || item.id,
      text: item.testimonialText || "",
      author: item.customerName || "",
      rating: "★".repeat(item.rating || 5),
      date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "",
    }));

    setTestimonials(data);
  } catch (err) {
    console.error("Failed to load testimonials:", err);
  }
};

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;
    
    try {
      setAnnouncementError(null);
      const formData = new FormData();
      formData.append("message", newAnnouncement);
      formData.append("type", announcementType);
      if (announcementImage) {
        formData.append("image", announcementImage);
      }
      
      if (editingAnnouncementId) {
        await axios.put(`${API}/announcements/${editingAnnouncementId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(`${API}/announcements`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setEditingAnnouncementId(null);
      setNewAnnouncement("");
      setAnnouncementType("info");
      setAnnouncementImage(null);
      fetchAnnouncements();
    } catch (err: any) {
      console.error("Error saving announcement:", err);
      setAnnouncementError(`Save failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAnnouncementImage(e.target.files[0]);
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncementId(announcement.id);
    setNewAnnouncement(announcement.message);
    setAnnouncementType(announcement.type);
    setAnnouncementImage(null);
  };

  const handleCancelEdit = () => {
    setEditingAnnouncementId(null);
    setNewAnnouncement("");
    setAnnouncementType("info");
    setAnnouncementImage(null);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      setAnnouncementError(null);
      await axios.delete(`${API}/announcements/${id}`);
      fetchAnnouncements();
    } catch (err: any) {
      console.error("Error deleting announcement:", err);
      setAnnouncementError(`Delete failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleApprove = async (id: string | number) => {
    try {
      await axios.put(`${API}/appointments/${id}/status`, { status: "approved" });
      fetchAllData();
    } catch (err: any) {
      console.error("Error approving appointment:", err);
      setApiError(`Approve failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleReject = async (id: string | number) => {
    try {
      await axios.put(`${API}/appointments/${id}/status`, { status: "rejected" });
      fetchAllData();
    } catch (err: any) {
      console.error("Error rejecting appointment:", err);
      setApiError(`Reject failed: ${err.response?.data?.error || err.message}`);
    }
  };

  // Testimonials CRUD functions
  const handleTestimonialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    setFormData({ ...formData, [target.name]: target.value });
    setTestimonialError("");
  };

  const handleAddEditTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestimonialError("");
    setTestimonialSuccess("");
    setSubmittingTestimonial(true);

    try {
      const payload = {
        customerName: formData.author,
        rating: parseInt(formData.rating, 10),
        testimonialText: formData.text,
      };

      let res;
      if (testimonialEditingId) {
        res = await axios.put(`${API}/testimonials/${testimonialEditingId}`, payload);
        const updatedTestimonial: Testimonial = {
          id: res.data.testimonial._id || testimonialEditingId,
          text: formData.text,
          author: formData.author,
          rating: "★".repeat(parseInt(formData.rating, 10)),
          date: res.data.testimonial.createdAt ? new Date(res.data.testimonial.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : testimonials.find(t => t.id === testimonialEditingId)?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        };
        setTestimonials(testimonials.map(t => t.id === testimonialEditingId ? updatedTestimonial : t));
      } else {
        res = await axios.post(`${API}/testimonials`, payload);
        const newTestimonial: Testimonial = {
          id: res.data.testimonial._id || "",
          text: formData.text,
          author: formData.author,
          rating: "★".repeat(parseInt(formData.rating, 10)),
          date: res.data.testimonial.createdAt ? new Date(res.data.testimonial.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        };
        setTestimonials([...testimonials, newTestimonial]);
      }

      setFormData({ text: "", author: "", rating: "5" });
      setTestimonialEditingId(null);
      setShowTestimonialForm(false);
    } catch (err: any) {
      const serverMessage = err?.response?.data?.error || err?.message || "Failed to save testimonial.";
      console.error("Failed to save testimonial:", err);
      setTestimonialError(serverMessage);
    } finally {
      setSubmittingTestimonial(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await axios.delete(`${API}/testimonials/${id}`);
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
      alert("Failed to delete testimonial.");
    }
  };

  const editTestimonial = (testimonial: Testimonial) => {
    setFormData({
      text: testimonial.text,
      author: testimonial.author,
      rating: testimonial.rating.length.toString()
    });
    setTestimonialEditingId(testimonial.id);
    setShowTestimonialForm(true);
  };

  const cancelTestimonialEdit = () => {
    setFormData({ text: "", author: "", rating: "5" });
    setTestimonialEditingId(null);
    setShowTestimonialForm(false);
    setTestimonialError("");
    setTestimonialSuccess("");
  };

  // Products CRUD functions
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    setProductFormData({ ...productFormData, [target.name]: target.value });
    setProductError("");
  };

  const handleAddEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductError("");
    setSubmittingProduct(true);

    try {
      const formData = new FormData();
      formData.append("title", productFormData.title);
      formData.append("description", productFormData.description);
      formData.append("category", productFormData.category);
      if (productImage) {
        formData.append("image", productImage);
      }
      // If editing and no new image, keep the existing imgURL if we have it
      if (productEditingId && !productImage && productFormData.imgURL) {
        formData.append("imgURL", productFormData.imgURL);
      }

      if (productEditingId) {
        await axios.put(`${API}/products/${productEditingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API}/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setProductFormData({ title: "", description: "", imgURL: "", category: "Engine Oil and Oil Filters" });
      setProductImage(null);
      setProductEditingId(null);
      setShowProductForm(false);
      fetchProducts();
    } catch (err: any) {
      const serverMessage = err?.response?.data?.error || err?.message || "Failed to save product.";
      console.error("Failed to save product:", err);
      setProductError(serverMessage);
    } finally {
      setSubmittingProduct(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product.");
    }
  };

  const editProduct = (product: Product) => {
    setProductFormData({
      title: product.title,
      description: product.description,
      imgURL: product.imgURL,
      category: product.category,
    });
    setProductImage(null);
    setProductEditingId(product._id);
    setShowProductForm(true);
  };

  const cancelProductEdit = () => {
    setProductFormData({ title: "", description: "", imgURL: "", category: "Engine Oil and Oil Filters" });
    setProductImage(null);
    setProductEditingId(null);
    setShowProductForm(false);
    setProductError("");
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };

  // Services CRUD functions
  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error("Failed to load services:", err);
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setServiceFormData({ ...serviceFormData, [target.name]: target.value });
    setServiceError("");
  };

  const handleAddEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    setServiceError("");
    setSubmittingService(true);

    try {
      const formData = new FormData();
      formData.append("title", serviceFormData.title);
      formData.append("description", serviceFormData.description);
      if (serviceImage) {
        formData.append("image", serviceImage);
      }
      if (serviceEditingId && !serviceImage && serviceFormData.imgURL) {
        formData.append("imgURL", serviceFormData.imgURL);
      }

      if (serviceEditingId) {
        await updateService(serviceEditingId, formData);
      } else {
        await createService(formData);
      }

      setServiceFormData({ title: "", description: "", imgURL: "" });
      setServiceImage(null);
      setServiceEditingId(null);
      setShowServiceForm(false);
      fetchServices();
    } catch (err: any) {
      const serverMessage = err?.response?.data?.error || err?.message || "Failed to save service.";
      console.error("Failed to save service:", err);
      setServiceError(serverMessage);
    } finally {
      setSubmittingService(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService(id);
      setServices(services.filter(s => s._id !== id));
    } catch (err) {
      console.error("Failed to delete service:", err);
      alert("Failed to delete service.");
    }
  };

  const handleEditService = (service: Service) => {
    setServiceFormData({
      title: service.title,
      description: service.description,
      imgURL: service.imgURL,
    });
    setServiceImage(null);
    setServiceEditingId(service._id || null);
    setShowServiceForm(true);
  };

  const handleCancelServiceEdit = () => {
    setServiceFormData({ title: "", description: "", imgURL: "" });
    setServiceImage(null);
    setServiceEditingId(null);
    setShowServiceForm(false);
    setServiceError("");
  };

  const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setServiceImage(e.target.files[0]);
    }
  };

  // Mechanics CRUD functions
  const fetchMechanics = async () => {
    try {
      const data = await getMechanics();
      setMechanics(data);
    } catch (err) {
      console.error("Failed to load mechanics:", err);
    }
  };

  const handleMechanicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setMechanicFormData({ ...mechanicFormData, [target.name]: target.value });
    setMechanicError("");
  };

  const handleAddEditMechanic = async (e: React.FormEvent) => {
    e.preventDefault();
    setMechanicError("");
    setSubmittingMechanic(true);

    try {
      const formData = new FormData();
      formData.append("name", mechanicFormData.name);
      formData.append("role", mechanicFormData.role);
      if (mechanicImage) {
        formData.append("image", mechanicImage);
      }
      if (mechanicEditingId && !mechanicImage && mechanicFormData.imgURL) {
        formData.append("imgURL", mechanicFormData.imgURL);
      }

      if (mechanicEditingId) {
        await updateMechanic(mechanicEditingId, formData);
      } else {
        await createMechanic(formData);
      }

      setMechanicFormData({ name: "", role: "", imgURL: "" });
      setMechanicImage(null);
      setMechanicEditingId(null);
      setShowMechanicForm(false);
      fetchMechanics();
    } catch (err: any) {
      const serverMessage = err?.response?.data?.error || err?.message || "Failed to save mechanic.";
      console.error("Failed to save mechanic:", err);
      setMechanicError(serverMessage);
    } finally {
      setSubmittingMechanic(false);
    }
  };

  const handleDeleteMechanic = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this mechanic?")) return;
    try {
      await deleteMechanic(id);
      setMechanics(mechanics.filter(m => m._id !== id));
    } catch (err) {
      console.error("Failed to delete mechanic:", err);
      alert("Failed to delete mechanic.");
    }
  };

  const handleEditMechanic = (mechanic: Mechanic) => {
    setMechanicFormData({
      name: mechanic.name,
      role: mechanic.role,
      imgURL: mechanic.imgURL || "",
    });
    setMechanicImage(null);
    setMechanicEditingId(mechanic._id || null);
    setShowMechanicForm(true);
  };

  const handleCancelMechanicEdit = () => {
    setMechanicFormData({ name: "", role: "", imgURL: "" });
    setMechanicImage(null);
    setMechanicEditingId(null);
    setShowMechanicForm(false);
    setMechanicError("");
  };

  const handleMechanicImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMechanicImage(e.target.files[0]);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Admin Header with Menu Bar */}
      <div className="admin-menu-bar">
        <div className="admin-menu-left">
          <h2>Admin Dashboard</h2>
        </div>
        <div className="admin-menu-right">
          <Link to="/admin/reports" className="reports-link-btn">
            Reports
          </Link>
          <div className="notification-badge">
            <span>New Bookings</span>
            {notificationCount > 0 && (
              <span className="badge-count">{notificationCount}</span>
            )}
          </div>

        </div>
      </div>

      <div className="admin-content">
        {/* Header */}
        <div className="admin-header">
          <h1>Welcome, {user?.username}!</h1>
        </div>

        {apiError && (
          <div style={{backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem', margin: '1rem 0', borderLeft: '4px solid #dc2626', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span>{apiError}</span>
            <button 
              onClick={() => {setApiError(null); fetchAllData();}} 
              style={{backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.875rem'}}
            >
              Retry
            </button>
          </div>
        )}

        {/* Pending Appointments Section */}
        <div className="appointments-section">
          <h3>New Booking Requests ({pendingAppointments.length})</h3>
          {pendingAppointments.length === 0 ? (
            <p className="no-appointments">No pending bookings</p>
          ) : (
            <div className="appointments-grid">
              {pendingAppointments.map((apt) => (
                <div key={apt.id} className="appointment-card pending">
                  <div className="appointment-info">
                    <h4>{customerNameFallback(apt)}</h4>
                    <p><strong>Car:</strong> {apt.carModel}</p>
                    <p><strong>Service:</strong> {apt.serviceType}</p>
                    <p><strong>Date:</strong> {apt.bookingDate} at {apt.bookingTime}</p>
                    <p><strong>Contact:</strong> {apt.contactNumber}</p>
                    {apt.description && <p><strong>Notes:</strong> {apt.description}</p>}
                  </div>
                  <div className="appointment-actions">
                    <button 
                      className="approve-btn" 
                      onClick={() => handleApprove(apt.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="reject-btn" 
                      onClick={() => handleReject(apt.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats Section */}
        <div className="appointments-section stats-section">
          <h3>Booking Summary</h3>
          <div className="stats-grid">
            <div className="stats-card total">
              <h4>Total Bookings</h4>
              <span className="stats-number">{stats.total}</span>
            </div>
            <div className="stats-card pending">
              <h4>Pending</h4>
              <span className="stats-number">{stats.pending}</span>
            </div>
            <div className="stats-card approved">
              <h4>Approved</h4>
              <span className="stats-number">{stats.approved}</span>
            </div>
            <div className="stats-card rejected">
              <h4>Rejected</h4>
              <span className="stats-number">{stats.rejected}</span>
            </div>
          </div>
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Pending", value: stats.pending },
                    { name: "Approved", value: stats.approved },
                    { name: "Rejected", value: stats.rejected },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`
                  }
                >
                  <Cell fill="#555555" />
                  <Cell fill="#28a745" />
                  <Cell fill="#dc3545" />
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} bookings`, ""]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rejected Appointments Section */}
        <div className="appointments-section rejected-section">
          <h3>Rejected Bookings ({rejectedAppointments.length})</h3>
          {rejectedAppointments.length === 0 ? (
            <p className="no-appointments">No rejected bookings</p>
          ) : (
            <div className="appointments-grid">
              {rejectedAppointments.map((apt) => (
                <div key={apt.id} className="appointment-card rejected">
                  <div className="appointment-info">
                    <h4>{customerNameFallback(apt)}</h4>
                    <p><strong>Car:</strong> {apt.carModel}</p>
                    <p><strong>Service:</strong> {apt.serviceType}</p>
                    <p><strong>Date:</strong> {apt.bookingDate} at {apt.bookingTime}</p>
                    <p><strong>Contact:</strong> {apt.contactNumber}</p>
                    {apt.description && <p><strong>Notes:</strong> {apt.description}</p>}
                    {apt.formattedUpdatedAt && <p><strong>Last Updated:</strong> {apt.formattedUpdatedAt}</p>}
                  </div>
                  <div className="appointment-status">
                    <span className="status-rejected">Rejected</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Appointments Section */}
        <div className="appointments-section approved-section">
          <h3>Approved Bookings ({approvedAppointments.length})</h3>
          {approvedAppointments.length === 0 ? (
            <p className="no-appointments">No approved bookings yet</p>
          ) : (
            <div className="appointments-grid">
              {approvedAppointments.map((apt) => (
                <div key={apt.id} className="appointment-card approved">
                  <div className="appointment-info">
                    <h4>{customerNameFallback(apt)}</h4>
                    <p><strong>Car:</strong> {apt.carModel}</p>
                    <p><strong>Service:</strong> {apt.serviceType}</p>
                    <p><strong>Date:</strong> {apt.bookingDate} at {apt.bookingTime}</p>
                    <p><strong>Contact:</strong> {apt.contactNumber}</p>
                    {apt.formattedUpdatedAt && <p><strong>Confirmed:</strong> {apt.formattedUpdatedAt}</p>}
                  </div>
                  <div className="appointment-status">
                    <span className="status-approved">Approved</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="appointments-section history-section">
          <h3>Bookings History ({historyAppointments.length})</h3>
          {historyAppointments.length === 0 ? (
            <p className="no-appointments">No bookings history</p>
          ) : (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date/Time</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {historyAppointments.slice(0, 10).map((apt) => (
                    <tr key={apt.id} className={`status-${apt.status}`}>
                      <td>{customerNameFallback(apt)}</td>
                      <td>{apt.serviceType}</td>
                      <td>{apt.bookingDate} {apt.bookingTime}</td>
                      <td>{apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}</td>
                      <td>{apt.formattedUpdatedAt || apt.formattedCreatedAt || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {historyAppointments.length > 10 && (
                <p className="history-footer">Showing 10 most recent of {historyAppointments.length} total bookings</p>
              )}
            </div>
          )}
        </div>

        {/* Announcements Management Section */}
        <div className="appointments-section">
          <h3>Manage Announcements ({announcements.length})</h3>
          
          {/* Add New Announcement Form */}
          <form onSubmit={handleSaveAnnouncement} className="announcement-form">
            <div className="form-row">
              <input
                type="text"
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                placeholder="Enter announcement message..."
                className="announcement-input"
              />
              <select
                value={announcementType}
                onChange={(e) => setAnnouncementType(e.target.value)}
                className="announcement-select"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
              <button type="submit" className="add-announcement-btn">
                {editingAnnouncementId ? 'Update Announcement' : 'Add Announcement'}
              </button>
              {editingAnnouncementId && (
                <button type="button" className="cancel-edit-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
            <div className="form-row image-upload-row">
              <label htmlFor="announcement-image" className="image-upload-label">
                {announcementImage ? announcementImage.name : "Upload Image (optional)"}
              </label>
              <input
                type="file"
                id="announcement-image"
                accept="image/*"
                onChange={handleImageChange}
                className="image-upload-input"
              />
              {announcementImage && (
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => setAnnouncementImage(null)}
                >
                  Remove Image
                </button>
              )}
            </div>
          </form>

          {announcementError && (
            <div className="announcement-error">
              <span>{announcementError}</span>
              <button 
                onClick={() => setAnnouncementError(null)} 
                className="dismiss-btn"
              >
                Dismiss
              </button>
            </div>
          )}
          {/* Existing Announcements List */}
          <div className="announcements-list">
            {announcements.length === 0 ? (
              <p className="no-appointments">No announcements yet</p>
            ) : (
              announcements.map((announcement) => (
                <div key={announcement.id} className={`announcement-card ${announcement.type}`}>
                  <div className="announcement-content">
                    <span className="announcement-badge">{announcement.type}</span>
                    <p className="announcement-message">{announcement.message}</p>
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
                    <small className="announcement-date">
                      {new Date(announcement.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <div className="announcement-actions">
                    <button
                      className="edit-announcement-btn"
                      onClick={() => handleEditAnnouncement(announcement)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-announcement-btn"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Testimonials Management Section */}
        <div className="appointments-section">
          <h3>Manage Testimonials ({testimonials.length})</h3>
          
          {testimonials.length === 0 ? (
            <p className="no-appointments">No testimonials yet</p>
          ) : (
            <div className="testimonials-table-container">
              <table className="testimonials-table">
                <thead>
                  <tr>
                    <th>Text</th>
                    <th>Author</th>
                    <th>Rating</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((testimonial) => (
                    <tr key={testimonial.id}>
                      <td className="testimonial-text">{testimonial.text}</td>
                      <td>{testimonial.author}</td>
                      <td>{testimonial.rating}</td>
                      <td>{testimonial.date}</td>
                      <td className="testimonial-actions">
                        <button 
                          className="edit-testimonial-btn small-btn" 
                          onClick={() => editTestimonial(testimonial)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-testimonial-btn small-btn" 
                          onClick={() => deleteTestimonial(testimonial.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button 
            className="toggle-testimonial-form-btn"
            onClick={() => {
              if (testimonialEditingId) {
                cancelTestimonialEdit();
              } else {
                setShowTestimonialForm(!showTestimonialForm);
              }
            }}
          >
            {testimonialEditingId ? 'Cancel Edit' : showTestimonialForm ? 'Cancel' : 'Add New Testimonial'}
          </button>

          {showTestimonialForm && (
            <form onSubmit={handleAddEditTestimonial} className="testimonial-form">
              {testimonialError && (
                <div className="error-message">{testimonialError}</div>
              )}
              {testimonialSuccess && (
                <div className="success-message">{testimonialSuccess}</div>
              )}
              <div className="form-group">
                <label>Testimonial Text:</label>
                <textarea 
                  name="text" 
                  value={formData.text} 
                  onChange={handleTestimonialChange} 
                  placeholder="Enter testimonial text..."
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Author:</label>
                  <input 
                    type="text" 
                    name="author" 
                    value={formData.author} 
                    onChange={handleTestimonialChange} 
                    placeholder="Customer name"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Rating:</label>
                  <select 
                    name="rating" 
                    value={formData.rating} 
                    onChange={handleTestimonialChange}
                  >
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" disabled={submittingTestimonial} className="submit-testimonial-btn">
                  {submittingTestimonial ? 'Saving...' : testimonialEditingId ? 'Update Testimonial' : 'Add Testimonial'}
                </button>
                <button type="button" onClick={cancelTestimonialEdit} className="cancel-testimonial-btn" disabled={submittingTestimonial}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Products Management Section */}
        <div className="appointments-section">
            <div className="products-header">
              <h3>Manage Products ({products.length})</h3>

              {products.length > 5 && (
                <button
                  className="toggle-products-btn"
                  onClick={() => setShowAllProducts(!showAllProducts)}
                >
                  {showAllProducts ? "Collapse" : "Show All"}
                </button>
              )}
            </div>

            {products.length === 0 ? (
              <p className="no-appointments">No products yet</p>
            ) : (
              <div className="products-table-container">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleProducts.map((product) => (
                      <tr key={product._id}>
                        <td className="product-image-cell">
                          <img
                            src={`${BASE_IMAGE_URL}/${product.imgURL || ""}`}
                            alt={product.title}
                            className="product-thumb"
                            onError={(e) => {
                              e.currentTarget.src = "/vite.svg";
                              e.currentTarget.alt = "Image not available";
                            }}
                          />
                        </td>

                        <td className="product-title">{product.title}</td>

                        <td>{product.category}</td>

                        <td className="product-description">
                          {product.description}
                        </td>

                        <td className="product-actions">
                          <button
                            className="edit-product-btn small-btn"
                            onClick={() => editProduct(product)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-product-btn small-btn"
                            onClick={() => deleteProduct(product._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          <button 
            className="toggle-product-form-btn"
            onClick={() => {
              if (productEditingId) {
                cancelProductEdit();
              } else {
                setShowProductForm(!showProductForm);
              }
            }}
          >
            {productEditingId ? 'Cancel Edit' : showProductForm ? 'Cancel' : 'Add New Product'}
          </button>

          {showProductForm && (
            <form onSubmit={handleAddEditProduct} className="product-form">
              {productError && (
                <div className="error-message">{productError}</div>
              )}
              <div className="form-group">
                <label>Product Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  value={productFormData.title} 
                  onChange={handleProductChange} 
                  placeholder="Enter product title"
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category:</label>
                  <select 
                    name="category" 
                    value={productFormData.category} 
                    onChange={handleProductChange}
                  >
                    {productCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{productEditingId ? 'Change Image:' : 'Product Image:'}</label>
                  <div className="form-row image-upload-row">
                    <label htmlFor="product-image" className="image-upload-label">
                      {productImage ? productImage.name : (productEditingId ? "Upload new image (optional)" : "Upload product image")}
                    </label>
                    <input
                      type="file"
                      id="product-image"
                      accept="image/*"
                      onChange={handleProductImageChange}
                      className="image-upload-input"
                      required={!productEditingId}
                    />
                    {productImage && (
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => setProductImage(null)}
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  {productEditingId && productFormData.imgURL && !productImage && (
                    <small className="current-image-note">Current image will be kept if no new image is uploaded.</small>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  value={productFormData.description} 
                  onChange={handleProductChange} 
                  placeholder="Enter product description..."
                  required 
                />
              </div>
              <div className="form-actions">
                <button type="submit" disabled={submittingProduct} className="submit-product-btn">
                  {submittingProduct ? 'Saving...' : productEditingId ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" onClick={cancelProductEdit} className="cancel-product-btn" disabled={submittingProduct}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Services Management Section */}
        <div className="appointments-section">
        <div className="services-header">
          <h3>Manage Services ({services.length})</h3>

          {services.length > 5 && (
            <button
              className="toggle-services-btn"
              onClick={() => setShowAllServices(!showAllServices)}
            >
              {showAllServices ? "Collapse" : "Show All"}
            </button>
          )}
        </div>

        {services.length === 0 ? (
          <p className="no-appointments">No services yet</p>
        ) : (
          <div className="services-table-container">
            <table className="services-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleServices.map((service) => (
                  <tr key={service._id}>
                    <td className="service-image-cell">
                      <img
                        src={`${BASE_IMAGE_URL}/${service.imgURL || ""}`}
                        alt={service.title}
                        className="service-thumb"
                        onError={(e) => {
                          e.currentTarget.src = "/vite.svg";
                          e.currentTarget.alt = "Image not available";
                        }}
                      />
                    </td>

                    <td className="service-title">{service.title}</td>

                    <td className="service-description">
                      {service.description}
                    </td>

                    <td className="service-actions">
                      <button
                        className="edit-service-btn small-btn"
                        onClick={() => handleEditService(service)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-service-btn small-btn"
                        onClick={() => handleDeleteService(service._id!)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

          <button 
            className="toggle-service-form-btn"
            onClick={() => {
              if (serviceEditingId) {
                handleCancelServiceEdit();
              } else {
                setShowServiceForm(!showServiceForm);
              }
            }}
          >
            {serviceEditingId ? 'Cancel Edit' : showServiceForm ? 'Cancel' : 'Add New Service'}
          </button>

          {showServiceForm && (
            <form onSubmit={handleAddEditService} className="service-form">
              {serviceError && (
                <div className="error-message">{serviceError}</div>
              )}
              <div className="form-group">
                <label>Service Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  value={serviceFormData.title} 
                  onChange={handleServiceChange} 
                  placeholder="Enter service title"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  value={serviceFormData.description} 
                  onChange={handleServiceChange} 
                  placeholder="Enter service description..."
                  required 
                />
              </div>
              <div className="form-group">
                <label>{serviceEditingId ? 'Change Image:' : 'Service Image:'}</label>
                <div className="form-row image-upload-row">
                  <label htmlFor="service-image" className="image-upload-label">
                    {serviceImage ? serviceImage.name : (serviceEditingId ? "Upload new image (optional)" : "Upload service image")}
                  </label>
                  <input
                    type="file"
                    id="service-image"
                    accept="image/*"
                    onChange={handleServiceImageChange}
                    className="image-upload-input"
                    required={!serviceEditingId}
                  />
                  {serviceImage && (
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => setServiceImage(null)}
                    >
                      Remove Image
                    </button>
                  )}
                </div>
                {serviceEditingId && serviceFormData.imgURL && !serviceImage && (
                  <small className="current-image-note">Current image will be kept if no new image is uploaded.</small>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" disabled={submittingService} className="submit-service-btn">
                  {submittingService ? 'Saving...' : serviceEditingId ? 'Update Service' : 'Add Service'}
                </button>
                <button type="button" onClick={handleCancelServiceEdit} className="cancel-service-btn" disabled={submittingService}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Mechanics Management Section */}
        <div className="appointments-section">
          <h3>Manage Mechanics ({mechanics.length})</h3>
          
          {mechanics.length === 0 ? (
            <p className="no-appointments">No mechanics yet</p>
          ) : (
            <div className="mechanics-table-container">
              <table className="mechanics-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mechanics.map((mechanic) => (
                    <tr key={mechanic._id}>
                      <td className="mechanic-image-cell">
                        <img 
                          src={`${BASE_IMAGE_URL}/${mechanic.imgURL || ''}`} 
                          alt={mechanic.name} 
                          className="mechanic-thumb"
                          onError={(e) => {
                            e.currentTarget.src = '/vite.svg'; // fallback
                            e.currentTarget.alt = 'Image not available';
                          }}
                        />
                      </td>
                      <td className="mechanic-name">{mechanic.name}</td>
                      <td className="mechanic-role">{mechanic.role}</td>
                      <td className="mechanic-actions">
                        <button 
                          className="edit-mechanic-btn small-btn" 
                          onClick={() => handleEditMechanic(mechanic)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-mechanic-btn small-btn" 
                          onClick={() => handleDeleteMechanic(mechanic._id!)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button 
            className="toggle-mechanic-form-btn"
            onClick={() => {
              if (mechanicEditingId) {
                handleCancelMechanicEdit();
              } else {
                setShowMechanicForm(!showMechanicForm);
              }
            }}
          >
            {mechanicEditingId ? 'Cancel Edit' : showMechanicForm ? 'Cancel' : 'Add New Mechanic'}
          </button>

          {showMechanicForm && (
            <form onSubmit={handleAddEditMechanic} className="mechanic-form">
              {mechanicError && (
                <div className="error-message">{mechanicError}</div>
              )}
              <div className="form-group">
                <label>Mechanic Name:</label>
                <input 
                  type="text" 
                  name="name" 
                  value={mechanicFormData.name} 
                  onChange={handleMechanicChange} 
                  placeholder="Enter mechanic name"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <input 
                  type="text" 
                  name="role" 
                  value={mechanicFormData.role} 
                  onChange={handleMechanicChange} 
                  placeholder="e.g. Chief Technician, Mechanic"
                  required 
                />
              </div>
              <div className="form-group">
                <label>{mechanicEditingId ? 'Change Image:' : 'Mechanic Image:'}</label>
                <div className="form-row image-upload-row">
                  <label htmlFor="mechanic-image" className="image-upload-label">
                    {mechanicImage ? mechanicImage.name : (mechanicEditingId ? "Upload new image (optional)" : "Upload mechanic image")}
                  </label>
                  <input
                    type="file"
                    id="mechanic-image"
                    accept="image/*"
                    onChange={handleMechanicImageChange}
                    className="image-upload-input"
                    required={!mechanicEditingId}
                  />
                  {mechanicImage && (
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => setMechanicImage(null)}
                    >
                      Remove Image
                    </button>
                  )}
                </div>
                {mechanicEditingId && mechanicFormData.imgURL && !mechanicImage && (
                  <small className="current-image-note">Current image will be kept if no new image is uploaded.</small>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" disabled={submittingMechanic} className="submit-mechanic-btn">
                  {submittingMechanic ? 'Saving...' : mechanicEditingId ? 'Update Mechanic' : 'Add Mechanic'}
                </button>
                <button type="button" onClick={handleCancelMechanicEdit} className="cancel-mechanic-btn" disabled={submittingMechanic}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
