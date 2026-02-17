import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Heart } from "lucide-react";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("user@example.com"); // Pre-filled for demo
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await authApi.login({ email, password });

      // Store role from response, fallback to selected role if not present
      const userRole = data.user.role.toLowerCase();
      localStorage.setItem("userRole", userRole);

      // Redirect based on role
      if (userRole === "patient") router.push("/dashboard/patient");
      else if (userRole === "doctor") router.push("/dashboard/doctor");
      else if (userRole === "caregiver") router.push("/dashboard/caregiver");
      else router.push("/dashboard/patient"); // Fallback
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
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
          Welcome Back
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sign in to RuralConnect+
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Visual Role Toggle (Optional, maybe removes ambiguity if login is generic) */}
          {/* kept for UI consistency with previous version */}
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

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Input
            placeholder="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
