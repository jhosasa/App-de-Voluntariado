import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LoaderCircle,
  Inbox,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  LayoutDashboard // Nuevo icono
} from "lucide-react";

const ProfilePage = () => {
  // 1. IMPORTANTE: Pedimos 'profile' además de 'user' para saber el rol
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      setLoading(true);
      
      // Consultamos postulaciones (Voluntariado)
      const { data, error } = await supabase
        .from("volunteer_applications")
        .select(`*, events (id, title, event_date, image_url)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
      } else {
        setApplications(data || []);
      }
      setLoading(false);
    };

    fetchApplications();
  }, [user]);

  const getStatusChip = (status: string) => {
    switch (status) {
      case "approved":
        return <div className="flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3" /> Aprobado</div>;
      case "rejected":
        return <div className="flex items-center gap-2 text-red-600 bg-red-100 px-3 py-1 rounded-full text-xs font-medium"><XCircle className="w-3 h-3" /> Rechazado</div>;
      default:
        return <div className="flex items-center gap-2 text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-xs font-medium"><Clock className="w-3 h-3" /> Pendiente</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center gap-6 mb-12 pb-8 border-b border-border"
      >
        <img
          src={user?.user_metadata?.avatar_url || "https://via.placeholder.com/150"}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-primary object-cover"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">{user?.user_metadata?.full_name}</h1>
          <p className="text-text-secondary">{user?.email}</p>
          
          {/* Muestra una etiqueta con tu rol actual */}
          <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full uppercase">
            {profile?.role === 'organization' ? 'Organización' : 'Voluntario'}
          </span>
        </div>
      </motion.div>

      {/* BLOQUE DE ACCIÓN SEGÚN EL ROL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {profile?.role === 'organization' ? (
          // SI ERES ONG: Te mostramos el botón para ir a tu Dashboard
          <div className="mb-12 bg-primary/5 border border-primary/20 p-8 rounded-xl flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <LayoutDashboard />
                Panel de Gestión
              </h3>
              <p className="text-text-secondary mt-1">
                Accede a tu panel para crear eventos y gestionar voluntarios.
              </p>
            </div>
            <Link
              to="/ong-dashboard"
              className="bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Ir a mi Dashboard
            </Link>
          </div>
        ) : (
          // SI ERES VOLUNTARIO: Te invitamos a ser ONG
          <div className="mb-12 bg-surface border border-border p-6 rounded-xl flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Building2 className="text-primary" />
                ¿Representas a una Organización?
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                Registra tu ONG para poder publicar eventos.
              </p>
            </div>
            <Link
              to="/register-ong"
              className="bg-white text-black border border-gray-200 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Registrar ONG
            </Link>
          </div>
        )}

        {/* HISTORIAL (Solo relevante si te has postulado a cosas) */}
        <h2 className="text-2xl font-bold mb-6">Mi Historial de Postulaciones</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-xl border border-border border-dashed">
            <Inbox className="mx-auto h-12 w-12 text-text-secondary opacity-50" />
            <h3 className="mt-4 text-lg font-medium">No tienes postulaciones</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {profile?.role === 'organization' 
                ? "Como organización, aquí aparecerían los eventos a los que te uniste como voluntario individual." 
                : "Aún no te has inscrito a ningún evento."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-surface p-4 rounded-lg border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                 {/* ... (resto del código de items igual) ... */}
                 <div className="flex items-center gap-4 w-full sm:w-auto">
                    {app.events?.image_url && (
                      <img src={app.events.image_url} alt="" className="w-16 h-16 rounded object-cover" />
                    )}
                    <div>
                        <p className="font-bold">{app.events?.title}</p>
                        <p className="text-sm text-text-secondary">{new Date(app.events?.event_date).toLocaleDateString()}</p>
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