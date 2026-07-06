"use client";

import { motion } from "framer-motion";
import { User, CreditCard, MapPin, Activity, ShieldAlert, Download, TrendingUp, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

const spendingTrend = [
  { month: 'Jan', spend: 450 },
  { month: 'Feb', spend: 520 },
  { month: 'Mar', spend: 480 },
  { month: 'Apr', spend: 2100 }, // Abnormal spike
  { month: 'May', spend: 600 },
  { month: 'Jun', spend: 550 },
];

export default function Customer360() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Customer 360° Profile</h1>
          <p className="text-muted-foreground mt-1">Comprehensive behavioral and risk analysis for CUST-9921.</p>
        </div>
        <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm">
          <Download className="w-4 h-4" /> Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm md:col-span-1 relative overflow-hidden">
          {/* Decorative Gradient Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary/20">
              JD
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">John Doe</h2>
              <p className="text-sm font-medium text-muted-foreground">ID: CUST-9921</p>
            </div>
          </div>
          
          <div className="space-y-5 text-sm">
            <div className="flex justify-between pb-3 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Risk Level</span>
              <span className="font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-md">High (85/100)</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Customer Since</span>
              <span className="font-bold text-foreground">Mar 2024</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Avg. Monthly Spend</span>
              <span className="font-bold text-foreground">$500.00</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Preferred Method</span>
              <span className="font-bold text-foreground">Credit Card (*4242)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-medium">Top Merchant</span>
              <span className="font-bold text-foreground">Amazon</span>
            </div>
          </div>
        </div>

        {/* Behavioral Analysis */}
        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Spending Trend & Anomalies
            </h2>
          </div>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#888888" opacity={0.2} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ color: 'var(--color-foreground)' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="spend" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" name="Monthly Spend" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* AI Behaviour Summary */}
      <div className="bg-destructive/5 border border-destructive/20 p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-destructive/10 rounded-full blur-[100px] pointer-events-none"></div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-destructive">
           <AlertTriangle className="w-6 h-6" /> AI Behaviour Summary
        </h2>
        <p className="text-muted-foreground leading-relaxed text-base max-w-4xl relative z-10">
          Customer CUST-9921 typically spends ~$500/month primarily on e-commerce and groceries within the United States. 
          <span className="text-destructive font-semibold px-1"> In April, a significant anomaly was detected with spending spiking by 420%.</span> 
          Recent transactions include an abnormally high $4,500 attempted purchase from a new IP address located in Russia, directed to a high-risk Crypto merchant. 
          The AI Decision Engine strongly recommends freezing the account pending manual identity verification.
        </p>
        
        <div className="mt-8 flex gap-4 relative z-10">
           <button className="bg-destructive text-destructive-foreground px-6 py-2.5 rounded-xl font-medium shadow-md shadow-destructive/20 hover:bg-destructive/90 transition-colors">
              Freeze Account
           </button>
           <button className="bg-background text-foreground border border-border px-6 py-2.5 rounded-xl font-medium hover:bg-muted transition-colors">
              Request KYC Verification
           </button>
        </div>
      </div>
    </div>
  );
}
