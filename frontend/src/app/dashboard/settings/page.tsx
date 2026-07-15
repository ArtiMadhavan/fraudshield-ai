"use client";

import { useState } from "react";
import { Database, AlertTriangle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error' | null, message: string}>({ type: null, message: '' });

  const loadDemoData = async () => {
    setLoading(true);
    setStatus({ type: null, message: '' });
    try {
      const response = await api.post('/system/load-demo-data');
      setStatus({ type: 'success', message: response.data.message || 'Demo data loaded successfully' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error.response?.data?.detail || 'Failed to load demo data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
        <p className="text-slate-500 mt-1">Manage platform configuration and data.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Database className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-800">Demonstration Data</h3>
            <p className="text-slate-500 mt-1 mb-4 text-sm">
              Populate the system with 500 simulated realistic Indian FinTech transactions, including fraud cases, alerts, customers, and merchants. This will replace all existing data.
            </p>
            
            {status.type && (
              <div className={`p-4 rounded-lg mb-4 flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                <p className="text-sm font-medium">{status.message}</p>
              </div>
            )}
            
            <button
              onClick={loadDemoData}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                'Load Demo Data'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
