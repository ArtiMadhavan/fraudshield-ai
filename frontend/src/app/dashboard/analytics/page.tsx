"use client";

import { motion } from "framer-motion";
import { Users, Store, TrendingUp, TrendingDown, MapPin } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ComposedChart, Line
} from 'recharts';
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<{
    customerData: any[],
    merchantData: any[],
    heatmapData: any[]
  } | null>(null);

  useEffect(() => {
    api.get("/system/analytics").then(res => setData(res.data)).catch(err => console.error(err));
  }, []);

  if (!data) {
    return <div className="flex h-96 items-center justify-center text-muted-foreground animate-pulse">Loading Analytics Data...</div>;
  }
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Advanced Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep dive into customer behavior and merchant risk profiles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Analytics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">Customer Demographics</h3>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.customerData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                <XAxis dataKey="age" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#EF4444" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                <Bar yAxisId="left" dataKey="count" name="Total Customers" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="fraud" name="Fraud Cases" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Merchant Analytics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Store className="w-5 h-5 text-warning" />
            <h3 className="text-lg font-bold">Top Merchants by Risk</h3>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.merchantData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" opacity={0.5} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                <Bar dataKey="volume" name="Txn Volume" fill="#1E293B" radius={[0, 4, 4, 0]} barSize={20} />
                <Line type="monotone" dataKey="fraudRate" name="Fraud Rate %" stroke="#F59E0B" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Heatmap Simulation Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-success" />
          <h3 className="text-lg font-bold">Geographic Risk Heatmap Data</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Region / Country</th>
                <th className="px-4 py-3">Total Volume</th>
                <th className="px-4 py-3">Fraud Attempts</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3 rounded-tr-lg">Trend</th>
              </tr>
            </thead>
            <tbody>
              {data.heatmapData.map((row, idx) => (
                <tr key={idx} className={cn("border-b border-border", row.risk === "Critical" ? "bg-destructive/5" : "")}>
                  <td className="px-4 py-4 font-medium">{row.region}</td>
                  <td className="px-4 py-4">{row.volume}</td>
                  <td className="px-4 py-4">{row.attempts}</td>
                  <td className="px-4 py-4">
                    <span className={cn("font-medium", row.risk === "Low" ? "text-success" : row.risk === "High" ? "text-destructive" : "text-destructive font-bold")}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {row.trend === "up" ? <TrendingUp className="w-4 h-4 text-destructive" /> : <TrendingDown className="w-4 h-4 text-success" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
