
import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import * as ReactRouterDOM from "react-router-dom";
import { 
  Ticket, 
  MapPin, 
  Briefcase, 
  Building2, 
  Clock, 
  Loader2, 
  ChevronRight, 
  Filter, 
  ExternalLink,
  Search,
  AlertCircle,
  Hash,
  ArrowUpDown
} from "lucide-react";
import TicketSidebar from "./TicketSidebar";

const { Link } = ReactRouterDOM as any;

export default function EngineerTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/tickets/assigned");
      setTickets(r.data || []);
    } catch (err) {
      console.error("Failed to load queue", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "OPEN": return "bg-rose-50 text-rose-600 border-rose-100";
      case "IN_PROGRESS": return "bg-amber-50 text-amber-600 border-amber-100";
      case "RESOLVED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const filtered = tickets.filter(t => {
    const matchesStatus = !statusFilter || t.status === statusFilter;
    const matchesSearch = !search || 
      t.issue.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toString().includes(search) ||
      (t.customer_name || "").toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-[1600px] mx-auto space-y-8 relative">
      {/* Sidebar Overlay */}
      <TicketSidebar 
        ticketId={selectedTicketId} 
        onClose={() => setSelectedTicketId(null)}
        onUpdateSuccess={load}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                <Ticket className="w-6 h-6" />
             </div>
             <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Assigned Queue</h2>
          </div>
          <p className="text-slate-500 mt-1 text-sm font-medium">Detailed log of technical requests assigned to your profile.</p>
        </div>
        <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm flex items-center self-start sm:self-auto">
           <button onClick={load} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all" title="Refresh Queue">
              <ArrowUpDown className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium"
            placeholder="Search by ID, issue or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
           <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
           <select
             className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
           >
             <option value="">All Statuses</option>
             <option value="OPEN">Open</option>
             <option value="IN_PROGRESS">In Progress</option>
             <option value="RESOLVED">Resolved</option>
           </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-400 font-medium tracking-wide">Refreshing queue...</p>
        </div>
      ) : (
        <>
          {/* Desktop Queue */}
          <div className="hidden lg:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Reference</th>
                  <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Issue Description</th>
                  <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Client / Project</th>
                  <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Status</th>
                  <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t: any) => (
                  <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors group cursor-pointer" onClick={() => setSelectedTicketId(t.id)}>
                    <td className="p-5">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-[10px] group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             #{t.id}
                          </div>
                          <div>
                             <p className="font-black text-slate-400 text-[10px] uppercase tracking-tighter">{t.priority}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(t.created_at).toLocaleDateString()}</p>
                          </div>
                       </div>
                    </td>
                    <td className="p-5">
                       <span className="font-bold text-slate-800 line-clamp-1 max-w-[280px] group-hover:text-indigo-600 transition-colors">{t.issue}</span>
                    </td>
                    <td className="p-5">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                             <Building2 className="w-3.5 h-3.5 text-slate-300" />
                             {t.customer_name}
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                             <MapPin className="w-3 h-3" /> {t.site_name}
                             <span className="text-slate-200">•</span>
                             <Briefcase className="w-3 h-3" /> {t.project_name}
                          </div>
                       </div>
                    </td>
                    <td className="p-5">
                       <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(t.status)}`}>
                          {t.status}
                       </span>
                    </td>
                    <td className="p-5 text-right">
                       <div className="inline-flex items-center justify-center p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm active:scale-90">
                         <ExternalLink className="w-4 h-4" />
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
             {filtered.map((t: any) => (
               <div key={t.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 hover:border-indigo-200 transition-all cursor-pointer" onClick={() => setSelectedTicketId(t.id)}>
                  <div className="flex items-start justify-between">
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Case #{t.id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${t.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
                            {t.priority}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 leading-tight line-clamp-2">{t.issue}</h4>
                     </div>
                     <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider border ${getStatusBadge(t.status)}`}>
                        {t.status}
                     </span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100">
                     <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</p>
                        <p className="text-[11px] font-bold text-slate-700">{t.customer_name}</p>
                     </div>
                     <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site</p>
                        <p className="text-[11px] font-bold text-slate-700">{t.site_name}</p>
                     </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
                    Manage Ticket <ChevronRight className="w-4 h-4" />
                  </div>
               </div>
             ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200">
               <h3 className="text-lg font-bold text-slate-800">Queue is empty</h3>
               <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
