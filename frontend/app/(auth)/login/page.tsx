"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Heart } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("userRole", role);
      if (role === "patient") router.push("/dashboard/patient");
      else if (role === "doctor") router.push("/dashboard/doctor");
      else if (role === "caregiver") router.push("/dashboard/caregiver");
    }, 1000);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-primary fill-current" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-primary">
          Welcome Back
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sign in to RuralConnect+
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {["patient", "doctor", "caregiver"].map((r) => (
                <div
                  key={r}
                  onClick={() => setRole(r)}
                  className={`cursor-pointer text-center py-2 rounded-md border text-sm capitalize transition-all ${
                    role === r
                      ? "bg-primary text-white border-primary"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  {r}
                </div>
              ))}
            </div>
          </div>

          <Input
            placeholder="Email Address"
            type="email"
            required
            defaultValue="user@example.com"
          />
          <Input
            placeholder="Password"
            type="password"
            required
            defaultValue="password"
          />

          <Button className="w-full" size="lg" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
