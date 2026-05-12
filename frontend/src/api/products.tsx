import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export interface Product {
  _id?: string;
  title: string;
  description: string;
  imgURL: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const res = await axios.get(`${API}/products`);
  return res.data;
};

export const createProduct = async (product: Omit<Product, "_id">): Promise<{ message: string; id: string }> => {
  const res = await axios.post(`${API}/products`, product);
  return res.data;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  const res = await axios.put(`${API}/products/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const res = await axios.delete(`${API}/products/${id}`);
  return res.data;
};

