
import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell as ReCell } from "recharts";
import * as ReactRouterDOM from "react-router-dom";
import { 
  Users, 
  Briefcase, 
  MapPin, 
  Ticket, 
  PlusCircle, 
  UserPlus, 
  Loader2,
  ChevronRight,
  ShieldCheck,
  Clock,
  Activity,
  BarChart3
} from "lucide-react";

const { Link } = ReactRouterDOM as any;

const STATUS_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#64748b'];
const OVERVIEW_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customers: 0,
    projects: 0,
    sites: 0,
    openTickets: 0,
    engineers: 0,
    totalTickets: 0
  });
  const [byStatus, setByStatus] = useState<any[]>([]);
  const [overviewData, setOverviewData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { count: custCount },
          { count: projCount },
          { count: siteCount },
          { data: tickets },
          { count: engCount }
        ] = await Promise.all([
          supabase.from('customers').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('sites').select('*', { count: 'exact', head: true }),
          supabase.from('tickets').select('*'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'ENGINEER')
        ]);

        const ticketData = tickets || [];
        const open = ticketData.filter((x: any) => x.status === "OPEN").length;

        const currentStats = {
          customers: custCount || 0,
          projects: projCount || 0,
          sites: siteCount || 0,
          openTickets: open,
          engineers: engCount || 0,
          totalTickets: ticketData.length
        };

        setStats(currentStats);
        setOverviewData([
          { name: 'Cust', value: currentStats.customers },
          { name: 'Proj', value: currentStats.projects },
          { name: 'Tkt', value: currentStats.totalTickets },
          { name: 'Eng', value: currentStats.engineers },
        ]);

        const statusOrder = ["OPEN", "IN_PROGRESS", "ASSIGNED", "RESOLVED", "CLOSED"];
        const statusLabels: any = { OPEN: "Open", IN_PROGRESS: "In Progress", ASSIGNED: "Assigned", RESOLVED: "Resolved", CLOSED: "Closed" };
        const statusMap: any = {};
        ticketData.forEach((x: any) => statusMap[x.status] = (statusMap[x.status] || 0) + 1);
        setByStatus(statusOrder.map(status => ({
            name: statusLabels[status] || status,
            value: statusMap[status] || 0
        })));
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const topCards = [
    { title: "Customers", value: stats.customers, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Projects", value: stats.projects, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Engineers", value: stats.engineers, icon: Users, color: "text-pink-600", bg: "bg-pink-50" },
    { title: "Open Tickets", value: stats.openTickets, icon: Ticket, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
      <p className="text-slate-500 font-medium">Building Live Dashboard...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:py-8 space-y-6 lg:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Enterprise Overview</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Monitoring system performance via Supabase Cloud.</p>
        </div>
        <div className="flex items-center self-start sm:self-auto gap-2 text-[10px] font-black text-slate-400 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 uppercase tracking-widest">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Live Cloud Sync
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {topCards.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all active:scale-[0.98] group">
            <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${c.bg} ${c.color} inline-block mb-3 sm:mb-4`}>
                <c.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">{c.title}</p>
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 mt-0.5">{c.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600"><BarChart3 className="w-5 h-5" /></div>
            <div><h3 className="text-base sm:text-lg font-bold text-slate-800">Resource Distribution</h3></div>
          </div>
          <div className="h-[200px] sm:h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overviewData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {overviewData.map((_, index) => (<ReCell key={`cell-${index}`} fill={OVERVIEW_COLORS[index % OVERVIEW_COLORS.length]} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-rose-50 p-2 rounded-xl text-rose-600"><Activity className="w-5 h-5" /></div>
            <div><h3 className="text-base sm:text-lg font-bold text-slate-800">Ticket Status Mix</h3></div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
             <div className="h-48 sm:h-56 w-full sm:w-1/2 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius="65%" outerRadius="85%" paddingAngle={5} stroke="none">
                      {byStatus.map((_, i) => (<Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalTickets}</span>
                </div>
             </div>
             <div className="w-full sm:w-1/2 grid grid-cols-2 sm:grid-cols-1 gap-2">
                {byStatus.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length] }}></div>
                        <span className="text-[10px] font-bold text-slate-500 truncate">{entry.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-700">{entry.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/admin/customers" className="group bg-white border border-slate-100 rounded-2xl sm:rounded-[2rem] p-6 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/10 transition-all active:scale-[0.98]">
          <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><UserPlus className="w-6 h-6 text-indigo-600" /></div>
          <h4 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">Customers <ChevronRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform" /></h4>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage corporate partners.</p>
        </Link>
        <Link to="/admin/projects" className="group bg-white border border-slate-100 rounded-2xl sm:rounded-[2rem] p-6 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/10 transition-all active:scale-[0.98]">
          <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><PlusCircle className="w-6 h-6 text-emerald-600" /></div>
          <h4 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">Projects <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" /></h4>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Setup service assignments.</p>
        </Link>
        <div className="bg-slate-900 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-center">
            <ShieldCheck className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
            <h3 className="text-lg font-bold text-white relative z-10">Cloud Secured</h3>
            <p className="text-slate-400 text-xs mt-2 relative z-10 leading-relaxed">Supabase RLS policies are active for all data channels.</p>
        </div>
      </div>
    </div>
  );
}
