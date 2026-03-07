"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      },
    );

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      toast.success(data.message || "Account created successfully");
      router.push("/");
    } else {
      const errorData = await res.json();
      toast.error(
        errorData.error || "Registration failed. Try a different username.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-100">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-blue-600">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center italic">
            JOIN THE WAITLIST
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose Username</label>
              <Input
                placeholder="sneaker_king"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Create Password</label>
              <Input
                type="password"
                placeholder="Make it strong"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 py-6 text-lg"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">Already a member? </span>
            <Link href="/login">
              <Button variant="link">Log in</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
