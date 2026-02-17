"use client";

import { useState } from "react";
import { medicines } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Check, Clock, Plus, Trash2 } from "lucide-react";

export default function MedicinesPage() {
  const [meds, setMeds] = useState(medicines);
  const [newMedName, setNewMedName] = useState("");

  const addMed = () => {
    if (!newMedName) return;
    const newMed = {
      id: Math.random().toString(),
      patientId: "u1",
      name: newMedName,
      dosage: "Tablet",
      frequency: "Daily",
      times: ["09:00"],
      startDate: new Date().toISOString().split("T")[0],
      status: "active" as const,
      takenHistory: [],
    };
    setMeds([...meds, newMed]);
    setNewMedName("");
  };

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
          <Card
            key={med.id}
            className="flex flex-col md:flex-row items-center justify-between p-4"
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{med.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {med.dosage} • {med.frequency}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
              <div className="flex gap-2">
                {med.times.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
              >
                <Check className="h-4 w-4 mr-2" /> Mark Taken
              </Button>
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
