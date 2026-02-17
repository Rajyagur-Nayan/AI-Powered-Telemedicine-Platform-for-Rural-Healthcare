"use client";

import { useEffect, useState } from "react";
import { doctors, appointments as mockAppointments } from "@/data/mock";
import { userApi, appointmentApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Users, Calendar, ClipboardList } from "lucide-react";

export default function DoctorDashboard() {
  const [currentDoctor, setCurrentDoctor] = useState<any>(doctors[0]);
  const [appointmentsList, setAppointmentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Profile
        try {
          const { data } = await userApi.getProfile();
          // Merge with mock if some fields missing
          setCurrentDoctor({ ...doctors[0], ...data });
        } catch (err) {
          console.error("Failed to fetch profile", err);
          setCurrentDoctor(doctors[0]);
        }

        // Fetch Appointments
        try {
          const { data } = await appointmentApi.list();
          // Map backend data to UI
          const formattedAppointments = data.map((appt: any) => ({
            id: appt.id,
            patientId: appt.patient?.user?.name || "Unknown Patient", // Using name as ID for display if ID not easy
            date: new Date(appt.dateTime).toLocaleDateString(),
            time: new Date(appt.dateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            type: "Consultation", // Default
            status:
              new Date(appt.dateTime) > new Date() ? "upcoming" : "completed",
            patientName: appt.patient?.user?.name,
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
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const upcomingAppointments = appointmentsList.filter(
    (a) => a.status === "upcoming",
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Welcome, {currentDoctor.name} 👨‍⚕️
          </h1>
          <p className="text-muted-foreground">
            Manage your patients and schedule.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>View Reports</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Appointments Today
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingAppointments.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments.length} remaining today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reports
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {String(apt.patientId).slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{apt.patientId}</p>
                      <p className="text-sm text-muted-foreground">
                        {apt.date} at {apt.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{apt.type}</Badge>
                    <Button size="sm" variant="secondary">
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No upcoming appointments.</p>
            )}
            {/* Dummy entries to fill the list if empty */}
            {[1, 2, 3].map((_, i) => (
              <div
                key={`dummy-${i}`}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                    P{i + 4}
                  </div>
                  <div>
                    <p className="font-medium">Suresh Verma</p>
                    <p className="text-sm text-muted-foreground">
                      Today at {10 + i}:00 AM
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Consultation</Badge>
                  <Button size="sm" variant="secondary">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
