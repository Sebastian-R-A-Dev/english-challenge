"use client";

import { postRefresh } from "@/lib/session-api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  /** Short-lived JWT from refresh cookie; null if guest or refresh failed. */
  accessToken: string | null;
  /** Initial refresh in flight. */
  loading: boolean;
  reloadSession: () => Promise<void>;
  clearSession: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reloadSession = useCallback(async () => {
    setLoading(true);
    try {
      const token = await postRefresh();
      setAccessToken(token);
    } catch {
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
  }, []);

  useEffect(() => {
    void reloadSession();
  }, [reloadSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      loading,
      reloadSession,
      clearSession,
    }),
    [accessToken, loading, reloadSession, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
