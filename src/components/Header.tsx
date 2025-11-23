import { HeartHandshake, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link to="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <HeartHandshake className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-text">VolunTier</span>
          </motion.div>
        </Link>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-6"
        >
          <Link to="/events" className="text-text-secondary hover:text-primary transition-colors font-medium">
            Eventos
          </Link>
          {!loading && (
            <>
              {user ? (
                <div className="relative">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="transition-transform duration-300 hover:scale-110">
                    <img 
                      src={user.user_metadata?.avatar_url} 
                      alt="User Avatar" 
                      className="w-10 h-10 rounded-full border-2 border-primary"
                    />
                  </button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-border py-2 z-50"
                        onMouseLeave={() => setMenuOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-sm font-semibold text-text truncate">{user.user_metadata?.full_name || user.email}</p>
                          <p className="text-xs text-text-secondary truncate">{user.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-primary transition-colors w-full">
                          <User className="w-4 h-4" />
                          <span>Mi Perfil</span>
                        </Link>
                        <button
                          onClick={() => { signOut(); setMenuOpen(false); }}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-primary transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-glow-primary"
                >
                  Iniciar Sesión
                </Link>
              )}
            </>
          )}
        </motion.div>
      </nav>
    </header>
  );
};

export default Header;
