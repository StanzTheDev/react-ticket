// app/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user && typeof window !== 'undefined') {
      const savedTickets = localStorage.getItem(`tickets_${user.id}`);
      if (savedTickets) {
        setTickets(JSON.parse(savedTickets));
      } else {
        setTickets([]);
        localStorage.setItem(`tickets_${user.id}`, JSON.stringify([]));
      }
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  };

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-slate-900">Paseo</span>
              </div>
              <nav className="hidden md:flex space-x-1">
                <Link href="/dashboard" className="px-3 py-2 text-sm text-slate-900 bg-slate-100 rounded-lg font-medium">
                  Dashboard
                </Link>
                <Link href="/tickets" className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition">
                  Tickets
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Hello, {user.name}</span>
              <button 
                onClick={handleLogout}
                className="text-sm text-slate-600 hover:text-slate-900 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">
            Welcome back, {user.name}
          </h1>
          <p className="text-slate-600 text-sm">Here's your dashboard overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-600">Total Tickets</h3>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-slate-900">{stats.total}</p>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-600">Open</h3>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-slate-900">{stats.open}</p>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-600">In Progress</h3>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-slate-900">{stats.inProgress}</p>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-600">Resolved</h3>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-slate-900">{stats.closed}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/tickets" 
              className="bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition text-sm font-medium inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Manage Tickets
            </Link>
            <Link 
              href="/tickets" 
              className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-200 transition text-sm font-medium inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Ticket
            </Link>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Recent Tickets</h2>
          <div className="space-y-3">
            {recentTickets.length === 0 ? (
              <p className="text-slate-600 text-sm py-4 text-center">No tickets found. Create your first ticket to get started.</p>
            ) : (
              recentTickets.map(ticket => (
                <div key={ticket.id} className="flex items-start justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 text-sm mb-1">{ticket.title}</h3>
                    <p className="text-sm text-slate-600 truncate">{ticket.description}</p>
                  </div>
                  <span className={`ml-4 px-2.5 py-1 rounded-md text-xs font-medium border flex-shrink-0 ${
                    ticket.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    ticket.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link 
              href="/tickets" 
              className="text-sm text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
            >
              View all tickets
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}