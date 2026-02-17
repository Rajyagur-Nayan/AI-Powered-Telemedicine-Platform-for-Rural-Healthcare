import { currentUser } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { User, Mail, Phone, MapPin } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6 mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentUser.name}</h2>
                <Badge className="mt-1" variant="secondary">
                  {currentUser.role}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input defaultValue={currentUser.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue={currentUser.email} disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input defaultValue="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input defaultValue="Mumbai, India" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Receive updates about appointments.
                </div>
              </div>
              <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Medicine Reminders</div>
                <div className="text-sm text-muted-foreground">
                  Get notified when it's time to take meds.
                </div>
              </div>
              <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
