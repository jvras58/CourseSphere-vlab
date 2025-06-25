"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Session, SessionUser } from "@/lib/session";

interface SessionState {
  session: Session | null;
  isAuthenticated: boolean;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
  updateUser: (user: Partial<SessionUser>) => void;
  getUserId: () => string | undefined;
  getUserName: () => string | undefined;
  getUserEmail: () => string | undefined;
  getUserBio: () => string | undefined;
  getUserImage: () => string | undefined;
  getUserRole: () => { id: number; name: string } | undefined;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      session: null,
      isAuthenticated: false,
      setSession: (session) =>
        set({
          session,
          isAuthenticated: !!session,
        }),
      clearSession: () =>
        set({
          session: null,
          isAuthenticated: false,
        }),
      updateUser: (userData) =>
        set((state) => {
          if (!state.session) return state;

          return {
            session: {
              ...state.session,
              user: {
                ...state.session.user,
                ...userData,
              },
            },
          };
        }),
      getUserId: () => get().session?.user?.id,
      getUserName: () => get().session?.user?.name,
      getUserEmail: () => get().session?.user?.email,
      getUserBio: () => get().session?.user?.bio,
      getUserImage: () => get().session?.user?.image,
      getUserRole: () => get().session?.user?.role,
    }),
    {
      name: "nexply-user-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
