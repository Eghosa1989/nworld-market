import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import { AuthProvider } from './context/AuthContext';
import { OrdersProvider } from './context/OrdersContext';
import Storefront from './pages/Storefront';
import Admin from './pages/Admin';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductsProvider>
        <AuthProvider>
          <OrdersProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Storefront />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
              <Toaster position="top-right" richColors />
            </CartProvider>
          </OrdersProvider>
        </AuthProvider>
      </ProductsProvider>
    </QueryClientProvider>
  );
}

export default App;
