"use client";

import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { LogIn, LogOut, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PublicAuthProps {
  children?: React.ReactNode;
  showSignOut?: boolean;
}

export function PublicAuth({ children, showSignOut = false }: PublicAuthProps) {
  const { data: session, status } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);

  const handleSignIn = async (provider: 'google' | 'github') => {
    setIsSigningIn(true);
    try {
      await signIn(provider, { 
        callbackUrl: window.location.href,
        redirect: false 
      });
      setSignInDialogOpen(false);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
  };

  // If user is signed in, show user info or sign out option
  if (session?.user && showSignOut) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
              <AvatarFallback>
                {session.user.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{session.user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>
            Signed in via {session.user.provider}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Sign in dialog
  return (
    <Dialog open={signInDialogOpen} onOpenChange={setSignInDialogOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign in to comment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Sign in to join the conversation
          </DialogTitle>
          <DialogDescription>
            Choose your preferred method to sign in and start commenting
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Card className="border-dashed bg-muted/30">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-3">
                Your information is only used for commenting and will not be shared
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handleSignIn('google')}
                  disabled={isSigningIn}
                  className="w-full flex items-center gap-3"
                  variant="outline"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isSigningIn ? 'Signing in...' : 'Continue with Google'}
                </Button>
                
                <Button
                  onClick={() => handleSignIn('github')}
                  disabled={isSigningIn}
                  className="w-full flex items-center gap-3"
                  variant="outline"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  {isSigningIn ? 'Signing in...' : 'Continue with GitHub'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-xs text-muted-foreground text-center">
            By signing in, you agree to our comment guidelines. Your profile information 
            will be used to display your name and avatar when commenting.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}