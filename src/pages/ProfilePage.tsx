import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { LoaderCircle, Inbox, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('volunteer_applications')
        .select(`
          *,
          events (
            id,
            title,
            event_date,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
      } else {
        setApplications(data);
      }
      setLoading(false);
    };

    fetchApplications();
  }, [user]);

  const getStatusChip = (status) => {
    switch (status) {
      case 'approved':
        return <div className="flex items-center gap-2 text-success bg-success/10 px-3 py-1 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3" /> Aprobado</div>;
      case 'rejected':
        return <div className="flex items-center gap-2 text-error bg-error/10 px-3 py-1 rounded-full text-xs font-medium"><XCircle className="w-3 h-3" /> Rechazado</div>;
      default:
        return <div className="flex items-center gap-2 text-warning bg-warning/10 px-3 py-1 rounded-full text-xs font-medium"><Clock className="w-3 h-3" /> Pendiente</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center gap-6 mb-12 pb-8 border-b border-border"
      >
        <img 
          src={user?.user_metadata?.avatar_url} 
          alt="User Avatar" 
          className="w-24 h-24 rounded-full border-4 border-primary"
        />
        <div>
          <h1 className="text-3xl font-bold">{user?.user_metadata?.full_name}</h1>
          <p className="text-text-secondary">{user?.email}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-6">Mi Historial de Voluntariado</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-xl border border-border">
            <Inbox className="mx-auto h-12 w-12 text-text-secondary" />
            <h3 className="mt-4 text-lg font-medium">Aún no tienes postulaciones</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Explora los eventos y encuentra tu próxima oportunidad para ayudar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="bg-surface p-4 rounded-lg border border-border flex items-center justify-between hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={app.events.image_url} alt={app.events.title} className="w-16 h-16 rounded-md object-cover hidden sm:block" />
                  <div>
                    <p className="font-bold text-lg">{app.events.title}</p>
                    <div className="flex items-center gap-2 text-sm text-text-secondary mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(app.events.event_date).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>
                {getStatusChip(app.status)}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
