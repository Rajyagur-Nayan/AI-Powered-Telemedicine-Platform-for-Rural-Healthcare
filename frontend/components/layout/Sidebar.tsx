"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Pill,
  FileText,
  User,
  Activity,
  LogOut,
  Users,
} from "lucide-react";
import { cn } from "@/components/ui/Button";

type Role = "patient" | "doctor" | "caregiver";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard/patient", // Dynamic placeholder
    icon: LayoutDashboard,
    roles: ["patient", "doctor", "caregiver"],
  },
  {
    name: "Check Symptoms",
    href: "/symptoms",
    icon: Activity,
    roles: ["patient"],
  },
  {
    name: "Appointments",
    href: "/appointments", // Patient booking
    icon: Calendar,
    roles: ["patient"],
  },
  {
    name: "Medicines",
    href: "/medicines",
    icon: Pill,
    roles: ["patient", "caregiver"],
  },
  {
    name: "Records",
    href: "/records",
    icon: FileText,
    roles: ["patient", "doctor"],
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    roles: ["patient", "doctor", "caregiver"],
  },
  {
    name: "AI Counselor",
    href: "/counseling/ai",
    icon: Activity,
    roles: ["patient"],
  },
  {
    name: "Live Consultation",
    href: "/counseling/video",
    icon: Users,
    roles: ["doctor"],
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [role, setRole] = useState<Role>("patient");

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as Role;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const getDashboardLink = (r: Role) => {
    switch (r) {
      case "doctor":
        return "/dashboard/doctor";
      case "caregiver":
        return "/dashboard/caregiver";
      default:
        return "/dashboard/patient";
    }
  };

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-card text-card-foreground",
        className,
      )}
    >
      <div className="flex h-16 items-center px-6 border-b">
        <span className="text-xl font-bold text-primary">RuralConnect+</span>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            // Fix dashboard link dynamically
            const href =
              item.name === "Dashboard" ? getDashboardLink(role) : item.href;
            const isActive = pathname === href;

            return (
              <Link
                key={item.name}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  isActive ? "bg-muted text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t">
        <Link
          href="/login"
          onClick={() => localStorage.removeItem("userRole")}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Link>
      </div>
    </div>
  );
}
