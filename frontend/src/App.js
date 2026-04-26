import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import NewHome from './pages/NewHome';
import Home from './pages/Home';
import Empregos from './pages/Empregos';
import Mapa from './pages/Mapa';
import Mensagens from './pages/Mensagens';
import Perfil from './pages/Perfil';
import Creditos from './pages/Creditos';
import Abonamento from './pages/Abonamento';
import Assinatura from './pages/Assinatura';
import PublicarDemanda from './pages/PublicarDemanda';
import EditarPerfil from './pages/EditarPerfil';
import Ofertantes from './pages/Ofertantes';
import BottomNav from './components/BottomNav';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import Orcamentos from './pages/admin/Orcamentos';
import Clientes from './pages/admin/Clientes';
import Parametros from './pages/admin/Parametros';
import { Toaster } from './components/ui/toaster';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const ConditionalBottomNav = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const path = location.pathname;
  const hideOn = ['/', '/landing'];
  const isAdmin = path.startsWith('/admin');
  if (!isAuthenticated || isAdmin || hideOn.includes(path)) return null;
  return <BottomNav />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/feed" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/landing" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/" element={<PublicRoute><NewHome /></PublicRoute>} />
      <Route path="/feed" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/empregos" element={<ProtectedRoute><Empregos /></ProtectedRoute>} />
      <Route path="/mapa" element={<ProtectedRoute><Mapa /></ProtectedRoute>} />
      <Route path="/mensagens" element={<ProtectedRoute><Mensagens /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/creditos" element={<ProtectedRoute><Creditos /></ProtectedRoute>} />
      <Route path="/abonamento" element={<ProtectedRoute><Abonamento /></ProtectedRoute>} />
      <Route path="/assinatura" element={<ProtectedRoute><Assinatura /></ProtectedRoute>} />
      <Route path="/publicar" element={<ProtectedRoute><PublicarDemanda /></ProtectedRoute>} />
      <Route path="/editar-perfil" element={<ProtectedRoute><EditarPerfil /></ProtectedRoute>} />
      <Route path="/ofertantes" element={<ProtectedRoute><Ofertantes /></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="orcamentos" element={<Orcamentos />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="parametros" element={<Parametros />} />
        <Route path="demandas" element={<AdminDashboard />} />
        <Route path="perimetro" element={<AdminDashboard />} />
        <Route path="perfil" element={<AdminDashboard />} />
        <Route path="editar-perfil" element={<AdminDashboard />} />
        <Route path="avaliacoes" element={<AdminDashboard />} />
        <Route path="seo" element={<AdminDashboard />} />
        <Route path="comunicacao" element={<AdminDashboard />} />
        <Route path="faturas" element={<AdminDashboard />} />
        <Route path="recebimentos" element={<AdminDashboard />} />
        <Route path="catalogo" element={<AdminDashboard />} />
        <Route path="tutoriais" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ConditionalBottomNav />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
