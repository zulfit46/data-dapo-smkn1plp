'use client';

import { useState, useEffect } from 'react';
import App from '@/dapo/App';

// Pola "mounted": App masuk MAIN BUNDLE (bukan lazy chunk) → tidak ada
// permintaan chunk terpisah yang bisa gagal via proxy/preview. Fallback
// statis dirender di SSR & client (cocok, no hydration mismatch).
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50/30 to-blue-50/20 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <App /> : <LoadingFallback />;
}
