"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ShoppingCart } from "lucide-react";
import { toast } from 'sonner';

export default function PurchasePage() {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(60);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'expired'>('idle');
  const router = useRouter();

  useEffect(() => {
    if (status !== 'idle') return;

    if (timeLeft <= 0) {
      setStatus('expired');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const handleFinalPurchase = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/drops/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: id }),
        credentials: 'include'
      });

      if (res.ok) {
        setStatus('success');
        setTimeout(() => router.push('/'), 2500);
      } else {
        const err = await res.json();
        toast(err.error || "Purchase failed. Your reservation might have expired.");
        router.push('/');
      }
    } catch (error) {
      console.error("Purchase Error", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-2 overflow-hidden">
        
        {/* Progress Header */}
        <div className={`h-2 w-full transition-all duration-1000 ${timeLeft < 15 ? 'bg-red-500' : 'bg-green-500'}`} 
             style={{ width: `${(timeLeft / 60) * 100}%` }} />

        <CardHeader className="text-center pt-8">
          <CardTitle className="text-3xl font-black italic uppercase flex justify-center items-center gap-2">
            <ShoppingCart className="w-8 h-8" /> Secure The Drop
          </CardTitle>
          <p className="text-slate-500 font-medium">Your pair is held. Complete checkout now.</p>
        </CardHeader>

        <CardContent className="space-y-6 py-6">
          {status === 'idle' && (
            <div className="text-center space-y-4">
              <div className="text-7xl font-mono font-black tracking-tighter tabular-nums">
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-red-500 animate-pulse">
                Reservation Expires Soon
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-4 animate-in zoom-in-50">
              <CheckCircle2 className="w-20 h-20 text-green-500" />
              <h2 className="text-2xl font-bold uppercase">Order Confirmed!</h2>
              <p className="text-slate-500">Redirecting you to the dashboard...</p>
            </div>
          )}

          {status === 'expired' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <AlertCircle className="w-20 h-20 text-red-500" />
              <h2 className="text-2xl font-bold uppercase">Time's Up</h2>
              <p className="text-slate-500">Your reservation has been released back to the public.</p>
              <Button onClick={() => router.push('/')} variant="outline">Return Home</Button>
            </div>
          )}
        </CardContent>

        {status === 'idle' && (
          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button 
              onClick={handleFinalPurchase}
              disabled={isProcessing}
              className="w-full h-16 text-xl font-bold uppercase bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100"
            >
              {isProcessing ? "Processing..." : "Confirm & Pay Now"}
            </Button>
            <p className="text-[10px] text-center text-slate-400 uppercase tracking-tighter">
              By clicking pay, you agree to our Hype-Drop terms of service.
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}