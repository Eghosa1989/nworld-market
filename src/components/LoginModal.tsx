import { useAuth } from '../context/AuthContext';
import { X, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login, loginWithGoogle, setPendingAction, authError, clearAuthError } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    setMode('signin');
    setName('');
    setEmail('');
    setPassword('');
    setAuthLoading(false);
    setGoogleLoading(false);
    clearAuthError();
  }, [isLoginModalOpen, clearAuthError]);

  useEffect(() => {
    clearAuthError();
  }, [mode]);

  if (!isLoginModalOpen) return null;

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthLoading(true);
    try {
      await login(email.trim(), password, mode === 'signup', name.trim());
    } catch (error) {
      console.error('Email auth error', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setAuthLoading(false);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google Auth error", error);
      setGoogleLoading(false);
    }
  };

  const closeModal = () => {
    setIsLoginModalOpen(false);
    setPendingAction(null);
    clearAuthError();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-orange-950/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative flex flex-col md:flex-row"
          onClick={e => e.stopPropagation()}
        >
          {/* Left Side */}
          <div className="hidden md:flex md:w-2/5 bg-orange-900 relative p-8 flex-col justify-between overflow-hidden text-white">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            
            <div className="relative z-10">
              <h1 className="text-3xl font-black tracking-tighter mb-2">NWORLD<span className="text-orange-400">MARKET</span></h1>
              <p className="text-orange-100 font-medium text-sm">Your premium marketplace for authentic goods.</p>
            </div>

            <div className="relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                    <CheckCircle2 size={20} className="text-orange-300" />
                  </div>
                  <p className="text-sm font-medium text-orange-50">Fast & Secure Checkout</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                    <CheckCircle2 size={20} className="text-orange-300" />
                  </div>
                  <p className="text-sm font-medium text-orange-50">Save Multiple Addresses</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                    <CheckCircle2 size={20} className="text-orange-300" />
                  </div>
                  <p className="text-sm font-medium text-orange-50">Track Your Orders Live</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-3/5 p-6 sm:p-8 relative flex flex-col justify-center">
            <button
              title="Close"
              aria-label="Close"
              onClick={closeModal}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-colors z-10"
            >
              <X size={20} className="stroke-[2.5]" />
            </button>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium mt-1">
                    {mode === 'signin'
                      ? 'Sign in below to access your cart, wishlist, and track your orders.'
                      : 'Sign up below to start shopping and tracking orders.'}
                  </p>
                </div>

                <div className="mb-5 inline-flex w-full rounded-xl bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className={`w-1/2 rounded-lg px-3 py-2 text-sm font-bold transition-all ${mode === 'signin' ? 'bg-white text-orange-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className={`w-1/2 rounded-lg px-3 py-2 text-sm font-bold transition-all ${mode === 'signup' ? 'bg-white text-orange-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-3.5" autoComplete="off">
                  {mode === 'signup' && (
                    <div>
                      <label className="mb-1 block text-sm font-bold text-gray-700">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={mode === 'signup'}
                        autoComplete="off"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        placeholder="Mrs Nneka"
                      />
                    </div>
                  )}
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      placeholder="you@example.com"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-700">Password</label>
                    {mode === 'signup' ? (
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                      />
                    ) : (
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        placeholder="Enter your password"
                        autoComplete="new-password"
                      />
                    )}
                  </div>

                  {authError && (
                    <div className="p-4 bg-red-50 text-red-600 font-medium text-sm rounded-xl border border-red-100 flex items-start gap-3">
                      <X size={18} className="mt-0.5 shrink-0" />
                      <p>{authError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading || googleLoading}
                    className="w-full rounded-xl bg-orange-600 py-3 text-sm font-bold text-white transition-all hover:bg-orange-700 disabled:opacity-50"
                  >
                    {authLoading ? (mode === 'signin' ? 'Signing in...' : 'Signing up...') : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
                  </button>
                </form>

                <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                  <div className="h-px flex-1 bg-gray-200" />
                  Or
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <button
                  type="button"
                  disabled={googleLoading || authLoading}
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 active:bg-gray-100 disabled:opacity-50 text-gray-700 py-3 rounded-xl font-bold text-sm transition-all"
                >
                  {googleLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </span>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Google
                    </>
                  )}
                </button>

                <div className="mt-6 text-center bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs font-medium text-gray-500">
                    {mode === 'signin'
                      ? 'Use email sign in or Google to access your cart, wishlist, profile, and checkout.'
                      : 'Use sign up to create a customer account, or continue with Google for one-tap access.'}
                  </p>
                </div>
              </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
