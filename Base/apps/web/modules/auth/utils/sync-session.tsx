"use client";

import { useEffect } from "react";
import type { Session } from "@/lib/session";
import { useSessionStore } from "../stores/session-store";

interface SessionProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  const setSession = useSessionStore((state) => state.setSession);

  useEffect(() => {
    setSession(session ?? null);
  }, [session, setSession]);

  return <>{children}</>;
}

export function useSession() {
  const session = useSessionStore((state) => state.session);
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const getUserId = useSessionStore((state) => state.getUserId);
  const getUserName = useSessionStore((state) => state.getUserName);
  const getUserEmail = useSessionStore((state) => state.getUserEmail);
  const getUserBio = useSessionStore((state) => state.getUserBio);
  const getUserImage = useSessionStore((state) => state.getUserImage);
  const getUserRole = useSessionStore((state) => state.getUserRole);

  return {
    session,
    isAuthenticated,
    user: session?.user,
    userId: getUserId(),
    userName: getUserName(),
    userEmail: getUserEmail(),
    userBio: getUserBio(),
    userImage: getUserImage(),
    userRole: getUserRole(),
  };
}