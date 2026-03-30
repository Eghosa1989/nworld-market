import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Aisha O.",
    location: "Texas",
    text: "The red palm oil and egusi seeds completely transformed my weekend cooking. It tastes exactly like home! Finally a reliable store for authentic ingredients.",
    rating: 5
  },
  {
    id: 2,
    name: "David K.",
    location: "New York",
    text: "Fast shipping and the quality of the pounded yam flour is incredible. I've recommended UNIQ \"N\" PREMIUM MARKET to all my friends.",
    rating: 5
  },
  {
    id: 3,
    name: "Chioma E.",
    location: "Ontario",
    text: "I was skeptical about buying dried crayfish online, but it was incredibly fresh and well-packaged. Everything was perfect!",
    rating: 5
  }
];

export default function CustomerReviews() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // New Review Form State
  const [newReview, setNewReview] = useState({ name: '', location: '', text: '', rating: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0) return; // Prevent empty rating

    const addedReview = {
      ...newReview,
      id: Date.now()
    };
    
    setReviews([addedReview, ...reviews]);
    setIsSubmitted(true);
    setCurrentIndex(0); // Show the new review immediately

    setTimeout(() => {
      setIsSubmitted(false);
      setNewReview({ name: '', location: '', text: '', rating: 0 });
    }, 4000);
  };

  return (
    <section className="py-6 bg-white border-t border-orange-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-6">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl font-black font-serif text-orange-950 mb-1"
          >
            Happy Customers
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[10px] text-orange-900/70 font-medium"
          >
            Don't just take our word for it — hear what our community has to say.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          
          {/* Left Column: Review Carousel */}
          <div className="relative">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-orange-400 mb-2 text-center md:text-left">Latest Reviews</h3>
            <div className="bg-orange-50 rounded-xl p-4 relative shadow-sm border border-orange-100/50 min-h-40 flex flex-col">
              <Quote className="absolute top-2 right-2 text-orange-200 w-5 h-5 rotate-180 opacity-50" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col flex-1"
                >
                  <div className="flex gap-1 mb-2 text-orange-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={10} 
                        className={i < reviews[currentIndex].rating ? "fill-current" : "text-orange-200 fill-orange-50"} 
                      />
                    ))}
                  </div>

                  <p className="text-xs text-orange-950 font-medium leading-relaxed mb-4 relative z-10 flex-1">
                    "{reviews[currentIndex].text}"
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-800 text-[10px] shrink-0">
                      {reviews[currentIndex].name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[10px] text-orange-950">{reviews[currentIndex].name}</h4>
                      <p className="text-[8px] uppercase tracking-widest text-orange-500 font-bold">{reviews[currentIndex].location}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel navigation controls */}
              <div className="absolute -bottom-3 right-4 flex gap-1">
                <button 
                  onClick={prevReview}
                  aria-label="Previous review"
                  className="w-6 h-6 rounded-full bg-white shadow-sm border border-orange-100 flex items-center justify-center text-orange-900 hover:bg-orange-50 transition-colors"
                >
                  <ChevronLeft size={12} />
                </button>
                <button 
                  onClick={nextReview}
                  aria-label="Next review"
                  className="w-6 h-6 rounded-full bg-white shadow-sm border border-orange-100 flex items-center justify-center text-orange-900 hover:bg-orange-50 transition-colors"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-center md:justify-start gap-1 mt-4">
              {reviews.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to review ${idx + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-orange-500 w-4' : 'bg-orange-200 hover:bg-orange-300'}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Leave a Review */}
          <div className="bg-white border border-orange-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-orange-950 mb-1">Leave a Review</h3>
            <p className="text-[10px] text-orange-800/60 mb-3">Share your experience with UNIQ &quot;N&quot; PREMIUM MARKET.</p>

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 text-green-700 p-4 rounded-lg flex flex-col items-center justify-center text-center h-40 border border-green-100"
              >
                <CheckCircle2 size={24} className="mb-2" />
                <p className="font-bold text-xs">Thank you for your feedback!</p>
                <p className="text-[10px] mt-1">Your review has been successfully posted.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Rating Input */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-orange-900">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        aria-label={`Rate ${star} stars`}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star 
                          size={14} 
                          className={`transition-colors ${star <= newReview.rating ? "fill-orange-400 text-orange-400" : "fill-gray-100 text-gray-200"}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    required
                    placeholder="Name" 
                    value={newReview.name}
                    onChange={e => setNewReview({...newReview, name: e.target.value})}
                    className="w-full px-3 py-1.5 text-[10px] bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none transition-all"
                  />
                  <input 
                    type="text" 
                    placeholder="Location (Optional)" 
                    value={newReview.location}
                    onChange={e => setNewReview({...newReview, location: e.target.value})}
                    className="w-full px-3 py-1.5 text-[10px] bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>
                
                <textarea 
                  required
                  placeholder="Tell us what you think..." 
                  rows={2}
                  value={newReview.text}
                  onChange={e => setNewReview({...newReview, text: e.target.value})}
                  className="w-full px-3 py-1.5 text-[10px] bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none transition-all resize-none"
                />

                <button 
                  type="submit" 
                  disabled={newReview.rating === 0}
                  className="w-full bg-orange-950 text-white py-1.5 rounded-lg text-[10px] font-bold hover:bg-orange-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  Post Review
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}