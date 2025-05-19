
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for email verification success in the URL
    const checkEmailVerification = () => {
      const url = new URL(window.location.href);
      const type = url.searchParams.get('type');
      
      if (type === 'signup' && url.pathname.includes('/auth/callback')) {
        // Clean the URL by removing the query parameters
        window.history.replaceState({}, document.title, '/login');
        
        // Show success toast
        setTimeout(() => {
          toast({
            title: "Email Verified Successfully",
            description: "Your email has been verified. You can now log in.",
            variant: "default",
          });
        }, 500);
      }
    };

    // Run once on mount
    checkEmailVerification();
  }, [toast, location]);

  useEffect(() => {
    // Set up auth state listener FIRST to ensure we catch all auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false); // Update loading state after auth state change
      }
    );

    // THEN check for existing session - this prevents flickering during initial load
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false); // Update loading state after session check
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signUp(email: string, password: string, metadata?: { full_name?: string }) {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      toast({
        title: "Account created successfully",
        description: "Please check your email for the confirmation link.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "Successfully signed in to TripLink."
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }

  async function signOut() {
    try {
      setIsLoading(true); // Set loading state when signing out
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Reset loading state regardless of outcome
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signUp,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
