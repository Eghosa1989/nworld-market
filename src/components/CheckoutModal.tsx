import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Landmark, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cartItems, cartTotal, clearCart, setIsCartOpen } = useCart();
  const { addOrder } = useOrders();
  const { userEmail } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'interac'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'email' | 'amount' | null>(null);

  // Form states
  const [email, setEmail] = useState(userEmail || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // To preserve total after cart is cleared on success
  const [orderTotal, setOrderTotal] = useState(0);

  const finalTotal = cartTotal;

  const handleCopy = async (text: string, type: 'email' | 'amount') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(type);
      setTimeout(() => setCopyStatus(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate real payment gateway delay
    setTimeout(() => {
      setOrderTotal(finalTotal);
      addOrder({
        customerEmail: email,
        customerName: `${firstName} ${lastName}`.trim() || 'Guest',
        customerPhone: phone,
        total: finalTotal,
        status: 'Pending',
        paymentMethod: paymentMethod === 'interac' ? 'Interac e-Transfer' : 'Card',
        items: cartItems.map(item => ({
          ...item,
          size: item.size || 'N/A'
        }))
      });

      clearCart();
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isProcessing && !isSuccess ? onClose : undefined}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {isSuccess ? (
            <div className="p-8 sm:p-10 text-center flex flex-col items-center justify-center min-h-100 overflow-y-auto custom-scrollbar">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shrink-0"
              >
                <CheckCircle2 size={40} strokeWidth={2.5} />
              </motion.div>
              
              {paymentMethod === 'interac' ? (
                <>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 font-serif">Order Received!</h2>
                  <p className="text-gray-500 mb-6 max-w-sm text-sm">
                    Thank you, {firstName || 'Customer'}. To complete your order, please send your e-Transfer now. We will send a confirmation message via email or phone once payment is received.
                  </p>

                  <div className="bg-white border-2 border-orange-100 rounded-xl overflow-hidden w-full text-left mb-8 shadow-sm">
                    <div className="bg-orange-50/80 px-4 py-3 border-b border-orange-100 flex items-center gap-2">
                      <Landmark size={18} className="text-orange-600" />
                      <h4 className="font-bold text-orange-950 text-sm">Final Payment Instructions</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-500 uppercase">1. Amount to send</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono font-bold text-gray-900 text-lg">
                            ${orderTotal.toFixed(2)}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(orderTotal.toFixed(2), 'amount')}
                            className={`p-2.5 rounded-lg border transition-all flex items-center justify-center min-w-10.5 ${
                              copyStatus === 'amount' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            {copyStatus === 'amount' ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-500 uppercase">2. Email address</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono font-medium text-gray-900 text-sm sm:text-base overflow-hidden text-ellipsis whitespace-nowrap">
                            payment@uniqnpremiummarket.com
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy('payment@uniqnpremiummarket.com', 'email')}
                            className={`p-2.5 rounded-lg border transition-all flex items-center justify-center min-w-10.5 ${
                              copyStatus === 'email' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            {copyStatus === 'email' ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 text-green-800 p-3 rounded-lg flex items-start gap-2.5 text-xs font-medium border border-green-100/50">
                        <ShieldCheck size={16} className="text-green-600 shrink-0 mt-0.5" />
                        <p><strong>Auto-Deposit Enabled.</strong> No password required.</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-gray-900 mb-2 font-serif">Payment Successful!</h2>
                  <p className="text-gray-500 mb-8 max-w-sm">
                    Thank you for your order, {firstName || 'Customer'}. We have sent a receipt to {email || 'your email'}.
                  </p>
                </>
              )}

              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                  setIsCartOpen(false);
                }}
                className="bg-orange-950 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-900 transition-colors w-full max-w-xs shrink-0"
              >
                {paymentMethod === 'interac' ? 'Done' : 'Continue Shopping'}
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-orange-50/50">
                <div>
                  <h2 className="text-xl font-black text-orange-950 flex items-center gap-2">
                    Secure Checkout <ShieldCheck size={18} className="text-green-600" />
                  </h2>
                  <p className="text-sm text-orange-800/60 font-medium">Complete your order of ${cartTotal.toFixed(2)}</p>
                </div>
                {!isProcessing && (
                  <button
                    onClick={onClose}
                    aria-label="Close checkout"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="stroke-2" />
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                  
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Contact & Delivery Info</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-400"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="email"
                          required
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-400"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-400"
                        />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Street Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-400"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-400"
                        />
                        <input
                          type="text"
                          required
                          placeholder="ZIP Code"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Payment Method toggle */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all font-bold text-sm ${
                          paymentMethod === 'card' 
                            ? 'border-orange-500 bg-orange-50 text-orange-900' 
                            : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <CreditCard size={18} /> Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('interac')}
                        className={`p-3 rounded-xl border-2 flex flex-col sm:flex-row items-center justify-center gap-2 transition-all font-bold text-sm ${
                          paymentMethod === 'interac' 
                            ? 'border-orange-500 bg-orange-50 text-orange-900' 
                            : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <Landmark size={18} /> Interac E-Transfer
                      </button>
                    </div>

                    {/* Card Input Mock */}
                    {paymentMethod === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 pt-2"
                      >
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="Card Number"
                            maxLength={19}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-400 font-mono tracking-wider"
                          />
                          <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-400 font-mono"
                          />
                          <input
                            type="text"
                            required
                            placeholder="CVC"
                            maxLength={4}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-400 font-mono"
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 justify-center">
                          <ShieldCheck size={12} /> SSL Encrypted Secured Payment
                        </p>
                      </motion.div>
                    )}

                    {/* Interac Help Text */}
                    {paymentMethod === 'interac' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white border-2 border-orange-100 rounded-xl overflow-hidden mt-2"
                      >
                        <div className="bg-orange-50/80 px-4 py-3 border-b border-orange-100 flex items-center gap-2">
                          <Landmark size={18} className="text-orange-600" />
                          <h4 className="font-bold text-orange-950 text-sm">Interac e-Transfer Instructions</h4>
                        </div>
                        
                        <div className="p-4 space-y-4 text-sm">
                          <ol className="space-y-4 relative border-l-2 border-orange-100 ml-3">
                            <li className="pl-6 relative">
                              <span className="absolute -left-2.25 top-0.5 bg-orange-100 text-orange-600 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                              <p className="text-gray-600 font-medium mb-2">Send exactly this amount:</p>
                              <div className="flex items-center gap-2 max-w-50">
                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono font-bold text-gray-900 text-lg">
                                  ${finalTotal.toFixed(2)}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(finalTotal.toFixed(2), 'amount')}
                                  className={`p-2.5 rounded-lg border transition-all flex items-center justify-center min-w-10.5 ${
                                    copyStatus === 'amount' 
                                      ? 'bg-green-50 border-green-200 text-green-600' 
                                      : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                  }`}
                                  title="Copy amount"
                                >
                                  {copyStatus === 'amount' ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                              </div>
                            </li>

                            <li className="pl-6 relative">
                              <span className="absolute -left-2.25 top-0.5 bg-orange-100 text-orange-600 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                              <p className="text-gray-600 font-medium mb-2">To the provided email address:</p>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 italic">
                                Email address will be revealed after you place the order.
                              </div>
                            </li>

                            <li className="pl-6 relative">
                              <span className="absolute -left-2.25 top-0.5 bg-orange-100 text-orange-600 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black">3</span>
                              <p className="text-gray-600 font-medium">Click <strong className="text-gray-900">Pay Now</strong> below to complete your checkout. Your order will be confirmed via phone or email once payment is recieved.</p>
                            </li>
                          </ol>

                          <div className="bg-green-50 text-green-800 p-3 rounded-lg flex items-start gap-2.5 text-xs font-medium border border-green-100/50">
                            <ShieldCheck size={16} className="text-green-600 shrink-0 mt-0.5" />
                            <p><strong>Auto-Deposit is Enabled.</strong> No security question or password is required.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-gray-900">Total to pay</span>
                  <span className="text-xl font-black text-gray-900">${finalTotal.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing}
                  className="w-full bg-orange-950 text-white py-4 rounded-xl font-black text-lg hover:bg-orange-900 transition-all transform active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                       <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Pay ${paymentMethod === 'interac' ? 'Now' : `$${finalTotal.toFixed(2)}`}`
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

