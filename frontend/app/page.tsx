import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Activity,
  Calendar,
  Pill,
  FileText,
  Heart,
  Shield,
  Smartphone,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b bg-white sticky top-0 z-50">
        <div className="font-bold text-2xl text-primary flex items-center gap-2">
          <Heart className="h-6 w-6 fill-primary" />
          RuralConnect+
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="#features" className="hover:text-primary">
            Features
          </Link>
          <Link href="#about" className="hover:text-primary">
            About
          </Link>
          <Link href="#testimonials" className="hover:text-primary">
            Testimonials
          </Link>
        </nav>
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 text-center bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
              Accessible & Smart Healthcare for{" "}
              <span className="text-primary">Every Community</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Connecting rural patients with top doctors through AI-powered
              diagnostics and seamless telemedicine.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/symptoms">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8 py-6 gap-2"
                >
                  <Activity className="h-5 w-5" /> Check Symptoms Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Comprehensive Health Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <Activity className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>AI Disease Prediction</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Get instant preliminary diagnosis based on your symptoms using
                  advanced AI models.
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <Globe className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Online Consultation</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Connect with specialized doctors via video call from the
                  comfort of your home.
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <Pill className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Medicine Reminders</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Never miss a dose with automated SMS and app notifications for
                  your prescriptions.
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Secure Digital Records</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Store and access your medical history, reports, and
                  prescriptions securely in one place.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Trusted by Families</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-white border rounded-xl shadow-sm text-left">
                <p className="italic text-muted-foreground mb-4">
                  "RuralConnect+ saved my father's life. We got a quick
                  consultation with a cardiologist without travelling 200km to
                  the city."
                </p>
                <div className="font-bold">- Rajesh K., Farmer</div>
              </div>
              <div className="p-6 bg-white border rounded-xl shadow-sm text-left">
                <p className="italic text-muted-foreground mb-4">
                  "The medicine reminders are a blessing. I never forget my BP
                  tablets now. The interface is so easy to use."
                </p>
                <div className="font-bold">- Sunita D., Teacher</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-bold text-xl text-white mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 fill-white" /> RuralConnect+
            </div>
            <p className="text-sm">
              Bridging the gap in rural healthcare with technology and care.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features">Features</Link>
              </li>
              <li>
                <Link href="/doctors">Find Doctors</Link>
              </li>
              <li>
                <Link href="/symptoms">Symptom Checker</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#">Help Center</Link>
              </li>
              <li>
                <Link href="#">Emergency Contacts</Link>
              </li>
              <li>
                <Link href="#">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>support@ruralconnect.com</li>
              <li>+91 1800 123 4567</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          © 2026 RuralConnect+. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
