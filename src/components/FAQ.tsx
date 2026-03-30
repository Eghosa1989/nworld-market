import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    question: "Where do you source your ingredients?",
    answer: "We partner directly with trusted farmers and suppliers in Nigeria and across West Africa to ensure 100% authentic, high-quality, and ethically sourced traditional ingredients."
  },
  {
    question: "How much does shipping cost?",
    answer: "Shipping depends on your location and order size. We offer standard and expedited shipping globally. Orders over $100 automatically qualify for free standard shipping!"
  },
  {
    question: "How long does delivery take?",
    answer: "Most domestic orders arrive within 3-5 business days. International shipping generally takes 7-14 business days, depending on customs and local couriers."
  },
  {
    question: "Do you offer wholesale or bulk purchasing?",
    answer: "Yes, we do! Please contact us via our 'Get In Touch' section at the bottom of the page or email hello@uniqnpremiummarket.com for bulk pricing and wholesale catalogs."
  },
  {
    question: "What is your return policy?",
    answer: "Due to the perishable nature of our grocery items, we do not accept returns on food products. However, if your order arrives damaged or incorrect, please reach out to us within 48 hours for a replacement or refund."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-6 bg-white border-t border-orange-100">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl font-black font-serif text-orange-950 mb-1"
          >
            Got Questions?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[10px] text-orange-900/70 font-medium"
          >
            Here are some common questions from our community.
          </motion.p>
        </div>

        <div className="space-y-1">
          {FAQS.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 2 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-orange-100 rounded-lg overflow-hidden bg-orange-50/20"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-orange-50 transition-colors"
              >
                <span className="font-bold text-xs text-orange-950 pr-4">{faq.question}</span>
                <span className="text-orange-500 shrink-0">
                  {openIndex === index ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-1 text-[10px] text-orange-900/70 leading-relaxed border-t border-orange-100/30">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}