
import React, { useEffect, useState } from "react";
import { api } from "../api/api";
// Fixed: Use namespace import to avoid named export issues in some environments
import * as ReactRouterDOM from "react-router-dom";
import { 
  Ticket, 
  UserCheck, 
  Filter, 
  Loader2, 
  ChevronRight, 
  MapPin, 
  Briefcase, 
  Building2,
  ExternalLink,
  ShieldCheck,
  Clock,
  LayoutDashboard
} from "lucide-react";

// Extracting members from ReactRouterDOM to fix named export errors
const { Link } = ReactRouterDOM as any;

export default function AdminTickets() {
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState<any[]>([]);
    const [engineers, setEngineers] = useState<any[]>([]);
    const [status, setStatus] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const [t, u] = await Promise.all([
                api.get("/tickets"),
                api.get("/users"),
            ]);

            setTickets(t.data || []);
            setEngineers((u.data || []).filter((x: any) => x.role === "ENGINEER"));
        } catch (err) {
            console.error("Failed to load tickets", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [status]);

    const assign = async (ticketId: number, engineerId: string) => {
        try {
            await api.post(`/tickets/${ticketId}/assign`, { engineer_id: engineerId });
            load();
        } catch (err) {
            console.error("Assignment failed", err);
        }
    };

    const badge = (s: string) => {
        switch (s) {
            case "OPEN": return "bg-rose-50 text-rose-600 border-rose-100";
            case "IN_PROGRESS": return "bg-amber-50 text-amber-600 border-amber-100";
            case "RESOLVED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    const filteredTickets = status 
        ? tickets.filter(t => t.status === status)
        : tickets;

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-[1600px] mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                            <Ticket className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Support Queue</h2>
                    </div>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Manage global support requests and resource assignment.</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <Filter className="w-4 h-4 text-slate-400 ml-2" />
                    <select
                        className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none pr-8 cursor-pointer appearance-none"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                    <p className="text-slate-400 font-medium">Fetching active cases...</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Reference</th>
                                    <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Context</th>
                                    <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Status</th>
                                    <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Engineer Assignment</th>
                                    <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredTickets.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-400 text-[10px] uppercase">Ticket ID</span>
                                                <span className="font-bold text-slate-900 text-base">#{t.id}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-700 font-bold">
                                                    <Building2 className="w-3.5 h-3.5 text-slate-300" />
                                                    {t.customer_name}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium">
                                                    <Briefcase className="w-3 h-3" /> {t.project_name}
                                                    <span className="text-slate-200">•</span>
                                                    <MapPin className="w-3 h-3" /> {t.site_name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border tracking-widest ${badge(t.status)}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="relative max-w-[200px]">
                                                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                                <select
                                                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                                    value={t.engineer_id || ""}
                                                    onChange={(e) => assign(t.id, e.target.value)}
                                                >
                                                    <option value="">Unassigned</option>
                                                    {engineers.map((e) => (
                                                        <option key={e.id} value={e.id}>{e.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <Link
                                                to={`/tickets/${t.id}`}
                                                className="inline-flex items-center justify-center p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all active:scale-90"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
                        {filteredTickets.map((t) => (
                            <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs">
                                            #{t.id}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 leading-tight">{t.customer_name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.project_name}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border tracking-wider ${badge(t.status)}`}>
                                        {t.status}
                                    </span>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {t.site_name}
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                                        <Clock className="w-3.5 h-3.5" />
                                        Issued: {new Date().toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Engineer</label>
                                    <div className="relative">
                                        <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 appearance-none"
                                            value={t.engineer_id || ""}
                                            onChange={(e) => assign(t.id, e.target.value)}
                                        >
                                            <option value="">Not Assigned</option>
                                            {engineers.map((e) => (
                                                <option key={e.id} value={e.id}>{e.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <Link
                                    to={`/tickets/${t.id}`}
                                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-xs hover:bg-indigo-100 transition-all"
                                >
                                    View Full Ticket Detail <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>

                    {filteredTickets.length === 0 && (
                        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800">No tickets found</h3>
                            <p className="text-slate-400 text-sm mt-1">Try refining your status filter or check back later.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
