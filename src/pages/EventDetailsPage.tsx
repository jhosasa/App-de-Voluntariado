import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext'; // Importamos el contexto de Auth
import { motion } from 'framer-motion';
import { Calendar, MapPin, LoaderCircle } from 'lucide-react';
import toast from 'react-hot-toast'; // Importamos para las notificaciones

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtenemos el usuario actual
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false); // Estado para el botón de carga
  const [hasApplied, setHasApplied] = useState(false); // Estado para saber si ya se postuló
  const [error, setError] = useState<string | null>(null);

  // 1. Cargar el evento y verificar si el usuario ya se postuló
  useEffect(() => {
    const fetchEventAndStatus = async () => {
      if (!id) return;
      setLoading(true);

      // A. Cargar datos del evento
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (eventError) {
        console.error('Error fetching event details:', eventError);
        setError('No se pudo cargar el evento.');
      } else {
        setEvent(eventData);
      }

      // B. Si el usuario está logueado, verificar si ya se postuló
      if (user) {
        const { data: applicationData } = await supabase
          .from('volunteer_applications')
          .select('id')
          .eq('event_id', id)
          .eq('user_id', user.id)
          .single();
        
        if (applicationData) {
          setHasApplied(true);
        }
      }

      setLoading(false);
    };

    fetchEventAndStatus();
  }, [id, user]);

  // 2. Función para manejar el clic en "Postularme"
  const handleApply = async () => {
    // Si no está logueado, mandar al login
    if (!user) {
      toast.error("Debes iniciar sesión para ser voluntario");
      navigate('/login');
      return;
    }

    setApplying(true);

    try {
      // Insertar la postulación
      const { error } = await supabase
        .from('volunteer_applications')
        .insert({
          event_id: id,
          user_id: user.id,
          status: 'pending',
          full_name: user.user_metadata?.full_name || 'Voluntario', // Datos opcionales
          phone: user.user_metadata?.phone || '',
        });

      if (error) throw error;

      toast.success('¡Te has postulado correctamente!');
      setHasApplied(true); // Cambiamos el estado del botón
    } catch (err: any) {
      console.error('Error applying:', err);
      toast.error('Ocurrió un error al enviar tu solicitud.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><LoaderCircle className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-16 text-center text-error"><p>{error}</p></div>;
  }

  if (!event) {
    return <div className="container mx-auto px-4 py-16 text-center"><p>Evento no encontrado.</p></div>;
  }

  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="relative h-[50vh]">
        <img src={event.image_url} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold text-white"
          >
            {event.title}
          </motion.h1>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Descripción del Evento</h2>
            <p className="text-text-secondary leading-relaxed">{event.description || 'No hay descripción disponible para este evento.'}</p>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-surface p-6 rounded-xl border border-border space-y-6">
              <h3 className="text-xl font-bold border-b border-border pb-4">Detalles</h3>
              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 text-secondary mt-1" />
                <div>
                  <p className="font-semibold">{formattedDate}</p>
                  <p className="text-sm text-text-secondary">{formattedTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-accent mt-1" />
                <div>
                  <p className="font-semibold">{event.location}</p>
                  <p className="text-sm text-text-secondary">Ubicación del evento</p>
                </div>
              </div>
              
              {/* --- BOTÓN CON LÓGICA --- */}
              <button 
                onClick={handleApply}
                disabled={applying || hasApplied}
                className={`w-full font-bold py-3 rounded-lg transition-all duration-300 transform shadow-glow-primary
                  ${hasApplied 
                    ? 'bg-green-600 text-white cursor-default' 
                    : 'bg-primary text-white hover:bg-primary/90 hover:scale-105'
                  }
                  ${applying ? 'opacity-70 cursor-wait' : ''}
                `}
              >
                {applying ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoaderCircle className="w-5 h-5 animate-spin" /> Procesando...
                  </span>
                ) : hasApplied ? (
                  "¡Ya estás postulado!"
                ) : (
                  "Quiero ser Voluntario"
                )}
              </button>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetailsPage;