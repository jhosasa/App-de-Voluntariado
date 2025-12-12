import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface text-textSecondary py-12 px-4 sm:px-6 lg:px-8 border-t border-border shadow-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center mb-4">
            <span className="text-2xl font-bold text-primary">Voluntariado</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Conectando corazones y manos para construir un futuro mejor. Únete a nuestra comunidad de voluntarios.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Enlaces Rápidos</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-primary transition-colors duration-300">Inicio</Link></li>
            <li><Link to="/events" className="hover:text-primary transition-colors duration-300">Eventos</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors duration-300">Contacto</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><Link to="/privacy" className="hover:text-primary transition-colors duration-300">Política de Privacidad</Link></li>
            <li><Link to="/terms" className="hover:text-primary transition-colors duration-300">Términos de Servicio</Link></li>
            <li><Link to="/cookies" className="hover:text-primary transition-colors duration-300">Política de Cookies</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Síguenos</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-textSecondary hover:text-primary transition-colors duration-300">
              <FaFacebookF size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-textSecondary hover:text-primary transition-colors duration-300">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-textSecondary hover:text-primary transition-colors duration-300">
              <FaInstagram size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-textSecondary hover:text-primary transition-colors duration-300">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-border text-center text-sm">
        <p>&copy; {currentYear} Voluntariado. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
