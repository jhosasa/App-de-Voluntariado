import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Target, ShieldCheck, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Users,
      title: 'Conecta con Causas',
      description: 'Descubre una amplia gama de ONGs y proyectos que necesitan tu ayuda y pasión.'
    },
    {
      icon: Target,
      title: 'Impacto Real',
      description: 'Cada hora que dedicas se traduce en un cambio tangible para la comunidad.'
    },
    {
      icon: ShieldCheck,
      title: 'Plataforma Segura',
      description: 'Verificamos a nuestras organizaciones para garantizar una experiencia de voluntariado segura.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img src="https://images.pexels.com/photos/6994982/pexels-photo-6994982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Volunteers" className="absolute inset-0 w-full h-full object-cover" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-20 container mx-auto px-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Únete. Ayuda. <span className="text-primary">Inspira.</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            Encuentra oportunidades de voluntariado que se alinean con tu pasión y genera un impacto real en tu comunidad.
          </p>
          <Link to="/events" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-glow-primary text-lg">
            Explorar Eventos <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué VolunTier?</h2>
            <p className="text-text-secondary max-w-2xl mx-auto mb-12">
              Facilitamos la conexión entre personas con ganas de ayudar y organizaciones que necesitan manos amigas.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background p-8 rounded-xl border border-border text-center"
              >
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
