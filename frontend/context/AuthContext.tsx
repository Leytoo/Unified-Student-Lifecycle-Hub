'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../constants';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  token: string;
  isFullPiiAccess: boolean;
  canSubmitGrades: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: UserRole.ADMIN,
  setRole: () => {},
  token: UserRole.ADMIN,
  isFullPiiAccess: true,
  canSubmitGrades: true,
  isAdmin: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(UserRole.ADMIN);

  useEffect(() => {
    const saved = localStorage.getItem('edugov_role') as UserRole;
    if (saved && Object.values(UserRole).includes(saved)) {
      setRoleState(saved);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('edugov_role', newRole);
  };

  const isFullPiiAccess = role === UserRole.ADMIN || role === UserRole.REGISTRAR;
  const canSubmitGrades = role === UserRole.FACULTY || role === UserRole.REGISTRAR || role === UserRole.ADMIN;
  const isAdmin = role === UserRole.ADMIN;

  return (
    <AuthContext.Provider value={{ role, setRole, token: role, isFullPiiAccess, canSubmitGrades, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
