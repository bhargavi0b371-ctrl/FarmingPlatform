'use client';

// TopNav intentionally omitted on public home page to avoid showing app links
import Link from 'next/link';
import { useAuth } from '../lib/auth';

export default function HomePage() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-green-600">Crop Advisory</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">Grow smarter with connected farm insights.</h1>
            <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
              Access weather data, market prices, farm records, and advisory recommendations from a single dashboard.
            </p>
          </div>
          <div />
        </div>
      </header>

      <main className="px-6 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] bg-gradient-to-br from-green-600 to-sky-600 p-10 text-white shadow-xl shadow-slate-200/20">
            <div className="max-w-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Digital Agriculture for Every Farmer</p>
              <h2 className="mt-6 text-3xl font-semibold sm:text-4xl">Smart farm insights, local market clarity, and better harvest decisions.</h2>
              <p className="mt-6 text-base leading-7 text-slate-100 sm:text-lg">
                EcoFarm helps farmers plan irrigation, protect crops, and capture better prices with weather alerts, advisory guidance, and field tracking in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-green-700 shadow-md shadow-slate-800/10 hover:bg-slate-100">
                  Log In to Access Dashboard
                </Link>
                <Link href="/register" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20">
                  Create Account
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/80 p-6 shadow-lg shadow-slate-200/10 backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Why EcoFarm</p>
              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <p>• Forecast weather threats and plan irrigation with confidence.</p>
                <p>• Monitor market prices daily to choose the best selling time.</p>
                <p>• Track farm activity, pest risk, and crop progress from one dashboard.</p>
                <p>• Use AI-driven advisories tailored to local crop conditions.</p>
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-white p-6 shadow-lg shadow-slate-200/10">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Farmer Benefits</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { title: 'Save time', description: 'One dashboard for weather, pricing and field records.' },
                  { title: 'Boost income', description: 'Make market-ready decisions with price alerts.' },
                  { title: 'Protect yield', description: 'Catch pests, diseases and irrigation needs early.' },
                  { title: 'Act local', description: 'Receive insights designed for your farm and region.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200 p-4">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
