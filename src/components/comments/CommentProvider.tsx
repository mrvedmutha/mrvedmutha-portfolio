"use client";

import React from 'react';
import { SessionProvider } from 'next-auth/react';

interface CommentProviderProps {
  children: React.ReactNode;
}

export function CommentProvider({ children }: CommentProviderProps) {
  return (
    <SessionProvider 
      basePath="/api/auth/public"
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}