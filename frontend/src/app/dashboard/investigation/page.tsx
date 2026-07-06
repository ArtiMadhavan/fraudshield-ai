"use client";

import { motion } from "framer-motion";
import { ShieldAlert, CheckCircle, XCircle, PauseCircle, Clock, MapPin, Monitor, CreditCard, Activity, ArrowRight, User, Building, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InvestigationWorkspace() {
  // Mock Data
  const alert = {
    id: "ALRT-8842",
    transaction_id: "TRX-9982",
    amount: "$4,500.00",
    time: "2026-07-06 14:32:01",
    status: "Investigating",
    risk_score: 98,
    risk_level: "Critical",
    confidence: 96.5,
    customer: { id: "CUST-9921", name: "John Doe", risk: 85, history: "High risk profile" },
    merchant: { id: "MERCH-AMZ", name: "CryptoEx", risk: 12.4, category: "Cryptocurrency" },
    device: { type: "Desktop", os: "Windows 11", browser: "Chrome 120", ip: "104.21.44.22", location: "Russia" },
    reasons: [
      "Transaction amount ($4,500.00) is significantly higher than customer's average ($500.00).",
      "Payment initiated from a new or unrecognized device.",
      "Transaction originated from a high-risk geographic location (Russia).",
      "Merchant has a high historical fraud rate (12.4%)."
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-6 border-b border-border/50 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Investigation Workspace</h1>
            <span className="bg-destructive/15 text-destructive text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-sm">
              {alert.risk_level} Risk
            </span>
          </div>
          <p className="text-muted-foreground font-medium">Alert ID: {alert.id} • Transaction: {alert.transaction_id}</p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none bg-success text-success-foreground px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-success/90 shadow-sm shadow-success/20">
            <CheckCircle className="w-4 h-4" /> Approve
          </button>
          <button className="flex-1 lg:flex-none bg-destructive text-destructive-foreground px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-destructive/90 shadow-sm shadow-destructive/20">
            <XCircle className="w-4 h-4" /> Reject
          </button>
          <button className="flex-1 lg:flex-none bg-secondary text-secondary-foreground border border-border px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-muted shadow-sm">
            <PauseCircle className="w-4 h-4" /> Freeze
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: AI Decision Engine Output */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-destructive/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="p-2.5 bg-destructive/15 rounded-xl text-destructive">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">AI Decision Engine Analysis</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-8 relative z-10">
              <div className="bg-card border border-border/50 p-5 rounded-xl shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Risk Score</p>
                <div className="flex items-end gap-1">
                   <p className="text-4xl font-bold tracking-tight text-destructive">{alert.risk_score}</p>
                   <p className="text-sm font-medium text-muted-foreground mb-1">/100</p>
                </div>
              </div>
              <div className="bg-card border border-border/50 p-5 rounded-xl shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">ML Confidence</p>
                <div className="flex items-end gap-1">
                   <p className="text-4xl font-bold tracking-tight">{alert.confidence}</p>
                   <p className="text-sm font-medium text-muted-foreground mb-1">%</p>
                </div>
              </div>
              <div className="bg-card border border-border/50 p-5 rounded-xl shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Action Taken</p>
                <p className="text-2xl font-bold tracking-tight text-destructive mt-1">BLOCKED</p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Rule-Based Explanations</h3>
              {alert.reasons.map((reason, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-card/80 p-4 rounded-xl border border-border/50 shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold mb-8 tracking-tight">Transaction Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                   <CreditCard className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Amount & Method</p>
                  <p className="font-bold text-lg text-foreground">{alert.amount}</p>
                  <p className="text-sm text-muted-foreground">Credit Card (*4242)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                   <Clock className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Timestamp</p>
                  <p className="font-bold text-lg text-foreground">{alert.time}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                   <MapPin className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Location & IP</p>
                  <p className="font-bold text-lg text-destructive">{alert.device.location}</p>
                  <p className="text-sm text-muted-foreground font-mono">{alert.device.ip}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                   <Monitor className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Device Fingerprint</p>
                  <p className="font-bold text-lg text-foreground">{alert.device.os}</p>
                  <p className="text-sm text-muted-foreground">{alert.device.browser} <span className="text-destructive font-semibold ml-1">• New Device</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 360 Profiles */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                 <User className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg tracking-tight">Customer Profile</h2>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Name</p>
                <p className="font-bold text-lg">{alert.customer.name}</p>
                <p className="text-sm text-muted-foreground">{alert.customer.id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Historical Risk Profile</p>
                <div className="w-full bg-secondary rounded-full h-2.5 mt-2 overflow-hidden border border-border/50">
                  <div className="bg-destructive h-full rounded-full relative" style={{ width: `${alert.customer.risk}%` }}></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                   <span className="text-xs text-muted-foreground font-medium">Risk Score</span>
                   <p className="text-sm text-destructive font-bold">{alert.customer.risk}/100</p>
                </div>
              </div>
              <button className="w-full bg-secondary hover:bg-muted text-foreground font-medium py-2.5 rounded-xl text-sm transition-colors border border-border shadow-sm flex items-center justify-center gap-2 mt-2">
                View 360° Profile <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center text-warning">
                 <Building className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg tracking-tight">Merchant Profile</h2>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Merchant Name</p>
                <p className="font-bold text-lg">{alert.merchant.name}</p>
                <p className="text-sm text-muted-foreground">{alert.merchant.category}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Fraud Chargeback Rate</p>
                <div className="flex items-center gap-3 mt-1">
                   <p className="text-3xl font-bold tracking-tight text-destructive">{alert.merchant.risk}%</p>
                   <p className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">Avg: 0.5%</p>
                </div>
              </div>
              <button className="w-full bg-secondary hover:bg-muted text-foreground font-medium py-2.5 rounded-xl text-sm transition-colors border border-border shadow-sm flex items-center justify-center gap-2 mt-2">
                View 360° Profile <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-foreground">
                 <Activity className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg tracking-tight">Analyst Notes</h2>
            </div>
            <textarea 
              className="w-full bg-muted/50 border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none min-h-[140px] resize-none"
              placeholder="Enter investigation notes here..."
            ></textarea>
            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl mt-4 transition-all text-sm shadow-md shadow-primary/20">
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
