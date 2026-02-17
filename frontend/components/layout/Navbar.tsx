"use client";

import { useState, useEffect } from "react";
import { Bell, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { notificationApi } from "@/lib/api";

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const { data } = await notificationApi.list();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    }
    // Poll for notifications or just fetch once
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id: number) => {
    try {
      await notificationApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="flex h-16 items-center border-b bg-background px-4 md:px-6 relative z-40">
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden mr-4"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1 ml-auto flex items-center justify-end gap-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full w-8 h-8 p-0"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </Button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-white border rounded-lg shadow-xl p-4 z-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-sm">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`text-sm p-2 rounded cursor-pointer ${
                        n.isRead
                          ? "bg-gray-50 text-muted-foreground"
                          : "bg-blue-50"
                      }`}
                      onClick={() => handleMarkRead(n.id)}
                    >
                      <p className="font-medium">{n.message}</p>
                      <p className="text-xs opacity-70">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No new notifications
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

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
