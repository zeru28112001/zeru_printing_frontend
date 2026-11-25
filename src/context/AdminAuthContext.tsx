'use client';

import { createContext, useContext } from 'react';

export interface AdminAuthContextType {
  token: string | null;
  user: { email: string; name: string } | null;
  logout: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextType>({
  token: null,
  user: null,
  logout: () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);
