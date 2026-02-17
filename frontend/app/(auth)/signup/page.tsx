"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Heart } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("userRole", "patient");
      router.push("/dashboard/patient"); // Default redirect
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
          Create Account
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Join RuralConnect+ today
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="First Name" required />
            <Input placeholder="Last Name" required />
          </div>
          <Input placeholder="Email Address" type="email" required />
          <Input placeholder="Password" type="password" required />
          <Input placeholder="Confirm Password" type="password" required />

          <Button className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
