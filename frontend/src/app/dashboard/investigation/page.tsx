"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  flexRender, 
  getCoreRowModel, 
  getSortedRowModel, 
  useReactTable, 
  SortingState 
} from "@tanstack/react-table";
import { ShieldAlert, ArrowUpDown, ChevronLeft, ChevronRight, X, CheckCircle, XCircle, PauseCircle } from "lucide-react";

export default function InvestigationWorkspace() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/investigations');
      setAlerts(res.data);
    } catch (err) {
      console.error("Failed to load alerts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleUpdateStatus = async (alertId: number, status: string) => {
    try {
      await api.put(`/investigations/${alertId}`, { status, analyst_notes: "Updated from workspace" });
      setSelectedAlert(null);
      fetchAlerts();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const columns = [
    {
      accessorKey: "transaction_id",
      header: "Transaction ID",
      cell: ({ row }: any) => <span className="font-mono text-xs">{row.original.transaction_id}</span>,
    },
    {
      accessorKey: "risk_level",
      header: ({ column }: any) => (
        <button className="flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Risk <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: ({ row }: any) => {
        const r = row.original.risk_level;
        const color = r === "Critical" ? "text-red-600 bg-red-100" : r === "High" ? "text-amber-600 bg-amber-100" : "text-blue-600 bg-blue-100";
        return <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{r}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        return <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700">{row.original.status}</span>;
      },
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }: any) => <span className="text-xs text-slate-500">{row.original.time}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <button 
          onClick={() => setSelectedAlert(row.original)}
          className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
          Investigate
        </button>
      )
    }
  ];

  const table = useReactTable({
    data: alerts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Investigation Workspace</h1>
          <p className="text-sm text-slate-500 font-medium">Review and resolve active fraud alerts.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[18px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-400 font-medium">Loading alerts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-slate-50 border-b border-slate-100">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Modal for Investigation Detail */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm transition-all">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Alert Details</h2>
                  <p className="text-xs font-mono text-slate-500">{selectedAlert.transaction_id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAlert(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                   <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Risk Score</p>
                   <p className={`text-2xl font-bold ${selectedAlert.risk_level === 'Critical' ? 'text-red-600' : 'text-amber-600'}`}>
                     {selectedAlert.risk_score} <span className="text-sm font-medium text-slate-400">/100</span>
                   </p>
                 </div>
                 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                   <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">ML Confidence</p>
                   <p className="text-2xl font-bold text-slate-900">{(selectedAlert.confidence * 100).toFixed(1)}%</p>
                 </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">Rule Triggers & Explanations</h3>
                <div className="space-y-3">
                  {selectedAlert.reasons?.map((reason: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start bg-amber-50/50 border border-amber-100 p-3 rounded-lg">
                      <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-slate-700">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">Transaction Info</h3>
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Amount</span>
                    <span className="text-sm font-bold text-slate-900">{selectedAlert.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Time</span>
                    <span className="text-sm font-medium text-slate-900">{selectedAlert.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Customer</span>
                    <span className="text-sm font-medium text-indigo-600 cursor-pointer hover:underline">{selectedAlert.customer?.name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex gap-3">
               <button 
                onClick={() => handleUpdateStatus(selectedAlert.id, "CLOSED")}
                className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
                 <CheckCircle className="w-4 h-4" /> Approve
               </button>
               <button 
                onClick={() => handleUpdateStatus(selectedAlert.id, "INVESTIGATING")}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 hover:bg-red-700 transition-colors shadow-sm shadow-red-200">
                 <XCircle className="w-4 h-4" /> Block
               </button>
               <button 
                onClick={() => handleUpdateStatus(selectedAlert.id, "FROZEN")}
                className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                 <PauseCircle className="w-4 h-4" /> Freeze
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
