import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  total: number;
  status: string;
  date: string;
  paymentMethod: string;
  items: OrderItem[];
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const mapped: Order[] = data.map(o => ({
          id: o.id,
          customerEmail: o.customer_email,
          customerName: o.customer_name,
          customerPhone: o.customer_phone,
          total: o.total,
          status: o.status,
          date: o.created_at.split('T')[0],
          paymentMethod: o.payment_method,
          items: o.items || []
        }));
        setOrders(mapped);
      }
    };
    loadOrders();
  }, []);

  const addOrder = async (orderData: Omit<Order, 'id' | 'date'>) => {
    // Optimistic UI insert with a temp ID
    const tempId = `temp-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    
    setOrders(prev => [{
      ...orderData,
      id: tempId,
      date
    }, ...prev]);

    // Format for DB
    const dbPayload = {
      customer_email: orderData.customerEmail,
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      total: orderData.total,
      status: orderData.status,
      payment_method: orderData.paymentMethod,
      items: orderData.items
    };

    const { data, error } = await supabase.from('orders').insert([dbPayload]).select().single();
    
    if (error) {
       console.error("Order Insert Error:", error);
       toast.error(`Failed to sync order to database: ${error.message || error.details}`);
    } else if (data) {
       // Swap temp ID with real DB UUID
       setOrders(prev => prev.map(o => o.id === tempId ? {
         ...o,
         id: data.id,
         date: data.created_at.split('T')[0]
       } : o));
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    await supabase.from('orders').update({ status }).eq('id', orderId);
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}


export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
