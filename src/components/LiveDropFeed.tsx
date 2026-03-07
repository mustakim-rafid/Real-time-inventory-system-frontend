"use client";

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`);

export default function LiveDropFeed({ initialDrops }: { initialDrops: any[] }) {
  const [drops, setDrops] = useState(initialDrops);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    socket.on('STOCK_UPDATED', (data: { dropId: string; newStock: number }) => {
      setDrops((prev) => 
        prev.map(d => d.id === data.dropId ? { ...d, availableStock: data.newStock } : d)
      );
    });

    socket.on('STOCK_UPDATE', (data: { dropId: string; stock: number }) => {
      setDrops((prev) => 
        prev.map(d => d.id === data.dropId ? { ...d, availableStock: data.stock } : d)
      );
    });

    socket.on('NEW_PURCHASE', (data: { dropId: string; username: string }) => {
      setDrops((prev) => prev.map(d => {
        if (d.id === data.dropId) {
          const newPurchases = [{ user: { username: data.username } }, ...d.purchases].slice(0, 3);
          return { ...d, purchases: newPurchases };
        }
        return d;
      }));
    });

    return () => {
      socket.off('STOCK_UPDATED');
      socket.off('STOCK_UPDATE');
      socket.off('NEW_PURCHASE');
    };
  }, []);

  const handleReserve = async (dropId: string) => {
    if (!user) return router.push('/login');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/drops/${dropId}/reserve`, {
        method: 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        const reservation = await res.json();
        router.push(`/purchase/${reservation.id}`);
      } else {
        const err = await res.json();
        toast(err.error || "Too slow! Someone else grabbed it.");
      }
    } catch (e) {
      console.error("Reservation Error", e);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {drops.map((drop) => (
        <Card key={drop.id} className="relative overflow-hidden border-2 hover:border-black transition-all group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="mb-2 font-mono">{drop.availableStock > 0 ? 'IN STOCK' : 'SOLD OUT'}</Badge>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Limited Edition</span>
            </div>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">{drop.name}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="text-4xl font-black mb-6">${drop.price}</div>
            
            {/* Stock Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-bold uppercase">
                <span>Available Units</span>
                <span>{drop.availableStock} / {drop.totalStock}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${drop.availableStock < 5 ? 'bg-red-500' : 'bg-black'}`}
                  style={{ width: `${(drop.availableStock / drop.totalStock) * 100}%` }}
                />
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-slate-50 p-4 rounded-xl">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Live Cop Activity</h4>
              <div className="space-y-2">
                {drop.purchases.length > 0 ? drop.purchases.map((p: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm animate-in fade-in slide-in-from-left-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="font-bold">{p.user.username}</span>
                    <span className="text-slate-400 text-xs">just secured a pair</span>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 italic">Waiting for the first cop...</p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button 
              onClick={() => handleReserve(drop.id)}
              disabled={drop.availableStock === 0}
              className={`w-full h-14 text-lg font-bold uppercase transition-all ${drop.availableStock > 0 ? 'bg-black text-white hover:scale-[1.02]' : 'bg-slate-200 text-slate-400'}`}
            >
              {drop.availableStock > 0 ? 'Reserve Your Pair' : 'Sold Out'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}