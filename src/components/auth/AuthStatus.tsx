import { useState, useEffect } from "preact/hooks";
import { supabase } from "@/utils/supabase";
import type { Session } from "@supabase/supabase-js";

export default function AuthStatus() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      window.dispatchEvent(new CustomEvent('auth-status', { detail: { session } }));
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      window.dispatchEvent(new CustomEvent('auth-status', { detail: { session } }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {session ? (
        <div>
          <p>Signed In</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <p>Signed Out</p>
      )}
    </div>
  );
}