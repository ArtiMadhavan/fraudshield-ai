"use client";

import { motion } from "framer-motion";
import { User, CreditCard, MapPin, Activity, ShieldAlert, Download, TrendingUp, AlertTriangle, Monitor, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function Customer360() {
  const [customer, setCustomer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await api.get('/customers/CUST-9921/360');
        setCustomer(res.data);
      } catch (err) {
        console.error("Failed to load customer profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
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
    data: customer?.recent_transactions || [],
    columns: txColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading || !customer) {
    return <div className="flex h-96 items-center justify-center text-slate-500 animate-pulse font-medium">Loading Live Customer Profile...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customer 360° Profile</h1>
          <p className="text-slate-500 mt-1 font-medium">Comprehensive behavioral and risk analysis for {customer.id}.</p>
        </div>
        <button className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm">
          <Download className="w-4 h-4" /> Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 p-8 rounded-[18px] shadow-sm md:col-span-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-600/20">
              {customer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{customer.name}</h2>
              <p className="text-sm font-medium text-slate-500">{customer.email}</p>
            </div>
          </div>
          
          <div className="space-y-5 text-sm relative z-10">
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Risk Score</span>
              <span className={`font-bold px-2 py-0.5 rounded-md ${customer.risk_score > 70 ? 'text-red-600 bg-red-100' : 'text-emerald-600 bg-emerald-100'}`}>
                {customer.risk_score > 70 ? 'High' : 'Low'} ({customer.risk_score}/100)
              </span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium">KYC Status</span>
              <span className="font-bold text-slate-900 uppercase">{customer.kyc_status}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Customer Since</span>
              <span className="font-bold text-slate-900">{new Date(customer.join_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Total Spent (180d)</span>
              <span className="font-bold text-slate-900">${customer.total_spent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Credit Score</span>
              <span className="font-bold text-slate-900">{customer.credit_score}</span>
            </div>
          </div>
        </div>

        {/* Behavioral Analysis */}
        <div className="bg-white border border-slate-200 p-8 rounded-[18px] shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <Activity className="w-5 h-5 text-indigo-600" /> Spending Trend & Anomalies
            </h2>
          </div>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customer.spendingTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ color: '#0f172a' }}
                  cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" name="Monthly Spend" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Device & Location & Txs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-[18px] shadow-sm">
          <h2 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" /> Location History
          </h2>
          <div className="space-y-4">
             {customer.location_history && customer.location_history.length > 0 ? customer.location_history.map((loc: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><MapPin className="w-4 h-4"/></div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{loc.city}, {loc.country}</p>
                        <p className="text-xs text-slate-500 font-mono">{loc.ip}</p>
                      </div>
                   </div>
                </div>
             )) : <p className="text-sm text-slate-500">No location history found.</p>}
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
      <div className="bg-red-50/50 border border-red-100 p-8 rounded-[18px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full blur-[100px] pointer-events-none"></div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-red-600">
           <AlertTriangle className="w-6 h-6" /> AI Behaviour Summary
        </h2>
        <p className="text-slate-700 leading-relaxed text-base max-w-4xl relative z-10 font-medium">
          {customer.summary}
        </p>
        
        <div className="mt-8 flex gap-4 relative z-10">
           <button className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm shadow-red-200 hover:bg-red-700 transition-colors">
              Freeze Account
           </button>
           <button className="bg-white text-slate-700 border border-slate-200 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm">
              Request KYC Verification
           </button>
        </div>
      </div>
    </div>
  );
}
