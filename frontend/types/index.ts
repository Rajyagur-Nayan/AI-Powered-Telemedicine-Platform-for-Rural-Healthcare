export type Role = "patient" | "doctor" | "caregiver";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  rating: number;
  experience: number; // years
  image: string;
  availability: string[]; // e.g., ["Mon", "Wed", "Fri"]
}

export interface Appointment {
  day: string;
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string; // ISO string
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  type: "online" | "in-person";
  meetingLink?: string;
}

export interface Medicine {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string; // e.g., "Daily", "Twice a day"
  times: string[]; // e.g., ["08:00", "20:00"]
  startDate: string;
  endDate?: string;
  status: "active" | "completed";
  takenHistory: { date: string; taken: boolean }[];
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  doctorName: string;
  hospitalName: string;
  prescriptionUrl?: string;
  reportUrl?: string;
}

export interface Symptom {
  id: string;
  name: string;
}

export interface Prediction {
  id: string;
  date: string;
  symptoms: string[];
  disease: string;
  confidence: number;
  riskLevel: "low" | "medium" | "high";
  recommendations: string[];
}
