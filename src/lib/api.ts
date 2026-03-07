const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchDrops = async () => {
  const res = await fetch(`${API_URL}/api/drops`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch drops');
  return res.json();
};