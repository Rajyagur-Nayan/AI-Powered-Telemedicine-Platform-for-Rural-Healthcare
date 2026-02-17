import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Heart } from "lucide-react";
import { authApi } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "", // Backend expects 'name', we'll combine
    email: "",
    password: "",
    confirmPassword: "",
    role: "PATIENT", // Default
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { data } = await authApi.register({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: "PATIENT", // Hardcoded for simplified signup flow, generic user is patient
      });

      localStorage.setItem("userRole", "patient");
      router.push("/dashboard/patient");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
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
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="firstName"
              placeholder="First Name"
              required
              onChange={handleChange}
            />
            <Input
              name="lastName"
              placeholder="Last Name"
              required
              onChange={handleChange}
            />
          </div>
          <Input
            name="email"
            placeholder="Email Address"
            type="email"
            required
            onChange={handleChange}
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            required
            onChange={handleChange}
          />
          <Input
            name="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            required
            onChange={handleChange}
          />

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
