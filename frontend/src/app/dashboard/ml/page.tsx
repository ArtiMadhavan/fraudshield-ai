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

  useEffect(() => {
    api.get("/system/ml-metrics").then(res => setData(res.data)).catch(err => console.error(err));
  }, []);

  if (!data) {
    return <div className="flex h-96 items-center justify-center text-muted-foreground animate-pulse">Loading ML Metrics...</div>;
  }
  return (
    <div className="space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Machine Learning Engine</h1>
          <p className="text-sm text-muted-foreground">Monitor performance metrics and feature importance of the Fraud AI model.</p>
        </div>
        <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-all border border-border flex items-center gap-2">
          <Database className="w-4 h-4" />
          Retrain Model
        </button>
      </div>

      {/* Model Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary border border-primary/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Model</p>
            <p className="text-lg font-bold">{data.active_model}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-success/10 rounded-lg text-success border border-success/20">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">F1 Score</p>
            <p className="text-lg font-bold">{data.f1_score}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-warning/10 rounded-lg text-warning border border-warning/20">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Precision</p>
            <p className="text-lg font-bold">{data.precision}%</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-destructive/10 rounded-lg text-destructive border border-destructive/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Training Data</p>
            <p className="text-lg font-bold">{data.training_data} rows</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Comparison Radar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold mb-6">Model Comparison Analysis</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.modelComparison}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" />
                <Radar name="XGBoost" dataKey="XGBoost" stroke="#2563EB" fill="#2563EB" fillOpacity={0.5} />
                <Radar name="Random Forest" dataKey="RandomForest" stroke="#22C55E" fill="#22C55E" fillOpacity={0.3} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">XGBoost</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">Random Forest</span>
            </div>
          </div>
        </motion.div>

        {/* Feature Importance Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold mb-6">SHAP Feature Importance</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.featureImportance} margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" opacity={0.5} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={20}>
                  {data.featureImportance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#EF4444' : index === 1 ? '#F59E0B' : '#2563EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
