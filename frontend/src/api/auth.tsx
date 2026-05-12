import axios from 'axios';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    username: string;
    role: 'admin' | 'user';
  };
}

const API = import.meta.env.VITE_API_URL;

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axios.post(`${API}/auth/login`, credentials);
  return response.data;
};

export const setAuthToken = (token: string) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  delete axios.defaults.headers.common['Authorization'];
};

export interface RegisterCredentials {
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export type RegisterResponse = LoginResponse;

export const register = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
  const response = await axios.post(`${API}/auth/register`, credentials);
  return response.data;
};


