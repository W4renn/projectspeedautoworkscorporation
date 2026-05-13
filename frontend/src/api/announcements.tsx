import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export interface Announcement {
  _id?: string;
  title: string;
  message: string;
  priority?: "low" | "medium" | "high";
  imgURL?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const res = await axios.get(`${API}/announcements`);
  return res.data;
};

export const createAnnouncement = async (
  formData: FormData
): Promise<{ message: string; id: string }> => {
  const res = await axios.post(`${API}/announcements`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateAnnouncement = async (
  id: string,
  formData: FormData
): Promise<Announcement> => {
  const res = await axios.put(`${API}/announcements/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteAnnouncement = async (
  id: string
): Promise<{ message: string }> => {
  const res = await axios.delete(`${API}/announcements/${id}`);
  return res.data;
};
