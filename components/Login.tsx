
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext, UserRole } from "../context/AuthContext";
import { supabase } from "../api/supabase";
import * as ReactRouterDOM from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Loader2, 
  AlertCircle, 
  ChevronRight,
  ShieldCheck,
  Info
} from "lucide-react";

const { useNavigate } = ReactRouterDOM as any;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateEmail = (value: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email is required";
    if (!re.test(value)) return "Enter a valid email address";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eErr = validateEmail(email);
    if (eErr) {
      setEmailError(eErr);
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");
    setLoading(true);

    // --- SUPABASE AUTH START ---
    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (data.session) {
        const metadata = data.session.user.user_metadata;
        const role: UserRole = metadata.role || 'CUSTOMER';
        
        login(data.session.access_token, {
          name: metadata.name || email.split('@')[0],
          email: email,
          loginTime: new Date().toLocaleTimeString(),
          role: role
        });

        if (role === "ENGINEER") navigate("/engineer");
        else if (role === "CUSTOMER") navigate("/customer");
        else navigate("/admin");
        return;
      }

      if (supabaseError) {
        // --- DEMO LOGIC FALLBACK ---
        if (email === "admin@example.com" && password === "admin123") {
          setTimeout(() => {
            login("mock-admin-token", {
              name: "Admin User",
              email: "admin@example.com",
              loginTime: new Date().toLocaleTimeString(),
              role: 'ADMIN'
            });
            navigate("/admin");
            setLoading(false);
          }, 800);
          return;
        }

        if (email === "engineer@example.com" && password === "engineer123") {
          setTimeout(() => {
            login("mock-engineer-token", {
              name: "Technical Engineer",
              email: "engineer@example.com",
              loginTime: new Date().toLocaleTimeString(),
              role: 'ENGINEER'
            });
            navigate("/engineer");
            setLoading(false);
          }, 800);
          return;
        }

        setError(supabaseError.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] relative overflow-hidden px-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-200 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-200 mb-4 transform hover:rotate-6 transition-transform">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Access</h1>
          <p className="text-slate-500 mt-2 font-medium">Secured by Supabase Cloud Architecture</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-sm animate-pulse">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 transition-colors ${emailError ? 'text-red-400' : 'text-slate-400 group-focus-within:text-indigo-500'}`} />
                </div>
                <input
                  type="email"
                  className={`w-full bg-slate-50/50 border pl-11 pr-4 py-3.5 rounded-xl transition-all outline-none text-slate-800 placeholder:text-slate-400 ${
                    emailError
                      ? "border-red-300 focus:ring-4 focus:ring-red-50"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  }`}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(validateEmail(e.target.value));
                  }}
                  onBlur={() => setEmailError(validateEmail(email))}
                />
              </div>
              {emailError && (
                <p className="text-xs font-medium text-red-500 ml-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full inline-block"></span>
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="password"
                  className="w-full bg-slate-50/50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl transition-all outline-none text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-3">
            <div className="text-[10px] text-indigo-800 leading-relaxed w-full">
              <p className="font-bold mb-2 flex items-center gap-1 text-xs"><Info className="w-3.5 h-3.5" /> Demo Access:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="font-black text-[9px] uppercase opacity-60">Admin Role</p>
                  <p className="font-mono bg-white/50 px-1.5 py-0.5 rounded select-all">admin@example.com</p>
                  <p className="font-mono bg-white/50 px-1.5 py-0.5 rounded select-all">admin123</p>
                </div>
                <div className="space-y-1 border-l border-indigo-100 pl-4">
                  <p className="font-black text-[9px] uppercase opacity-60">Engineer Role</p>
                  <p className="font-mono bg-white/50 px-1.5 py-0.5 rounded select-all">engineer@example.com</p>
                  <p className="font-mono bg-white/50 px-1.5 py-0.5 rounded select-all">engineer123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
