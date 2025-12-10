import { supabase } from "@/utils/supabase";
import type { Session } from "@supabase/supabase-js";

let session: Session | null = null;

const listeners = new Set<(session: Session | null) => void>();

const authStore = {
  async initialize() {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    session = currentSession;
    authStore.notify();

    supabase.auth.onAuthStateChange((_event, newSession) => {
      if (JSON.stringify(session) !== JSON.stringify(newSession)) {
        session = newSession;
        authStore.notify();
      }
    });
  },

  subscribe(listener: (session: Session | null) => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSession() {
    return session;
  },

  notify() {
    for (const listener of listeners) {
      listener(session);
    }
  },

  async signOut() {
    await supabase.auth.signOut();
  }
};

authStore.initialize();

export default authStore;