/*
  # Esquema Inicial de Voluntariado

  Este esquema establece las tablas base para la aplicación de voluntariado.

  ## Tablas Creadas:
  1. **events**: Almacena la información sobre los eventos de voluntariado publicados por las ONGs.
     - Columnas: id, created_at, title, description, image_url, event_date, location.
  2. **volunteer_applications**: Registra las aplicaciones de los usuarios para los eventos.
     - Columnas: id, created_at, event_id, user_id, status, full_name, phone, reason.

  ## Seguridad:
  - Se habilita RLS (Row Level Security) para ambas tablas.
  - **events**: Cualquiera puede leer los eventos. Los usuarios autenticados pueden crear, actualizar o eliminar sus propios eventos.
  - **volunteer_applications**: Los usuarios autenticados pueden crear aplicaciones y ver las suyas.
*/

-- Tabla de Eventos
CREATE TABLE IF NOT EXISTS public.events (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    title text NOT NULL,
    description text,
    image_url text,
    event_date timestamp with time zone NOT NULL,
    location text,
    organizer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Habilitar RLS para events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Políticas para events
DROP POLICY IF EXISTS "Public can view all events" ON public.events;
CREATE POLICY "Public can view all events" ON public.events
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Authenticated users can create events" ON public.events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Organizers can update their own events" ON public.events;
CREATE POLICY "Organizers can update their own events" ON public.events
    FOR UPDATE USING (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Organizers can delete their own events" ON public.events;
CREATE POLICY "Organizers can delete their own events" ON public.events
    FOR DELETE USING (auth.uid() = organizer_id);


-- Tabla de Aplicaciones de Voluntarios
CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    full_name text,
    phone text,
    reason text,
    CONSTRAINT unique_application UNIQUE (event_id, user_id)
);

-- Habilitar RLS para volunteer_applications
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Políticas para volunteer_applications
DROP POLICY IF EXISTS "Users can create their own applications" ON public.volunteer_applications;
CREATE POLICY "Users can create their own applications" ON public.volunteer_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own applications" ON public.volunteer_applications;
CREATE POLICY "Users can view their own applications" ON public.volunteer_applications
    FOR SELECT USING (auth.uid() = user_id);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.volunteer_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_event_id ON public.volunteer_applications(event_id);