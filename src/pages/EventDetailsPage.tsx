import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Calendar, MapPin, LoaderCircle, Info } from 'lucide-react';

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching event details:', error);
        setError('No se pudo cargar el evento. Inténtalo de nuevo más tarde.');
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

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
              <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-glow-primary">
                Quiero ser Voluntario
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetailsPage;
