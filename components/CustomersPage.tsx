
import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { 
  Users, 
  Search, 
  Plus, 
  Loader2, 
  Edit2, 
  Trash2, 
  X, 
  Building2, 
  Hash, 
  Calendar,
  ChevronRight,
  AlertTriangle,
  Info
} from "lucide-react";

export default function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/customers");
      setCustomers(res.data || []);
    } catch (err) {
      console.error("Failed to load customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setMsg("");
    setShow(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setName(c.name);
    setMsg("");
    setShow(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/customers/${editing.id}`, { name });
        setMsg("Customer updated successfully");
      } else {
        await api.post("/customers", { name });
        setMsg("Customer created successfully");
      }
      setShow(false);
      load();
      // Clear message after 3 seconds
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("Operation failed. Please try again.");
    }
  };

  const openRemoveConfirm = (c: any) => {
    setCustomerToDelete(c);
    setShowDeleteConfirm(true);
  };

  const confirmRemove = async () => {
    if (!customerToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/customers/${customerToDelete.id}`);
      setShowDeleteConfirm(false);
      setCustomerToDelete(null);
      load();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.customer_code || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Corporate Clients</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage and organize your business customer base.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Add New Customer</span>
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
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-50 transition-colors" />
          </div>
          <input
            className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium"
            placeholder="Search by name or customer code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
          <p className="text-slate-400 font-medium">Synchronizing client list...</p>
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">System Code</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Client Name</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Registered</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[11px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg w-fit">
                        <Hash className="w-3 h-3" />
                        {c.customer_code}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Calendar className="w-4 h-4" />
                        {new Date(c.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEdit(c)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Client"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openRemoveConfirm(c)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Client"
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

          {/* Mobile View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filtered.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{c.name}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{c.customer_code}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openEdit(c)}
                      className="p-2 text-indigo-600 bg-indigo-50 rounded-xl"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openRemoveConfirm(c)}
                      className="p-2 text-rose-600 bg-rose-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                   <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <Calendar className="w-3 h-3" />
                      {new Date(c.created_at).toLocaleDateString()}
                   </div>
                   <div className="flex items-center text-indigo-600 text-[11px] font-bold">
                      View Details <ChevronRight className="w-4 h-4" />
                   </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No customers found</h3>
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
            className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-scale-in"
          >
            <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editing ? "Update Client" : "Register Client"}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Enter the official business name for the record.
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

            <div className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Official Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-slate-800"
                    placeholder="e.g. Acme Corporation"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
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
                {editing ? "Save Changes" : "Create Record"}
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
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-scale-in">
             <div className="p-8 text-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                   <AlertTriangle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Confirm Removal</h3>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                   Are you sure you want to delete <span className="font-bold text-slate-900">{customerToDelete?.name}</span>? This will also affect associated projects and tickets.
                </p>
             </div>
             <div className="px-8 pb-8 flex flex-col gap-3">
                <button 
                  onClick={confirmRemove}
                  disabled={isDeleting}
                  className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  Yes, Remove Client
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
