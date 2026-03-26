import React, { useState } from 'react';
import { 
  Home, TrendingUp, Sparkles, Target, Zap, 
  Bot, Award, Lightbulb, Menu, X, LogOut, 
  ChevronRight, AlertCircle, Loader2, User, CheckCircle2,
  ShieldCheck, Activity, GraduationCap
} from 'lucide-react';

// --- Cloud AI Service (Groq Llama3) ---
const callLocalAI = async (prompt, systemInstruction = "") => {
  const response = await fetch("/api/groq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt,
      systemInstruction
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("AI service unavailable");
  }

  return data.text;
};

// --- Formatting Component ---
const FormattedMessage = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-4 text-slate-700 leading-relaxed text-sm md:text-base text-left">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-2" />;
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
           return <p key={index} className="text-lg font-bold text-slate-900 pt-2 border-b border-slate-100 pb-1">{line.replace(/\*\*/g, '')}</p>;
        }
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <div key={index} className="ml-4 flex items-start group">
              <span className="mr-3 text-indigo-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
              <span className="group-hover:text-slate-900 transition-colors">{line.substring(2)}</span>
            </div>
          );
        }
        return <p key={index} className="animate-in fade-in slide-in-from-left-2 duration-500">{line.replace(/\*\*/g, '')}</p>;
      })}
    </div>
  );
};

