
import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { 
  MapPin, 
  Search, 
  Plus, 
  Loader2, 
  Edit2, 
  Trash2, 
  X, 
  Briefcase, 
  Package, 
  HardDrive,
  Filter,
  Layers
} from "lucide-react";

export default function SitesPage() {
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    project_id: "",
    equipment_name: "",
    vendor: "",
    quantity: 1,
    remarks: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, p] = await Promise.all([
        api.get("/sites"),
        api.get("/projects"),
      ]);
      setSites(s.data || []);
      setProjects(p.data || []);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      project_id: "",
      equipment_name: "",
      vendor: "",
      quantity: 1,
      remarks: "",
    });
    setShow(true);
  };

  const openEdit = (s: any) => {
    setEditing(s);
    const eq = (s.equipment && s.equipment.length > 0) ? s.equipment[0] : {};
    setForm({
      name: s.name || "",
      project_id: s.project_id || "",
      equipment_name: eq.name || s.equipment_name || "",
      vendor: eq.vendor || s.vendor || "",
      quantity: eq.qty || s.quantity || 1,
      remarks: eq.remarks || s.remarks || "",
    });
    setShow(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      project_id: form.project_id,
      equipment: [
        { 
          name: form.equipment_name, 
          vendor: form.vendor, 
          qty: form.quantity, 
          remarks: form.remarks 
        }
      ]
    };

    try {
      if (editing) {
        await api.put(`/sites/${editing.id}`, payload);
      } else {
        await api.post("/sites", payload);
      }
      setShow(false);
      loadData();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const remove = async (id: number) => {
    // Alert box removed as per request
    try {
      await api.delete(`/sites/${id}`);
      loadData();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filtered = sites.filter(s =>
    (!projectFilter || s.project_id == projectFilter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-[1600px] mx-auto space-y-8 text-slate-900">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                <MapPin className="w-6 h-6" />
             </div>
             <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Site Registry</h2>
          </div>
          <p className="text-slate-500 mt-1 text-sm font-medium">Configure physical locations and installed hardware.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Add New Site</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium"
            placeholder="Search by site name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold text-slate-700 appearance-none"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-400 font-medium">Synchronizing site data...</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Site Details</th>
                  <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Project</th>
                  <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Equipment</th>
                  <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => {
                  const eq = (s.equipment && s.equipment.length > 0) ? s.equipment[0] : { name: s.equipment_name, qty: s.quantity };
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-slate-800">{s.name}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-slate-500 font-bold">
                          <Briefcase className="w-4 h-4 text-slate-300" />
                          {s.project_name || "N/A"}
                        </div>
                      </td>
                      <td className="p-5">
                        {eq.name ? (
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                <Package className="w-4 h-4" />
                             </div>
                             <div>
                               <p className="font-bold text-slate-700 leading-none">{eq.name}</p>
                               <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">QTY: {eq.qty || 1}</p>
                             </div>
                          </div>
                        ) : <span className="text-slate-300 italic text-xs">No asset</span>}
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(s)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => remove(s.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
            {filtered.map((s) => {
               const eq = (s.equipment && s.equipment.length > 0) ? s.equipment[0] : { name: s.equipment_name, qty: s.quantity, vendor: s.vendor };
               return (
                <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{s.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> {s.project_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="p-2.5 text-indigo-600 bg-indigo-50 rounded-xl">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(s.id)} className="p-2.5 text-rose-600 bg-rose-50 rounded-xl">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {eq.name && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
                       <Package className="w-5 h-5 text-slate-400" />
                       <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 truncate">{eq.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">Qty: {eq.qty || 1} • {eq.vendor || 'Generic'}</p>
                       </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200">
              <MapPin className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No sites found</h3>
              <p className="text-slate-400 text-sm mt-1">Adjust your filters or create a new site.</p>
            </div>
          )}
        </>
      )}

      {/* Modern Modal / Dialog */}
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
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                   <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {editing ? "Update Site Profile" : "Register Site"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Set location and hardware technical specs.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShow(false)}
                className="p-2.5 rounded-2xl text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                  <Layers className="w-4 h-4" /> Location Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 ml-1">Site Name</label>
                    <input
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-800"
                      placeholder="e.g. Rack 4 - Campus B"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 ml-1">Project Assignment</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-800 appearance-none"
                      value={form.project_id}
                      onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                      required
                    >
                      <option value="">Select Project</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                  <HardDrive className="w-4 h-4" /> Hardware Specification
                </div>
                
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Equipment Name</label>
                      <input 
                        className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 transition-all" 
                        placeholder="e.g. Cisco Nexus"
                        value={form.equipment_name}
                        onChange={(e) => setForm({ ...form, equipment_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Vendor / OEM</label>
                      <input 
                        className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 transition-all" 
                        placeholder="e.g. Cisco Systems"
                        value={form.vendor}
                        onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-1 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Quantity</label>
                      <input 
                        type="number"
                        className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 transition-all" 
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                        min="1"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Remarks / Serial Number</label>
                      <input 
                        className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 transition-all" 
                        placeholder="Technical notes..."
                        value={form.remarks}
                        onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="flex-1 px-6 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-200 transition-all border border-slate-200"
              >
                Cancel
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                <HardDrive className="w-5 h-5" />
                {editing ? "Save Changes" : "Create Site"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
