import React from "react";
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
  Info,
  ShieldCheck
} from "lucide-react";

const { useNavigate } = ReactRouterDOM as any;

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [logoError, setLogoError] = React.useState(false);

  const { login } = React.useContext(AuthContext);
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

    try {
      const { data, error: supabaseError } = await (supabase.auth as any).signInWithPassword({
        email,
        password,
      });

      if (data?.session) {
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
        // Fallback for demo
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
        setError(supabaseError.message);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] relative overflow-hidden px-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            {!logoError ? (
              <img 
                src="assets/logo.png" 
                alt="Company Logo" 
                className="h-20 w-auto drop-shadow-2xl animate-scale-in"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="p-4 bg-indigo-600 rounded-[2rem] shadow-xl shadow-indigo-200">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Access</h1>
          <p className="text-slate-500 mt-2 font-medium">Secured Support Architecture</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/20">
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
                    emailError ? "border-red-300 focus:ring-4" : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  }`}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="password"
                  className="w-full bg-slate-50/50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl outline-none text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-[0.98]"
            >
              <div className="relative flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Sign In</span><ChevronRight className="w-5 h-5" /></>}
              </div>
            </button>
          </form>

          <div className="mt-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-3">
            <div className="text-[10px] text-indigo-800 leading-relaxed w-full">
              <p className="font-bold mb-1 flex items-center gap-1 text-xs"><Info className="w-3.5 h-3.5" /> Demo Access:</p>
              <p className="font-mono bg-white/50 px-1.5 py-0.5 rounded inline-block">admin@example.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}