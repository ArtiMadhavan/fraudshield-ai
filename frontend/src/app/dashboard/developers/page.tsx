"use client";

import { useState } from "react";
import { Key, Webhook, BookOpen, Code2, Terminal, Copy, CheckCircle2, Clock, Activity, ShieldAlert } from "lucide-react";

export default function DeveloperPortal() {
  const [activeTab, setActiveTab] = useState("cURL");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Developer Portal</h1>
          <p className="text-sm text-slate-500">Manage API keys, webhooks, and view integration documentation.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          API System Operational
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Keys & Webhooks */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">API Keys</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Publishable Key</label>
                <div className="flex items-center">
                  <code className="flex-1 bg-slate-50 border border-slate-200 border-r-0 rounded-l-lg px-3 py-2 text-sm text-slate-700 overflow-hidden text-ellipsis">pk_live_f8d92a3c7b1e45f6a89c2d1b</code>
                  <button onClick={() => handleCopy("pk_live_f8d92a3c7b1e45f6a89c2d1b", "pk")} className="bg-slate-50 border border-slate-200 rounded-r-lg px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                    {copiedKey === 'pk' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Secret Key</label>
                <div className="flex items-center">
                  <code className="flex-1 bg-slate-50 border border-slate-200 border-r-0 rounded-l-lg px-3 py-2 text-sm text-slate-700 overflow-hidden text-ellipsis">sk_live_************************</code>
                  <button className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border-r-0">Reveal</button>
                  <button onClick={() => handleCopy("sk_live_dummy_secret_key", "sk")} className="bg-slate-50 border border-slate-200 rounded-r-lg px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                    {copiedKey === 'sk' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Keep your secret key confidential. Never expose it in client-side code.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Webhook className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Webhooks</h2>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Endpoint URL</label>
              <input type="text" defaultValue="https://merchant.com/api/webhooks/fraudshield" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Events</span>
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">All Events (5)</span>
            </div>
            
            <button className="w-full mt-4 bg-white border border-slate-200 text-slate-700 font-semibold text-sm py-2 rounded-lg hover:bg-slate-50 transition-colors">
              Test Webhook
            </button>
          </div>

        </div>

        {/* Right Column: Docs & SDK */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">API Integration</h2>
              </div>
              <p className="text-sm text-slate-500">Send transaction details to receive real-time fraud probability and decisions.</p>
            </div>
            
            <div className="p-6">
               <div className="flex items-center gap-3 mb-4">
                 <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">POST</span>
                 <code className="text-sm font-medium text-slate-700">/api/v1/payments/process</code>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                 <div>
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Request Example</h3>
                   <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto shadow-inner">
                     <p>{`{`}</p>
                     <p className="pl-4">"merchant_id": "merch_123",</p>
                     <p className="pl-4">"customer_name": "John Doe",</p>
                     <p className="pl-4">"amount": 2500,</p>
                     <p className="pl-4">"payment_method": "UPI",</p>
                     <p className="pl-4">"device": "Mobile Safari",</p>
                     <p className="pl-4">"ip_address": "103.45.67.89"</p>
                     <p>{`}`}</p>
                   </div>
                 </div>
                 
                 <div>
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Response Example</h3>
                   <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto shadow-inner">
                     <p>{`{`}</p>
                     <p className="pl-4">"decision": <span className="text-red-400">"BLOCK"</span>,</p>
                     <p className="pl-4">"risk_score": 91,</p>
                     <p className="pl-4">"fraud_probability": 0.96,</p>
                     <p className="pl-4">"reasons": [</p>
                     <p className="pl-8 text-amber-400">"High transaction amount",</p>
                     <p className="pl-8 text-amber-400">"New device detected"</p>
                     <p className="pl-4">]</p>
                     <p>{`}`}</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* SDK Snippets */}
          <div className="bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-800">
            <div className="flex border-b border-slate-800">
              {['cURL', 'Python', 'Node.js', 'Java'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-semibold transition-colors ${activeTab === tab ? 'text-white border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-4 text-sm font-mono text-slate-300 overflow-x-auto">
              {activeTab === 'cURL' && (
                <pre>
                  curl -X POST https://api.fraudshield.ai/v1/payments/process \<br/>
                  &nbsp;&nbsp;-H "Authorization: Bearer sk_live_xxx" \<br/>
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                  &nbsp;&nbsp;-d '{"{"}"amount": 2500, "payment_method": "UPI"{"}"}'
                </pre>
              )}
              {activeTab === 'Python' && (
                <pre>
                  import requests<br/>
                  <br/>
                  headers = {"{"} "Authorization": "Bearer sk_live_xxx" {"}"}<br/>
                  payload = {"{"} "amount": 2500, "payment_method": "UPI" {"}"}<br/>
                  <br/>
                  response = requests.post(<br/>
                  &nbsp;&nbsp;"https://api.fraudshield.ai/v1/payments/process",<br/>
                  &nbsp;&nbsp;json=payload, headers=headers<br/>
                  )<br/>
                  print(response.json())
                </pre>
              )}
              {activeTab === 'Node.js' && (
                <pre>
                  const axios = require('axios');<br/>
                  <br/>
                  axios.post('https://api.fraudshield.ai/v1/payments/process', {"{"}<br/>
                  &nbsp;&nbsp;amount: 2500,<br/>
                  &nbsp;&nbsp;payment_method: 'UPI'<br/>
                  {"}"}, {"{"}<br/>
                  &nbsp;&nbsp;headers: {"{"} Authorization: 'Bearer sk_live_xxx' {"}"}<br/>
                  {"}"}).then(res {`=>`} console.log(res.data));
                </pre>
              )}
              {activeTab === 'Java' && (
                <pre>
                  // Using OkHttp<br/>
                  OkHttpClient client = new OkHttpClient();<br/>
                  <br/>
                  MediaType JSON = MediaType.get("application/json; charset=utf-8");<br/>
                  RequestBody body = RequestBody.create(<br/>
                  &nbsp;&nbsp;{`"{\\"amount\\": 2500, \\"payment_method\\": \\"UPI\\"}"`}, JSON<br/>
                  );<br/>
                  <br/>
                  Request request = new Request.Builder()<br/>
                  &nbsp;&nbsp;.url("https://api.fraudshield.ai/v1/payments/process")<br/>
                  &nbsp;&nbsp;.header("Authorization", "Bearer sk_live_xxx")<br/>
                  &nbsp;&nbsp;.post(body)<br/>
                  &nbsp;&nbsp;.build();
                </pre>
              )}
            </div>
          </div>
          
        </div>
      </div>
      
      {/* API Logs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <Activity className="w-5 h-5 text-indigo-600" />
               <h2 className="text-lg font-bold text-slate-900">API Logs</h2>
            </div>
            <button className="text-sm text-indigo-600 font-semibold hover:underline">View All Logs</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase text-xs tracking-wider">
                  <tr>
                     <th className="px-6 py-3">Time</th>
                     <th className="px-6 py-3">Endpoint</th>
                     <th className="px-6 py-3">Status</th>
                     <th className="px-6 py-3">Latency</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                     <td className="px-6 py-4 font-mono text-xs">Today, 11:34 AM</td>
                     <td className="px-6 py-4 font-mono text-xs">POST /api/v1/payments/process</td>
                     <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold">200 OK</span></td>
                     <td className="px-6 py-4 font-mono text-xs">124 ms</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                     <td className="px-6 py-4 font-mono text-xs">Today, 11:30 AM</td>
                     <td className="px-6 py-4 font-mono text-xs">POST /api/v1/payments/process</td>
                     <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold">200 OK</span></td>
                     <td className="px-6 py-4 font-mono text-xs">132 ms</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                     <td className="px-6 py-4 font-mono text-xs">Today, 11:15 AM</td>
                     <td className="px-6 py-4 font-mono text-xs">POST /api/v1/payments/upload</td>
                     <td className="px-6 py-4"><span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold">400 ERR</span></td>
                     <td className="px-6 py-4 font-mono text-xs">84 ms</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}
