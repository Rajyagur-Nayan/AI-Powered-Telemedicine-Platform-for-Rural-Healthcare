"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Users,
  UserPlus,
  MonitorUp,
  Phone,
} from "lucide-react";
import { doctors } from "@/data/mock";

export default function DoctorVideoCounselingPage() {
  const [callStatus, setCallStatus] = useState<
    "idle" | "calling" | "connected"
  >("idle");
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  // Simulate patient answering after a delay when in 'calling' state
  useEffect(() => {
    if (callStatus === "calling") {
      // In a real app, we'd wait for socket event.
      // For demo, we just simulate "waiting" UI or require manual "Force Connect" for testing?
      // Let's set a timeout to simulate patient picking up for better UX flow demo
      const timer = setTimeout(() => {
        setCallStatus("connected");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [callStatus]);

  if (callStatus === "idle") {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-6 max-w-md p-8 bg-white rounded-2xl shadow-xl">
          <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Video className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Ready for Consultation?
            </h2>
            <p className="text-slate-500 mt-2">
              Upcoming appointment with{" "}
              <span className="font-semibold text-primary">Suresh Verma</span>.
            </p>
          </div>
          <Button
            size="lg"
            className="w-full gap-2 text-lg h-12"
            onClick={() => setCallStatus("calling")}
          >
            <Phone className="h-5 w-5" /> Start Video Call
          </Button>
        </div>
      </div>
    );
  }

  if (callStatus === "calling") {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-6">
          <div className="relative">
            <span className="absolute inset-0 bg-primary/50 rounded-full animate-ping opacity-75"></span>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh"
              className="h-32 w-32 rounded-full border-4 border-primary relative z-10 bg-slate-800"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Calling Suresh Verma...</h2>
            <p className="text-slate-400 mt-2">
              Waiting for patient to join...
            </p>
          </div>
          <Button
            variant="destructive"
            size="lg"
            className="gap-2 rounded-full h-14 w-14 p-0"
            onClick={() => setCallStatus("idle")}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

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
            Consultation: Suresh Verma
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
            <Users className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Video Feed (Patient) */}
      <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2788&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-90"
          alt="Patient Feed"
        />

        {/* Doctor Self View (PiP) */}
        <div className="absolute bottom-6 right-6 w-48 h-36 bg-slate-800 rounded-lg border-2 border-slate-700 shadow-xl overflow-hidden">
          <img
            src={doctors[0].image}
            alt="Me"
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
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
          variant="secondary"
          className="rounded-full h-12 w-12 p-0 bg-slate-700 text-white hover:bg-slate-600 border-0 hidden sm:flex"
        >
          <MonitorUp className="h-5 w-5" />
        </Button>

        <Button
          variant="destructive"
          className="rounded-full h-12 w-16 px-6 mx-2"
          onClick={() => setCallStatus("idle")}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>

        <Button
          variant="secondary"
          className="rounded-full h-12 w-12 p-0 bg-slate-700 text-white hover:bg-slate-600 border-0 hidden sm:flex"
        >
          <UserPlus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
