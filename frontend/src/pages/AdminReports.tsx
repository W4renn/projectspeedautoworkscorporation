import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/Authcontext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { Link } from "react-router-dom";
import "./AdminReports.css";

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
  formattedCreatedAt?: string;
  formattedUpdatedAt?: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface ServiceTypeData {
  name: string;
  value: number;
}

interface DailyTrendData {
  date: string;
  bookings: number;
}

const STATUS_COLOR_MAP: Record<string, string> = {
  Pending: "#555555",
  Approved: "#28a745",
  Rejected: "#dc3545",
};

const SERVICE_COLORS = ["#0243a1", "#E65100", "#28a745", "#dc3545", "#ffc107", "#6f42c1", "#17a2b8", "#fd7e14"];

const API = import.meta.env.VITE_API_URL;

export default function AdminReports() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [serviceTypeData, setServiceTypeData] = useState<ServiceTypeData[]>([]);
  const [dailyTrends, setDailyTrends] = useState<DailyTrendData[]>([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const customerNameFallback = (apt: Appointment) => {
    return apt.customerName || `${apt.firstName || ''} ${apt.surname || ''}`.trim() || 'Unknown';
  };

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (statusFilter !== "all") params.status = statusFilter;
      if (serviceTypeFilter !== "all") params.serviceType = serviceTypeFilter;

      const chartParams: any = {
        startDate,
        endDate,
      };

      if (statusFilter !== "all") {
        chartParams.status = statusFilter;
      }

      if (serviceTypeFilter !== "all") {
        chartParams.serviceType = serviceTypeFilter;
      }

      const [appointmentsRes, summaryRes, serviceTypesRes, trendsRes] = await Promise.all([
        axios.get(`${API}/reports/appointments`, { params }),
        axios.get(`${API}/reports/summary`, { params }),
        axios.get(`${API}/reports/service-types`, { params: chartParams }),
        axios.get(`${API}/reports/daily-trends`, { params: chartParams }),
      ]);
      
      setAppointments(appointmentsRes.data || []);
      setStats(summaryRes.data || { total: 0, pending: 0, approved: 0, rejected: 0 });
      setServiceTypeData(serviceTypesRes.data || []);
      setDailyTrends(trendsRes.data || []);
    } catch (err: any) {
      console.error("Error fetching report data:", err);
      setError(`Failed to load report data: ${err.response?.data?.error || err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const res = await axios.get(`${API}/services`);
      const types = res.data.map((s: any) => s.title);
      setServiceTypes(types);
    } catch (err) {
      console.error("Failed to load service types:", err);
    }
  };

  useEffect(() => {
    fetchServiceTypes();
    fetchReportData();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReportData();
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
    setServiceTypeFilter("all");
    setTimeout(() => fetchReportData(), 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const statusPieData = [
    { name: "Pending", value: stats.pending },
    { name: "Approved", value: stats.approved },
    { name: "Rejected", value: stats.rejected },
  ].filter(d => d.value > 0);

  return (
    <div className="admin-dashboard admin-reports">
      {/* Admin Header with Menu Bar */}
      <div className="admin-menu-bar">
        <div className="admin-menu-left">
          <h2>Admin Reports</h2>
        </div>
        <div className="admin-menu-right">
          <Link to="/admin" className="back-to-dashboard-btn">
            Back to Dashboard
          </Link>
          <button className="print-btn" onClick={handlePrint}>
            Print Report
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h1>Booking Reports</h1>
          <p>Generate and filter detailed booking reports</p>
        </div>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => { setError(null); fetchReportData(); }}>
              Retry
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="appointments-section filter-section">
          <h3>Filter Reports</h3>
          <form onSubmit={handleFilter} className="report-filter-form">
            <div className="filter-row">
              <div className="filter-group">
                <label>From Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>To Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Status:</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              {/* <div className="filter-group">
                <label>Service Type:</label>
                <select value={serviceTypeFilter} onChange={(e) => setServiceTypeFilter(e.target.value)}>
                  <option value="all">All Services</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type.toLowerCase()}>
                      {type}
                    </option>
                  ))}
                </select>
              </div> */}
              <div className="filter-actions">
                <button type="submit" className="apply-filter-btn" disabled={loading}>
                  {loading ? 'Loading...' : 'Apply Filters'}
                </button>
                <button type="button" className="clear-filter-btn" onClick={handleClear}>
                  Clear
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Summary Stats */}
        <div className="appointments-section stats-section">
          <h3>Summary</h3>
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
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Status Pie Chart */}
          <div className="appointments-section chart-section">
            <h3>Bookings by Status</h3>
            {statusPieData.length === 0 ? (
              <p className="no-appointments">No data available</p>
            ) : (
              <div className="pie-chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusPieData}
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
                      {statusPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STATUS_COLOR_MAP[entry.name] || "#999"}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} bookings`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Service Type Bar Chart */}
          <div className="appointments-section chart-section">
            <h3>Bookings by Service Type</h3>
            {serviceTypeData.length === 0 ? (
              <p className="no-appointments">No data available</p>
            ) : (
              <div className="bar-chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serviceTypeData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value) => [`${value} bookings`, "Count"]} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {serviceTypeData.map((_, index) => (
                        <Cell key={`bar-cell-${index}`} fill={SERVICE_COLORS[index % SERVICE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Daily Trends Line Chart */}
        <div className="appointments-section chart-section">
          <h3>Daily Booking Trends</h3>
          {dailyTrends.length === 0 ? (
            <p className="no-appointments">No data available</p>
          ) : (
            <div className="line-chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={dailyTrends} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} bookings`, "Bookings"]} />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="#0243a1" strokeWidth={3} dot={{ r: 4, fill: "#E65100" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Appointments Table */}
        <div className="appointments-section">
          <h3>Booking Details ({appointments.length})</h3>
          {appointments.length === 0 ? (
            <p className="no-appointments">No bookings match the selected filters</p>
          ) : (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Car Model</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Contact</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id} className={`status-${apt.status}`}>
                      <td>{customerNameFallback(apt)}</td>
                      <td>{apt.carModel}</td>
                      <td>{apt.serviceType}</td>
                      <td>{apt.bookingDate}</td>
                      <td>{apt.bookingTime}</td>
                      <td>{apt.contactNumber}</td>
                      <td>{apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Report Footer */}
        <div className="report-footer">
          <p>Report generated by {user?.username} on {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
