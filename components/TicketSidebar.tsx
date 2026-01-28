
import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { 
  X, 
  Ticket, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  HardDrive, 
  MapPin, 
  History, 
  User,
  Send,
  Loader2,
  Activity,
  Box,
  Building2,
  Briefcase,
  Zap
} from "lucide-react";

interface TicketSidebarProps {
  ticketId: number | null;
  onClose: () => void;
  onUpdateSuccess?: () => void;
}

export default function TicketSidebar({ ticketId, onClose, onUpdateSuccess }: TicketSidebarProps) {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState("IN_PROGRESS");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (ticketId) {
      load();
    } else {
      setData(null);
    }
  }, [ticketId]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/tickets/${ticketId}`);
      setData(r.data);
      if (r.data?.ticket?.status) {
        setStatus(r.data.ticket.status === 'RESOLVED' ? 'RESOLVED' : 'IN_PROGRESS');
      }
    } catch (err) {
      console.error("Failed to load ticket details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!comment.trim()) return;
    setUpdating(true);
    try {
      await api.post(`/tickets/${ticketId}/status`, {
        status,
        comment,
      });
      setComment("");
      await load();
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setUpdating(false);
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

  if (!ticketId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden border-l border-slate-100">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-none">Manage Case #{ticketId}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                <Activity className="w-3 h-3 text-indigo-500" /> Technical Audit Live
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-slate-400 font-medium">Synchronizing ticket data...</p>
            </div>
          ) : data ? (
            <>
              {/* Context Summary */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(data.ticket.status)}`}>
                    {data.ticket.status}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${data.ticket.priority === 'HIGH' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                    {data.ticket.priority} PRIORITY
                  </span>
                </div>
                
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
                  <h4 className="text-base font-black text-slate-800 leading-tight">
                    {data.ticket.issue}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Customer</p>
                       <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-300" /> {data.ticket.customer_name}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Location</p>
                       <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-300" /> {data.ticket.site_name}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Equipment</p>
                       <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-slate-300" /> {data.ticket.equipment}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Project</p>
                       <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-300" /> {data.ticket.project_name}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Lifecycle Timeline */}
              <section className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-500" /> Audit Lifecycle
                </h4>
                <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {data.timeline && data.timeline.map((log: any, idx: number) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[37px] top-1 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center z-10 ${idx === 0 ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-200'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm space-y-1.5">
                        <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{log.action}</h5>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{log.message || log.comment}</p>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase pt-1">
                          <User className="w-3 h-3" /> System Update • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Update Form (Sticky Bottom) */}
              <section className="bg-slate-900 rounded-[2rem] p-6 shadow-xl relative overflow-hidden mt-8">
                 <div className="relative z-10 space-y-5">
                    <div className="flex items-center gap-2">
                       <Zap className="w-4 h-4 text-indigo-400" />
                       <h4 className="text-white font-bold text-base">Engineer Action</h4>
                    </div>

                    <div className="space-y-4">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Set Modality</label>
                          <select
                            className="w-full bg-white/10 border border-white/10 text-white p-3 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold text-xs cursor-pointer"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value="IN_PROGRESS" className="text-slate-900">IN PROGRESS</option>
                            <option value="RESOLVED" className="text-slate-900">RESOLVED</option>
                          </select>
                       </div>

                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Technical Notes</label>
                          <textarea
                            className="w-full bg-white/10 border border-white/10 text-white p-4 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium text-xs min-h-[100px] resize-none placeholder:text-slate-600"
                            placeholder="Detail resolution steps or progress..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                       </div>

                       <button
                        onClick={handleUpdate}
                        disabled={updating || !comment.trim()}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black shadow-xl shadow-indigo-900/40 hover:bg-indigo-500 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                       >
                         {updating ? (
                           <Loader2 className="w-5 h-5 animate-spin" />
                         ) : (
                           <>
                             <span>Commit Status Update</span>
                             <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                           </>
                         )}
                       </button>
                    </div>
                 </div>
              </section>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
               <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
               <p className="font-bold">Error retrieving ticket data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
