
import React, { useEffect, useState, useContext } from "react";
import { supabase } from "../api/supabase";
import { AuthContext } from "../context/AuthContext";
import { 
  Briefcase, 
  MapPin, 
  HardDrive, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Info,
  Ticket,
  ChevronRight,
  AlertTriangle,
  Zap
} from "lucide-react";

export default function RaiseTicket() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    project_id: "",
    site_id: "",
    equipment: "",
    issue: "",
    priority: "MEDIUM"
  });

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    const loadProjects = async () => {
      const { data } = await supabase.from('projects').select('*');
      setProjects(data || []);
    };
    loadProjects();
  }, []);

  const onProject = async (id: string) => {
    setForm({ ...form, project_id: id, site_id: "", equipment: "" });
    if (!id) {
      setSites([]);
      return;
    }
    const { data } = await supabase.from('sites').select('*').eq('project_id', id);
    setSites(data || []);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Find customer_id from project if needed, or assume project links to customer
      const { data: projData } = await supabase.from('projects').select('customer_id').eq('id', form.project_id).single();

      const { error } = await supabase.from('tickets').insert([{
        issue: form.issue,
        description: form.issue, // Using same for now
        project_id: form.project_id,
        site_id: form.site_id,
        customer_id: projData?.customer_id,
        equipment: form.equipment,
        priority: form.priority,
        status: 'OPEN'
      }]);

      if (error) throw error;

      setMsgType("success");
      setMsg("Ticket raised successfully in Supabase Cloud.");
      setForm({ project_id: "", site_id: "", equipment: "", issue: "", priority: "MEDIUM" });
      setSites([]);
    } catch (err) {
      setMsgType("error");
      setMsg("Failed to submit ticket. Please check Supabase RLS policies.");
    } finally {
      setLoading(false);
      setTimeout(() => { setMsg(""); setMsgType(""); }, 5000);
    }
  };

  const priorities = [
    { id: 'LOW', label: 'Low', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
    { id: 'MEDIUM', label: 'Medium', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { id: 'HIGH', label: 'High', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
           <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100"><Ticket className="w-6 h-6" /></div>
           <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Request Support</h2>
        </div>
        <p className="text-slate-500 font-medium text-sm">Deploy a technical request directly to the engineering queue.</p>
      </div>

      {msg && (
        <div className={`mb-6 flex items-center gap-3 p-5 rounded-[1.5rem] border animate-scale-in ${msgType === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
          {msgType === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-bold leading-tight">{msg}</p>
        </div>
      )}

      <form onSubmit={submit} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-6 sm:p-10 space-y-8 relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px]"><Info className="w-3.5 h-3.5" /> Project Context</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">Assigned Project</label>
              <select className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-indigo-500 font-bold text-slate-800" value={form.project_id} onChange={(e) => onProject(e.target.value)} required>
                <option value="">Select Project</option>
                {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">Target Site</label>
              <select className={`w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-indigo-500 font-bold text-slate-800 ${!sites.length ? 'opacity-50' : ''}`} value={form.site_id} onChange={(e) => setForm({ ...form, site_id: e.target.value })} disabled={!sites.length} required>
                <option value="">{form.project_id ? "Select Site" : "Awaiting Project..."}</option>
                {sites.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50 relative z-10">
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px]"><AlertTriangle className="w-3.5 h-3.5" /> Urgency Level</div>
          <div className="grid grid-cols-3 gap-3">
             {priorities.map((p) => (
               <button key={p.id} type="button" onClick={() => setForm({ ...form, priority: p.id })} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${form.priority === p.id ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
                 <Zap className={`w-5 h-5 mb-1 ${p.color}`} />
                 <span className={`text-[10px] font-black uppercase tracking-wider ${p.color}`}>{p.label}</span>
               </button>
             ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1">Affected Equipment</label>
            <input className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-indigo-500 font-medium text-slate-800" placeholder="e.g. Rack B-12 UPS System" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1">Describe the Issue</label>
            <textarea className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-indigo-500 font-medium text-slate-800 min-h-[160px] resize-none" placeholder="Please describe exactly what happened..." value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} required />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black shadow-2xl hover:bg-indigo-700 transition-all disabled:opacity-70 group">
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" /><span>Submit Support Ticket</span></>}
        </button>
      </form>
    </div>
  );
}
