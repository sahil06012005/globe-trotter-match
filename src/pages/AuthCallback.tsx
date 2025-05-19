
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Process the OAuth or email confirmation
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Redirect to login after confirmation with proper message
      if (event === 'SIGNED_IN') {
        navigate('/');
      } else {
        navigate('/login');
      }
    });

    // Check if we're coming from email confirmation
    const url = new URL(window.location.href);
    const isEmailConfirmation = url.searchParams.has('type');
    
    if (isEmailConfirmation) {
      toast({
        title: "Email Verified Successfully",
        description: "Your email has been verified. You can now log in.",
      });
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-triplink-blue mx-auto mb-8"></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Processing your authentication...</h1>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
