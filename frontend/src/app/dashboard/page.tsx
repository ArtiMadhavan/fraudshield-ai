"use client";

import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { ShieldCheck, ShieldAlert, DollarSign, Activity, AlertTriangle, Users, TrendingUp, Download } from "lucide-react";

// Mock Data for BI Dashboard
const monthlyTrend = [
  { name: 'Jan', total: 45000, fraud: 1200 },
  { name: 'Feb', total: 52000, fraud: 1500 },
  { name: 'Mar', total: 48000, fraud: 900 },
  { name: 'Apr', total: 61000, fraud: 1100 },
  { name: 'May', total: 59000, fraud: 800 },
  { name: 'Jun', total: 68000, fraud: 750 },
];

const riskDistribution = [
  { name: 'Low Risk', value: 85, color: '#10b981' }, // Emerald
  { name: 'Medium Risk', value: 10, color: '#f59e0b' }, // Amber
  { name: 'High Risk', value: 4, color: '#f43f5e' }, // Rose
  { name: 'Critical', value: 1, color: '#9f1239' }, // Rose 900
];

export default function ExecutiveDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Executive Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time fraud prevention and revenue intelligence.</p>
        </div>
        <button className="bg-foreground text-background px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -4 }} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">+12.5%</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Today&apos;s Revenue</p>
          <h3 className="text-3xl font-bold tracking-tight">$1,245,000</h3>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-destructive/10 rounded-xl text-destructive">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">-2.1%</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Fraud Blocked</p>
          <h3 className="text-3xl font-bold tracking-tight">1,432</h3>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-warning/10 rounded-xl text-warning">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">Alerts</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">High-Risk Merchants</p>
          <h3 className="text-3xl font-bold tracking-tight">24</h3>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-success/10 rounded-xl text-success">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">v2.1</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">AI Model Accuracy</p>
          <h3 className="text-3xl font-bold tracking-tight">99.97%</h3>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm col-span-2">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-lg font-bold">Revenue vs Fraud Trend</h3>
             <select className="bg-muted text-sm border-none rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary">
                <option>Last 6 Months</option>
                <option>This Year</option>
             </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#888888" opacity={0.2} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ color: 'var(--color-foreground)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" name="Total Revenue" />
                <Area type="monotone" dataKey="fraud" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorFraud)" name="Fraud Blocked" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold mb-2">Risk Distribution</h3>
          <p className="text-sm text-muted-foreground mb-6">AI risk classification for today&apos;s volume.</p>
          
          <div className="h-64 relative flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '12px' }} 
                  itemStyle={{ color: 'var(--color-foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold tracking-tight">15%</span>
              <span className="text-sm font-medium text-muted-foreground mt-1">At Risk</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            {riskDistribution.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="font-medium text-foreground">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
