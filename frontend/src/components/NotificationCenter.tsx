"use client";

import { useState } from "react";
import { Bell, ShieldAlert, AlertTriangle, Info, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialNotifications = [
  { id: 1, type: "critical", message: "Blocked Txn #TRX-9982 (Risk: 98)", time: "2 min ago", customer: "John Doe", merchant: "CryptoEx" },
  { id: 2, type: "high", message: "Review Required #TRX-9981 (Risk: 75)", time: "15 min ago", customer: "Alice Smith", merchant: "Amazon" },
  { id: 3, type: "medium", message: "Unusual velocity detected for CUST-821", time: "1 hr ago", customer: "Bob Jones", merchant: "Multiple" },
  { id: 4, type: "low", message: "System Backup Completed", time: "2 hrs ago", customer: "System", merchant: "N/A" }
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const getIcon = (type: string) => {
    switch(type) {
      case "critical": return <ShieldAlert className="w-5 h-5 text-destructive" />;
      case "high": return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "medium": return <Info className="w-5 h-5 text-blue-500" />;
      default: return <CheckCircle2 className="w-5 h-5 text-success" />;
    }
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/50">
              <h3 className="font-bold">Notifications</h3>
              <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-1 rounded-full">
                {notifications.length} New
              </span>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  All caught up!
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map(n => (
                    <div key={n.id} className="p-4 hover:bg-secondary/30 transition-colors flex gap-3 relative group">
                      <div className="shrink-0 mt-1">{getIcon(n.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-tight mb-1">{n.message}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{n.customer}</span>
                          <span>{n.time}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeNotification(n.id)}
                        className="absolute right-2 top-2 p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-border bg-secondary/50 text-center">
              <button className="text-xs font-medium text-primary hover:underline">View All Alerts</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
