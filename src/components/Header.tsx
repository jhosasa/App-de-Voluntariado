import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings, LayoutDashboard, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Sesión cerrada correctamente.');
  };

  return (
    <header className="bg-surface text-text py-4 px-6 shadow-md border-b border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <HeartHandshake className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-text">Voluntariado</span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-primary transition-colors duration-300">Inicio</Link>
          <Link to="/events" className="hover:text-primary transition-colors duration-300">Eventos</Link>

          {user ? (
            <>
              {profile?.role === 'admin' && (
                <Link to="/admin" className="hover:text-primary transition-colors duration-300 flex items-center space-x-1">
                  <LayoutDashboard size={18} />
                  <span>Admin</span>
                </Link>
              )}
              {profile?.role === 'ong' && (
                <Link to="/ong-dashboard" className="hover:text-primary transition-colors duration-300 flex items-center space-x-1">
                  <LayoutDashboard size={18} />
                  <span>ONG Dashboard</span>
                </Link>
              )}
              <Link to="/profile" className="hover:text-primary transition-colors duration-300 flex items-center space-x-1">
                <User size={18} />
                <span>Perfil</span>
              </Link>
              <button onClick={handleSignOut} className="flex items-center space-x-1 text-textSecondary hover:text-error transition-colors duration-300">
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary transition-colors duration-300">Iniciar Sesión</Link>
              <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-300">Registrarse</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
