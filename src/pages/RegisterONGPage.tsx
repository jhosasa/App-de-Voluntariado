import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Building2, LoaderCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterONGPage = () => {
  // 1. Extraemos refreshProfile del contexto
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    phone: '',
  });

  // Cargar nombre actual si existe
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFormData(prev => ({ ...prev, name: user.user_metadata.full_name }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // 2. Usamos UPSERT para guardar en la BD
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.name,
          organization_description: formData.description,
          website: formData.website,
          phone: formData.phone,
          role: 'organization', // Cambio de rol
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('¡Organización registrada con éxito!');

      // 3. PASO CRÍTICO: Forzamos la actualización del perfil en la App
      // Esto hace que el AuthContext sepa INMEDIATAMENTE que ahora eres una organización
      if (refreshProfile) {
        await refreshProfile();
      }

      // 4. Navegamos inmediatamente al dashboard
      // Al usar navigate, el ProtectedRoute verá el nuevo rol cargado por refreshProfile y te dejará pasar
      navigate('/ong-dashboard');

    } catch (error: any) {
      console.error('Error registrando ONG:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface p-8 rounded-xl border border-border"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Registrar Organización</h1>
            <p className="text-text-secondary">Completa los datos para poder publicar eventos.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre de la Organización</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="Ej. Fundación Esperanza"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="Cuéntanos qué hace tu organización..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Sitio Web (Opcional)</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Teléfono de Contacto</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="+591 ..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-all mt-4"
          >
            {loading ? <LoaderCircle className="animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? 'Guardando...' : 'Registrar Organización'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterONGPage;