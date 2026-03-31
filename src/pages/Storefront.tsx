import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Products from '../components/Products';
import RecipeSuggester from '../components/RecipeSuggester';
import CustomerReviews from '../components/CustomerReviews';
import FAQ from '../components/FAQ';
import Cart from '../components/Cart';
import LoginModal from '../components/LoginModal';
import ProfileModal from '../components/ProfileModal';
import UpdatePasswordModal from '../components/UpdatePasswordModal';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Storefront() {
  return (
    <div className="min-h-screen bg-orange-50 font-sans selection:bg-orange-200 selection:text-orange-900">
      <Navbar />
      <Cart />
      <LoginModal />
      <UpdatePasswordModal />
      <ProfileModal />
      <main>
        <Hero />
        <Products />
        <RecipeSuggester />
        <CustomerReviews />
        <FAQ />
      </main>
      
      {/* Compact Footer containing About & Get In Touch */}
      <footer id="contact" className="bg-orange-950 py-8 px-4 text-orange-200/80 border-t-4 border-orange-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          {/* About Blurb */}
          <div className="md:w-1/3">
            <h2 className="text-xl font-black text-white mb-2 tracking-tight">UNIQ &quot;N&quot; PREMIUM MARKET</h2>
            <p className="text-xs leading-relaxed">
              Founded by Mrs. Nneka, bringing authentic African heritage and traditional goods to doorsteps worldwide. Bringing Africa closer to home.
            </p>
          </div>

          {/* Get In Touch */}
          <div className="md:w-1/3 flex flex-col gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Get In Touch</h3>
            <div className="flex items-center gap-2 text-xs">
              <MapPin size={14} className="text-orange-500" />
              <span>123 Market Square, Global Trade District</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Phone size={14} className="text-orange-500" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Mail size={14} className="text-orange-500" />
              <span>hello@uniqnpremiummarket.com</span>
            </div>
          </div>

          {/* Navigation & Copyright */}
          <div className="md:w-1/3 flex flex-col items-start md:items-end gap-3">
            <div className="flex gap-4 text-xs font-medium">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#products" className="hover:text-white transition-colors">Shop</a>
              <Link to="/admin" className="hover:text-white transition-colors text-orange-400">Admin</Link>
            </div>
            <p className="text-[10px]">© 2026 UNIQ &quot;N&quot; PREMIUM MARKET. All rights reserved.</p>
          </div>

        </div>
      </footer>
    </div>
  );
}
