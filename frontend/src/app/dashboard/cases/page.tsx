"use client";
import { useState } from "react";
import { Search, Filter, ShieldAlert, Eye, CheckCircle } from "lucide-react";

export default function FraudCasesPage() {
  const [cases] = useState([
    { id: "CASE-1092", txId: "TXN1234567892", customer: "John Doe", merchant: "Apple Store", amount: "$1,250.00", risk: "High", status: "Open" },
    { id: "CASE-1093", txId: "TXN9988776655", customer: "Jane Smith", merchant: "Amazon", amount: "$4,500.00", risk: "Critical", status: "Open" },
    { id: "CASE-1090", txId: "TXN1122334455", customer: "Mike Johnson", merchant: "Best Buy", amount: "$899.99", risk: "Medium", status: "Investigating" },
    { id: "CASE-1085", txId: "TXN5544332211", customer: "Sarah Williams", merchant: "Target", amount: "$150.00", risk: "Low", status: "Closed" },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fraud Cases</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and investigate flagged transactions.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search cases or transactions..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-slate-600 font-medium shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" /> Filters
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
              <th className="px-5 py-3 font-semibold">Case ID</th>
              <th className="px-5 py-3 font-semibold">Transaction</th>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Amount</th>
              <th className="px-5 py-3 font-semibold">Risk Level</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {cases.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4 font-bold text-blue-600 cursor-pointer hover:underline">{c.id}</td>
                <td className="px-5 py-4 font-mono text-xs text-slate-600">{c.txId}</td>
                <td className="px-5 py-4 font-semibold text-slate-900">{c.customer}</td>
                <td className="px-5 py-4 font-semibold text-slate-900">{c.amount}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${c.risk === 'Critical' ? 'bg-red-100 text-red-700' : c.risk === 'High' ? 'bg-orange-100 text-orange-700' : c.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {c.risk}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs font-bold text-slate-600">{c.status}</td>
                <td className="px-5 py-4">
                  <button className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1">
                    <Eye className="w-4 h-4" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
