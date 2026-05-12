
export interface Appointment {
  id?: number;
  firstName: string;
  surname: string;
  contactNumber: string;
  email: string;
  carModel: string;
  serviceType: string;
  bookingDate: string;
  bookingTime: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

export type AppointmentStatus = "pending" | "approved" | "rejected";

export const SERVICE_TYPES = {
  "oil-change": "Oil Change",
  "tire-replacement": "Tire Replacement",
  "brake-service": "Brake Service",
  "engine-repair": "Engine Repair",
  "battery-replacement": "Battery Replacement",
  "car-detailing": "Car Detailing",
  "air-conditioner": "Air Conditioner Service",
  "general-maintenance": "General Maintenance",
  other: "Other",
} as const;

export const APPOINTMENT_STATUSES: Record<AppointmentStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: "#FFA500",
  approved: "#4CAF50",
  rejected: "#F44336",
};

export const INITIAL_APPOINTMENT: Appointment = {
  firstName: "",
  surname: "",
  contactNumber: "",
  email: "",
  carModel: "",
  serviceType: "",
  bookingDate: "",
  bookingTime: "",
  description: "",
  status: "pending",
};

export const validateAppointment = (appointment: Partial<Appointment>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!appointment.firstName?.trim()) errors.push("First name is required.");
  if (!appointment.surname?.trim()) errors.push("Surname is required.");
  if (!appointment.contactNumber?.trim()) errors.push("Contact number is required.");
  if (!appointment.email?.trim()) errors.push("Email is required.");
  if (!appointment.carModel?.trim()) errors.push("Car model is required.");
  if (!appointment.serviceType?.trim()) errors.push("Service type is required.");
  if (!appointment.bookingDate?.trim()) errors.push("Booking date is required.");
  if (!appointment.bookingTime?.trim()) errors.push("Booking time is required.");

  
  if (appointment.contactNumber && !/^\d{11,}$/.test(appointment.contactNumber.replace(/\D/g, ""))) {
    errors.push("Contact number must be at least 11 digits.");
  }

  if (appointment.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appointment.email)) {
    errors.push("Please enter a valid email address.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const CAR_BRANDS = [
  "Toyota",
  "Honda",
  "Ford",
  "Hyundai",
  "Nissan",
  "Mitsubishi",
  "Isuzu",
  "Kia",
  "Mazda",
  "Suzuki",
  "Chevrolet",
  "BMW",
  "Mercedes-Benz",
  "Volkswagen",
  "Audi"
] as const;

export const CAR_MODELS: Record<string, string[]> = {
  "Toyota": ["Vios", "Innova", "Avanza", "Corolla", "Hilux", "Fortuner", "Land Cruiser", "Wigo", "Rush", "Camry"],
  "Honda": ["Civic", "City", "Accord", "CR-V", "Jazz", "HR-V"],
  "Ford": ["Ranger", "Everest", "Territory", "Focus", "EcoSport"],
  "Hyundai": ["Tucson", "Santa Fe", "Accent", "Sonata", "Starex", "Creta"],
  "Nissan": ["Navara", "Patrol", "Urvan", "Sylphy", "Almera"],
  "Mitsubishi": ["Montero", "Strada", "Xpander", "L300", "Outlander"],
  "Isuzu": ["D-Max", "Crosswind", "MU-X"],
  "Kia": ["Sportage", "Sorento", "Picanto", "Rio", "Seltos"],
  "Mazda": ["CX-5", "BT-50", "Mazda3", "Mazda6"],
  "Suzuki": ["Swift", "Jimny", "S-Presso", "Ertiga"],
  "Chevrolet": ["Colorado", "Trailblazer"],
  "BMW": ["3 Series", "5 Series", "X3", "X5"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLA"],
  "Volkswagen": ["T-Cross", "Tiguan", "Teramont"],
  "Audi": ["A4", "A6", "Q5", "Q7"],
};

export const formatAppointmentDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};



