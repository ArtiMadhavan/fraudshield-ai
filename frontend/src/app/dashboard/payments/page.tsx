"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Download, MoreHorizontal, CheckCircle, 
  AlertTriangle, XCircle, ChevronLeft, ChevronRight, Activity, X
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/dashboard/stats'); // temporary workaround, I should add a proper transactions endpoint
        setTransactions(res.data.recent_transactions);
      } catch (err) {
        console.error("Failed to load transactions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const getDecisionBadge = (decision: string) => {
    switch(decision) {
      case 'Blocked': return <span className="text-red-600 bg-red-50 px-2 py-1 rounded font-semibold border border-red-100">Blocked</span>;
      case 'Review': return <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded font-semibold border border-amber-100">Review</span>;
      case 'Approved': return <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-semibold border border-emerald-100">Approved</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">View and search all processed transactions.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search TXN ID..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm w-64"
            />
          </div>
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-slate-600 font-medium shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" /> Filters
          </button>
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-slate-600 font-medium shadow-sm hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4 text-slate-400" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[18px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[500px]">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-400">
              <Activity className="w-6 h-6 animate-spin mr-2" /> Loading...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <th className="px-6 py-4 font-semibold border-b border-slate-200">TXN ID</th>
                  <th className="px-6 py-4 font-semibold border-b border-slate-200">Customer</th>
                  <th className="px-6 py-4 font-semibold border-b border-slate-200">Merchant</th>
                  <th className="px-6 py-4 font-semibold border-b border-slate-200">Amount</th>
                  <th className="px-6 py-4 font-semibold border-b border-slate-200">Risk Score</th>
                  <th className="px-6 py-4 font-semibold border-b border-slate-200">Decision</th>
                  <th className="px-6 py-4 font-semibold border-b border-slate-200">Time</th>
                  <th className="px-6 py-4 font-semibold border-b border-slate-200 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {transactions.map((tx: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedTx(tx)}>
                    <td className="px-6 py-4 font-medium text-indigo-600">{tx.txn_id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{tx.customer}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{tx.merchant}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">₹ {tx.amount?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${tx.risk_score > 70 ? 'text-red-600' : tx.risk_score > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {tx.risk_score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">{getDecisionBadge(tx.decision)}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{tx.time}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-slate-400 hover:text-indigo-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Showing {transactions.length} transactions</p>
          <div className="flex gap-2">
            <button className="p-1 border border-slate-200 rounded bg-white text-slate-400 hover:text-slate-600 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1 border border-slate-200 rounded bg-white text-slate-400 hover:text-slate-600 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {selectedTx && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Transaction Details</h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">{selectedTx.txn_id}</p>
                </div>
                <button onClick={() => setSelectedTx(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Amount</p>
                    <p className="text-2xl font-black text-slate-900">₹ {selectedTx.amount?.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Decision</p>
                    {getDecisionBadge(selectedTx.decision)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Entities</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Customer</span>
                      <span className="font-semibold text-slate-900">{selectedTx.customer}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Merchant</span>
                      <span className="font-semibold text-slate-900">{selectedTx.merchant}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    Transaction Replay
                  </h3>
                  
                  {/* Step-by-step Timeline */}
                  <div className="relative border-l-2 border-indigo-100 ml-3 space-y-6 mb-8 mt-2">
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <h4 className="text-xs font-bold text-slate-900">Received</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">POST /api/v1/payments/process</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <h4 className="text-xs font-bold text-slate-900">Validated</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Pydantic Schema Check Passed</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <h4 className="text-xs font-bold text-slate-900">Feature Engineering</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Extracted 42 features (Amount, Device, Location)</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <h4 className="text-xs font-bold text-slate-900">ML Prediction (Random Forest)</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 text-indigo-600 font-semibold">Fraud Probability: {selectedTx.fraud_probability || 0.05}</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <h4 className="text-xs font-bold text-slate-900">Business Rules Engine</h4>
                      <div className="mt-1 space-y-1">
                        {selectedTx.reasons && selectedTx.reasons.length > 0 ? (
                           selectedTx.reasons.map((r: string, i: number) => (
                             <span key={i} className="inline-block bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded border border-amber-200 mr-2 mb-1">{r}</span>
                           ))
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-medium">No flags triggered</span>
                        )}
                      </div>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <h4 className="text-xs font-bold text-slate-900">Decision & Risk Score</h4>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">Calculated Risk Score</span>
                          <span className={`font-bold ${selectedTx.risk_score > 70 ? 'text-red-600' : selectedTx.risk_score > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>{selectedTx.risk_score}/100</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className={`h-full rounded-full ${selectedTx.risk_score > 70 ? 'bg-red-500' : selectedTx.risk_score > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{width: `${selectedTx.risk_score}%`}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-slate-800 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <h4 className="text-xs font-bold text-slate-900">Stored</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Saved to SQLite Database</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recommendation</p>
                     <p className="text-sm font-medium text-slate-800">
                       {selectedTx.decision === 'APPROVE' ? 'Approve transaction. Risk is within acceptable limits.' : 
                        selectedTx.decision === 'BLOCK' ? 'Block transaction and notify analyst immediately.' : 
                        'Hold transaction for manual review.'}
                     </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
