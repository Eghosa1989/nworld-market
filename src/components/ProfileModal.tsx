import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Package, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { useProducts } from '../context/ProductsContext';
import { useState } from 'react';

export default function ProfileModal() {
  const { isProfileModalOpen, setIsProfileModalOpen, currentUser, logout } = useAuth();
  const { orders } = useOrders();
  const { products, wishlist, toggleWishlist } = useProducts();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');

  if (!isProfileModalOpen) return null;

  // We should wait for currentUser, but if it takes a second, show a loading state
  if (!currentUser) return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-orange-950/40 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl flex items-center gap-4 relative">
        <button 
          onClick={() => setIsProfileModalOpen(false)} 
          title="Close"
          className="absolute -top-3 -right-3 bg-white p-1 rounded-full shadow-md text-gray-400 hover:text-gray-900"
        >
          <X size={16} />
        </button>
        <svg className="animate-spin h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-gray-600 font-bold">Loading profile data...</span>
      </div>
    </div>
  );

  const userOrders = orders.filter(o => o.customerEmail === currentUser.email); 
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));     

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsProfileModalOpen(false)}
          className="absolute inset-0 bg-orange-950/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-orange-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 capitalize">Your Profile</h2>
                <p className="text-sm text-gray-500 font-medium">Manage your account and orders</p>
              </div>
            </div>
            <button
              title="Close Profile Modal"
              aria-label="Close Profile Modal"
              onClick={() => setIsProfileModalOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="stroke-2" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <div className="space-y-6">
              
              {/* Profile Details */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Account Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                    <div className="font-medium text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      {currentUser.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Member Since</label>
                    <div className="font-medium text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      {new Date(currentUser.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 font-bold text-sm transition-colors border-b-2 ${
                    activeTab === 'orders' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Package size={16} /> Orders ({userOrders.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`px-4 py-2 font-bold text-sm transition-colors border-b-2 ${
                    activeTab === 'wishlist' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Heart size={16} /> Wishlist ({wishlistedProducts.length})
                  </div>
                </button>
              </div>

              {activeTab === 'orders' && (
                <div>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map(order => (
                        <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:border-orange-200 transition-colors">
                          <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                            <div>
                              <div className="font-mono text-gray-900 font-bold bg-gray-100 inline-block px-2 py-0.5 rounded text-xs mb-1">
                                {order.id}
                              </div>
                              <div className="text-xs text-gray-500 font-medium"> 
                                Placed on {order.date}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-black text-gray-900">${order.total.toFixed(2)}</div>
                              <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 ${
                                order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {order.status}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-gray-600">     
                            {order.items.map(item => (
                              <div key={item.id} className="flex justify-between py-1">
                                <span>{item.quantity}x {item.name} ({item.size})</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  {wishlistedProducts.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-gray-500 font-medium">Your wishlist is empty.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {wishlistedProducts.map(product => (
                        <div key={product.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                            <p className="text-xs text-gray-500 font-medium mt-1">${product.sizes[0].price.toFixed(2)}</p>
                          </div>
                          <button
                            title="Remove from wishlist"
                            aria-label="Remove from wishlist"
                            onClick={() => toggleWishlist(product.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Heart size={18} className="fill-current" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => {
                logout();
                setIsProfileModalOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors border border-red-100"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}