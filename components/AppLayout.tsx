
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AppLayoutProps {
  // Marking children as optional to satisfy TypeScript's check when used in complex JSX contexts like ternaries inside props
  children?: React.ReactNode;
}

// AppLayout component that provides the main structure of the application including Sidebar and Topbar
export default function AppLayout({ children }: AppLayoutProps) {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Use user role from context if available, otherwise default to ADMIN for safety
  const role = user?.role || 'ADMIN';

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar with mobile toggle logic */}
      <Sidebar 
        role={role} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar with mobile menu trigger */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
