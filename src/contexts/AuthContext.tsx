import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
});

interface User {
  id: string;
  email: string;
  is_admin: boolean;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, is_admin")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return null;
    }

    return profile;
  };

  useEffect(() => {
    const setSessionAndUser = async (session: Session | null) => {
      setSession(session);

      if (session?.user) {
        const profile = await getProfile(session.user.id);
        if (profile) {
          setUser(profile);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSessionAndUser(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionAndUser(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
