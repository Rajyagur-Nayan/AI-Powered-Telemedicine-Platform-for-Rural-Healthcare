import { doctors, appointments } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Users, Calendar, ClipboardList } from "lucide-react";

export default function DoctorDashboard() {
  const currentDoctor = doctors[0]; // Simulation
  const upcomingAppointments = appointments.filter(
    (a) => a.doctorId === currentDoctor.id && a.status === "upcoming",
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 remaining</p>
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
                      {apt.patientId.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">Patient ID: {apt.patientId}</p>
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
