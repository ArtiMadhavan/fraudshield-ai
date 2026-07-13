"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TerminalSquare, FileJson, UploadCloud, Play, 
  CheckCircle, AlertTriangle, XCircle, BrainCircuit, Activity, ChevronRight
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type InputMethod = "form" | "json" | "file";

interface PredictionResult {
  decision: string;
  risk_score: number;
  fraud_probability: number;
  confidence: number;
  risk_level: string;
  reasons: string[];
  recommendation: string;
  transaction_id?: string;
}

export default function AITestingConsole() {
  const [method, setMethod] = useState<InputMethod>("json");
  const [jsonInput, setJsonInput] = useState("{\n  \"customer_id\": \"CUST-9921\",\n  \"merchant_id\": \"M-APPLE\",\n  \"amount\": 1250.00,\n  \"currency\": \"USD\",\n  \"payment_method\": \"Credit Card\",\n  \"device\": \"Desktop\",\n  \"browser\": \"Chrome\",\n  \"os\": \"Windows\",\n  \"location\": \"New York, USA\",\n  \"ip_address\": \"192.168.1.1\",\n  \"transaction_type\": \"Purchase\"\n}");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [timelineStep, setTimelineStep] = useState(0);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setResult(null);
      setTimelineStep(1); // Received

      // Parse JSON
      let payload;
      try {
        payload = JSON.parse(jsonInput);
      } catch (e) {
        alert("Invalid JSON format");
        setLoading(false);
        return;
      }

      setTimeout(() => setTimelineStep(2), 500); // Validated
      setTimeout(() => setTimelineStep(3), 1000); // ML Prediction
      setTimeout(() => setTimelineStep(4), 1500); // Rules
      
      const res = await api.post("/payments/process", payload);
      
      setTimeout(() => {
        setTimelineStep(5); // Decision
        setResult(res.data);
        setLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Testing Console</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">Internal Enterprise Tool for manual transaction testing and ML inference validation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Input */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[18px] shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setMethod("form")}
                className={cn("flex-1 py-3 text-sm font-semibold transition-colors", method === "form" ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50" : "text-slate-500 hover:bg-slate-50")}
              >
                Manual Form
              </button>
              <button 
                onClick={() => setMethod("json")}
                className={cn("flex-1 py-3 text-sm font-semibold transition-colors", method === "json" ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50" : "text-slate-500 hover:bg-slate-50")}
              >
                Raw JSON
              </button>
              <button 
                onClick={() => setMethod("file")}
                className={cn("flex-1 py-3 text-sm font-semibold transition-colors", method === "file" ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50" : "text-slate-500 hover:bg-slate-50")}
              >
                CSV / JSON
              </button>
            </div>

            <div className="p-6">
              {method === "json" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <FileJson className="w-4 h-4" /> Transaction Payload
                    </label>
                  </div>
                  <textarea 
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-80 bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-sm border border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none custom-scrollbar"
                    spellCheck={false}
                  />
                </div>
              )}
              {method === "form" && (
                <div className="h-80 flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                  Manual form builder coming soon. Use Raw JSON for now.
                </div>
              )}
              {method === "file" && (
                <div className="h-80 flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                  <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
                  <p className="font-semibold text-slate-600">Click to upload CSV or JSON file</p>
                  <p className="text-xs mt-1">Batch processing supports up to 10,000 rows</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md flex justify-center items-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <Activity className="w-5 h-5 animate-pulse" /> : <Play className="w-5 h-5 fill-current" />}
                Analyze Transaction
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Output & Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {!loading && !result && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-200 rounded-[18px] border-dashed">
                <BrainCircuit className="w-12 h-12 mb-4 text-slate-300" />
                <p className="font-medium text-slate-500">Waiting for transaction payload...</p>
              </motion.div>
            )}

            {(loading || result) && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 rounded-[18px] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
                  <BrainCircuit className={cn("w-5 h-5 text-indigo-600", loading && "animate-pulse")} />
                  <h2 className="font-bold text-slate-900">AI Decision Engine Analysis</h2>
                </div>
                
                <div className="p-6 lg:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Left Output */}
                    <div>
                      {loading ? (
                        <div className="h-32 flex items-center justify-center border border-slate-100 rounded-xl bg-slate-50">
                           <Activity className="w-8 h-8 text-indigo-400 animate-spin" />
                        </div>
                      ) : (
                        <div className={cn("h-32 flex flex-col items-center justify-center border rounded-xl", 
                           result?.decision === "APPROVE" ? "border-emerald-200 bg-emerald-50" : 
                           result?.decision === "REVIEW" ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"
                        )}>
                          {result?.decision === "APPROVE" ? <CheckCircle className="w-10 h-10 text-emerald-600 mb-2" /> :
                           result?.decision === "REVIEW" ? <AlertTriangle className="w-10 h-10 text-amber-600 mb-2" /> :
                           <XCircle className="w-10 h-10 text-red-600 mb-2" />}
                          <h3 className={cn("text-2xl font-black tracking-tight", 
                             result?.decision === "APPROVE" ? "text-emerald-700" : 
                             result?.decision === "REVIEW" ? "text-amber-700" : "text-red-700"
                          )}>
                             {result?.decision || "UNKNOWN"}
                          </h3>
                        </div>
                      )}
                    </div>
                    
                    {/* Right Output */}
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                          <p className="text-xs font-bold text-slate-400 uppercase">Risk Score</p>
                          <p className={cn("text-3xl font-black mt-1", result?.risk_level === "Critical" ? "text-red-600" : "text-slate-900")}>
                            {loading ? "--" : result?.risk_score}
                          </p>
                       </div>
                       <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                          <p className="text-xs font-bold text-slate-400 uppercase">Confidence</p>
                          <p className="text-3xl font-black mt-1 text-slate-900">{loading ? "--" : `${result?.confidence}%`}</p>
                       </div>
                       <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl col-span-2">
                          <p className="text-xs font-bold text-slate-400 uppercase flex justify-between">
                            <span>Fraud Probability</span>
                            <span className={cn(
                              result?.fraud_probability && result.fraud_probability > 0.8 ? "text-red-600" : "text-slate-900"
                            )}>{loading ? "--" : `${(result?.fraud_probability || 0) * 100}%`}</span>
                          </p>
                          <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
                             <div className={cn("h-full transition-all duration-1000", result?.fraud_probability && result.fraud_probability > 0.8 ? "bg-red-500" : "bg-indigo-500")} style={{ width: `${(result?.fraud_probability || 0) * 100}%` }}></div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Rule-Based Explanations */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Business Rules Triggered</h4>
                    {loading ? (
                      <div className="space-y-2">
                         <div className="h-10 bg-slate-100 rounded-lg animate-pulse w-3/4"></div>
                         <div className="h-10 bg-slate-100 rounded-lg animate-pulse w-1/2"></div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {result?.reasons?.map((reason, i) => (
                          <div key={i} className="flex items-start gap-3 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/50">
                            <Activity className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-slate-700">{reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Recommendation */}
                  {!loading && result && (
                    <div className="mt-6 bg-slate-900 p-5 rounded-xl text-white">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Recommendation</p>
                      <p className="text-sm font-medium">{result.recommendation}</p>
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Timeline Animation */}
          {(loading || result) && (
            <div className="bg-white border border-slate-200 rounded-[18px] p-6 shadow-sm overflow-hidden">
               <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-6">
                 <span className={cn("transition-colors", timelineStep >= 1 ? "text-indigo-600" : "text-slate-300")}>Received</span>
                 <ChevronRight className="w-4 h-4 text-slate-200" />
                 <span className={cn("transition-colors", timelineStep >= 2 ? "text-indigo-600" : "text-slate-300")}>Validated</span>
                 <ChevronRight className="w-4 h-4 text-slate-200" />
                 <span className={cn("transition-colors", timelineStep >= 3 ? "text-indigo-600" : "text-slate-300")}>ML Infer</span>
                 <ChevronRight className="w-4 h-4 text-slate-200" />
                 <span className={cn("transition-colors", timelineStep >= 4 ? "text-indigo-600" : "text-slate-300")}>Rules</span>
                 <ChevronRight className="w-4 h-4 text-slate-200" />
                 <span className={cn("transition-colors", timelineStep >= 5 ? "text-emerald-600" : "text-slate-300")}>Decision</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                 <div className="h-full bg-indigo-600 transition-all duration-500 ease-out" style={{ width: `${(timelineStep / 5) * 100}%` }}></div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
