import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 5000);
    }
  };

  return (
    <section className="py-20 bg-orange-100 border-t border-orange-200 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-300/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-orange-900/5 border border-orange-50"
        >
          <div className="mx-auto w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Mail size={32} strokeWidth={2} />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black font-serif text-orange-950 mb-4">
            Get 10% Off Your First Order!
          </h2>
          <p className="text-orange-900/70 font-medium mb-8 max-w-lg mx-auto">
            Join our community to receive exclusive discounts, traditional African recipes, and the latest product drops straight to your inbox.
          </p>

          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 text-green-600 bg-green-50 py-4 px-6 rounded-2xl max-w-md mx-auto"
            >
              <CheckCircle2 size={24} />
              <span className="font-bold">Thank you for subscribing! Check your email.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-4 rounded-xl border border-orange-200 bg-orange-50/50 placeholder-orange-300 text-orange-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
              />
              <button
                type="submit"
                className="bg-orange-950 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-800 transition-colors shadow-md hover:shadow-lg transform active:scale-95 shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="mt-4 text-[10px] uppercase tracking-widest text-orange-400 font-bold">
            No spam, unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
