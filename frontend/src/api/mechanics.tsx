import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export interface Mechanic {
  _id?: string;
  name: string;
  role: string;
  imgURL: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getMechanics = async (): Promise<Mechanic[]> => {
  const res = await axios.get(`${API}/mechanics`);
  return res.data;
};

export const createMechanic = async (formData: FormData): Promise<{ message: string; id: string }> => {
  const res = await axios.post(`${API}/mechanics`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateMechanic = async (id: string, formData: FormData): Promise<Mechanic> => {
  const res = await axios.put(`${API}/mechanics/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteMechanic = async (id: string): Promise<{ message: string }> => {
  const res = await axios.delete(`${API}/mechanics/${id}`);
  return res.data;
};

