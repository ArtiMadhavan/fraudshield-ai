"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowRight, 
  BrainCircuit, 
  Activity, 
  Lock, 
  Zap, 
  BarChart3, 
  Layers, 
  Server,
  Database,
  Globe
} from "lucide-react";

const features = [
  {
    icon: <BrainCircuit className="w-6 h-6 text-indigo-500" />,
    title: "AI-Powered Detection",
    description: "Advanced machine learning models analyze hundreds of data points in real-time to identify fraud patterns."
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    title: "Real-time Decisions",
    description: "Sub-50ms latency ensures fraudulent transactions are blocked before they impact your bottom line."
  },
  {
    icon: <Activity className="w-6 h-6 text-emerald-500" />,
    title: "Explainable AI",
    description: "Human-readable explanations for every decision, making compliance and manual reviews effortless."
  },
  {
    icon: <Lock className="w-6 h-6 text-rose-500" />,
    title: "Enterprise Security",
    description: "Bank-grade encryption, Role-Based Access Control (RBAC), and comprehensive audit trails."
  }
];

const techStack = [
  { name: "Next.js 15", icon: <Globe className="w-8 h-8" /> },
  { name: "React 19", icon: <Layers className="w-8 h-8" /> },
  { name: "FastAPI", icon: <Server className="w-8 h-8" /> },
  { name: "MySQL", icon: <Database className="w-8 h-8" /> },
  { name: "Scikit-Learn", icon: <BrainCircuit className="w-8 h-8" /> },
  { name: "Tailwind CSS", icon: <Globe className="w-8 h-8" /> },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">FraudShield AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] max-w-5xl opacity-50 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              FraudShield AI v4.0 is live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Enterprise Payment Fraud Prevention.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Stop fraudulent transactions in real-time with our advanced AI Decision Engine. Complete with explainable AI, beautiful dashboards, and seamless integration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-medium hover:scale-105 transition-transform">
                Explore Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/dashboard/payments" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-full font-medium hover:bg-secondary/80 transition-colors">
                Run Simulation
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Preview Image/Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden ring-1 ring-white/10"
          >
            <div className="h-8 border-b border-border bg-muted/50 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
            <div className="aspect-[16/9] bg-muted relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/20"></div>
              {/* Abstract Representation of Dashboard */}
              <div className="absolute inset-0 p-8 grid grid-cols-3 gap-6 opacity-80">
                <div className="col-span-2 space-y-6">
                  <div className="h-32 rounded-xl bg-card border border-border shadow-sm flex items-end p-4 gap-2">
                    {[40, 70, 45, 90, 65, 85, 100, 60, 80].map((h, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className="flex-1 bg-primary/80 rounded-t-sm"
                      ></motion.div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-48 rounded-xl bg-card border border-border shadow-sm p-4">
                      <div className="w-1/2 h-4 bg-muted rounded mb-4"></div>
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-8 bg-muted/50 rounded"></div>)}
                      </div>
                    </div>
                    <div className="h-48 rounded-xl bg-card border border-border shadow-sm p-4 flex items-center justify-center relative">
                       <div className="w-32 h-32 rounded-full border-8 border-primary/20 border-t-primary animate-spin-slow"></div>
                       <div className="absolute font-bold text-2xl">98%</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 space-y-6">
                  <div className="h-24 rounded-xl bg-primary text-primary-foreground p-4 flex flex-col justify-between">
                     <div className="w-1/3 h-3 bg-white/20 rounded"></div>
                     <div className="w-2/3 h-6 bg-white/40 rounded"></div>
                  </div>
                  <div className="h-[270px] rounded-xl bg-card border border-border shadow-sm p-4">
                     <div className="w-1/2 h-4 bg-muted rounded mb-4"></div>
                     <div className="space-y-4">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="flex gap-3 items-center">
                           <div className="w-10 h-10 rounded-full bg-muted"></div>
                           <div className="flex-1 space-y-2">
                             <div className="w-full h-3 bg-muted rounded"></div>
                             <div className="w-2/3 h-2 bg-muted/50 rounded"></div>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Intelligence</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to analyze, investigate, and block fraud at scale.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-12">Powered by Modern Technology</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {techStack.map((tech, index) => (
              <div key={index} className="flex flex-col items-center gap-2 hover:scale-110 transition-transform">
                <div className="text-foreground">{tech.icon}</div>
                <span className="text-sm font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-semibold">FraudShield AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built as an MCA Final Year Project. Enterprise Ready.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="https://github.com" target="_blank" className="hover:text-foreground">GitHub</Link>
            <Link href="/login" className="hover:text-foreground">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
