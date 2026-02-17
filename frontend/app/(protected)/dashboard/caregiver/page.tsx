import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HeartPulse, Pill, Phone } from "lucide-react";

export default function CaregiverDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Caregiver Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitoring: Rajesh Kumar (Father)
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-red-50 border-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Emergency Contact
            </CardTitle>
            <Phone className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              Dr. Amit Sharma
            </div>
            <Button variant="destructive" size="sm" className="mt-2 w-full">
              Call Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Medicine Adherence
            </CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92%</div>
            <p className="text-xs text-muted-foreground">
              Last missed: 2 days ago
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vitals</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Normal</div>
            <p className="text-xs text-muted-foreground">Heart Rate: 72 bpm</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-6">Medicine Timeline (Today)</h2>
      <Card>
        <CardContent className="pt-6">
          <div className="relative border-l border-gray-200 ml-3 space-y-8">
            <div className="mb-8 ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 ring-8 ring-white">
                <div className="h-2 w-2 rounded-full bg-green-600"></div>
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900">
                Morning Dose - Taken
              </h3>
              <time className="mb-2 block text-sm font-normal leading-none text-gray-400">
                09:00 AM
              </time>
              <p className="text-base font-normal text-gray-500">
                Paracetamol 500mg, Amoxicillin 250mg
              </p>
            </div>
            <div className="mb-8 ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
                <div className="h-2 w-2 rounded-full bg-gray-400"></div>
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900">
                Afternoon Dose - Pending
              </h3>
              <time className="mb-2 block text-sm font-normal leading-none text-gray-400">
                02:00 PM
              </time>
              <p className="text-base font-normal text-gray-500">
                Amoxicillin 250mg
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
