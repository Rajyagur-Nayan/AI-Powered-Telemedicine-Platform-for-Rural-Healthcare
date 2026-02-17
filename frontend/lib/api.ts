import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
  withCredentials: true, // Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = {
  login: (data: any) => api.post("/auth/login", data),
  register: (data: any) => api.post("/auth/register", data),
  logout: () => {
    // Backend doesn't have a logout endpoint yet that clears cookies,
    // but we can clear local state/localStorage.
    // Ideally backend should have /auth/logout
    localStorage.removeItem("userRole");
  },
};

export const userApi = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: any) => api.put("/users/profile", data),
  getDoctors: () => api.get("/users/doctors"),
};

export const appointmentApi = {
  book: (data: { doctorId: number; dateTime: string; notes?: string }) =>
    api.post("/appointments", data),
  list: () => api.get("/appointments"),
  updateStatus: (id: number, status: string) =>
    api.put(`/appointments/${id}/status`, { status }),
};

export const prescriptionApi = {
  list: () => api.get("/prescriptions"),
  create: (data: any) => api.post("/prescriptions", data),
};

// Types for API responses (can be moved to types/index.ts later)
export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export default api;
