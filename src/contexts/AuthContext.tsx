import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User, MailCredentials } from "@/types/email";

interface AuthContextType {
  user: User | null;
  credentials: MailCredentials | null;
  isLoading: boolean;
  login: (credentials: MailCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("webmail_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [credentials, setCredentials] = useState<MailCredentials | null>(() => {
    const saved = localStorage.getItem("webmail_credentials");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (creds: MailCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate IMAP authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, this would connect to the IMAP server
    // For now, we simulate a successful authentication
    const newUser: User = {
      email: creds.email,
      name: creds.email.split("@")[0],
      isAuthenticated: true,
    };
    
    setUser(newUser);
    setCredentials(creds);
    localStorage.setItem("webmail_user", JSON.stringify(newUser));
    localStorage.setItem("webmail_credentials", JSON.stringify(creds));
    setIsLoading(false);
    
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCredentials(null);
    localStorage.removeItem("webmail_user");
    localStorage.removeItem("webmail_credentials");
  }, []);

  return (
    <AuthContext.Provider value={{ user, credentials, isLoading, login, logout }}>
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
