"use client";

import { useEffect, useState } from "react";
import {
  appointments as mockAppointments,
  recentPredictions,
  medicines,
} from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Activity, Calendar, Pill, Video, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { userApi, appointmentApi, medicineApi } from "@/lib/api";

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointmentsList, setAppointmentsList] = useState<any[]>([]);
  const [medicinesList, setMedicinesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [incomingCall, setIncomingCall] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Profile
        try {
          const { data } = await userApi.getProfile();
          setUser(data);
        } catch (err) {
          console.error("Failed to fetch profile", err);
          setUser({ name: "Demo User" });
        }

        // Fetch Appointments
        try {
          const { data } = await appointmentApi.list();
          // Filter for upcoming or use all for now
          // If empty, we might want to use mock data for demo purposes if the user specifically asked
          // but usually empty means empty. However, user said "if route missing... use dummy".
          // So if success, use real data.
          // Map backend data to UI format if needed
          const formattedAppointments = data.map((appt: any) => ({
            id: appt.id,
            doctorName: appt.doctor?.user?.name || "Unknown Doctor",
            date: appt.dateTime, // Ensure backend sends ISO string
            time: new Date(appt.dateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            type: "online", // Default or derive from data
            status:
              new Date(appt.dateTime) > new Date() ? "upcoming" : "completed",
            day: new Date(appt.dateTime).getDate(),
          }));
          setAppointmentsList(
            formattedAppointments.length > 0
              ? formattedAppointments
              : mockAppointments,
          );
        } catch (err) {
          console.error("Failed to fetch appointments", err);
          setAppointmentsList(mockAppointments);
        }

        // Fetch Medicines
        try {
          const { data } = await medicineApi.list();
          const formattedMedicines = data.map((med: any) => ({
            id: med.id,
            name: med.medicineName,
            dosage: med.dosage,
            frequency:
              (med.isMorning ? "Morning " : "") +
              (med.isEvening ? "Evening" : ""),
            status: "active", // Default
          }));
          setMedicinesList(
            formattedMedicines.length > 0 ? formattedMedicines : medicines,
          );
        } catch (err) {
          console.error("Failed to fetch medicines", err);
          setMedicinesList(medicines);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // Simulate incoming call
    const timer = setTimeout(() => {
      setIncomingCall(true);
    }, 5000); // 5s delay

    return () => clearTimeout(timer);
  }, []);

  const nextAppointment = appointmentsList.find((a) => a.status === "upcoming");
  const activeMedicines = medicinesList.filter((m) => m.status === "active");
  const latestPrediction = recentPredictions[0];

  if (loading)
    return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6 relative">
      {/* Incoming Call Overlay/Alert */}
      {incomingCall && (
        <div className="bg-slate-900/90 text-white p-4 rounded-xl flex items-center justify-between shadow-2xl animate-in slide-in-from-top-4 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></span>
              <div className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center relative z-10 border-2 border-green-500">
                <Video className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg">
                Dr. Amit Sharma is calling...
              </h3>
              <p className="text-slate-400 text-sm">
                Incoming Video Consultation
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={() => setIncomingCall(false)}
            >
              Decline
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white gap-2 animate-pulse"
              onClick={() => router.push("/counseling/video/patient")}
            >
              <Phone className="h-4 w-4" /> Accept
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Hello, {user?.name} 👋
          </h1>
          <p className="text-muted-foreground">
            Here is your health overview for today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/symptoms">
            <Button className="gap-2">
              <Activity className="h-4 w-4" /> Check Symptoms
            </Button>
          </Link>
          <Link href="/appointments">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" /> Book Doctor
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Next Appointment Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Next Appointment
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {nextAppointment.day || "Today"}
                </div>
                <div className="text-xl font-bold">
                  {new Date(nextAppointment.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {nextAppointment.time} with {nextAppointment.doctorName}
                </p>
                <div className="flex gap-2 items-center mt-2">
                  <Badge variant="default">{nextAppointment.type}</Badge>
                  {nextAppointment.type === "online" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs text-primary"
                      onClick={() => router.push("/counseling/video/patient")}
                    >
                      Join Now
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No upcoming appointments
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Status / Prediction Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Latest Health Check
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {latestPrediction ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {latestPrediction.disease}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      latestPrediction.riskLevel === "high"
                        ? "destructive"
                        : latestPrediction.riskLevel === "medium"
                          ? "warning"
                          : "success"
                    }
                  >
                    {latestPrediction.riskLevel.toUpperCase()} RISK
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Confidence: {latestPrediction.confidence}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommendation: {latestPrediction.recommendations[0]}
                </p>
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No recent checks
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Medicines Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Medicines
            </CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeMedicines.length} Active
            </div>
            <p className="text-xs text-muted-foreground">
              {activeMedicines.length > 0
                ? "Next dose at 2:00 PM"
                : "No active prescriptions"}
            </p>
            <div className="mt-4 space-y-2">
              {activeMedicines.slice(0, 2).map((med, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{med.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {med.frequency}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Appointment booked</p>
                  <p className="text-xs text-muted-foreground">
                    Dr. Amit Sharma • Oct 24
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <Pill className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Medicine Taken</p>
                  <p className="text-xs text-muted-foreground">
                    Paracetamol • 9:00 AM
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
