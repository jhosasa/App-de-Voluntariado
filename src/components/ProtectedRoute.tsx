import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoaderCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  // AQUÍ ESTABA EL ERROR: Cambiamos 'ong' por 'organization' para que coincida con tu BD
  requiredRole?: 'volunteer' | 'organization' | 'admin'; 
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  // 👇 AGREGA ESTO PARA VER QUÉ PASA EN LA CONSOLA
  console.log("🛡️ PROTECTED ROUTE:", { 
    loading, 
    user: user ? "HAY USUARIO" : "NULL", 
    profile: profile ? profile.role : "PERFIL CARGANDO/NULL",
    requiredRole 
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    console.log("⛔ REDIRIGIENDO AL LOGIN");
    return <Navigate to="/login" replace />;
  }

  // OJO AQUÍ: Si requerimos rol, pero el perfil aún no llega, NO deberíamos echarlo, 
  // deberíamos seguir mostrando el loader o esperar.
  if (requiredRole && !profile) {
     console.log("⏳ ESPERANDO PERFIL...");
     // Opción A: Seguir cargando hasta que llegue el perfil
     return <div className="flex items-center justify-center h-screen bg-background">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
     </div>;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    console.log(`⛔ ROL INCORRECTO: Tiene ${profile?.role}, necesita ${requiredRole}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;