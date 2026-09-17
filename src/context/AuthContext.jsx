import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, tokenStore } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    tokenStore.hydrate();
    if (!tokenStore.get()) {
      setLoading(false);
      return;
    }
    try {
      const data = await api("/auth/me");
      setUser(data.user);
      setPermissions(data.permissions || []);
    } catch {
      tokenStore.clear();
      setUser(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const login = async ({ email, password, remember }) => {
    const data = await api("/auth/login", { method: "POST", body: { email, password } });
    tokenStore.set(data.token, remember);
    setUser(data.user);
    setPermissions(data.permissions || []);
    return data;
  };

  const register = async (payload) => {
    const data = await api("/auth/register", { method: "POST", body: payload });
    tokenStore.set(data.token);
    setUser(data.user);
    setPermissions(data.permissions || []);
    return data;
  };

  const logout = async () => {
    try { await api("/auth/logout", { method: "POST" }); } catch { /* token may already be stale */ }
    tokenStore.clear();
    setUser(null);
    setPermissions([]);
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const can = (permission) => user?.Role?.slug === "super-admin" || permissions.includes(permission);

  const value = useMemo(() => ({ user, permissions, loading, login, register, logout, can, refresh, isAuthenticated: Boolean(user) }), [user, permissions, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
