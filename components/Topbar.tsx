
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  Menu, 
  LogOut, 
  Clock, 
  Mail,
  ChevronDown,
  Bell
} from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
      {/* Left: Mobile Menu & Brand */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all active:scale-90 border border-indigo-100 flex items-center justify-center"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" strokeWidth={2.5} />
        </button>
        
        <div className="flex flex-col">
           <span className="font-extrabold text-slate-900 text-sm sm:text-lg leading-tight tracking-tight">Support App</span>
           <div className="hidden sm:flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active System</span>
           </div>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications (Desktop) */}
        <button className="hidden sm:flex p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        {/* User Profile Dropdown */}
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

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-0" 
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 animate-fade-in origin-top-right">
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
                  
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-slate-500">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold truncate">{user?.email}</span>
                     </div>
                     <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold">Login: {user?.loginTime}</span>
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
