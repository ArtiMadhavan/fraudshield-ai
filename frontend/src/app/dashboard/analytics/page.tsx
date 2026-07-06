"use client";

import { motion } from "framer-motion";
import { Users, Store, TrendingUp, TrendingDown, MapPin } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ComposedChart, Line
} from 'recharts';
import { cn } from "@/lib/utils";

const customerData = [
  { age: '18-24', count: 120, fraud: 15 },
  { age: '25-34', count: 450, fraud: 45 },
  { age: '35-44', count: 320, fraud: 20 },
  { age: '45-54', count: 210, fraud: 10 },
  { age: '55+', count: 90, fraud: 2 },
];

const merchantData = [
  { name: 'Amazon', volume: 45000, fraudRate: 0.2 },
  { name: 'Apple', volume: 38000, fraudRate: 0.1 },
  { name: 'Walmart', volume: 22000, fraudRate: 0.5 },
  { name: 'Unknown', volume: 5000, fraudRate: 4.8 },
  { name: 'CryptoEx', volume: 15000, fraudRate: 8.5 },
];

export default function AnalyticsPage() {
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
              <BarChart data={customerData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
              <ComposedChart data={merchantData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
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
              <tr className="border-b border-border">
                <td className="px-4 py-4 font-medium">North America</td>
                <td className="px-4 py-4">$4.2M</td>
                <td className="px-4 py-4">124</td>
                <td className="px-4 py-4"><span className="text-success font-medium">Low</span></td>
                <td className="px-4 py-4"><TrendingDown className="w-4 h-4 text-success" /></td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-4 font-medium">Europe</td>
                <td className="px-4 py-4">$2.8M</td>
                <td className="px-4 py-4">98</td>
                <td className="px-4 py-4"><span className="text-success font-medium">Low</span></td>
                <td className="px-4 py-4"><TrendingDown className="w-4 h-4 text-success" /></td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-4 font-medium">Eastern Europe</td>
                <td className="px-4 py-4">$850K</td>
                <td className="px-4 py-4">342</td>
                <td className="px-4 py-4"><span className="text-destructive font-medium">High</span></td>
                <td className="px-4 py-4"><TrendingUp className="w-4 h-4 text-destructive" /></td>
              </tr>
              <tr className="border-b border-border bg-destructive/5">
                <td className="px-4 py-4 font-medium">High-Risk IP Zones</td>
                <td className="px-4 py-4">$120K</td>
                <td className="px-4 py-4">450</td>
                <td className="px-4 py-4"><span className="text-destructive font-bold">Critical</span></td>
                <td className="px-4 py-4"><TrendingUp className="w-4 h-4 text-destructive" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
