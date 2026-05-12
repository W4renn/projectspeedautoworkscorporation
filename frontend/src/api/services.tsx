import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export interface Service {
  _id?: string;
  title: string;
  description: string;
  imgURL: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getServices = async (): Promise<Service[]> => {
  const res = await axios.get(`${API}/services`);
  return res.data;
};

export const createService = async (formData: FormData): Promise<{ message: string; id: string }> => {
  const res = await axios.post(`${API}/services`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateService = async (id: string, formData: FormData): Promise<Service> => {
  const res = await axios.put(`${API}/services/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteService = async (id: string): Promise<{ message: string }> => {
  const res = await axios.delete(`${API}/services/${id}`);
  return res.data;
};

