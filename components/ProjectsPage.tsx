
import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { 
  Briefcase, 
  Search, 
  Plus, 
  Loader2, 
  Edit2, 
  Trash2, 
  X, 
  Building2, 
  Hash, 
  MapPin,
  Users,
  ChevronRight,
  AlertTriangle,
  Info,
  Type,
  UserCheck
} from "lucide-react";

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [engineers, setEngineers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "",
    region: "",
    customer_id: "",
    engineer_ids: [] as string[],
  });

  const load = async () => {
    setLoading(true);
    try {
      const [p, c, e] = await Promise.all([
        api.get("/projects"),
        api.get("/customers"),
        api.get("/users?role=ENGINEER"),
      ]);
      setProjects(p.data || []);
      setCustomers(c.data || []);
      setEngineers(e.data || []);
    } catch (err) {
      console.error("Failed to load project data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      code: "",
      type: "",
      region: "",
      customer_id: "",
      engineer_ids: [],
    });
    setMsg("");
    setShow(true);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name,
      code: p.code,
      type: p.type,
      region: p.region,
      customer_id: p.customer_id,
      engineer_ids: (p.engineers || []).map((e: any) => e.id),
    });
    setMsg("");
    setShow(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/projects/${editing.id}`, form);
        setMsg("Project updated successfully");
      } else {
        await api.post("/projects", form);
        setMsg("Project created successfully");
      }
      setShow(false);
      load();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("Action failed. Please check your input.");
    }
  };

  const openRemoveConfirm = (p: any) => {
    setProjectToDelete(p);
    setShowDeleteConfirm(true);
  };

  const confirmRemove = async () => {
    if (!projectToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/projects/${projectToDelete.id}`);
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
      load();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.code || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Project Management</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Configure service assignments and resource allocations.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {msg && (
        <div className="mb-6 flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-indigo-700 text-sm font-bold animate-fade-in">
          <Info className="w-5 h-5 shrink-0" />
          {msg}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6">
        <div className="relative group max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium"
            placeholder="Search projects by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
          <p className="text-slate-400 font-medium">Aggregating project data...</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Identity</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Client</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Region / Type</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Assigned Engineers</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[11px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{p.name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Hash className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{p.code}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-medium text-slate-600">
                        <Building2 className="w-4 h-4 text-slate-300" />
                        {p.customer_name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          {p.region || "Global"}
                        </div>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-black uppercase tracking-tighter">
                          {p.type || "General"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex -space-x-2 overflow-hidden">
                        {(p.engineers || []).slice(0, 3).map((e: any, idx: number) => (
                          <div 
                            key={e.id} 
                            className="inline-block h-8 w-8 rounded-lg ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600"
                            title={e.name}
                          >
                            {e.name.charAt(0)}
                          </div>
                        ))}
                        {(p.engineers || []).length > 3 && (
                          <div className="inline-block h-8 w-8 rounded-lg ring-2 ring-white bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600">
                            +{(p.engineers || []).length - 3}
                          </div>
                        )}
                        {(p.engineers || []).length === 0 && (
                          <span className="text-xs text-slate-400 font-medium italic">No engineers</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEdit(p)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openRemoveConfirm(p)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight">{p.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Hash className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-mono font-bold text-slate-400">{p.code}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openEdit(p)}
                      className="p-2 text-indigo-600 bg-indigo-50 rounded-xl"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openRemoveConfirm(p)}
                      className="p-2 text-rose-600 bg-rose-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" /> Client
                      </span>
                      <span className="text-slate-700 font-bold">{p.customer_name}</span>
                   </div>
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Region
                      </span>
                      <span className="text-slate-700 font-bold">{p.region || "Global"}</span>
                   </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-500">{(p.engineers || []).length} Assigned</span>
                  </div>
                  <div className="flex items-center text-indigo-600 text-[11px] font-bold">
                    Edit Setup <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No projects found</h3>
              <p className="text-slate-400 text-sm mt-1">Try refining your search terms.</p>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" 
            onClick={() => setShow(false)}
          />
          <form
            onSubmit={save}
            className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-scale-in"
          >
            <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editing ? "Update Project Config" : "Deploy New Project"}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Define project identity and assign core team members.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setShow(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Project Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-slate-800"
                      placeholder="e.g. Server Migration"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">System Code</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-mono font-bold text-indigo-600 uppercase"
                      placeholder="PRJ-2024-001"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Project Type</label>
                  <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-slate-800"
                      placeholder="e.g. Infrastructure"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Geographic Region</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-slate-800"
                      placeholder="e.g. North America"
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Associate Customer</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-800 appearance-none"
                    value={form.customer_id}
                    onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                    required
                  >
                    <option value="">Select Primary Client</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5" /> Assign Technical Team
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
                  {engineers.map(e => (
                    <label 
                      key={e.id} 
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        form.engineer_ids.includes(e.id) 
                        ? 'bg-white border-indigo-200 shadow-sm' 
                        : 'border-transparent hover:bg-white/60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        checked={form.engineer_ids.includes(e.id)}
                        onChange={() => {
                          const set = new Set(form.engineer_ids);
                          set.has(e.id) ? set.delete(e.id) : set.add(e.id);
                          setForm({ ...form, engineer_ids: Array.from(set) });
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 leading-none">{e.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Engineer</span>
                      </div>
                    </label>
                  ))}
                  {engineers.length === 0 && (
                    <p className="col-span-full text-center text-xs text-slate-400 italic py-2">No engineers available to assign.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="flex-1 px-6 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-colors border border-slate-200"
              >
                Discard
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                {editing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editing ? "Update Project" : "Initialize Project"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" 
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="bg-white w-full max-sm:max-w-xs max-w-sm rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-scale-in">
             <div className="p-8 text-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                   <AlertTriangle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">Dissolve Project?</h3>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                   Removing <span className="font-bold text-slate-900 uppercase">{projectToDelete?.code}</span> will archive its status and unbind assigned engineers. This is final.
                </p>
             </div>
             <div className="px-8 pb-8 flex flex-col gap-3">
                <button 
                  onClick={confirmRemove}
                  disabled={isDeleting}
                  className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  Confirm Deletion
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  Keep Project
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
