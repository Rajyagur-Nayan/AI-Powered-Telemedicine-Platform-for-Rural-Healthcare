"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Activity, Check, AlertTriangle } from "lucide-react";

const symptomsList = [
  "Fever",
  "Cough",
  "Headache",
  "Fatigue",
  "Nausea",
  "Breathlessness",
  "Sore Throat",
  "Body Ache",
  "Runny Nose",
  "Loss of Taste",
];

export default function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const checkSymptoms = () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    // Simulate AI delay
    setTimeout(() => {
      setResult({
        disease: "Viral Fever",
        risk: "Medium",
        confidence: 82,
        recommendation: "Rest, Hydration, and Paracetamol if fever > 100°F.",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Symptom Checker
        </h1>
        <p className="text-muted-foreground">
          Select your symptoms to get an AI-powered preliminary diagnosis.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What are you feeling?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {symptomsList.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    selectedSymptoms.includes(symptom)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <Button
                onClick={checkSymptoms}
                className="w-full"
                disabled={selectedSymptoms.length === 0 || loading}
              >
                {loading ? "Analyzing..." : "Analyze Symptoms"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {result && (
            <Card className="border-primary/20 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Analysis Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Possible Condition
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {result.disease}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Risk Level
                    </div>
                    <Badge
                      variant={
                        result.risk === "High" ? "destructive" : "warning"
                      }
                      className="mt-1"
                    >
                      {result.risk}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Confidence
                    </div>
                    <div className="font-bold mt-1 text-primary">
                      {result.confidence}%
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-sm font-medium mb-1">Recommendation</div>
                  <p className="text-sm text-muted-foreground">
                    {result.recommendation}
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  Consult a Doctor Now
                </Button>
              </CardContent>
            </Card>
          )}

          {!result && (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
                <Activity className="h-12 w-12 mb-4 opacity-20" />
                <p>Select symptoms to see results here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
