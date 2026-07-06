"use client";

import { motion } from "framer-motion";
import { Building, TrendingUp, ShieldAlert, Users, CreditCard, Download, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const merchantVolume = [
  { month: 'Jan', volume: 150000, fraud: 1200 },
  { month: 'Feb', volume: 180000, fraud: 1500 },
  { month: 'Mar', volume: 165000, fraud: 1100 },
  { month: 'Apr', volume: 210000, fraud: 8900 }, // Fraud spike
  { month: 'May', volume: 190000, fraud: 4500 },
  { month: 'Jun', volume: 220000, fraud: 3200 },
];

export default function Merchant360() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Merchant 360° Profile</h1>
          <p className="text-sm text-muted-foreground">Comprehensive risk and performance analysis for MERCH-CRYPTO.</p>
        </div>
        <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border p-6 rounded-xl shadow-sm md:col-span-1 flex flex-col gap-6">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-warning/10 text-warning rounded-xl flex items-center justify-center">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">CryptoEx</h2>
              <p className="text-sm text-muted-foreground">ID: MERCH-CRYPTO</p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm mt-4">
            <div className="flex justify-between pb-2 border-b border-border">
              <span className="text-muted-foreground">Risk Rating</span>
              <span className="font-bold text-destructive">Critical (F)</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-border">
              <span className="text-muted-foreground">Category</span>
              <span className="font-bold">Cryptocurrency</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-border">
              <span className="text-muted-foreground">Total Revenue (YTD)</span>
              <span className="font-bold">$1.1M</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-border">
              <span className="text-muted-foreground">Fraud Chargeback Rate</span>
              <span className="font-bold text-destructive">12.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg. Txn Value</span>
              <span className="font-bold">$2,450.00</span>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="md:col-span-3 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Volume vs Fraud Trend
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={merchantVolume} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#EF4444" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="volume" stroke="#2563EB" strokeWidth={3} name="Total Volume" />
                  <Line yAxisId="right" type="monotone" dataKey="fraud" stroke="#EF4444" strokeWidth={3} name="Fraud Volume" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* AI Behaviour Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-destructive/5 border border-destructive/20 p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-destructive">
           <ShieldAlert className="w-5 h-5" /> Merchant Risk Advisory
        </h2>
        <p className="text-sm text-foreground leading-relaxed">
          Merchant <span className="font-bold">CryptoEx</span> currently maintains a Fraud Chargeback Rate of <span className="text-destructive font-bold">12.4%</span>, which is drastically above the industry threshold of 0.9%.
          In April, a massive coordinated BIN attack targeted this merchant, resulting in $8.9k of blocked fraudulent volume. The AI Decision Engine has automatically adjusted the risk multiplier for this merchant to <span className="font-bold">+15 points</span> for all future transactions. 
          Recommendation: Suspend settlement payouts pending full compliance review.
        </p>
      </motion.div>
    </div>
  );
}
