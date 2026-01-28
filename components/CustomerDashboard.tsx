
import React, { useEffect, useState } from "react";
import { api } from "../api/api";
// Fixed: Use namespace import to avoid named export issues in some environments
import * as ReactRouterDOM from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from "recharts";
import { 
  Ticket, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Activity, 
  Loader2,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

// Extracting members from ReactRouterDOM to fix named export errors
const { useNavigate } = ReactRouterDOM as any;

const STATUS_COLORS = {
  open: '#f43f5e',      
  in_progress: '#f59e0b', 
  resolved: '#10b981',   
};

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get("/tickets/my/stats")
      .then(r => setStats(r.data))
      .catch(err => console.error("Failed to fetch customer stats", err))
      .finally(() => setLoading(false));
  }, []);

  const barData = [
    { name: "Open", value: stats.open, fill: STATUS_COLORS.open },
    { name: "Active", value: stats.in_progress, fill: STATUS_COLORS.in_progress },
    { name: "Fixed", value: stats.resolved, fill: STATUS_COLORS.resolved },
  ];

  const pieData = [
    { name: "Open", value: stats.open },
    { name: "In Progress", value: stats.in_progress },
    { name: "Resolved", value: stats.resolved },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Initializing Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
             <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Customer Portal</h2>
          </div>
          <p className="text-slate-500 mt-1 text-sm font-medium">Monitoring your system support requests and health.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard title="Total Requests" value={stats.total} icon={Ticket} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="Open Now" value={stats.open} icon={AlertCircle} color="text-rose-600" bg="bg-rose-50" />
        <StatCard title="In Progress" value={stats.in_progress} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600"><TrendingUp className="w-5 h-5" /></div>
            <div><h3 className="text-lg font-bold text-slate-800">Support Load</h3></div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" radius={[8, 8, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-rose-50 p-2 rounded-xl text-rose-600"><Activity className="w-5 h-5" /></div>
            <div><h3 className="text-lg font-bold text-slate-800">Lifecycle View</h3></div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 flex-1">
             <div className="h-48 w-48 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={pieData} dataKey="value" innerRadius="72%" outerRadius="92%" paddingAngle={6} stroke="none"><Cell fill={STATUS_COLORS.open} /><Cell fill={STATUS_COLORS.in_progress} /><Cell fill={STATUS_COLORS.resolved} /></Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-900 leading-none">{stats.total}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group cursor-pointer hover:bg-slate-800 transition-colors">
            <h3 className="text-xl font-bold text-white relative z-10">Secured Architecture</h3>
            <p className="text-slate-400 text-sm mt-2 relative z-10 leading-relaxed max-w-xs">All support communication is encrypted and monitored for security compliance.</p>
        </div>
        <div 
          onClick={() => navigate('/customer/create-ticket')}
          className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-xl flex flex-col justify-center min-h-[160px] relative overflow-hidden group cursor-pointer"
        >
           <div className="relative z-10 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">Facing Issues? <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></h3>
              <p className="text-indigo-100 text-sm mt-2">Our engineering team responds to priority customer tickets within 120 minutes.</p>
              <button 
                className="mt-5 bg-white text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-100 active:scale-95 transition-transform"
              >
                Create Support Request
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
  <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
    <div className={`p-3 rounded-2xl ${bg} ${color} inline-block mb-4`}><Icon className="w-6 h-6" /></div>
    <div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.1em]">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
  </div>
);
