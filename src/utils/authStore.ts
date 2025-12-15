import { supabase } from "@/utils/supabase";
import type { Session } from "@supabase/supabase-js";

let session: Session | null = null;
let loading = true;

const listeners = new Set<(session: Session | null, loading: boolean) => void>();

const authStore = {
  async initialize() {
    authStore.setLoading(true);
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    session = currentSession;
    authStore.setLoading(false);
    authStore.notify();

    supabase.auth.onAuthStateChange((_event, newSession) => {
      if (JSON.stringify(session) !== JSON.stringify(newSession)) {
        session = newSession;
        authStore.notify();
      }
    });
  },

  subscribe(listener: (session: Session | null, loading: boolean) => void) {
    listeners.add(listener);
    listener(session, loading);
    return () => listeners.delete(listener);
  },

  getSession() {
    return session;
  },

  isLoading() {
    return loading;
  },

  setLoading(isLoading: boolean) {
    loading = isLoading;
    authStore.notify();
  },

  notify() {
    for (const listener of listeners) {
      listener(session, loading);
    }
  },

  async signOut() {
    authStore.setLoading(true);
    await supabase.auth.signOut();
    authStore.setLoading(false);
  },

  showNotification(message: string, isError = false) {
    const event = new CustomEvent("show-notification", {
      detail: { message, isError },
    });
    document.dispatchEvent(event);
  },
};

authStore.initialize();

export default authStore;