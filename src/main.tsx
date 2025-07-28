import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import App from './App.tsx'
import './index.css'

// Loading component to prevent FOUC
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
    <div className="animate-pulse">
      <div className="w-16 h-16 bg-blue-500/20 rounded-full mb-4"></div>
      <div className="text-white text-lg">Loading...</div>
    </div>
  </div>
);

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<LoadingFallback />}>
    <App />
  </Suspense>
);
