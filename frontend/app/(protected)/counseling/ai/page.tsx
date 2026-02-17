"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mic, MicOff, PhoneOff, Settings, Volume2 } from "lucide-react";
import { currentUser } from "@/data/mock";

export default function AICounselingPage() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Simulate AI speaking

  // Simulate AI "speaking" animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex-1 grid md:grid-cols-2 gap-6 mb-6">
        {/* AI Doctor Avatar Section */}
        <Card className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-primary/20 relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
            Draft: AI Counselor
          </div>

          <div
            className={`relative transition-all duration-500 transform ${isSpeaking ? "scale-105" : "scale-100"}`}
          >
            {/* Pulse Effect */}
            {isSpeaking && (
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            )}
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=DoctorAI&backgroundColor=b6e3f4"
              alt="AI Doctor"
              className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white shadow-xl z-10 relative"
            />
          </div>

          <div className="mt-8 flex items-center gap-2">
            {isSpeaking ? (
              <div className="flex gap-1 h-6 items-center">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary animate-[bounce_1s_infinite]"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      height: `${Math.random() * 20 + 5}px`,
                    }}
                  ></div>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground text-sm font-medium">
                Listening...
              </span>
            )}
          </div>
        </Card>

        {/* User Avatar Section */}
        <Card className="flex flex-col items-center justify-center bg-slate-50 border-dashed">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt="Me"
              className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-md grayscale-[20%]"
            />
            <div className="absolute bottom-2 right-2 bg-green-500 h-6 w-6 rounded-full border-2 border-white"></div>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-700">
            {currentUser.name}
          </h3>
          <p className="text-sm text-muted-foreground">Patient</p>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-4 flex justify-center items-center gap-6 bg-slate-900 border-slate-800 rounded-2xl shadow-2xl">
        <Button
          variant="secondary"
          size="lg"
          className="rounded-full h-14 w-14 p-0 bg-slate-700 hover:bg-slate-600 text-white border-0"
        >
          <Volume2 className="h-6 w-6" />
        </Button>

        <Button
          size="lg"
          className={`rounded-full h-16 w-16 p-0 transition-all ${isListening ? "bg-primary hover:bg-primary/90" : "bg-red-500 hover:bg-red-600"}`}
          onClick={() => setIsListening(!isListening)}
        >
          {isListening ? (
            <Mic className="h-7 w-7" />
          ) : (
            <MicOff className="h-7 w-7" />
          )}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          className="rounded-full h-14 w-14 p-0"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </Card>
    </div>
  );
}
