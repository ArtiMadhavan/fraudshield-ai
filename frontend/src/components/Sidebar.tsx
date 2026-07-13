"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CreditCard, 
  Bell, 
  Users,
  Store,
  FileText,
  BarChart3,
  Shield,
  Briefcase,
  History,
  Eye,
  BrainCircuit,
  Database,
  LineChart,
  UserCircle,
  Lock,
  Settings,
  ClipboardList,
  MoreVertical,
  TerminalSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationGroups = [
  {
    title: "MAIN",
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Transactions', href: '/dashboard/payments', icon: CreditCard },
      { name: 'Alerts', href: '/dashboard/investigation', icon: Bell },
      { name: 'Customers', href: '/dashboard/customer-360', icon: Users },
      { name: 'Merchants', href: '/dashboard/merchant-360', icon: Store },
      { name: 'Reports', href: '/dashboard/reports', icon: FileText },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ]
  },
  {
    title: "RISK MANAGEMENT",
    items: [
      { name: 'Risk Rules', href: '/dashboard/rules', icon: Shield },
      { name: 'Fraud Cases', href: '/dashboard/cases', icon: Briefcase },
      { name: 'Decision Logs', href: '/dashboard/logs', icon: History },
      { name: 'Watchlist', href: '/dashboard/watchlist', icon: Eye },
    ]
  },
  {
    title: "AI / ML",
    items: [
      { name: 'AI Testing Console', href: '/dashboard/upload', icon: TerminalSquare },
      { name: 'Model Performance', href: '/dashboard/ml', icon: BrainCircuit },
      { name: 'Model Registry', href: '/dashboard/registry', icon: Database },
      { name: 'Training History', href: '/dashboard/training', icon: History },
      { name: 'Feature Importance', href: '/dashboard/features', icon: LineChart },
    ]
  },
  {
    title: "ADMIN",
    items: [
      { name: 'Users', href: '/dashboard/users', icon: UserCircle },
      { name: 'Roles & Permissions', href: '/dashboard/roles', icon: Lock },
      { name: 'System Settings', href: '/dashboard/settings', icon: Settings },
      { name: 'Audit Logs', href: '/dashboard/audit', icon: ClipboardList },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 custom-scrollbar overflow-hidden">
      {/* Logo Area */}
      <div className="px-6 py-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
          <Shield className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          FraudShield AI
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-6 overflow-y-auto">
        {navigationGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      isActive 
                        ? "bg-indigo-600 text-white shadow-sm" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom User Profile */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              AS
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">Aarav Singh</p>
              <p className="text-xs text-slate-500 mt-1">Risk Manager</p>
            </div>
          </div>
          <MoreVertical className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
}
