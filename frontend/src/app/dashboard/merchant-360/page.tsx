"use client";

import { motion } from "framer-motion";
import { Building, TrendingUp, ShieldAlert, Users, CreditCard, Download, Activity, Globe } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function Merchant360() {
  const [merchant, setMerchant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const res = await api.get('/merchants/MERCH-913/360');
        setMerchant(res.data);
      } catch (err) {
        console.error("Failed to load merchant profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMerchant();
  }, []);

  const txColumns = [
    { accessorKey: "id", header: "Txn ID", cell: ({ row }: any) => <span className="font-mono">{row.original.id.substring(0,8)}</span> },
    { accessorKey: "amount", header: "Amount", cell: ({ row }: any) => `$${row.original.amount.toFixed(2)}` },
    { accessorKey: "status", header: "Status", cell: ({ row }: any) => (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${row.original.status === 'completed' ? 'text-emerald-600 bg-emerald-100' : 'text-slate-600 bg-slate-100'}`}>
        {row.original.status}
      </span>
    ) },
    { accessorKey: "date", header: "Date", cell: ({ row }: any) => <span className="text-slate-500">{new Date(row.original.date).toLocaleDateString()}</span> },
  ];

  const txTable = useReactTable({
    data: merchant?.recent_transactions || [],
    columns: txColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading || !merchant) {
    return <div className="flex h-96 items-center justify-center text-slate-500 animate-pulse font-medium">Loading Live Merchant Profile...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Merchant 360° Profile</h1>
          <p className="text-slate-500 mt-1 font-medium">Comprehensive risk and performance analysis for {merchant.id}.</p>
        </div>
        <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 p-8 rounded-[18px] shadow-sm md:col-span-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
             <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{merchant.name}</h2>
              <p className="text-sm text-slate-500 font-medium">ID: {merchant.id}</p>
            </div>
          </div>
          
          <div className="space-y-5 text-sm relative z-10">
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Risk Rating</span>
              <span className={`font-bold px-2 py-0.5 rounded-md ${merchant.risk_level === 'Critical' ? 'text-red-600 bg-red-100' : merchant.risk_level === 'High' ? 'text-amber-600 bg-amber-100' : 'text-emerald-600 bg-emerald-100'}`}>
                {merchant.risk_level}
              </span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Category</span>
              <span className="font-bold text-slate-900">{merchant.category}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Total Revenue (YTD)</span>
              <span className="font-bold text-slate-900">${merchant.total_revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Fraud Chargeback Rate</span>
              <span className={`font-bold ${merchant.fraud_percentage > 5 ? 'text-red-600' : 'text-amber-600'}`}>
                {merchant.fraud_percentage.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Settlement Status</span>
              <span className="font-bold text-slate-900 uppercase">{merchant.settlement_status}</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white border border-slate-200 p-8 rounded-[18px] shadow-sm md:col-span-2">
            <h2 className="text-lg font-bold mb-8 flex items-center gap-2 text-slate-900">
              <Activity className="w-5 h-5 text-indigo-600" /> Revenue & Volume Trend
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={merchant.revenueTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="Revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-[18px] shadow-sm">
          <h2 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" /> Operating Countries
          </h2>
          <div className="flex flex-wrap gap-2">
             {merchant.countries && merchant.countries.length > 0 ? merchant.countries.map((country: string, idx: number) => (
                <div key={idx} className="px-4 py-2 bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-100 text-sm">
                   {country}
                </div>
             )) : <p className="text-sm text-slate-500">No country data found.</p>}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[18px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" /> Recent Transactions
            </h2>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {txTable.getHeaderGroups().map(hg => (
                  <tr key={hg.id} className="bg-slate-50/50">
                    {hg.headers.map(h => (
                      <th key={h.id} className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {txTable.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-5 py-3 text-slate-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Behaviour Summary */}
      <div className="bg-amber-50/50 border border-amber-100 p-8 rounded-[18px] shadow-sm relative overflow-hidden">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-600 relative z-10">
           <ShieldAlert className="w-5 h-5" /> Merchant Risk Advisory
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed relative z-10 font-medium">
          {merchant.summary} 
          The AI Decision Engine has automatically adjusted the risk multiplier for this merchant due to the chargeback percentage.
          Recommendation: Review settlement rules for this account.
        </p>
      </div>
    </div>
  );
}
