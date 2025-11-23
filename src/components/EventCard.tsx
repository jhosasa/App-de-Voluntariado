import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  location: string;
  event_date: string;
  image_url: string;
}

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-background rounded-xl overflow-hidden border border-border/50 group transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col"
    >
      <div className="relative h-48">
        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 text-text group-hover:text-primary transition-colors">{event.title}</h3>
        <div className="space-y-2 text-text-secondary mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" />
            <span>{event.location}</span>
          </div>
        </div>
        <div className="mt-auto">
          <Link to={`/event/${event.id}`} className="w-full block text-center bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105">
            Ver Detalles
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
