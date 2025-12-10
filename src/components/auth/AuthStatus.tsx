import { useState, useEffect } from "preact/hooks";
import authStore from "@/utils/authStore";
import type { Session } from "@supabase/supabase-js";

export default function AuthStatus() {
  const [session, setSession] = useState<Session | null>(authStore.getSession());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setSession);
    return () => unsubscribe();
  }, []);

 

  return (
    <div>
      {session ? (
        <div>
          <p>Signed In</p>
        </div>
      ) : (
        <p>Signed Out</p>
      )}
    </div>
  );
}