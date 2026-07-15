import Link from "next/link";
import { Shield, ChevronRight, Activity, BrainCircuit, Database, Lock, Server, Zap, Globe, Layers, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">FraudShield AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#architecture" className="hover:text-indigo-600 transition-colors">Architecture</a>
            <a href="#workflow" className="hover:text-indigo-600 transition-colors">AI Workflow</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sandbox" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden md:block">
              Merchant Sandbox
            </Link>
            <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-2">
              Sign In <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v13.0 API Now Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            Enterprise Payment <br/><span className="text-indigo-600">Risk Intelligence</span> Platform
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Protect every transaction with AI-powered fraud detection. Engineered for modern payment gateways, e-commerce, and digital wallets.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2">
              <LayoutDashboardIcon className="w-4 h-4" /> Admin Dashboard
            </Link>
            <Link href="/sandbox" className="w-full sm:w-auto bg-white border border-slate-200 hover:border-slate-300 text-slate-900 px-8 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
              <TerminalIcon className="w-4 h-4" /> Merchant Sandbox
            </Link>
            <Link href="/dashboard/developers" className="w-full sm:w-auto bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-8 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
              <CodeIcon className="w-4 h-4" /> Developer Portal
            </Link>
          </div>
        </div>
      </main>

      {/* Logos/Trust Section */}
      <section className="border-y border-slate-200 bg-white py-12 px-6">
         <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Architecture Inspired By Enterprise Risk Engines</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
               {/* Placeholders for logos */}
               <div className="text-xl font-black">Stripe Radar</div>
               <div className="text-xl font-black">Razorpay Risk</div>
               <div className="text-xl font-black">Visa Risk Manager</div>
               <div className="text-xl font-black">PayPal Fraud Protection</div>
            </div>
         </div>
      </section>

      {/* AI Workflow */}
      <section id="workflow" className="py-24 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Millisecond Decision Intelligence</h2>
            <p className="text-slate-500 mt-3 font-medium">From API payload to blocked transaction in under 200ms.</p>
         </div>

         <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                  <Database className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-900">API Payload</h3>
                  <p className="text-xs text-slate-500 mt-1">REST API ingests JSON via secure webhook.</p>
               </div>
               
               <ChevronRight className="w-6 h-6 text-slate-300 hidden md:block mx-auto" />
               
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center relative">
                  <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">FastAPI</div>
                  <Server className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-900">Validation</h3>
                  <p className="text-xs text-slate-500 mt-1">Pydantic schema validation & enrichment.</p>
               </div>
               
               <ChevronRight className="w-6 h-6 text-slate-300 hidden md:block mx-auto" />
               
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center relative shadow-lg">
                  <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">XGBoost</div>
                  <BrainCircuit className="w-8 h-8 text-white mx-auto mb-3" />
                  <h3 className="font-bold text-white">ML + Rules</h3>
                  <p className="text-xs text-slate-400 mt-1">Calculates Fraud Probability & Risk Score.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Tech Stack */}
      <section id="architecture" className="bg-slate-900 text-white py-24 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div>
                <h2 className="text-3xl font-black tracking-tight mb-4">Enterprise Technology Stack</h2>
                <p className="text-slate-400 mb-8 text-lg">Built with modern, battle-tested technologies designed for high-throughput transactional systems.</p>
                
                <div className="space-y-4">
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                         <Layers className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                         <h4 className="font-bold">Frontend UI</h4>
                         <p className="text-sm text-slate-400 mt-1">Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                         <Zap className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                         <h4 className="font-bold">Backend API</h4>
                         <p className="text-sm text-slate-400 mt-1">FastAPI, Python 3, SQLAlchemy ORM, JWT Authentication</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                         <BrainCircuit className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                         <h4 className="font-bold">Machine Learning</h4>
                         <p className="text-sm text-slate-400 mt-1">Scikit-learn, XGBoost, Random Forest, Pandas</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 blur-3xl rounded-full"></div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 relative shadow-2xl overflow-hidden font-mono text-sm text-emerald-400">
                   <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                   </div>
                   <p className="text-slate-400">POST /api/v1/payments/process</p>
                   <br/>
                   <p>{`{`}</p>
                   <p className="pl-4">"decision": <span className="text-red-400">"BLOCK"</span>,</p>
                   <p className="pl-4">"risk_score": 91,</p>
                   <p className="pl-4">"fraud_probability": 0.96,</p>
                   <p className="pl-4">"reasons": [</p>
                   <p className="pl-8 text-amber-400">"High transaction amount",</p>
                   <p className="pl-8 text-amber-400">"Velocity rule triggered"</p>
                   <p className="pl-4">]</p>
                   <p>{`}`}</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
               <Shield className="w-5 h-5 text-indigo-600" />
               <span className="font-bold text-slate-900 tracking-tight">FraudShield AI</span>
            </div>
            <p className="text-sm text-slate-500">Built for enterprise payment intelligence.</p>
         </div>
      </footer>
    </div>
  );
}

// Inline Icons for Landing Page only
const LayoutDashboardIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
const TerminalIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>;
const CodeIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
