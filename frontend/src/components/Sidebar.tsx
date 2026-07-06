"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  BrainCircuit, 
  Users,
  Store,
  Search,
  Settings,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: 'Executive Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Payment Simulator', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Fraud Investigation', href: '/dashboard/investigation', icon: Search },
  { name: 'Customer 360°', href: '/dashboard/customer-360', icon: Users },
  { name: 'Merchant 360°', href: '/dashboard/merchant-360', icon: Store },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'ML Engine Metrics', href: '/dashboard/ml', icon: BrainCircuit },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          FraudShield AI
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground rounded-lg hover:bg-secondary hover:text-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
          System Settings
        </Link>
        
        <div className="mt-4 px-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold">
            AD
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@fraudshield.ai</p>
          </div>
        </div>
      </div>
    </div>
  );
}
