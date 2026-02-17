import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // Backend URL
  withCredentials: true, // Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a response interceptor to handle errors globally if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can handle 401 (Unauthorized) here by redirecting to login
    if (error.response && error.response.status === 401) {
      // Create a custom event so UI can react (e.g., clear logs, redirect)
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (data: any) => api.post("/auth/login", data),
  register: (data: any) => api.post("/auth/register", data),
  logout: () => {
    // Backend doesn't have a logout endpoint yet that clears cookies,
    // but we can clear local state/localStorage.
    // Ideally backend should have /auth/logout
    localStorage.removeItem("userRole");
    // If backend implements logout: return api.post("/auth/logout");
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

export const medicineApi = {
  schedule: (data: any) => api.post("/medicine/schedule", data),
  list: () => api.get("/medicine/schedule"),
  log: (data: any) => api.post("/medicine/log", data),
};

export const medicalRecordApi = {
  create: (data: FormData) =>
    api.post("/medical-records", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  list: (patientId?: number) =>
    api.get("/medical-records", { params: { patientId } }),
};

export const notificationApi = {
  list: () => api.get("/notifications"),
  markRead: (id: number) => api.put(`/notifications/${id}/read`),
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
