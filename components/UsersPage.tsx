
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  UserPlus, 
  Search, 
  User as UserIcon, 
  Mail, 
  Shield, 
  X, 
  Plus, 
  Loader2,
  Edit2,
  Trash2,
  ChevronRight,
  AlertTriangle
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ENGINEER",
  });

  const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, form);
      } else {
        await api.post("/users", form);
      }
      closeModal();
      loadUsers();
    } catch (err) {
      console.error("Operation failed", err);
    }
  };

  const openDeleteConfirm = (user: any) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/users/${userToDelete.id}`);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      loadUsers();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "", 
      role: user.role,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setForm({ name: "", email: "", password: "", role: "ENGINEER" });
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor = (r: string) => {
    if (r === "SUPER_ADMIN") return "bg-purple-100 text-purple-700 border-purple-200";
    if (r === "ADMIN") return "bg-blue-100 text-blue-700 border-blue-200";
    if (r === "ENGINEER") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">User Directory</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage system access, edit roles, or remove accounts.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 group"
        >
          <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6">
        <div className="relative group max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
          <p className="text-slate-400 font-medium">Loading user data...</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">User Details</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Role</th>
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider text-[11px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${roleColor(u.role)}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(u)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteConfirm(u)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete User"
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
            {filtered.map((u) => (
              <div key={u.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{u.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openEditModal(u)}
                      className="p-2 text-indigo-600 bg-indigo-50 rounded-xl"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteConfirm(u)}
                      className="p-2 text-rose-600 bg-rose-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${roleColor(u.role)}`}>
                    {u.role.replace('_', ' ')}
                  </span>
                  <div className="flex items-center text-indigo-600 text-[11px] font-bold">
                    Quick Edit <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <UserIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No users found</h3>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your search criteria.</p>
            </div>
          )}
        </>
      )}

      {/* Create / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" 
            onClick={closeModal}
          />
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-scale-in"
          >
            <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editingUser ? "Update Account Details" : "Create New Account"}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {editingUser ? `Modifying ${editingUser.name}'s profile.` : "Fill in the details for the new team member."}
                </p>
              </div>
              <button 
                type="button"
                onClick={closeModal}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-slate-800"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-slate-800"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                    {editingUser ? "New Password (Optional)" : "Temporary Password"}
                  </label>
                  <input
                    type="password"
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-slate-800"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={!editingUser}
                  />
                  {editingUser && <p className="text-[10px] text-slate-400 ml-1">Leave blank to keep current.</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Access Level</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-800 appearance-none"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="ENGINEER">ENGINEER</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-6 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-colors border border-slate-200"
              >
                Discard
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                {editingUser ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingUser ? "Save Changes" : "Create Account"}
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
                <h3 className="text-xl font-black text-slate-900">Confirm Deletion</h3>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                   Are you sure you want to remove <span className="font-bold text-slate-900">{userToDelete?.name}</span>? This action is permanent and cannot be undone.
                </p>
             </div>
             <div className="px-8 pb-8 flex flex-col gap-3">
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  Yes, Delete User
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
