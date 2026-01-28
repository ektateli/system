import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  Menu, 
  LogOut, 
  Clock, 
  Mail,
  ChevronDown,
  Bell,
  ShieldCheck
} from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center"
        >
          <Menu className="w-6 h-6" strokeWidth={2.5} />
        </button>
        
        <div className="flex items-center gap-3">
           {!logoError ? (
             <img 
                src="assets/logo.png" 
                alt="Logo" 
                className="h-8 w-auto hidden sm:block"
                onError={() => setLogoError(true)}
             />
           ) : (
             <ShieldCheck className="w-6 h-6 text-indigo-600 hidden sm:block" />
           )}
           <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-sm sm:text-lg leading-tight tracking-tight">ProSupport</span>
              <div className="hidden sm:flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active System</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="hidden sm:flex p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
          >
            <div className="flex flex-col items-end hidden md:flex">
              <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{user?.name}</span>
              <span className="text-[10px] text-slate-400 font-medium">Logged in</span>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-100 ring-2 ring-white">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-0" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in origin-top-right">
                <div className="p-5 bg-slate-50/50 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                        {user?.name?.charAt(0)}
                     </div>
                     <div>
                        <p className="font-bold text-slate-900 leading-tight">{user?.name}</p>
                        <p className="text-xs text-slate-400 font-medium truncate w-40">{user?.email}</p>
                     </div>
                  </div>
                </div>
                <div className="p-2">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-bold text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}