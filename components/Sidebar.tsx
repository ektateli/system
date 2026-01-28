
import React from "react";
// Fixed: Use namespace import to avoid named export issues in some environments
import * as ReactRouterDOM from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  MapPin, 
  Ticket, 
  Upload, 
  X,
  ShieldCheck
} from "lucide-react";

// Extracting members from ReactRouterDOM to fix named export errors
const { Link, useLocation } = ReactRouterDOM as any;

const menus = {
    SUPER_ADMIN: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "Customers", path: "/admin/customers", icon: Users },
        { name: "Projects", path: "/admin/projects", icon: Briefcase },
        { name: "Sites", path: "/admin/sites", icon: MapPin },
        { name: "Tickets", path: "/admin/tickets", icon: Ticket },
        { name: "Bulk Upload", path: "/admin/bulk", icon: Upload },
    ],
    ADMIN: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "Customers", path: "/admin/customers", icon: Users },
        { name: "Projects", path: "/admin/projects", icon: Briefcase },
        { name: "Sites", path: "/admin/sites", icon: MapPin },
        { name: "Tickets", path: "/admin/tickets", icon: Ticket },
        { name: "Bulk Upload", path: "/admin/bulk", icon: Upload },
    ],
    ENGINEER: [
        { name: "Dashboard", path: "/engineer", icon: LayoutDashboard },
        { name: "My Tickets", path: "/engineer/tickets", icon: Ticket },
    ],
    CUSTOMER: [
        { name: "Dashboard", path: "/customer", icon: LayoutDashboard },
        { name: "Raise Ticket", path: "/customer/create-ticket", icon: Ticket },
        { name: "My Tickets", path: "/customer/tickets", icon: Ticket },
    ],
};

interface SidebarProps {
  role: 'SUPER_ADMIN' | 'ADMIN' | 'ENGINEER' | 'CUSTOMER';
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const items = (menus as any)[role] || [];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-600 p-2 rounded-xl">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight">ProSupport</h1>
                        </div>
                        <button onClick={onClose} className="lg:hidden">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>

                    <nav className="space-y-1">
                        {items.map((m: any) => {
                            const Icon = m.icon;
                            const isActive = location.pathname === m.path;
                            return (
                                <Link
                                    key={m.path}
                                    to={m.path}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                        ${isActive 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }
                                    `}
                                    onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{m.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
                   <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-2xl">
                       <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center font-bold">
                           {role.charAt(0)}
                       </div>
                       <div>
                           <p className="text-xs font-bold text-white">System User</p>
                           <p className="text-[10px] text-slate-400 uppercase font-black">{role.replace('_', ' ')}</p>
                       </div>
                   </div>
                </div>
            </aside>
        </>
    );
}
