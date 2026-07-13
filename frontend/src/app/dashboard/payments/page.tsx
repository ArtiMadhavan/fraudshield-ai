"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, CheckCircle, AlertTriangle, XCircle, ShieldAlert, Smartphone, Loader2, BrainCircuit, Activity, Lock, Check } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

const API_BASE = "http://localhost:8000/api/v1";

type PaymentStep = "details" | "otp" | "processing" | "result";

interface PaymentResult {
  decision: string;
  transaction_id?: string;
  risk_level: string;
  risk_score?: number;
  confidence: number;
  explanations: string[];
}

const processingSteps = [
  "Receiving Encrypted Payload...",
  "Extracting Transaction Features...",
  "Running Gradient Boosting Model...",
  "Calculating Anomaly Score...",
  "Applying Rule-Based Explainability...",
  "Finalizing AI Decision..."
];

export default function PaymentFlow() {
  const [step, setStep] = useState<PaymentStep>("details");
  const [amount, setAmount] = useState("1250.00");
  const [merchant, setMerchant] = useState("Apple Store");
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState<PaymentResult | null>(null);
  
  // For animation
  const [currentProcessIndex, setCurrentProcessIndex] = useState(0);

  const handleSendOTP = () => {
    setStep("otp");
  };

  const handleVerifyOTP = async () => {
    setStep("processing");
    setCurrentProcessIndex(0);
    
    // Simulate complex AI processing visually
    const interval = setInterval(() => {
      setCurrentProcessIndex(prev => {
        if (prev < processingSteps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 600); // 600ms per step

    try {
      // Call backend API concurrently with animation
      const response = await axios.post(`${API_BASE}/transactions/process`, {
        customer_id: "CUST-9921",
        merchant_id: merchant,
        amount: parseFloat(amount),
        currency: "USD",
        payment_method: "Credit Card",
        device: "Desktop",
        browser: "Chrome",
        os: "Windows",
        location: "New York, USA",
        ip_address: "192.168.1.1",
        transaction_type: "Purchase"
      });
      
      // Wait for animation to finish before showing result
      setTimeout(() => {
        setResult(response.data);
        setStep("result");
      }, 4000);

    } catch (error) {
      console.error(error);
      setTimeout(() => {
        setResult({
          decision: "Error",
          risk_level: "Critical",
          confidence: 0,
          explanations: ["Backend API error or unavailable."]
        });
        setStep("result");
      }, 4000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Secure Checkout Simulator</h1>
        <p className="text-muted-foreground">Experience the real-time AI Decision Engine in action.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden relative ring-1 ring-black/5 dark:ring-white/10">
        <div className="p-8 md:p-12">
          
          <AnimatePresence mode="wait">
            {step === "details" && (
              <motion.div 
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center border-b border-border pb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-xl">Payment Details</p>
                      <p className="text-sm text-muted-foreground">Simulating Customer CUST-9921</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Merchant Name</label>
                    <input 
                      type="text" 
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Amount (USD)</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-2xl font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  
                  <button 
                    onClick={handleSendOTP}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl mt-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all"
                  >
                    Proceed to Pay ${amount}
                  </button>
                </div>
                
                <div className="pt-4 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
                   <Lock className="w-3.5 h-3.5" />
                   Secured by FraudShield AI
                </div>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div 
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 text-center py-8"
              >
                <div className="mx-auto w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-primary mb-6 shadow-inner ring-1 ring-black/5 dark:ring-white/10">
                  <Smartphone className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Two-Factor Authentication</h2>
                <p className="text-muted-foreground">A security code has been sent to your registered mobile number ending in **45.</p>
                
                <div className="pt-8 pb-4">
                  <input 
                    type="text" 
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-center text-3xl tracking-[1em] font-mono bg-muted/50 border border-border rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none w-72 mx-auto block placeholder:text-muted-foreground/30"
                    maxLength={6}
                  />
                </div>
                
                <button 
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6}
                  className="w-full max-w-sm mx-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  Verify & Pay
                </button>
                
                <button 
                  onClick={() => setStep("details")}
                  className="w-full max-w-xs mx-auto text-muted-foreground text-sm py-2 hover:text-foreground mt-4 font-medium"
                >
                  Cancel Transaction
                </button>
              </motion.div>
            )}

            {step === "processing" && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12"
              >
                <div className="flex flex-col items-center justify-center mb-12">
                   <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <BrainCircuit className="w-8 h-8 text-primary animate-pulse" />
                      </div>
                   </div>
                   <h2 className="text-2xl font-bold tracking-tight">AI Decision Engine Active</h2>
                   <p className="text-muted-foreground mt-2">Processing transaction securely in real-time...</p>
                </div>
                
                <div className="max-w-md mx-auto space-y-4">
                  {processingSteps.map((s, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                        index < currentProcessIndex ? "bg-success text-success-foreground" :
                        index === currentProcessIndex ? "bg-primary text-primary-foreground animate-pulse" : "bg-muted text-muted-foreground"
                      )}>
                         {index < currentProcessIndex ? <Check className="w-3.5 h-3.5" /> : 
                          index === currentProcessIndex ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 
                          <span className="text-[10px]">{index + 1}</span>}
                      </div>
                      <p className={cn(
                         "text-sm font-medium transition-all duration-300",
                         index < currentProcessIndex ? "text-foreground" :
                         index === currentProcessIndex ? "text-primary font-bold" : "text-muted-foreground"
                      )}>
                        {s}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "result" && result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-4"
              >
                <div className="text-center mb-8">
                  {result.decision === "Approve" ? (
                    <CheckCircle className="w-24 h-24 text-success mx-auto mb-6" />
                  ) : result.decision === "Review" ? (
                    <AlertTriangle className="w-24 h-24 text-warning mx-auto mb-6" />
                  ) : (
                    <XCircle className="w-24 h-24 text-destructive mx-auto mb-6" />
                  )}
                  
                  <h2 className="text-3xl font-bold tracking-tight mb-2">
                    {result.decision === "Approve" ? "Payment Successful" : 
                     result.decision === "Review" ? "Payment Under Review" : "Payment Blocked"}
                  </h2>
                  <p className="text-muted-foreground font-mono bg-muted/50 inline-block px-3 py-1 rounded-md text-sm mt-2">
                    TXN: {result.transaction_id || 'FS-8921-X'}
                  </p>
                </div>

                <div className="bg-card border border-border rounded-2xl shadow-lg mt-8 overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b border-border flex items-center gap-3">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-foreground">Decision Engine Analysis</h3>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-muted/30 p-5 rounded-xl border border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Risk Score</p>
                        <div className="flex items-end gap-2">
                           <p className={cn(
                             "text-4xl font-bold tracking-tight",
                             result.risk_level === "Critical" ? "text-destructive" :
                             result.risk_level === "High" ? "text-destructive/80" :
                             result.risk_level === "Medium" ? "text-warning" : "text-success"
                           )}>{result.risk_score}</p>
                           <span className="text-sm text-muted-foreground font-medium mb-1">/ 100</span>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-5 rounded-xl border border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Confidence</p>
                        <div className="flex items-end gap-2">
                           <p className="text-4xl font-bold tracking-tight">{result.confidence}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Rule-Based Explanations</p>
                      <div className="space-y-2">
                        {result.explanations.map((reason: string, i: number) => (
                          <div key={i} className="flex items-start gap-3 bg-muted/30 p-3 rounded-lg border border-border/50">
                            <Activity className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm font-medium">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-center">
                  <button 
                    onClick={() => {setStep("details"); setOtp("");}}
                    className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-8 py-3.5 rounded-xl transition-all"
                  >
                    Start New Simulation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
