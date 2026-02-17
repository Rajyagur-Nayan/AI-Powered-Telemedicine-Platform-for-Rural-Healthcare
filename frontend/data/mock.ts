import {
  User,
  Doctor,
  Appointment,
  Medicine,
  MedicalRecord,
  Prediction,
} from "../types";

export const currentUser: User = {
  id: "u1",
  name: "Rajesh Kumar",
  email: "rajesh.kumar@example.com",
  role: "patient",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
};

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Amit Sharma",
    specialization: "General Physician",
    hospital: "City General Hospital",
    rating: 4.8,
    experience: 12,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
    availability: ["Mon", "Tue", "Wed", "Fri"],
  },
  {
    id: "d2",
    name: "Dr. Neha Patel",
    specialization: "Cardiologist",
    hospital: "Heart Care Center",
    rating: 4.9,
    experience: 15,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
    availability: ["Tue", "Thu", "Sat"],
  },
  {
    id: "d3",
    name: "Dr. Rakesh Verma",
    specialization: "Neurologist",
    hospital: "Neuro Life Institute",
    rating: 4.7,
    experience: 20,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rakesh",
    availability: ["Mon", "Wed", "Fri"],
  },
];

export const appointments: Appointment[] = [
  {
    id: "a1",
    patientId: "u1",
    doctorId: "d1",
    doctorName: "Dr. Amit Sharma",
    specialization: "General Physician",
    date: "2023-10-25",
    time: "10:00 AM",
    status: "upcoming",
    type: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "a2",
    patientId: "u1",
    doctorId: "d2",
    doctorName: "Dr. Neha Patel",
    specialization: "Cardiologist",
    date: "2023-10-20",
    time: "04:00 PM",
    status: "completed",
    type: "in-person",
  },
];

export const medicines: Medicine[] = [
  {
    id: "m1",
    patientId: "u1",
    name: "Paracetamol",
    dosage: "500mg",
    frequency: "Twice a day",
    times: ["09:00", "21:00"],
    startDate: "2023-10-24",
    status: "active",
    takenHistory: [
      { date: "2023-10-24", taken: true },
      { date: "2023-10-25", taken: false },
    ],
  },
  {
    id: "m2",
    patientId: "u1",
    name: "Amoxicillin",
    dosage: "250mg",
    frequency: "Thrice a day",
    times: ["09:00", "14:00", "21:00"],
    startDate: "2023-10-24",
    endDate: "2023-10-29",
    status: "active",
    takenHistory: [],
  },
];

export const medicalRecords: MedicalRecord[] = [
  {
    id: "r1",
    patientId: "u1",
    date: "2023-09-15",
    diagnosis: "Seasonal Flu",
    doctorName: "Dr. Amit Sharma",
    hospitalName: "City General Hospital",
    reportUrl: "#",
  },
  {
    id: "r2",
    patientId: "u1",
    date: "2023-05-10",
    diagnosis: "Mild Hypertension",
    doctorName: "Dr. Neha Patel",
    hospitalName: "Heart Care Center",
    prescriptionUrl: "#",
  },
];

export const recentPredictions: Prediction[] = [
  {
    id: "p1",
    date: "2023-10-24",
    symptoms: ["Fever", "Headache", "Fatigue"],
    disease: "Viral Fever",
    confidence: 82,
    riskLevel: "medium",
    recommendations: ["Rest", "Hydration", "Consult Doctor if fever persists"],
  },
];
