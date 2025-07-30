"use client";

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function useCommentAuth() {
  // Check public comment session
  const { data: publicSession, status: publicStatus } = useSession();
  
  // Check admin session
  const [adminSession, setAdminSession] = useState<any>(null);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    // Check if there's an admin session
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        setAdminSession(data.user ? data : null);
        setAdminLoading(false);
      })
      .catch(() => {
        setAdminLoading(false);
      });
  }, []);

  // Prioritize admin session over public session
  const activeSession = adminSession?.user ? adminSession : publicSession;
  const isLoading = adminLoading || publicStatus === 'loading';

  const currentUser = activeSession?.user ? {
    id: activeSession.user._id || activeSession.user.id || '',
    name: activeSession.user.name || 'Anonymous User',
    email: activeSession.user.email || '',
    image: activeSession.user.image || '',
    provider: activeSession.user.provider || 'unknown',
    isAdmin: adminSession?.user ? (activeSession.user.role === 'admin') : (activeSession.user.isAdmin || false),
    adminId: activeSession.user.adminId || activeSession.user._id,
  } : null;

  return {
    currentUser,
    isLoading,
    isAuthenticated: !!activeSession?.user,
    isAdmin: currentUser?.isAdmin || false,
  };
}