"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Moon, Menu, Activity } from "lucide-react";
import Image from "next/image";
import { useWebSocket } from "@/hooks/useWebSocket";
import { cn } from "@/lib/utils";

export default function Topbar() {
  const [notifications, setNotifications] = useState(3);
  const { lastMessage, isConnected } = useWebSocket("ws://localhost:8000/ws");
  const [user, setUser] = useState<{username: string, role: string}>({ username: "User", role: "Role" });

  useEffect(() => {
    if (lastMessage?.type === "NEW_ALERT") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotifications(prev => prev + 1);
    }
  }, [lastMessage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        setUser({
          username: decodedPayload.sub || "User",
          role: decodedPayload.role || "Role"
        });
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
  }, []);

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center flex-1 gap-4">
        <button className="p-2 -ml-2 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-5">
        <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold border", isConnected ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200")}>
          <Activity className="w-3 h-3" />
          {isConnected ? "LIVE" : "OFFLINE"}
        </div>
        <button className="relative p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
          <Bell className="w-5 h-5" />
          {notifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {notifications > 9 ? "9+" : notifications}
            </span>
          )}
        </button>
        
        <button className="p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
          <Moon className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm overflow-hidden uppercase">
             {user.username.substring(0, 2)}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-slate-900 leading-none capitalize">{user.username}</p>
            <p className="text-xs text-slate-500 mt-1 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
