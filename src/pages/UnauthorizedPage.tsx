import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-6 text-center bg-background rounded-xl border border-border shadow-lg"
      >
        <ShieldOff className="mx-auto h-20 w-20 text-error" />
        <h2 className="mt-6 text-4xl font-extrabold text-text">
          Acceso Denegado
        </h2>
        <p className="mt-2 text-lg text-text-secondary">
          No tienes los permisos necesarios para ver esta página.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 transition-colors duration-300"
          >
            <Home className="mr-2 h-5 w-5" />
            Volver al Inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
