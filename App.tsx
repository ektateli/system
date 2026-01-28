
import React, { useContext } from 'react';
// Fixed: Use namespace import to avoid named export issues in some environments
import * as ReactRouterDOM from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import RaiseTicket from './components/RaiseTicket';
import CustomerTickets from './components/CustomerTickets';
import AppLayout from './components/AppLayout';
import UsersPage from './components/UsersPage';
import CustomersPage from './components/CustomersPage';
import ProjectsPage from './components/ProjectsPage';
import SitesPage from './components/SitesPage';
import AdminTickets from './components/AdminTickets';
import TicketDetail from './components/TicketDetail';
import BulkUpload from './components/BulkUpload';
import EngineerDashboard from './components/EngineerDashboard';
import EngineerTickets from './components/EngineerTickets';
import { ShieldCheck, Loader2 } from 'lucide-react';

// Extracting members from ReactRouterDOM to fix named export errors
const { HashRouter: Router, Routes, Route, Navigate, useLocation } = ReactRouterDOM as any;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { token, loading } = useContext(AuthContext);
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Synchronizing Core...</p>
      </div>
    );
  }

  if (!token && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes wrapped in AppLayout */}
      <Route
        path="*"
        element={
          token ? (
            <AppLayout>
              <Routes>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/customers" element={<CustomersPage />} />
                <Route path="/admin/projects" element={<ProjectsPage />} />
                <Route path="/admin/sites" element={<SitesPage />} />
                <Route path="/admin/tickets" element={<AdminTickets />} />
                <Route path="/tickets/:id" element={<TicketDetail />} />
                <Route path="/admin/bulk" element={<BulkUpload />} />
                
                <Route path="/engineer" element={<EngineerDashboard />} />
                <Route path="/engineer/tickets" element={<EngineerTickets />} />
                
                <Route path="/customer" element={<CustomerDashboard />} />
                <Route path="/customer/create-ticket" element={<RaiseTicket />} />
                <Route path="/customer/tickets" element={<CustomerTickets />} />
                
                <Route path="/" element={<Navigate to="/admin" replace />} />
              </Routes>
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;
