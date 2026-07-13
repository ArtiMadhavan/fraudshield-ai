"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Database, Sliders, CheckCircle } from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell
} from 'recharts';

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function MachineLearningPage() {
  const [data, setData] = useState<{
    active_model: string;
    f1_score: number;
    precision: number;
    training_data: string;
    featureImportance: any[];
    modelComparison: any[];
  } | null>(null);
  const [training, setTraining] = useState(false);

  const fetchMetrics = () => {
    api.get("/system/ml-metrics").then(res => setData(res.data)).catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleRetrain = async () => {
    try {
      setTraining(true);
      await api.post("/system/train-model");
      fetchMetrics();
    } catch (err) {
      console.error(err);
    } finally {
      setTraining(false);
    }
  };

  if (!data) {
    return <div className="flex h-96 items-center justify-center text-muted-foreground animate-pulse">Loading ML Metrics...</div>;
  }
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Machine Learning Engine</h1>
          <p className="text-sm text-slate-500 font-medium">Monitor performance metrics and feature importance of the Fraud AI model.</p>
        </div>
        <button 
          onClick={handleRetrain}
          disabled={training}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm shadow-indigo-200 flex items-center gap-2 disabled:opacity-50">
          <Database className="w-4 h-4" />
          {training ? "Training Models..." : "Retrain Model"}
        </button>
      </div>

      {/* Model Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-[18px] p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Active Model</p>
            <p className="text-xl font-bold text-slate-900">{data.active_model}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-[18px] p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">F1 Score</p>
            <p className="text-xl font-bold text-slate-900">{data.f1_score}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-[18px] p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Precision</p>
            <p className="text-xl font-bold text-slate-900">{data.precision}%</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-[18px] p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Training Data</p>
            <p className="text-xl font-bold text-slate-900">{data.training_data} rows</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Model Comparison Radar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 rounded-[18px] p-8 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6">Model Comparison Analysis</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.modelComparison}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar name="Champion Model" dataKey="ActiveModel" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.5} />
                <Radar name="Baseline (50%)" dataKey="Baseline" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
               <span className="text-sm font-medium text-slate-500">Champion Model</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-emerald-500 rounded-full opacity-50"></div>
               <span className="text-sm font-medium text-slate-500">Baseline (50%)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
