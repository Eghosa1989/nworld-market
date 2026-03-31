import { useAuth } from '../context/AuthContext';
import { X, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UpdatePasswordModal() {
  const { isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen, updatePassword, authError, clearAuthError } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isUpdatePasswordModalOpen) {
      setPassword('');
      setLoading(false);
      clearAuthError();
    }
  }, [isUpdatePasswordModalOpen, clearAuthError]);

  if (!isUpdatePasswordModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePassword(password);
      // setIsUpdatePasswordModalOpen is handled in context on success
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsUpdatePasswordModalOpen(false);
    clearAuthError();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-orange-950/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col p-6 sm:p-8"
          onClick={e => e.stopPropagation()}
        >
          <button
            title="Close"
            aria-label="Close"
            onClick={closeModal}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-colors z-10"
          >
            <X size={20} className="stroke-[2.5]" />
          </button>

          <div className="mb-6 flex flex-col items-center text-center mt-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-orange-600" size={24} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Update Password
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-2">
              Please enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-700">New Password</label>
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
            </div>

            {authError && (
              <div className="p-4 bg-red-50 text-red-600 font-medium text-sm rounded-xl border border-red-100 flex items-start gap-3">
                <X size={18} className="mt-0.5 shrink-0" />
                <p>{authError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || password.length < 6}
              className="w-full rounded-xl bg-orange-600 py-3 text-sm font-bold text-white transition-all hover:bg-orange-700 disabled:opacity-50 mt-2"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
