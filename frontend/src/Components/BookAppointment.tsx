import React, { useState, useEffect } from "react";
import "./BookAppointment.css";
import { validateAppointment, CAR_BRANDS, CAR_MODELS } from "../api/appointments/data";

export interface CallbackPayload {
  firstName: string;
  surname: string;
  contactNumber: string;
  email: string;
  carModel: string;
  serviceType: string;
  bookingDate: string;
  bookingTime: string;
  description?: string;
}

export default function BookAppointment() {
  const [form, setForm] = useState<Omit<CallbackPayload, 'description'> & { description: string } & { carBrand: string }>({
    firstName: "",
    surname: "",
    contactNumber: "",
    email: "",
    carModel: "",
    carBrand: "",
    serviceType: "",
    bookingDate: "",
    bookingTime: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const models = form.carBrand ? CAR_MODELS[form.carBrand] || [] : [];

  useEffect(() => {
    setForm(prev => ({ ...prev, carModel: '' }));
  }, [form.carBrand]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine brand and model for API
    const payload = {
      ...form,
      carModel: `${form.carBrand} ${form.carModel}`.trim()
    };
    const validation = validateAppointment(payload);
    if (!validation.valid) {
      setMsg(validation.errors.join(" "));
      return;
    }

    const API = import.meta.env.VITE_API_URL;

    try {
      setIsSubmitting(true);
      setMsg(null);
      
      const res = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to book appointment");
      }
      
      setMsg(" Appointment pending!");
      setIsSuccess(true);
      setForm({
        firstName: "",
        surname: "",
        contactNumber: "",
        email: "",
        carModel: "",
        carBrand: "",
        serviceType: "",
        bookingDate: "",
        bookingTime: "",
        description: "",
      });
    } catch (err: unknown) {
      console.error("Booking error:", err);
      const message = err instanceof Error ? err.message : "Failed to connect to server";
      setMsg(" Error: " + message);
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="callback-form-wrapper">
      <div className="header-accent"></div>
      <div className="form-header">
        <h2 className="title">Schedule Your Service</h2>
        <p className="subtitle">Quick and easy appointment booking</p>
      </div>

      <form onSubmit={handleSubmit} className="callback-form">
        <div className="form-section">
          <h3 className="section-title">Contact Information</h3>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="surname">Surname *</label>
              <input
                id="surname"
                type="text"
                name="surname"
                placeholder="Surname"
                value={form.surname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactNumber">Phone Number *</label>
              <input
                id="contactNumber"
                type="tel"
                name="contactNumber"
                placeholder="(+63)912 345 6789"
                value={form.contactNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          </div>
          
        </div>
        <div className="form-section">
          <h3 className="section-title">Vehicle & Service Details</h3>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label htmlFor="carBrand">Car Brand *</label>
              <select
                id="carBrand"
                name="carBrand"
                value={form.carBrand}
                onChange={handleChange}
                required
                className="service-select"
              >
                <option value="">Select brand...</option>
                {CAR_BRANDS.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="carModel">Car Model *</label>
              <select
                id="carModel"
                name="carModel"
                value={form.carModel}
                onChange={handleChange}
                className="service-select"
                disabled={!form.carBrand}
                required
              >
                <option value="">
                  {form.carBrand ? "Select model..." : "Select brand first..."}
                </option>
                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="serviceType">Service Type *</label>
              <select
                id="serviceType"
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                required
                className="service-select"
              >
                <option value="">Select a service...</option>
                <option value="oil-change">Oil Change</option>
                <option value="pms">PMS</option>
                <option value="aircon-servicing">Aircon Servicing</option>
                <option value="electrical-and-electronics">Electrical and Electronics</option>
                <option value="underchassis">Underchassis</option>
                <option value="key-programming">Key Programming</option>
                <option value="scanning-diagnosing">Scanning/Diagnosing</option>
                <option value="tire-services">Tire Services</option>
                <option value="engine-tune-up">Engine Tune-Up</option>
                <option value="body-works-and-paint-job">Body Works and Paint Job</option>
                <option value="under-coating">Under Coating</option>
                <option value="disc-drum-brake-lathe-machine-service">Disc/Drum Brake Lathe Machine Service</option>
                <option value="wheel-alignment">Wheel Alignment</option>
                <option value="wheel-balancing">Wheel Balancing</option>
                <option value="suspension">Suspension</option>
                <option value="egr-cleaning">EGR Cleaning</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Appointment Details</h3>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label htmlFor="bookingDate">Preferred Date *</label>
              <input
                id="bookingDate"
                type="date"
                name="bookingDate"
                value={form.bookingDate}
                onChange={handleChange}
                required
              />
            </div>
<div className="form-group">
              <label htmlFor="bookingTime">Preferred Time Slot *</label>
              <select
                id="bookingTime"
                name="bookingTime"
                value={form.bookingTime}
                onChange={handleChange}
                required
                className="service-select"
              >
                <option value="">Select preferred time...</option>
                <option value="08:00AM">08:00 AM</option>
                <option value="09:00AM">09:00 AM</option>
                <option value="10:00AM">10:00 AM</option>
                <option value="11:00AM">11:00 AM</option>
                <option value="12:00PM">12:00 PM</option>
                <option value="01:00PM">01:00 PM</option>
                <option value="02:00PM">02:00 PM</option>
                <option value="03:00PM">03:00 PM</option>
                <option value="04:00PM">04:00 PM</option>
              </select>
            </div>

            
          </div>
          <div className="form-group full-width">
            <label htmlFor="description">Additional Details</label>
            <textarea
              id="description"
              name="description"
              placeholder="Tell us more about your service request or any special requirements..."
              value={form.description ?? ""}
              onChange={handleChange}
              rows={4}
              className="description-input"
            />
          </div>

{msg && (
            <div className={`message ${isSuccess ? "success" : "error"}`}>
              {msg}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
        >
          <span>{isSubmitting ? "Booking..." : "Book Appointment"}</span>
          {!isSubmitting && <span className="button-icon">→</span>}
        </button>
      </form>
    </div>
  );
}
