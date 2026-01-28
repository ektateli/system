
import React, { useEffect, useState } from "react";
// Fixed: Use namespace import to avoid named export issues in some environments
import * as ReactRouterDOM from "react-router-dom";
import { api } from "../api/api";
import { 
  Ticket, 
  ChevronLeft, 
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
  Box
} from "lucide-react";

// Extracting members from ReactRouterDOM to fix named export errors
const { useParams, useNavigate } = ReactRouterDOM as any;

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState("IN_PROGRESS");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/tickets/${id}`);
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

  const update = async () => {
    if (!comment.trim()) return;
    setUpdating(true);
    try {
      await api.post(`/tickets/${id}/status`, {
        status,
        comment,
      });
      setComment("");
      await load();
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading ticket lifecycle...</p>
      </div>
    );
  }

  if (!data) return (
    <div className="p-8 text-center text-slate-500 font-medium">Ticket not found or access denied.</div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-[1400px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors group w-fit"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Queue
        </button>
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Priority: {data.ticket.priority || 'MEDIUM'}</span>
           <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusBadge(data.ticket.status)}`}>
              {data.ticket.status}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Content: Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/50 rounded-bl-full -z-0"></div>
             
             <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-[0.15em] text-[10px]">
                      <Ticket className="w-4 h-4" /> Case ID #{data.ticket.id}
                   </div>
                   <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                     {data.ticket.issue}
                   </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                         <HardDrive className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Equipment</p>
                         <p className="text-sm font-bold text-slate-800">{data.ticket.equipment}</p>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                         <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                         <p className="text-sm font-bold text-slate-800">{data.ticket.site_name || "Main Site"}</p>
                      </div>
                   </div>
                </div>

                <div className="bg-indigo-50/30 border border-indigo-100 p-6 rounded-3xl space-y-3">
                   <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold">
                      <MessageSquare className="w-4 h-4" /> Customer Description
                   </div>
                   <p className="text-slate-700 leading-relaxed text-sm font-medium italic">
                      "{data.ticket.description || "The customer has not provided a long-form description for this issue."}"
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Content: Sidebar Timeline & Update */}
        <div className="space-y-6">
          
          {/* Audit Timeline */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
                      <History className="w-5 h-5" />
                   </div>
                   <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Lifecycle Trail</h3>
                </div>
                <Clock className="w-4 h-4 text-slate-300" />
             </div>

             <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {data.timeline && data.timeline.map((log: any, idx: number) => (
                  <div key={idx} className="relative animate-fade-in">
                     <div className={`absolute -left-[37px] top-1.5 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center z-10 ${idx === 0 ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-200'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">{log.action}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{log.message || log.comment}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase pt-1">
                           <User className="w-3 h-3" /> System Admin • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Update Status Form */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
             <Activity className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
             
             <div className="relative z-10 space-y-6">
                <div className="space-y-1">
                   <h3 className="text-white font-bold text-lg">Update Status</h3>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Engineer Actions</p>
                </div>

                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Modality</label>
                      <select
                        className="w-full bg-white/10 border border-white/10 text-white p-3 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-xs cursor-pointer appearance-none"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="IN_PROGRESS" className="text-slate-900">IN PROGRESS</option>
                        <option value="RESOLVED" className="text-slate-900">RESOLVED</option>
                      </select>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Progress Notes</label>
                      <textarea
                        className="w-full bg-white/10 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-xs min-h-[100px] resize-none placeholder:text-slate-500"
                        placeholder="Detail the technical resolution steps..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                   </div>

                   <button
                    onClick={update}
                    disabled={updating || !comment.trim()}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-900/40 hover:bg-indigo-500 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                   >
                     {updating ? (
                       <Loader2 className="w-5 h-5 animate-spin" />
                     ) : (
                       <>
                         <span>Post Update</span>
                         <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </>
                     )}
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
