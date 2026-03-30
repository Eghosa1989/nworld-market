import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface User {
  id: string | number;
  email: string;
  name: string | null;
  joinDate: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (isOpen: boolean) => void;
  login: (email: string, password?: string, isSignUp?: boolean, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  userEmail: string | null;
  currentUser: User | null;
  users: User[];
  pendingAction: (() => void) | null;
  setPendingAction: (action: (() => void) | null) => void;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const clearAuthError = () => setAuthError(null);

  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (!error && data) {
      setUsers(data.map(p => ({
        id: p.id,
        email: p.email,
        name: p.name,
        joinDate: p.join_date,
        isAdmin: p.is_admin
      })));
    }
  };

  useEffect(() => {
    
    void fetchProfiles();
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email ?? null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email ?? null);
        await fetchProfiles();
        
        // Clean up messy URL hash after OAuth login
        if (window.location.hash.includes('access_token=')) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        setIsLoggedIn(false);
        setUserEmail(null);
        
      setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userEmail) {
      
      setCurrentUser(null);
      return;
    }

    const found = users.find(u => u.email === userEmail);
    if (found) {
      setCurrentUser(found);
    } else {
      // Fallback in case profile hasn't been created yet in DB
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setCurrentUser({
            id: user.id,
            email: user.email || userEmail, // use userEmail as fallback
            name: user.user_metadata?.name || user.user_metadata?.full_name || userEmail.split('@')[0],
            joinDate: user.created_at || new Date().toISOString()
          });
        } else {
          // Absolute fallback if somehow user is null but userEmail exists
          setCurrentUser({
            id: 'temp-' + Date.now(),
            email: userEmail,
            name: userEmail.split('@')[0],
            joinDate: new Date().toISOString()
          });
        }
      }).catch(() => {
        setCurrentUser({
          id: 'temp-' + Date.now(),
          email: userEmail,
          name: userEmail.split('@')[0],
          joinDate: new Date().toISOString()
        });
      });
    }
  }, [userEmail, users]);

  const login = async (email: string, password = '', isSignUp = false, name = '') => {
    setAuthError(null);
    let authError = null;

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            full_name: name,
          },
          emailRedirectTo: window.location.origin,
        }
      });
      authError = error;
      // If user is created and we have a name, update the profile. 
      // Note: The handle_new_user trigger creates the profile automatically.
      if (!error && data?.user && name) {
        await supabase.from('profiles').update({ name }).eq('id', data.user.id);
        
    void fetchProfiles(); // reload to get the newly updated name
      }
      if (!error) {
        toast.success(data.session ? 'Account created successfully.' : 'Account created. Check your email to confirm your sign up.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      authError = error;
      if (!error) {
        toast.success('Signed in successfully.');
      }
    }

    if (authError) {
      setAuthError(authError.message);
      throw authError;
    } else {
      setIsLoginModalOpen(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: 'select_account', // Forces Google to let the user select their account every time
        }
      }
    });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      isLoginModalOpen,
      setIsLoginModalOpen,
      isProfileModalOpen,
      setIsProfileModalOpen,
      login,
      loginWithGoogle,
      logout,
      userEmail,
      currentUser,
      users,
      pendingAction,
      setPendingAction,
      authError,
      clearAuthError
    }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
