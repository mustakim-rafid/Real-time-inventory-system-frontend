import { fetchDrops } from '@/lib/api';
import LiveDropFeed from '@/components/LiveDropFeed';
import { UserNav } from '@/components/UserNav';

export default async function DashboardPage() {
  const initialDrops = await fetchDrops();

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Drop Room</h1>
          <UserNav />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        <header className="mb-12">
          <h2 className="text-5xl font-black uppercase tracking-tight">Active Drops</h2>
          <p className="text-slate-500 font-medium">Real-time inventory</p>
        </header>

        <LiveDropFeed initialDrops={initialDrops} />
      </div>
    </main>
  );
}