// --- Views ---
const DashboardView = ({ setActiveTab }) => (
  <div className="max-w-6xl mx-auto py-4">
    <div className="bg-[#1e293b] rounded-[2rem] p-12 mb-10 text-white shadow-2xl relative overflow-hidden text-left border border-slate-700">
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy-First Architecture</span>
        </div>
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
          Intelligent Sales <br /> 
          <span className="text-indigo-400">Coaching Platform</span>
        </h1>
        <p className="text-lg text-slate-300 font-medium leading-relaxed mb-8 opacity-90">
          A secure, local-processing engine designed to optimize sales performance through advanced linguistic analysis and behavioral modeling.
        </p>
        <button 
          onClick={() => setActiveTab('generation')} 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-900/40 flex items-center group"
        >
          Launch Modules
          <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div className="absolute -bottom-10 -right-10 opacity-10">
        <GraduationCap className="w-80 h-80" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { id: 'analysis', title: 'Call Analysis', icon: Activity, color: 'bg-amber-500', desc: 'Quantitative and qualitative review of communication transcripts.' },
        { id: 'generation', title: 'Script Engine', icon: Sparkles, color: 'bg-indigo-500', desc: 'Linguistic synthesis for optimized outreach and follow-up sequences.' },
        { id: 'assessments', title: 'Pitch Evaluation', icon: Target, color: 'bg-emerald-500', desc: 'Automated scoring based on clarity, conviction, and value alignment.' },
      ].map(card => (
        <div 
          key={card.id} 
          onClick={() => setActiveTab(card.id)} 
          className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl cursor-pointer transition-all hover:-translate-y-1 text-left flex flex-col h-full"
        >
          <div className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg shadow-current/20`}><card.icon className="w-7 h-7" /></div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">{card.title}</h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed flex-grow">{card.desc}</p>
          <div className="text-indigo-600 font-bold text-sm flex items-center group-hover:underline">
            Initialize Module <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Standard View for Analysis and Evaluation
const ToolView = ({ title, icon: Icon, onSubmit, placeholder, label }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await onSubmit(input);
      setResult(res);
    } catch (e) {
      console.error(e);
      setResult("System Error: AI engine unreachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-md">
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-indigo-50 p-3 rounded-xl"><Icon className="text-indigo-600 w-8 h-8" /></div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
        </div>
        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
          <textarea 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 min-h-[200px] outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
            placeholder={placeholder}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button onClick={handleRun} disabled={loading || !input} className="w-full mt-4 bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl disabled:opacity-50 transition-all flex items-center justify-center text-lg shadow-xl shadow-slate-200">
            {loading ? <><Loader2 className="animate-spin mr-3 w-6 h-6" /> Analyzing...</> : "Generate Strategic Analysis"}
          </button>
        </div>
      </div>
      {result && (
        <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm animate-in slide-in-from-bottom-6">
          <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-100">
             <div className="bg-emerald-100 p-2 rounded-lg"><Bot className="w-5 h-5 text-emerald-600" /></div>
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Strategic Output</span>
          </div>
          <FormattedMessage text={result} />
        </div>
      )}
    </div>
  );
};

// NEW: Specialized View for Script Generation with multi-field input
const ScriptGenerationView = () => {
  const [formData, setFormData] = useState({ role: '', productName: '', productDesc: '', targetDemographic: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleRun = async () => {
    setLoading(true);
    const combinedPrompt = `User Role: ${formData.role}\nProduct Name: ${formData.productName}\nProduct Description: ${formData.productDesc}\nTarget Demographic: ${formData.targetDemographic}`;
    try {
      const res = await callLocalAI(combinedPrompt, "Synthesize a professional cold-outreach script and multi-touch email sequence using the provided product details and user role.");
      setResult(res);
    } catch (e) {
      setResult("System Error: Local intelligence node is unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-md">
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-indigo-50 p-3 rounded-xl"><Sparkles className="text-indigo-600 w-8 h-8" /></div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Script Generation</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Your Role</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              placeholder="e.g. Sales Manager, Founder"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Product Name</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              placeholder="e.g. CloudSync Pro"
              value={formData.productName}
              onChange={e => setFormData({...formData, productName: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Product Description</label>
          <textarea 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
            placeholder="Briefly describe what your product does..."
            value={formData.productDesc}
            onChange={e => setFormData({...formData, productDesc: e.target.value})}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Target Demographic</label>
          <textarea 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
            placeholder="Who are you reaching out to?"
            value={formData.targetDemographic}
            onChange={e => setFormData({...formData, targetDemographic: e.target.value})}
          />
          <button 
            onClick={handleRun} 
            disabled={loading || !formData.role || !formData.productName} 
            className="w-full mt-4 bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl disabled:opacity-50 transition-all flex items-center justify-center text-lg shadow-xl shadow-slate-200"
          >
            {loading ? <><Loader2 className="animate-spin mr-3 w-6 h-6" /> Generating...</> : "Generate Strategic Script"}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm animate-in slide-in-from-bottom-6">
          <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-100">
             <div className="bg-emerald-100 p-2 rounded-lg"><Bot className="w-5 h-5 text-emerald-600" /></div>
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Strategic Output</span>
          </div>
          <FormattedMessage text={result} />
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: Home },
    { id: 'analysis', label: 'Call Audit', icon: Activity },
    { id: 'generation', label: 'Scripting', icon: Sparkles },
    { id: 'assessments', label: 'Evaluation', icon: Target },
  ];

  return (
    <div className="flex h-screen bg-[#f1f5f9] text-slate-900 font-sans w-full overflow-hidden">
      <aside className={`bg-[#0f172a] text-slate-400 w-72 flex flex-col transition-all duration-500 fixed md:relative z-50 h-full ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-24'}`}>
        <div className="p-10 flex items-center text-white font-black text-2xl tracking-tighter">
          <div className="bg-indigo-600 p-2.5 rounded-xl mr-4 shadow-lg shadow-indigo-900/40"><TrendingUp className="w-6 h-6" /></div>
          {sidebarOpen && "coach_ai"}
        </div>
        <nav className="flex-1 px-6 space-y-3 mt-4">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => {setActiveTab(item.id); if(window.innerWidth < 768) setSidebarOpen(false);}} 
              className={`w-full flex items-center p-4 rounded-2xl transition-all duration-200 group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/50' : 'hover:bg-slate-800/50 hover:text-slate-100'}`}>
              <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} /> 
              {sidebarOpen && <span className="ml-5 font-bold text-xs uppercase tracking-[0.15em]">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-10 border-t border-slate-800/50">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border border-slate-600">A</div>
            {sidebarOpen && <div className="flex flex-col"><span className="text-xs font-bold text-white uppercase tracking-wider">Admin Node</span><span className="text-[10px] text-slate-500">Standard License</span></div>}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-10 justify-between shrink-0 z-30">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 mr-6"><Menu className="w-5 h-5" /></button>
            <h2 className="font-black text-slate-900 text-sm uppercase tracking-[0.25em]">{menuItems.find(m => m.id === activeTab)?.label} Module</h2>
          </div>
          <div className="flex items-center bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-3 shadow-lg shadow-emerald-500/50"></div>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">AI Engine: Online</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 md:p-14 bg-[#f8fafc] scroll-smooth">
          {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
          {activeTab === 'analysis' && <ToolView title="Call Audit" label="Transaction Transcript" icon={Activity} placeholder="Paste dialogue or email sequences..." onSubmit={val => callLocalAI(val, "Analyze this sales transcript for objections and win-probability.")} />}
          {activeTab === 'generation' && <ScriptGenerationView />}
          {activeTab === 'assessments' && <ToolView title="Pitch Evaluation" label="Oral Presentation Script" icon={Target} placeholder="Paste the pitch script..." onSubmit={val => callLocalAI(val, "Grade this sales pitch across clarity, persuasion, and conviction.")} />}
        </main>
      </div>
    </div>
  );
}