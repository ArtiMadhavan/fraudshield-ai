"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts';
import { 
  Calendar, Filter, TrendingUp, TrendingDown,
  Activity, ShieldAlert, DollarSign, Database,
  ArrowUpRight, ArrowDownRight,
  MonitorPlay, PlusCircle, UploadCloud, FileText,
  Server, Cpu, Network, ShieldCheck, Lock, CreditCard,
  CheckCircle, BrainCircuit
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { lastMessage } = useWebSocket("ws://localhost:8000/ws");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (lastMessage && data) {
      if (lastMessage.type === "NEW_TRANSACTION") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData((prev: any) => ({
          ...prev,
          stats: {
            ...prev.stats,
            total_transactions: prev.stats.total_transactions + 1
          }
        }));
      } else if (lastMessage.type === "NEW_ALERT") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData((prev: any) => ({
          ...prev,
          stats: {
            ...prev.stats,
            fraud_detected: prev.stats.fraud_detected + 1
          }
        }));
      }
    }
  }, [lastMessage]);

  if (loading || !data) {
    return <div className="flex h-96 items-center justify-center text-slate-500 animate-pulse font-medium">Loading Ecosystem Data...</div>;
  }

  const { stats, transaction_overview, risk_distribution, fraud_trend, recent_alerts, top_risky_merchants, system_health, recent_transactions } = data;

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'High': return 'text-red-600 bg-red-100 border-red-200';
      case 'Medium': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'Low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getDecisionBadge = (decision: string) => {
    switch(decision) {
      case 'Blocked': return <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-semibold">Blocked</span>;
      case 'Review': return <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-semibold">Review</span>;
      case 'Approved': return <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-semibold">Approved</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Real-time overview of your fraud detection ecosystem</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-slate-600 font-medium shadow-sm">
            May 20, 2025 - May 27, 2025
            <Calendar className="w-4 h-4 ml-2 text-slate-400" />
          </div>
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-slate-600 font-medium shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" />
            Filters
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 p-4 rounded-[18px] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Today's Transactions</p>
              <h3 className="text-xl font-bold text-slate-900">{stats.total_transactions.toLocaleString()}</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Activity className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs">
            <span className="flex items-center text-green-600 font-bold"><TrendingUp className="w-3 h-3 mr-1"/> {stats.tx_trend}%</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 p-4 rounded-[18px] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Fraud Detection Rate</p>
              <h3 className="text-xl font-bold text-slate-900">4.2%</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs">
             <span className="flex items-center text-slate-500 font-medium">{stats.fraud_detected} flags today</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 p-4 rounded-[18px] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Revenue Processed</p>
              <h3 className="text-xl font-bold text-slate-900">{stats.total_amount_str}</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs">
            <span className="flex items-center text-green-600 font-bold"><TrendingUp className="w-3 h-3 mr-1"/> {stats.amount_trend}%</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 p-4 rounded-[18px] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Average Risk Score</p>
              <h3 className="text-xl font-bold text-amber-600">18.4</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs">
            <span className="flex items-center text-green-600 font-bold"><TrendingDown className="w-3 h-3 mr-1"/> -2.1</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white border border-slate-200 p-4 rounded-[18px] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Approval Rate</p>
              <h3 className="text-xl font-bold text-emerald-600">95.8%</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs">
            <span className="flex items-center text-slate-500 font-medium">Auto-approved by AI</span>
          </div>
        </div>
        
        {/* Card 6 */}
        <div className="bg-white border border-slate-200 p-4 rounded-[18px] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Model Accuracy</p>
              <h3 className="text-xl font-bold text-indigo-600">98.2%</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs">
            <span className="flex items-center text-indigo-500 font-medium">Random Forest V3</span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Transaction Overview */}
        <div className="bg-white border border-slate-200 p-5 rounded-[18px] shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900">Transaction Overview</h3>
            <select className="bg-slate-50 border border-slate-200 text-xs px-2 py-1 rounded outline-none">
              <option>7 Days</option>
            </select>
          </div>
          <div className="flex gap-4 mb-4 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-green-500"></div> Approved</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-amber-400"></div> Review</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-red-500"></div> Blocked</div>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transaction_overview}>
                <defs>
                  <linearGradient id="colorApprove" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} dx={-10} tickFormatter={(v) => `${v/1000}k`} />
                <RechartsTooltip contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px'}} />
                <Area type="monotone" dataKey="Approved" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorApprove)" />
                <Area type="monotone" dataKey="Review" stroke="#fbbf24" strokeWidth={2} fillOpacity={0} />
                <Area type="monotone" dataKey="Blocked" stroke="#ef4444" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white border border-slate-200 p-5 rounded-[18px] shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Risk Distribution</h3>
          <div className="flex-1 flex flex-col relative items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={risk_distribution} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" stroke="none">
                  {risk_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-16">
              <span className="text-xl font-bold text-slate-900">24,782</span>
              <span className="text-[10px] text-slate-500">Total</span>
            </div>
            
            <div className="w-full space-y-2 mt-4 px-2">
              {risk_distribution.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: item.color}}></div>
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <div className="font-bold text-slate-900">{item.value}% <span className="text-slate-400 font-normal">({item.count.toLocaleString()})</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white border border-slate-200 p-5 rounded-[18px] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">Recent Alerts</h3>
            <Link href="/dashboard/investigation" className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            {recent_alerts.map((alert: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${alert.risk === 'High' ? 'bg-red-100 text-red-600' : alert.risk === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                     <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{alert.title}</p>
                    <p className="text-[10px] text-slate-500">{alert.id}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-[10px] text-slate-400 mb-1">{alert.time}</p>
                  <span className={`text-[9px] px-2 py-0.5 rounded border font-semibold ${getRiskColor(alert.risk)}`}>{alert.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Fraud Trend, Merchants, Health, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Fraud Trend */}
        <div className="bg-white border border-slate-200 p-5 rounded-[18px] shadow-sm lg:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900">Fraud Trend</h3>
            <select className="bg-slate-50 border border-slate-200 text-xs px-2 py-1 rounded outline-none">
              <option>7 Days</option>
            </select>
          </div>
          <div className="flex gap-4 mb-4 text-[10px] font-semibold text-slate-600">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-indigo-400"></div> Fraud Count</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-500"></div> Fraud Rate (%)</div>
          </div>
          <div className="flex-1 min-h-[220px]">
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={fraud_trend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis yAxisId="left" tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(v)=>`${v}%`} dx={10}/>
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px'}} />
                  <Bar yAxisId="left" dataKey="Fraud Count" fill="#818cf8" radius={[2, 2, 0, 0]} barSize={12} />
                  <Line yAxisId="right" type="monotone" dataKey="Fraud Rate" stroke="#10b981" strokeWidth={2} dot={{r: 3, fill: "#10b981"}} />
               </ComposedChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Top Risky Merchants */}
        <div className="bg-white border border-slate-200 p-5 rounded-[18px] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">Top Risky Merchants</h3>
            <Link href="/dashboard/merchant-360" className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">View All</Link>
          </div>
          <div className="flex-1 space-y-4">
             {top_risky_merchants.map((merchant: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[10px]">
                      {merchant.name.substring(0,2).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-900">{merchant.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-600">{merchant.amount}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded border font-semibold w-12 text-center ${getRiskColor(merchant.risk)}`}>{merchant.risk}</span>
                  </div>
                </div>
             ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white border border-slate-200 p-5 rounded-[18px] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">System Health</h3>
            <Link href="/dashboard/settings" className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">View All</Link>
          </div>
          <div className="flex-1 space-y-4 mt-2">
             {system_health.map((sys: any, i: number) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-3.5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-50 rounded text-slate-400 border border-slate-100">
                      <Server className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{sys.name}</span>
                  </div>
                  <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded font-bold border border-green-100">{sys.status}</span>
                </div>
             ))}
          </div>
        </div>

        {/* Quick Actions & AI Banner */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-[18px] shadow-sm flex-1">
             <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
             <div className="grid grid-cols-2 gap-3">
                <Link href="/dashboard/payments" className="p-3 border border-slate-200 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                  <MonitorPlay className="w-4 h-4 text-indigo-500" />
                  <span className="text-[10px] font-semibold text-slate-700 text-center">Simulate<br/>Transaction</span>
                </Link>
                <Link href="/dashboard/upload" className="p-3 border border-slate-200 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                  <UploadCloud className="w-4 h-4 text-purple-500" />
                  <span className="text-[10px] font-semibold text-slate-700 text-center">Upload<br/>Dataset</span>
                </Link>
             </div>
          </div>
          <div className="bg-indigo-50/80 border border-indigo-100 p-5 rounded-[18px] flex gap-4 items-center relative overflow-hidden">
             <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-200 rounded-full opacity-50 blur-xl"></div>
             <div className="flex-1 relative z-10">
                <h3 className="text-sm font-bold text-indigo-950 mb-1">AI Powered Protection</h3>
                <p className="text-[10px] text-indigo-800/80 mb-3 leading-relaxed">Our AI model is actively analyzing patterns and protecting your business in real-time.</p>
                <button className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors shadow-sm">
                  View Model Performance
                </button>
             </div>
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center relative z-10 shrink-0 border border-indigo-200 shadow-sm">
                <Lock className="w-4 h-4 text-indigo-600" />
             </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white border border-slate-200 rounded-[18px] shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
          <Link href="/dashboard/payments" className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="px-5 py-3 font-semibold">TXN ID</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Merchant</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Risk Score</th>
                <th className="px-5 py-3 font-semibold">Decision</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {recent_transactions.map((tx: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-600">{tx.txn_id}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">{tx.customer}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">{tx.merchant}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">₹ {tx.amount.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`font-bold ${tx.risk_score > 70 ? 'text-red-500' : tx.risk_score > 40 ? 'text-amber-500' : 'text-green-500'}`}>
                      {tx.risk_score}
                    </span>
                  </td>
                  <td className="px-5 py-3">{getDecisionBadge(tx.decision)}</td>
                  <td className="px-5 py-3 text-slate-500 font-medium">{tx.status}</td>
                  <td className="px-5 py-3 text-slate-500">{tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
