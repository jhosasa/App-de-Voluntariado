import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type Profile = {
  id: string;
  role: 'volunteer' | 'organization';
  full_name: string;
  avatar_url?: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  // Inicializamos loading en true
  const [loading, setLoading] = useState(true);

  // Función para cargar el perfil desde la BD
  const fetchProfileData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('⚠️ Error fetching profile:', error.message);
        return null; // Retornamos null si falla
      }
      
      if (data) {
        setProfile(data);
        return data;
      }
    } catch (err) {
      console.error('❌ Unexpected error fetching profile:', err);
    }
    return null;
  };

  const refreshProfile = async () => {
    if (user) await fetchProfileData(user.id);
  };

  useEffect(() => {
    let mounted = true;

    // Función auxiliar para manejar la sesión y el perfil en orden
    const handleSession = async (currentSession: Session | null) => {
      if (!mounted) return;

      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Buscamos el perfil
        await fetchProfileData(currentSession.user.id);
      } else {
        // Si no hay sesión, limpiamos todo
        setSession(null);
        setUser(null);
        setProfile(null);
      }

      // IMPORTANTE: Aquí apagamos el loading pase lo que pase
      if (mounted) {
        setLoading(false);
      }
    };

    // 1. Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // 2. Escuchar cambios
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Solo reaccionamos si la sesión cambió o si es un evento de Login/Logout explícito
        // (Para evitar recargas innecesarias, aunque handleSession es seguro)
        handleSession(session);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true); // Opcional: mostrar carga mientras sale
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};