"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
} from "lucide-react";
import { doctors, currentUser } from "@/data/mock";
import { useRouter } from "next/navigation";

export default function PatientVideoPage() {
  const router = useRouter();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  // In a real app, we would get the connected doctor's ID from the URL or state
  const connectedDoctor = doctors[0];

  return (
    <div className="h-[calc(100vh-8rem)] bg-slate-950 rounded-2xl overflow-hidden flex flex-col relative shadow-2xl">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Badge
              variant="outline"
              className="text-white border-white/20 bg-black/20 backdrop-blur"
            >
              REC
            </Badge>
          </div>
          <h2 className="text-white font-medium text-lg drop-shadow-md">
            Consultation: {connectedDoctor.name}
          </h2>
          <Badge className="bg-red-500/80 text-white border-0 animate-pulse hidden md:inline-flex">
            LIVE
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Video Feed (Doctor) */}
      <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
        {/* Simulate Doctor Video Feed */}
        <img
          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2940&auto=format&fit=crop"
          className="w-full h-full object-cover"
          alt="Doctor Feed"
        />

        {/* Patient Self View (PiP) */}
        <div className="absolute bottom-6 right-6 w-48 h-36 bg-slate-800 rounded-lg border-2 border-slate-700 shadow-xl overflow-hidden">
          {videoOn ? (
            <img
              src={currentUser.avatarUrl}
              alt="Me"
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-slate-800 text-slate-400 text-xs">
              Camera Off
            </div>
          )}
          <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-1.5 rounded">
            You
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-20 bg-slate-900 flex items-center justify-center gap-4 px-4">
        <Button
          variant="secondary"
          className={`rounded-full h-12 w-12 p-0 ${!micOn ? "bg-red-500 hover:bg-red-600 text-white" : "bg-slate-700 text-white hover:bg-slate-600 border-0"}`}
          onClick={() => setMicOn(!micOn)}
        >
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>

        <Button
          variant="secondary"
          className={`rounded-full h-12 w-12 p-0 ${!videoOn ? "bg-red-500 hover:bg-red-600 text-white" : "bg-slate-700 text-white hover:bg-slate-600 border-0"}`}
          onClick={() => setVideoOn(!videoOn)}
        >
          {videoOn ? (
            <Video className="h-5 w-5" />
          ) : (
            <VideoOff className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant="destructive"
          className="rounded-full h-12 w-16 px-6 mx-2"
          onClick={() => router.push("/dashboard/patient")}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
