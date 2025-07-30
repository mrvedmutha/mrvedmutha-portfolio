"use client";

import { useSession } from 'next-auth/react';

export function useCommentAuth() {
  const { data: session, status } = useSession();

  const currentUser = session?.user ? {
    id: session.user._id || '',
    name: session.user.name || 'Anonymous User',
    email: session.user.email || '',
    image: session.user.image || '',
    provider: session.user.provider || 'unknown',
    isAdmin: session.user.isAdmin || false,
    adminId: session.user.adminId,
  } : null;

  return {
    currentUser,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    isAdmin: currentUser?.isAdmin || false,
  };
}