import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export interface Testimonial {
  _id?: string;
  name: string;
  message: string;
  rating?: number;
  imgURL?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const res = await axios.get(`${API}/testimonials`);
  return res.data;
};

export const createTestimonial = async (
  formData: FormData
): Promise<{ message: string; id: string }> => {
  const res = await axios.post(`${API}/testimonials`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateTestimonial = async (
  id: string,
  formData: FormData
): Promise<Testimonial> => {
  const res = await axios.put(`${API}/testimonials/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteTestimonial = async (
  id: string
): Promise<{ message: string }> => {
  const res = await axios.delete(`${API}/testimonials/${id}`);
  return res.data;
};
