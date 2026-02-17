"use client";

import { useState } from "react";
import { doctors } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Clock, MapPin, Star } from "lucide-react";

export default function AppointmentsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [booked, setBooked] = useState(false);

  const handleBook = () => {
    if (!selectedDoctor || !date) return;
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Book an Appointment
          </h1>
          <p className="text-muted-foreground">
            Find the right doctor and schedule a visit.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <Card
            key={doctor.id}
            className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary ${selectedDoctor === doctor.id ? "ring-2 ring-primary bg-blue-50/30" : ""}`}
            onClick={() => setSelectedDoctor(doctor.id)}
          >
            <CardHeader className="flex flex-row gap-4 items-start">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-12 h-12 rounded-full bg-slate-200"
              />
              <div>
                <CardTitle className="text-lg">{doctor.name}</CardTitle>
                <div className="text-sm text-primary font-medium">
                  {doctor.specialization}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {doctor.hospital}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />{" "}
                {doctor.rating} ({doctor.experience} years exp)
              </div>

              <div className="pt-2">
                <div className="text-xs font-semibold mb-2 uppercase text-muted-foreground">
                  Available On
                </div>
                <div className="flex gap-2 flex-wrap">
                  {doctor.availability.map((day) => (
                    <Badge key={day} variant="secondary" className="text-xs">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedDoctor === doctor.id && (
                <div className="mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-medium mb-1.5 block">
                    Select Date
                  </label>
                  <Input
                    type="date"
                    className="bg-white mb-3"
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBook();
                    }}
                    disabled={booked}
                  >
                    {booked ? "Request Sent!" : "Confirm Booking"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
