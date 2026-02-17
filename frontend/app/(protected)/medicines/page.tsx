"use client";

import { useState, useEffect } from "react";
import { prescriptionApi } from "@/lib/api"; // Import API
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Check,
  Clock,
  Plus,
  Trash2,
  Pill,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function MedicinesPage() {
  const [meds, setMeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMedName, setNewMedName] = useState(""); // Kept for UI but backend might handle creation differently

  useEffect(() => {
    async function fetchMedicines() {
      try {
        const { data } = await prescriptionApi.list();
        // Backend returns prescriptions, which contain medicines.
        // We need to flatten this if the UI expects a list of medicines.
        // Assuming data structure: [{ id, medicines: [{name, dosage...}], ... }]
        // Or if backend returns simple list.
        // For now, let's assume we map prescription items or just show them.

        // Mocking the mapping since I don't know exact backend shape of 'medicines' field in prescription
        // If 'medicines' is a JSON field in Postgres/Prisma:
        const allMeds: any[] = [];
        data.forEach((p: any) => {
          if (Array.isArray(p.medicines)) {
            p.medicines.forEach((m: any) => {
              allMeds.push({
                ...m,
                prescriptionId: p.id,
                prescribedBy: p.doctor?.name || "Unknown Doctor",
                startDate: p.createdAt
                  ? p.createdAt.split("T")[0]
                  : new Date().toISOString().split("T")[0],
                status: "active", // default
                id: Math.random().toString(), // temp id if not present
              });
            });
          }
        });

        // If no meds found from backend yet, maybe show empty or keep mock?
        // Let's show empty for real integration.
        setMeds(allMeds);
      } catch (err) {
        console.error("Failed to fetch prescriptions", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMedicines();
  }, []);

  const addMed = () => {
    // This would ideally call API to create a self-prescription or note
    // For now, just update local state
    if (!newMedName) return;
    const newMed = {
      id: Math.random().toString(),
      patientId: "u1", // placeholder
      name: newMedName,
      dosage: "Tablet",
      frequency: "Daily",
      times: ["09:00"],
      startDate: new Date().toISOString().split("T")[0],
      status: "active" as const,
      prescribedBy: "Self",
      takenHistory: [],
    };
    setMeds([...meds, newMed]);
    setNewMedName("");
  };

  const toggleStatus = (id: string) => {
    // Local toggle for now
    setMeds((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "completed" : "active" }
          : m,
      ),
    );
  };

  if (loading) return <div>Loading medicines...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Medicine Cabinet
          </h1>
          <p className="text-muted-foreground">
            Track your prescriptions and daily intake.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Medicine name..."
            value={newMedName}
            onChange={(e) => setNewMedName(e.target.value)}
            className="w-[200px]"
          />
          <Button onClick={addMed}>
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {meds.map((med) => (
          <Card key={med.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="bg-blue-50 p-6 flex flex-col justify-center items-center w-full md:w-48 border-r border-blue-100">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                  <Pill className="h-8 w-8 text-primary" />
                </div>
                <Badge
                  variant={med.status === "active" ? "default" : "secondary"}
                >
                  {med.status ? med.status.toUpperCase() : "ACTIVE"}
                </Badge>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {med.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage || "Tablet"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" /> {med.frequency || "Daily"}
                      </Badge>
                      {med.status === "active" && (
                        <Badge variant="warning" className="gap-1">
                          <AlertCircle className="h-3 w-3" /> Due Soon
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700 block">
                        Prescribed By:
                      </span>
                      {med.prescribedBy || "Doctor"}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 block">
                        Start Date:
                      </span>
                      {med.startDate || "Today"}
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold text-gray-700 block">
                        Instructions:
                      </span>
                      {med.instructions || "Take after meals with water."}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  {med.status === "active" ? (
                    <Button
                      variant="outline"
                      className="gap-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                      onClick={() => toggleStatus(med.id)}
                    >
                      <CheckCircle className="h-4 w-4" /> Mark as Taken
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="gap-2 text-muted-foreground"
                      onClick={() => toggleStatus(med.id)}
                    >
                      Mark as Untaken
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {meds.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No medicines added yet.
          </div>
        )}
      </div>
    </div>
  );
}
