import { useState, useMemo, useEffect } from 'react';
import {
  Home, Package, Users, Settings, Plus, Edit2, Trash2,
  Menu, X, LogOut, CheckCircle, Clock, Search, Image as ImageIcon, Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useProducts } from '../context/ProductsContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { type Product } from '../data/products';

export default function Admin() {
  const { products, categories, addCategory, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const { users, isLoggedIn, currentUser, login, logout, resetPassword, authError, clearAuthError } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  // Products State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  
  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | number | null>(null);

  // Orders Filter State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Add Category Modal State
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Settings State
  const [settingsEmail, setSettingsEmail] = useState('payment@uniqnpremiummarket.com');
  const [settingsDeliveryFee, setSettingsDeliveryFee] = useState('15.00');
  const [settingsBanner, setSettingsBanner] = useState('');
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0] ?? 'Pantry');
  const [formPrice, setFormPrice] = useState('');
  const [formSize, setFormSize] = useState('1 pc');
  const [formImage, setFormImage] = useState('');
  const [formTags, setFormTags] = useState('');

  const derivedProducts = useMemo(() => {
    let filtered = products;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'All Categories') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    return filtered;
  }, [products, searchQuery, categoryFilter]);

  const derivedOrders = useMemo(() => {
    let filtered = orders;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      filtered = filtered.filter(o =>
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    }
    if (orderStatusFilter !== 'All') {
      filtered = filtered.filter(o => o.status === orderStatusFilter);
    }
    return filtered;
  }, [orders, orderSearch, orderStatusFilter]);

  const openAddModal = () => {
    setEditingProductId(null);
    setFormName('');
    setFormCategory(categories[0] ?? 'Pantry');
    setFormPrice('');
    setFormSize('1 pc');
    setFormImage('');
    setFormTags('');
    setIsProductModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.sizes[0]?.price.toString() || '0');
    setFormSize(p.sizes[0]?.size || '1 pc');
    setFormImage(p.image);
    setFormTags(p.searchTags.join(', '));
    setIsProductModalOpen(true);
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(formPrice);
    if (!formName.trim() || !formCategory || !Number.isFinite(price)) return;

    const payload: Omit<Product, 'id'> = {
      name: formName.trim(),
      category: formCategory,
      image: formImage.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
      rating: 4.8,
      searchTags: formTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      sizes: [{ size: formSize.trim() || '1 pc', price }]
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }
    setIsProductModalOpen(false);
  };

  const confirmDelete = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
    }
    setIsDeleteModalOpen(false);
  };

  const isCheckingAccess = isLoggedIn && !currentUser;
  const isAdmin = currentUser?.isAdmin === true;

  useEffect(() => {
    const rememberedEmail = window.localStorage.getItem('admin-remembered-email');
    if (rememberedEmail) {
      setAdminEmail(rememberedEmail);
    }
  }, []);

  useEffect(() => {
    supabase.from('store_settings').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) {
        if (data.etransfer_email) setSettingsEmail(data.etransfer_email);
        if (data.delivery_fee != null) setSettingsDeliveryFee(String(data.delivery_fee));
        if (data.banner_text != null) setSettingsBanner(data.banner_text);
      }
    });
  }, []);

  const handleAdminSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdminLoading(true);
    clearAuthError();

    if (isResetMode) {
      try {
        await resetPassword(adminEmail.trim());
        setIsResetMode(false);
      } catch (error) {
        console.error('Password reset error', error);
      } finally {
        setAdminLoading(false);
      }
      return;
    }

    try {
      await login(adminEmail.trim(), adminPassword, false);
      window.localStorage.setItem('admin-remembered-email', adminEmail.trim());
      setAdminPassword('');
    } catch (error) {
      console.error('Admin login error', error);
    } finally {
      setAdminLoading(false);
    }
  };

  // -------- ACCESS STATES --------
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <h1 className="text-3xl font-black text-orange-950 tracking-tight">UNIQ &quot;N&quot; ADMIN</h1>
          <p className="text-gray-500 mt-3 font-medium">Verifying your admin access...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-orange-400 to-orange-600"></div>
          
          <div className="text-center mb-8 mt-2">
            <h1 className="text-3xl font-black text-orange-950 tracking-tight">UNIQ &quot;N&quot; ADMIN</h1>
            <p className="text-gray-500 mt-2 font-medium">
              {isResetMode 
                ? 'Enter your admin email to receive a password reset link' 
                : 'Sign in with your backend admin account to manage your store'}
            </p>
          </div>

          <form onSubmit={handleAdminSignIn} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Admin Email</label>
              <input
                type="email"
                title="Admin Email"
                aria-label="Admin Email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium text-gray-800"
              />
            </div>
            {!isResetMode && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  title="Password"
                  aria-label="Password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium text-gray-800"
                />
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs font-medium text-gray-500">This page remembers your email only.</p>        
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={adminLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-6 active:scale-[0.98] disabled:opacity-50"
            >
              {adminLoading ? (isResetMode ? 'Sending...' : 'Signing in...') : (isResetMode ? 'Send Reset Link' : 'Secure Login')}
            </button>
            {isResetMode && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsResetMode(false)}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-900"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </form>
          <div className="mt-5 space-y-5">
            <p className="text-sm text-gray-500 font-medium text-center">
              Only accounts marked as admin in the backend profile table can enter this page.
            </p>
            {authError && (
              <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {authError}
              </p>
            )}
          </div>

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <Link to="/" className="text-sm font-bold text-orange-600 hover:text-orange-800 flex items-center justify-center gap-2 transition-colors">
              <Home size={16} /> Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-orange-400 to-orange-600"></div>
          <h1 className="text-3xl font-black text-orange-950 tracking-tight mt-2">Admin Access Required</h1>
          <p className="text-gray-500 mt-3 font-medium">
            Your account is signed in, but it is not marked as an admin in the backend.
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Signed in as {currentUser?.email}
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => void logout()}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              Sign Out
            </button>
            <Link to="/" className="text-sm font-bold text-orange-600 hover:text-orange-800 flex items-center justify-center gap-2 transition-colors">
              <Home size={16} /> Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------- ADMIN LAYOUT --------
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-orange-950 text-orange-50 flex flex-col 
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-orange-900 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black tracking-tight">UNIQ &quot;N&quot;</h2>
            <p className="text-xs text-orange-400 mt-1 font-bold">Admin Portal</p>
          </div>
          <button title="Close Menu" aria-label="Close Menu" className="md:hidden text-orange-200 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'dashboard' ? 'bg-orange-900 text-white shadow-inner' : 'text-orange-200 hover:bg-orange-900 hover:text-white'}`}
          >
            <Home size={18} /> Dashboard
          </button>
          <button 
            onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'products' ? 'bg-orange-900 text-white shadow-inner' : 'text-orange-200 hover:bg-orange-900 hover:text-white'}`}
          >
            <Package size={18} /> Products Management
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'orders' ? 'bg-orange-900 text-white shadow-inner' : 'text-orange-200 hover:bg-orange-900 hover:text-white'}`}
          >
            <CheckCircle size={18} /> Customer Orders
          </button>
          <button
            onClick={() => { setActiveTab('users'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'users' ? 'bg-orange-900 text-white shadow-inner' : 'text-orange-200 hover:bg-orange-900 hover:text-white'}`}
          >
            <Users size={18} /> Registered Users
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'settings' ? 'bg-orange-900 text-white shadow-inner' : 'text-orange-200 hover:bg-orange-900 hover:text-white'}`}
          >
            <Settings size={18} /> Store Settings
          </button>
        </nav>
        
        <div className="p-4 border-t border-orange-900 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3.5 text-orange-200 hover:bg-orange-900 hover:text-white rounded-xl text-sm font-bold transition-colors">
            <Home size={18} /> View Live Store
          </Link>
          <button 
            onClick={() => void logout()}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-red-300 hover:bg-red-950 hover:text-red-200 rounded-xl text-sm font-bold transition-colors"
          >
            <LogOut size={18} /> Secure Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 p-4 md:p-6 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button title="Open Menu" aria-label="Open Menu" onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-500 hover:text-gray-900">
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-black text-gray-800 capitalize">
              {activeTab} Overview
            </h1>
          </div>
          
          {activeTab === 'products' && (
            <div className="flex gap-2">
              <button 
                onClick={() => { setNewCategoryName(''); setIsAddCategoryModalOpen(true); }} 
                className="bg-orange-100 hover:bg-orange-200 text-orange-900 px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                title="Add Category"
              >
                <Tag size={18} /> <span className="hidden sm:inline">Add Category</span>
              </button>
              <button 
                onClick={openAddModal} 
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                title="Add New Product"
              >
                <Plus size={18} /> <span className="hidden sm:inline">Add Product</span>
              </button>
            </div>
          )}
        </header>

        {/* Dynamic Views based on activeTab */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-24">
          
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                  <div className="p-4 bg-green-100 text-green-700 rounded-2xl"><CheckCircle size={28}/></div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Sales</h3>
                    <p className="text-3xl font-black text-gray-900">${orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                  <div className="p-4 bg-orange-100 text-orange-700 rounded-2xl"><Package size={28}/></div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Orders</h3>
                    <p className="text-3xl font-black text-gray-900">{orders.length}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                  <div className="p-4 bg-blue-100 text-blue-700 rounded-2xl"><Users size={28}/></div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Customers</h3>
                    <p className="text-3xl font-black text-gray-900">{users.length}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                  <div className="p-4 bg-amber-100 text-amber-700 rounded-2xl"><Clock size={28}/></div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Orders</h3>
                    <p className="text-3xl font-black text-gray-900">{orders.filter(o => o.status === 'Pending').length}</p>
                  </div>
                </div>
              </div>

              {/* Chart & Recent Orders Split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-black text-gray-900">Recent Orders</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                          <th className="p-4 font-semibold">Order ID</th>
                          <th className="p-4 font-semibold">Customer</th>
                          <th className="p-4 font-semibold">Total</th>
                          <th className="p-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orders.slice(0, 4).map(order => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-900">{order.id.slice(0, 8)}</td>
                            <td className="p-4 text-gray-600">{order.customerEmail}</td>
                            <td className="p-4 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-500">No orders yet</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick glance list */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-orange-500" />
                    Urgent Actions
                  </h2>
                  <div className="p-4 bg-orange-50 border border-orange-200 text-orange-900 rounded-xl text-sm font-medium flex flex-col gap-3">
                    <p>Some rare items might be running low on stock. Please check inventory.</p>
                    <button onClick={() => setActiveTab('products')} className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors">Go to Products</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS VIEW */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      title="Search by product name"
                      aria-label="Search"
                      placeholder="Search by product name..." 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select 
                    title="Category Filter"
                    aria-label="Category Filter"
                    className="bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 block p-2.5 outline-none min-w-37.5"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option>All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-bold">Product Item</th>
                        <th className="px-6 py-4 font-bold">Category</th>
                        <th className="px-6 py-4 font-bold">Price</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {derivedProducts.map(product => (
                        <tr key={product.id} className="hover:bg-orange-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-4">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0" />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200 shrink-0">
                                <ImageIcon size={20} />
                              </div>
                            )}
                            {product.name}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-600">
                            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs">{product.category}</span>
                          </td>
                          <td className="px-6 py-4 font-black text-gray-900 text-base">${product.sizes?.[0]?.price?.toFixed(2) || '0.00'}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              aria-label="Edit product" 
                              onClick={() => openEditModal(product as Product)}
                              className="text-blue-600 hover:bg-blue-100 p-2.5 border border-transparent hover:border-blue-200 rounded-lg transition-all inline-block mr-2"
                            >
                              <Edit2 size={18}/>
                            </button>
                            <button 
                              aria-label="Delete product" 
                              onClick={() => { setDeletingProductId(product.id); setIsDeleteModalOpen(true); }}
                              className="text-red-600 hover:bg-red-100 p-2.5 border border-transparent hover:border-red-200 rounded-lg transition-all inline-block"
                            >
                              <Trash2 size={18}/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS VIEW */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      title="Search orders"
                      aria-label="Search orders"
                      placeholder="Search by customer name, email or order ID..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                    />
                  </div>
                  <select
                    title="Filter by status"
                    aria-label="Filter by status"
                    className="bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 block p-2.5 outline-none"
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Awaiting E-Transfer</option>
                    <option value="Paid">Payment Verified</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-bold">Order Details</th>
                        <th className="px-6 py-4 font-bold">Customer Contact</th>
                        <th className="px-6 py-4 font-bold">Total Amount</th>
                        <th className="px-6 py-4 font-bold">Payment/Shipping</th>
                        <th className="px-6 py-4 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {derivedOrders.length === 0 && (
                          <tr><td colSpan={5} className="p-8 text-center text-gray-500 font-medium">No orders found</td></tr>
                        )}
                        {derivedOrders.map(order => (
                          <tr key={order.id} className="hover:bg-orange-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-mono text-gray-900 font-bold bg-gray-100 inline-block px-2 py-0.5 rounded text-xs mb-1">{order.id}</div>
                              <div className="text-xs font-medium text-gray-500">{order.date}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-gray-900">{order.customerName}</div>
                              <div className="text-xs font-medium text-gray-500">{order.customerEmail}</div>
                          </td>
                          <td className="px-6 py-4 font-black text-gray-900 text-base">${order.total.toFixed(2)}</td>
                          <td className="px-6 py-4">
                              <div className="text-xs font-bold text-gray-600 mb-1">{order.paymentMethod}</div>
                              <select
                                title="Update Order Status"
                                aria-label="Update Order Status"
                                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer outline-none transition-colors border ${
                                  order.status === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200 focus:ring-amber-500' : 'bg-green-50 text-green-800 border-green-200 focus:ring-green-500'
                                }`}
                                value={order.status}
                                onChange={(e) => {
                                  updateOrderStatus(order.id, e.target.value);
                                  if (e.target.value === 'Paid' || e.target.value === 'Shipped') {
                                    toast.success(`Order ${e.target.value}! Customer ${order.customerName} has been notified via email.`);
                                  }
                                }}
                            >
                              <option value="Pending">Awaiting E-Transfer</option>
                              <option value="Paid">Payment Verified</option>
                              <option value="Shipped">Order Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right flex flex-col items-end gap-2">
                            {order.status === 'Pending' && (
                              <button 
                                onClick={() => {
                                  updateOrderStatus(order.id, 'Paid');
                                  toast.success(`Order Confirmed! A receipt has been sent to ${order.customerEmail}.`);
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm w-full min-w-35 flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle size={14} /> Confirm & Notify
                              </button>
                            )}
                            <button onClick={() => setViewingOrderId(order.id)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold text-xs transition-colors border border-gray-200 w-full min-w-35">
                              View Full Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
            {/* USERS VIEW */}
            {activeTab === 'users' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                        <tr>
                          <th className="px-6 py-4 font-bold">User ID</th>
                          <th className="px-6 py-4 font-bold">Email</th>
                          <th className="px-6 py-4 font-bold text-center">Orders</th>
                          <th className="px-6 py-4 font-bold text-right">Join Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users.map(user => (
                          <tr key={user.id} className="hover:bg-orange-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-mono text-gray-900 font-bold bg-gray-100 inline-block px-2 py-0.5 rounded text-xs mb-1">USR-{String(user.id).padStart(3, '0')}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-gray-900 flex items-center gap-2">
                                {user.email}
                                {user.isAdmin && (
                                  <span className="bg-orange-600 text-white text-xs font-black px-2 py-0.5 rounded-full">ADMIN</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-bold text-gray-900">
                                {orders.filter(o => o.customerEmail === user.email).length}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-gray-500 font-medium">
                              {new Date(user.joinDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          {/* SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-1">Store Configuration</h2>
                  <p className="text-sm font-medium text-gray-500 border-b border-gray-100 pb-6">Update global details that affect customer checkout and storefront displays.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-black text-gray-800 mb-2">E-Transfer Receiving Email</label>
                    <input title="Receiving Email" aria-label="Receiving Email" type="email" value={settingsEmail} onChange={e => setSettingsEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-medium" />
                    <p className="text-xs font-medium text-gray-500 mt-2 flex items-center gap-1"><CheckCircle size={14} className="text-green-500"/> This is the exact email shown to customers during checkout.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-black text-gray-800 mb-2">Standard Delivery Fee ($)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">$</span>
                      <input title="Delivery Fee" aria-label="Delivery Fee" type="number" value={settingsDeliveryFee} onChange={e => setSettingsDeliveryFee(e.target.value)} className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-medium" />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-black text-gray-800 mb-2">Storefront Announcement Banner</label>
                    <textarea title="Announcement Banner" aria-label="Announcement Banner" rows={3} value={settingsBanner} onChange={e => setSettingsBanner(e.target.value)} placeholder="e.g. Due to weather, expect slight delays..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-medium resize-none"></textarea>
                    <p className="text-xs font-medium text-gray-500 mt-2">Leave blank to hide the banner from the website.</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                  <button type="button" className="text-gray-600 hover:text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors">Cancel</button>
                  <button
                    type="button"
                    disabled={settingsSaving}
                    onClick={async () => {
                      setSettingsSaving(true);
                      const { error } = await supabase.from('store_settings').upsert({
                        id: 1,
                        etransfer_email: settingsEmail.trim(),
                        delivery_fee: parseFloat(settingsDeliveryFee) || 15,
                        banner_text: settingsBanner.trim(),
                      });
                      setSettingsSaving(false);
                      if (error) toast.error('Failed to save. Make sure the store_settings table exists in Supabase.');
                      else toast.success('Settings saved successfully!');
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {settingsSaving ? 'Saving...' : 'Save All Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modals */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900">{editingProductId ? 'Edit Product' : 'Add Product'}</h2>
                <button title="Close Modal" aria-label="Close Modal" onClick={() => setIsProductModalOpen(false)} className="text-gray-500 hover:text-gray-900 transition-colors"><X size={20}/></button>
              </div>
              <form onSubmit={submitProduct} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                  <input title="Product Name" aria-label="Product Name" required value={formName} onChange={e => setFormName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                    <input title="Product Price" aria-label="Product Price" required type="number" step="0.01" value={formPrice} onChange={e => setFormPrice(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Size Option</label>
                    <input title="Product Size" aria-label="Product Size" required value={formSize} onChange={e => setFormSize(e.target.value)} placeholder="e.g. 1L, 500g" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <select title="Product Category" aria-label="Product Category" value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Image</label>
                    <div className="flex gap-2 items-center mb-2">
                      <input 
                        type="file" 
                        accept="image/*"
                        title="Upload Image"
                        aria-label="Upload Image"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          toast.promise(
                            async () => {
                              const ext = file.name.split('.').pop() || 'tmp';
                              const fileName = `${Date.now()}.${ext}`;
                              const { error } = await supabase.storage.from('product-images').upload(fileName, file);
                              if (error) throw error;
                              const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
                              setFormImage(data.publicUrl);
                            },
                            { loading: 'Uploading image...', success: 'Image uploaded!', error: 'Failed to upload' }
                          );
                        }}
                        className="flex-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" 
                      />
                      {formImage && <img src={formImage} alt="Preview" className="w-10 h-10 object-cover rounded bg-gray-100" />}
                    </div>
                    <input title="Product Image URL" aria-label="Product Image URL" value={formImage} onChange={e => setFormImage(e.target.value)} placeholder="Or paste a URL https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none mt-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Search Tags (comma separated)</label>
                  <input value={formTags} onChange={e => setFormTags(e.target.value)} placeholder="stew, oil, spicy" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-700 transition-colors">{editingProductId ? 'Save Changes' : 'Create Product'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200 p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4"><Trash2 size={24} /></div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Delete Product?</h2>
              <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors">Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

        {viewingOrderId && (() => {
          const order = orders.find(o => o.id === viewingOrderId);
          if (!order) return null;
          return (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Order Invoice</h2>
                    <p className="text-xs font-mono text-gray-500 mt-1">ID: {order.id}</p>
                  </div>
                  <button title="Close Invoice" aria-label="Close Invoice" onClick={() => setViewingOrderId(null)} className="text-gray-500 hover:text-gray-900 transition-colors bg-white border border-gray-200 p-2 rounded-full shadow-sm"><X size={18}/></button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  {/* Customer Info */}
                  <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                    <h3 className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-3">Customer Details</h3>
                    <div className="space-y-2 text-sm text-gray-800">
                      <p><span className="font-semibold text-gray-500 w-24 inline-block">Name:</span> {order.customerName}</p>
                      <p><span className="font-semibold text-gray-500 w-24 inline-block">Email:</span> {order.customerEmail}</p>
                      <p><span className="font-semibold text-gray-500 w-24 inline-block">Phone:</span> {order.customerPhone || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Order Summary</h3>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded text-xs font-bold flex items-center justify-center">x{item.quantity}</div>
                            <div>
                              <p className="font-bold text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.size}</p>
                            </div>
                          </div>
                          <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500 font-medium">
                      <span>Subtotal</span>
                      <span>${(order.total - 15).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 font-medium">
                      <span>Standard Delivery</span>
                      <span>$15.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed border-gray-200">
                      <span className="font-bold text-gray-900">Total Paid</span>
                      <span className="font-black text-xl text-orange-600">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-bold text-gray-600">Status:</span>
                     <span className={`px-2.5 py-1 rounded text-xs font-black uppercase ${
                        order.status === 'Paid' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'Shipped' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                   </div>
                   <button onClick={() => setViewingOrderId(null)} className="px-5 py-2 rounded-xl font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors">Close</button>
                </div>
              </div>
            </div>
          );
        })()}

        {isAddCategoryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200 p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><Tag size={20} className="text-orange-600" /> Add Category</h2>
                <button title="Close" aria-label="Close" onClick={() => setIsAddCategoryModalOpen(false)} className="text-gray-500 hover:text-gray-900"><X size={20}/></button>
              </div>
              <input
                type="text"
                title="Category name"
                aria-label="Category name"
                placeholder="e.g. Beverages, Spices..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-medium mb-6"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newCategoryName.trim()) {
                    addCategory(newCategoryName.trim());
                    setIsAddCategoryModalOpen(false);
                  }
                }}
                autoFocus
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsAddCategoryModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                <button
                  type="button"
                  disabled={!newCategoryName.trim()}
                  onClick={() => {
                    if (newCategoryName.trim()) {
                      addCategory(newCategoryName.trim());
                      setIsAddCategoryModalOpen(false);
                    }
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

