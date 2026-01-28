
import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import { 
  UploadCloud, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Info,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet,
  Clock,
  History,
  HardDrive,
  ExternalLink
} from "lucide-react";

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "info" | "">("");
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const loadUploads = async () => {
    try {
      setLoadingHistory(true);
      const r = await api.get("/bulk-upload");
      setUploads(r.data || []);
    } catch (err) {
      console.error("Failed to load upload history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadUploads();
  }, []);

  const upload = async () => {
    if (!file) {
      setMsgType("info");
      setMsg("Please select a valid CSV or XLSX file first.");
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      await api.post("/bulk-upload", form);
      setMsgType("success");
      setMsg("Dataset successfully uploaded and queued for processing.");
      setFile(null);
      loadUploads();
    } catch (e) {
      setMsgType("error");
      setMsg("Upload failed. Please ensure the file format is correct and try again.");
    } finally {
      setLoading(false);
      // Auto-clear message after 5 seconds
      setTimeout(() => { setMsg(""); setMsgType(""); }, 5000);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PROCESSING': return 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse';
      case 'FAILED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                <UploadCloud className="w-6 h-6" />
             </div>
             <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Bulk Ingestion</h2>
          </div>
          <p className="text-slate-500 mt-1 text-sm font-medium">Import large datasets via CSV or Excel spreadsheets.</p>
        </div>
      </div>

      {/* Feedback Alert */}
      {msg && (
        <div className={`flex items-center gap-3 p-5 rounded-[1.5rem] border animate-scale-in shadow-sm ${
          msgType === "success" 
            ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
            : msgType === "error"
            ? "bg-rose-50 border-rose-100 text-rose-700"
            : "bg-indigo-50 border-indigo-100 text-indigo-700"
        }`}>
          {msgType === "success" && <CheckCircle2 className="w-5 h-5 shrink-0" />}
          {msgType === "error" && <AlertCircle className="w-5 h-5 shrink-0" />}
          {msgType === "info" && <Info className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-bold leading-tight">{msg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Upload Zone */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -z-0"></div>
            
            <div className="relative z-10">
              <label className="group relative flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-[2rem] hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer overflow-hidden">
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) setFile(selected);
                  }}
                />
                
                {file ? (
                  <div className="text-center p-6 animate-scale-in">
                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-indigo-200">
                      <FileSpreadsheet className="w-10 h-10" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1 truncate max-w-xs mx-auto">{file.name}</h4>
                    <p className="text-xs text-slate-400 font-medium mb-4">{(file.size / 1024).toFixed(2)} KB • Ready to upload</p>
                    <button 
                      onClick={removeFile}
                      className="inline-flex items-center gap-2 text-rose-500 text-xs font-bold hover:bg-rose-50 px-4 py-2 rounded-xl transition-all active:scale-95"
                    >
                      <X className="w-4 h-4" /> Remove File
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4 group-hover:scale-110 group-hover:text-indigo-400 transition-all duration-300">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1">Select your File</h4>
                    <p className="text-xs text-slate-400 font-medium px-4">Drag and drop or click to browse your files</p>
                    <div className="mt-6 flex gap-2 justify-center">
                       <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400">.CSV</span>
                       <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400">.XLSX</span>
                    </div>
                  </div>
                )}
              </label>

              <button
                onClick={upload}
                disabled={!file || loading}
                className="mt-8 w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Upload & Process</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Upload History Table (Desktop & Mobile Cards) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-600" />
                    Recent Activity
                </h3>
                <button onClick={loadUploads} className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 tracking-widest">
                    Refresh List
                </button>
            </div>

            {loadingHistory ? (
                <div className="bg-white rounded-[2rem] p-12 flex flex-col items-center justify-center border border-slate-100">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                    <p className="text-slate-400 text-xs font-medium">Synchronizing history...</p>
                </div>
            ) : uploads.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-slate-200">
                    <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">No ingestion history found.</p>
                </div>
            ) : (
                <>
                    {/* Desktop View */}
                    <div className="hidden sm:block bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Filename</th>
                                    <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                                    <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {uploads.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-slate-700 truncate max-w-[200px]">{u.filename}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border tracking-wider ${getStatusBadge(u.status)}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400 font-medium text-xs">
                                            {new Date(u.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="grid grid-cols-1 gap-3 sm:hidden">
                        {uploads.map(u => (
                            <div key={u.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-800 text-sm truncate">{u.filename}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            {new Date(u.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase border tracking-wider ${getStatusBadge(u.status)}`}>
                                    {u.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
          </div>
        </div>

        {/* Instructions & Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
             <ShieldCheck className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
             <div className="relative z-10">
                <h3 className="text-white font-bold text-lg mb-2">Security Note</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Your files are encrypted during transit. Our automated system will validate schema integrity before updating the central database.
                </p>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px] mb-6 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" /> Upload Instructions
             </h3>
             <ul className="space-y-4">
                {[
                  { text: "Use valid CSV or XLSX headers.", icon: HardDrive },
                  { text: "Max file size: 10MB.", icon: Clock },
                  { text: "UTF-8 encoding required.", icon: ShieldCheck },
                  { text: "Verify records before execution.", icon: CheckCircle2 }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                     <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <item.icon className="w-3.5 h-3.5" />
                     </div>
                     <span className="text-xs text-slate-600 font-bold leading-tight pt-1">{item.text}</span>
                  </li>
                ))}
             </ul>
          </div>

          {/* Download Template Card */}
          <div className="bg-indigo-50/50 rounded-[2.5rem] p-8 border border-indigo-100/50 group cursor-pointer hover:bg-indigo-100/50 transition-colors">
            <h4 className="text-indigo-900 font-bold text-sm mb-2">Need a template?</h4>
            <p className="text-indigo-700/60 text-[11px] font-medium mb-4">Download our standardized schema for faster processing.</p>
            <button className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
                Download Template <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
