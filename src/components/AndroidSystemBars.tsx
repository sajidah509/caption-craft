import React, { useState, useEffect } from "react";
import { Wifi, BatteryMedium, Signal } from "lucide-react";

export function AndroidStatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-6 pt-3 pb-2 flex items-center justify-between text-xs font-medium text-stone-200 select-none z-20">
      {/* Time */}
      <div className="flex items-center gap-1.5 font-['Roboto',sans-serif]">
        <span className="font-semibold tracking-tight">{time || "09:41"}</span>
      </div>

      {/* Camera Hole Cutout in Device */}
      <div className="w-3.5 h-3.5 rounded-full bg-stone-900 border border-stone-800 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-stone-950/80" />
      </div>

      {/* System Status Icons */}
      <div className="flex items-center gap-2 text-stone-300">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono">98%</span>
          <BatteryMedium className="w-4 h-4 fill-stone-300" />
        </div>
      </div>
    </div>
  );
}

export function AndroidNavBar() {
  return (
    <div className="w-full py-2 flex items-center justify-center select-none bg-transparent">
      {/* Material 3 / Android Gesture Navigation Pill */}
      <div className="w-32 h-1 bg-stone-400/40 rounded-full hover:bg-stone-400/60 transition-colors" />
    </div>
  );
}
