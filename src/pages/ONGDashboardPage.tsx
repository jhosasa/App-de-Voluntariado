import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  LoaderCircle,
  AlertCircle,
  Users,
  X,
  Check,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ONGDashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal de Postulantes
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // 1. Cargar eventos
  useEffect(() => {
    console.log("!!! 1. ENTRÓ AL USE-EFFECT DE EVENTOS  ONGDashboardPage!!!");
    const fetchMyEvents = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("organizer_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, [user]);

  // 2. Cargar postulantes de un evento específico
  const openApplicantsModal = async (event: any) => {
    setSelectedEvent(event);
    setLoadingApplicants(true);
    try {
      // Hacemos un JOIN con la tabla profiles para saber quién es el voluntario
      const { data, error } = await supabase
        .from("volunteer_applications")
        .select(
          `
          *,
          profiles (
    full_name,
    id,
    phone
  )
        `
        )
        .eq("event_id", event.id);

      if (error) throw error;
      setApplicants(data || []);
    } catch (error) {
      toast.error("Error al cargar postulantes");
      console.error(error);
    } finally {
      setLoadingApplicants(false);
    }
  };

  // 3. Cambiar estado de postulación (Aceptar/Rechazar)
  const handleStatusChange = async (
    applicationId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      const { error } = await supabase
        .from("volunteer_applications")
        .update({ status: newStatus })
        .eq("id", applicationId);

      if (error) throw error;

      // Actualizamos la lista local para que se vea el cambio al instante
      setApplicants((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      toast.success(
        `Postulante ${newStatus === "approved" ? "aceptado" : "rechazado"}`
      );
    } catch (error) {
      toast.error("No se pudo actualizar el estado");
    }
  };

  // 4. Borrar Evento
  const handleDelete = async (eventId: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este evento?")) return;
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);
      if (error) throw error;
      setEvents(events.filter((e) => e.id !== eventId));
      toast.success("Evento eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Panel de Organización</h1>
            <p className="text-text-secondary">
              Gestiona tus eventos y voluntarios
            </p>
          </div>
          <Link
            to="/create-event"
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-all"
          >
            <Plus className="w-5 h-5" /> Crear Nuevo Evento
          </Link>
        </div>

        {/* Lista de Eventos */}
        {events.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-text-secondary mb-4" />
            <h3 className="text-xl font-bold mb-2">No has creado eventos</h3>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-surface p-6 rounded-xl border border-border flex flex-col md:flex-row gap-6 items-center md:items-start"
              >
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                />

                <div className="flex-grow text-center md:text-left w-full">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="flex flex-col md:flex-row gap-4 text-sm text-text-secondary mb-4">
                    <span className="flex items-center gap-1 justify-center md:justify-start">
                      <Calendar className="w-4 h-4" />{" "}
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 justify-center md:justify-start">
                      <MapPin className="w-4 h-4" /> {event.location}
                    </span>
                  </div>

                  {/* Botón para ver postulantes */}
                  <button
                    onClick={() => openApplicantsModal(event)}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                  >
                    <Users className="w-4 h-4" /> Ver Postulantes
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* --- MODAL DE POSTULANTES --- */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-surface sticky top-0">
                <h2 className="text-xl font-bold">
                  Postulantes: {selectedEvent.title}
                </h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {loadingApplicants ? (
                  <div className="flex justify-center p-8">
                    <LoaderCircle className="animate-spin text-primary" />
                  </div>
                ) : applicants.length === 0 ? (
                  <p className="text-center text-text-secondary py-8">
                    Aún no hay voluntarios inscritos.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {applicants.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between bg-background p-4 rounded-lg border border-border"
                      >
                        <div>
                          <p className="font-bold text-lg">
                            {app.profiles?.full_name || "Usuario desconocido"}
                          </p>
                          <p className="text-sm text-text-secondary">
                            Tel: {app.profiles?.phone || "Sin teléfono"}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full mt-1 inline-block
                                            ${
                                              app.status === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : app.status === "rejected"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                          >
                            {app.status === "pending"
                              ? "Pendiente"
                              : app.status === "approved"
                              ? "Aceptado"
                              : "Rechazado"}
                          </span>
                        </div>

                        {/* Acciones */}
                        {app.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleStatusChange(app.id, "approved")
                              }
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                              title="Aceptar"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(app.id, "rejected")
                              }
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                              title="Rechazar"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ONGDashboardPage;
