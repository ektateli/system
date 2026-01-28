
import React, { useEffect, useState } from "react";
import { api } from "../api/api";
// Fixed: Use namespace import to avoid named export issues in some environments
import * as ReactRouterDOM from "react-router-dom";
import { 
  Ticket, 
  Clock, 
  ChevronRight, 
  Activity, 
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Loader2,
  Filter,
  HardDrive,
  MapPin,
  Plus,
  History,
  Zap,
  User,
  X,
  Box,
  ArrowLeft
} from "lucide-react";

// Extracting members from ReactRouterDOM to fix named export errors
const { Link } = ReactRouterDOM as any;

const getStatusConfig = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'OPEN': return { label: 'OPEN', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: AlertCircle, step: 1 };
    case 'IN_PROGRESS':
    case 'ASSIGNED': return { label: 'ACTIVE', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Activity, step: 2 };
    case 'RESOLVED':
    case 'CLOSED': return { label: 'RESOLVED', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2, step: 3 };
    default: return { label: status || 'PENDING', color: 'bg-slate-50 text-slate-600 border-slate-100', icon: Clock, step: 1 };
  }
};

const getPriorityConfig = (priority: string) => {
  switch (priority?.toUpperCase()) {
    case 'HIGH': return { color: 'bg-rose-50 text-rose-600 border-rose-100' };
    case 'LOW': return { color: 'bg-slate-50 text-slate-600 border-slate-100' };
    default: return { color: 'bg-blue-50 text-blue-600 border-blue-100' };
  }
};

export default function CustomerTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    api.get("/tickets/my")
      .then(r => setTickets(r.data || []))
      .catch(err => console.error("Failed to load tickets", err))
      .finally(() => setLoading(false));
  }, []);

  const formatAuditTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    } catch {
      return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    }
  };

  const getMockLogs = (ticket: any) => {
    const logs = [
      { id: 1, title: 'Ticket created', user: 'Alice Customer', time: formatAuditTime(ticket.created_at) },
    ];
    
    if (ticket.status !== 'OPEN') {
      logs.push({ id: 2, title: 'Engineer Assigned', user: 'Tech Support', time: formatAuditTime(new Date(new Date(ticket.created_at).getTime() + 3600000).toISOString()) });
    }
    
    if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
      logs.push({ id: 3, title: 'Issue Resolved', user: 'Admin User', time: formatAuditTime(new Date(new Date(ticket.created_at).getTime() + 86400000).toISOString()) });
    }

    return logs;
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] animate-fade-in overflow-hidden">
      {/* Header Area */}
      <div className="p-4 sm:p-6 lg:p-8 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-[1600px] mx-auto w-full">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Support Queue</h2>
            <p className="text-slate-500 text-sm font-medium">Real-time status of your service requests.</p>
          </div>
          <Link 
            to="/customer/create-ticket" 
            className="bg-indigo-600 px-6 py-3 rounded-2xl text-sm font-black text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all w-fit flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Raise New Case
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8 gap-6">
        {/* Left Side: Ticket List */}
        <div className={`flex-1 lg:max-w-md flex flex-col min-h-0 ${selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
              {tickets.length} Tickets Found
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-200">
                <Ticket className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">No tickets found</p>
              </div>
            ) : (
              tickets.map((t: any) => {
                const status = getStatusConfig(t.status);
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div 
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`group cursor-pointer bg-white border p-5 rounded-2xl transition-all relative ${
                      isSelected 
                        ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-md' 
                        : 'border-slate-100 shadow-sm hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${status.color}`}>
                        {status.label}
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-300">#{t.id}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
                      {t.issue}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mb-4">
                      <HardDrive className="w-3 h-3" /> {t.equipment}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        <MapPin className="w-3 h-3" /> {t.site_name || 'Main Site'}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                        <Clock className="w-3 h-3" /> {new Date(t.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Ticket Details (Lifecycle) */}
        <div className={`flex-1 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col min-h-0 shadow-sm relative overflow-hidden ${!selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
          {!selectedTicket ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                <History className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-800">Select a Ticket</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-xs">Pick a ticket from the left to view the full audit lifecycle and resolution details.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
              {/* Header Panel */}
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="lg:hidden flex items-center gap-2 text-indigo-600 font-bold text-xs mb-4 active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to list
                  </button>
                  <h3 className="text-[1.2rem] font-bold text-slate-900 tracking-tight leading-none">Ticket Lifecycle</h3>
                  <p className="text-[0.65rem] font-black text-[#94a3b8] uppercase tracking-[0.2em] mt-2">AUDIT & RESOLUTION</p>
                </div>
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="p-2.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-12 custom-scrollbar">
                {/* SITE CONTEXT Box */}
                <section>
                  <div className="flex items-center gap-2 text-[0.7rem] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-4">
                    <Box className="w-4 h-4" /> SITE CONTEXT
                  </div>
                  <div className="bg-[#f8fafc] rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[120px_1fr] gap-y-4 text-sm">
                      <span className="text-slate-400 font-medium">Site:</span>
                      <span className="text-slate-800 font-bold text-right sm:text-left">{selectedTicket.site_name || "Main Campus"}</span>
                      
                      <span className="text-slate-400 font-medium">Equipment:</span>
                      <span className="text-slate-800 font-bold text-right sm:text-left">{selectedTicket.equipment || "Cisco Router 9000"}</span>
                    </div>
                  </div>
                </section>

                {/* AUDIT HISTORY Timeline */}
                <section className="pb-10">
                  <div className="flex items-center gap-2 text-[0.7rem] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-8">
                    <History className="w-4 h-4" /> AUDIT HISTORY
                  </div>
                  
                  <div className="relative pl-12 space-y-12 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[1px] before:bg-slate-100">
                    {getMockLogs(selectedTicket).map((log, idx) => {
                      const isLatest = idx === 0;
                      return (
                        <div key={log.id} className="relative group">
                          {/* Hollow Circle Dot */}
                          <div className={`absolute -left-[12px] top-1.5 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center z-10 transition-all ${isLatest ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-200'}`}>
                             {isLatest && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                          </div>
                          
                          {/* Log Entry Content */}
                          <div className="animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                            <h4 className={`text-[0.95rem] font-bold leading-none mb-2 ${isLatest ? 'text-slate-900' : 'text-slate-600'}`}>
                              {log.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 text-[0.75rem] text-[#94a3b8] font-medium">
                              <User className="w-3.5 h-3.5" />
                              <span>{log.user}</span>
                              <span className="text-slate-200">•</span>
                              <span>{log.time}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* Status Footer */}
              <div className="p-6 bg-[#fcfcfd] border-t border-slate-50 flex flex-wrap items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Audit Trail</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest ${getPriorityConfig(selectedTicket.priority).color}`}>
                    {selectedTicket.priority || 'MEDIUM'} PRIORITY
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
