import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Image as ImageIcon, Type, Save, LoaderCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CreateEventPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    image_url: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast.error('Debes iniciar sesión');
        return;
    }

    // Validación simple
    if (!formData.title || !formData.description || !formData.event_date || !formData.location) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      console.log("Intentando crear evento con usuario:", user.id);

      // PREPARA LOS DATOS
      // Asegúrate de que los nombres de las columnas (izquierda) coincidan EXACTAMENTE con tu Supabase
      const eventData = {
          title: formData.title,
          description: formData.description,
          event_date: new Date(formData.event_date).toISOString(),
          location: formData.location,
          image_url: formData.image_url || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80',
          organizer_id: user.id, // ¿Tu columna se llama 'organizer_id', 'organization_id' o 'user_id'? Revisa en Supabase.
          
          // COMENTADO POR SEGURIDAD: 
          // Si tu tabla 'events' no tiene la columna 'organizer_name', esto romperá el código.
          // Descoméntalo solo si estás 100% seguro de que la columna existe.
          // organizer_name: user.user_metadata?.full_name || 'Organización', 
      };

      const { error } = await supabase
        .from('events')
        .insert(eventData);

      if (error) {
          console.error('Error detallado de Supabase:', error); // Mira la consola si falla
          throw error;
      }

      toast.success('¡Evento publicado correctamente!');
      navigate('/ong-dashboard'); 
      
    } catch (error: any) {
      console.error('Error creating event:', error);
      // Mostramos el mensaje exacto del error para saber qué pasa
      toast.error(`Error: ${error.message || 'No se pudo crear el evento'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link to="/ong-dashboard" className="flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al Panel
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface p-8 rounded-xl border border-border"
      >
        <h1 className="text-3xl font-bold mb-8">Publicar Nuevo Evento</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" /> Título del Evento
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="Ej. Limpieza de Playa"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="Detalles sobre las actividades, requisitos, etc."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Fecha y Hora */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Fecha y Hora
              </label>
              <input
                type="datetime-local"
                name="event_date"
                required
                value={formData.event_date}
                onChange={handleChange}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Ubicación
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="Ej. Parque Central, Zona Norte"
              />
            </div>
          </div>

          {/* URL de Imagen */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" /> URL de la Imagen (Opcional)
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="https://..."
            />
            <p className="text-xs text-text-secondary mt-1">Pega un enlace directo a una imagen (puedes usar Unsplash).</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-all mt-6 shadow-glow-primary"
          >
            {loading ? <LoaderCircle className="animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? 'Publicando...' : 'Publicar Evento'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateEventPage;