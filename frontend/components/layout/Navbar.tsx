"use client";

import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex h-16 items-center border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden mr-4"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1 ml-auto flex items-center justify-end gap-4">
        <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full w-8 h-8 p-0 border bg-muted"
        >
          <User className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
}
