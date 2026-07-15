"use client";

import { useState } from "react";
import { Shield, Lock, CreditCard, Smartphone, Wallet, Building, ArrowRight, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function MerchantSandbox() {
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [status, setStatus] = useState<"idle" | "analyzing" | "success" | "blocked">("idle");
  const [decisionData, setDecisionData] = useState<any>(null);

  const handlePayment = async () => {
    setStatus("analyzing");
    setDecisionData(null);
    
    // Simulate some network delay for the UX feel
    await new Promise(r => setTimeout(r, 600));

    try {
      // Send real data to the backend API
      const response = await api.post("/payments/process", {
        customer_name: "Demo Customer",
        customer_mobile: "9876543210",
        merchant_name: "TechStore India",
        merchant_category: "Electronics",
        amount: 74999,
        payment_method: paymentMethod,
        device: "Desktop Safari",
        city: "Mumbai",
        state: "MH",
        ip_address: "103.45.67.89"
      });

      const data = response.data;
      setDecisionData(data);
      
      if (data.decision === "APPROVE") {
        setStatus("success");
      } else {
        setStatus("blocked");
      }
    } catch (error) {
      console.error("Payment failed", error);
      setStatus("blocked");
      setDecisionData({
        decision: "ERROR",
        reasons: ["API Connection Failed"]
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Product Summary */}
        <div className="flex-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-8 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">M</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-900">TechStore India</h1>
              <p className="text-xs text-slate-500">Demo Merchant Environment</p>
            </div>
          </div>
          
          <div className="space-y-6">
             <div className="flex justify-between items-start">
               <div>
                 <h2 className="text-xl font-bold text-slate-900">Apple MacBook Air M3</h2>
                 <p className="text-sm text-slate-500 mt-1">13-inch, 8-Core CPU, 8-Core GPU, 8GB Unified Memory, 256GB SSD Storage - Midnight</p>
               </div>
               <div className="w-24 h-24 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="12" x="3" y="4" rx="2" ry="2"/><line x1="2" x2="22" y1="20" y2="20"/></svg>
               </div>
             </div>
             
             <div className="pt-6 border-t border-slate-100 space-y-3 text-sm">
               <div className="flex justify-between text-slate-600">
                 <span>Subtotal</span>
                 <span>₹74,999.00</span>
               </div>
               <div className="flex justify-between text-slate-600">
                 <span>Taxes (GST 18%)</span>
                 <span>Included</span>
               </div>
               <div className="flex justify-between font-bold text-lg text-slate-900 pt-3 border-t border-slate-100">
                 <span>Total</span>
                 <span>₹74,999.00</span>
               </div>
             </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="flex-1">
          {status === "idle" && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-bl-xl border-b border-l border-indigo-100 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Secured by FraudShield AI
               </div>
               
               <h3 className="text-lg font-bold text-slate-900 mb-6 mt-2">Payment Details</h3>
               
               <div className="space-y-3 mb-8">
                 <button onClick={() => setPaymentMethod("UPI")} className={`w-full flex items-center p-4 border rounded-xl transition-all ${paymentMethod === 'UPI' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                    <Smartphone className={`w-5 h-5 mr-3 ${paymentMethod === 'UPI' ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <span className="font-semibold text-sm">UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                 </button>
                 
                 {paymentMethod === 'UPI' && (
                   <div className="grid grid-cols-4 gap-2 pt-2 pb-4 animate-in fade-in slide-in-from-top-2">
                     <div className="border border-indigo-200 bg-white rounded-lg p-3 text-center cursor-pointer hover:border-indigo-500 transition-colors shadow-sm">
                       <span className="text-xs font-bold text-slate-700 block">GPay</span>
                     </div>
                     <div className="border border-indigo-200 bg-white rounded-lg p-3 text-center cursor-pointer hover:border-indigo-500 transition-colors shadow-sm">
                       <span className="text-xs font-bold text-slate-700 block">PhonePe</span>
                     </div>
                     <div className="border border-indigo-200 bg-white rounded-lg p-3 text-center cursor-pointer hover:border-indigo-500 transition-colors shadow-sm">
                       <span className="text-xs font-bold text-slate-700 block">Paytm</span>
                     </div>
                     <div className="border border-indigo-200 bg-white rounded-lg p-3 text-center cursor-pointer hover:border-indigo-500 transition-colors shadow-sm">
                       <span className="text-xs font-bold text-slate-700 block">BHIM</span>
                     </div>
                   </div>
                 )}
                 
                 <button onClick={() => setPaymentMethod("Debit Card")} className={`w-full flex items-center p-4 border rounded-xl transition-all ${paymentMethod === 'Debit Card' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                    <CreditCard className={`w-5 h-5 mr-3 ${paymentMethod === 'Debit Card' ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <span className="font-semibold text-sm">Debit Card / Credit Card</span>
                 </button>
                 <button onClick={() => setPaymentMethod("Net Banking")} className={`w-full flex items-center p-4 border rounded-xl transition-all ${paymentMethod === 'Net Banking' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                    <Building className={`w-5 h-5 mr-3 ${paymentMethod === 'Net Banking' ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <span className="font-semibold text-sm">Net Banking</span>
                 </button>
               </div>
               
               <button 
                  onClick={handlePayment}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
               >
                  <Lock className="w-4 h-4" /> Pay Securely ₹74,999
               </button>
               
               <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1">
                 <Shield className="w-3 h-3" /> Transactions are simulated for demonstration.
               </p>
            </div>
          )}

          {status === "analyzing" && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[400px]">
               <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
               <h3 className="text-xl font-bold text-slate-900">Authenticating...</h3>
               <p className="text-sm text-slate-500 mt-2 text-center">FraudShield AI is analyzing the transaction footprint across 40+ risk parameters.</p>
            </div>
          )}

          {status === "success" && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[400px] text-center">
               <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle className="w-10 h-10 text-emerald-600" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900">Payment Successful</h3>
               <p className="text-slate-500 mt-2 mb-8">Your order has been placed successfully.</p>
               
               <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 text-left mb-8">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">FraudShield AI Analysis</p>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-600">Decision</span>
                   <span className="font-bold text-emerald-600">{decisionData?.decision}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm mt-1">
                   <span className="text-slate-600">Risk Score</span>
                   <span className="font-bold text-slate-900">{decisionData?.risk_score}/100</span>
                 </div>
               </div>

               <button onClick={() => setStatus("idle")} className="text-indigo-600 font-semibold hover:underline">
                 Test another payment
               </button>
            </div>
          )}

          {status === "blocked" && (
            <div className="bg-white rounded-3xl p-12 border border-red-200 shadow-sm shadow-red-500/5 flex flex-col items-center justify-center h-full min-h-[400px] text-center">
               <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                 <XCircle className="w-10 h-10 text-red-600" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900">Payment Blocked</h3>
               <p className="text-slate-500 mt-2 mb-8">This transaction was flagged as high-risk and declined for your security.</p>
               
               <div className="w-full bg-red-50 p-4 rounded-xl border border-red-100 text-left mb-8">
                 <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">FraudShield AI Analysis</p>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-600">Decision</span>
                   <span className="font-bold text-red-600">{decisionData?.decision}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm mt-1">
                   <span className="text-slate-600">Risk Score</span>
                   <span className="font-bold text-slate-900">{decisionData?.risk_score}/100</span>
                 </div>
                 {decisionData?.reasons && decisionData.reasons.length > 0 && (
                   <div className="mt-3 pt-3 border-t border-red-200/50">
                     <span className="text-xs text-slate-500 block mb-1">Triggered Rules:</span>
                     <ul className="text-xs font-medium text-red-700 list-disc list-inside">
                       {decisionData.reasons.map((r: string, i: number) => (
                         <li key={i}>{r}</li>
                       ))}
                     </ul>
                   </div>
                 )}
               </div>

               <button onClick={() => setStatus("idle")} className="text-indigo-600 font-semibold hover:underline">
                 Try another method
               </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-12 text-center">
         <Link href="/dashboard" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Dashboard
         </Link>
      </div>
    </div>
  );
}
