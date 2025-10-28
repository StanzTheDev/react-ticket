// app/tickets/page.js
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TicketsPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filter, setFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});

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

  const updateTickets = (newTickets) => {
    setTickets(newTickets);
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem(`tickets_${user.id}`, JSON.stringify(newTickets));
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newTicket = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.id // Associate ticket with user
    };

    const updatedTickets = [...tickets, newTicket];
    updateTickets(updatedTickets);
    setFormData({ title: '', description: '', status: 'open', priority: 'medium' });
    setShowForm(false);
    setErrors({});
  };

  const startEdit = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority
    });
  };

  const handleUpdateTicket = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedTickets = tickets.map(ticket =>
      ticket.id === editingTicket.id 
        ? { ...ticket, ...formData, updatedAt: new Date().toISOString() }
        : ticket
    );

    updateTickets(updatedTickets);
    setEditingTicket(null);
    setFormData({ title: '', description: '', status: 'open', priority: 'medium' });
    setErrors({});
  };

  const handleDeleteTicket = (id) => {
    const updatedTickets = tickets.filter(ticket => ticket.id !== id);
    updateTickets(updatedTickets);
    setDeleteConfirm(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in_progress': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'closed': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'low': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
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
                <Link href="/dashboard" className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition">
                  Dashboard
                </Link>
                <Link href="/tickets" className="px-3 py-2 text-sm text-slate-900 bg-slate-100 rounded-lg font-medium">
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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">Tickets</h1>
            <p className="text-slate-600 text-sm">Manage and track support tickets</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition text-sm font-medium"
          >
            New Ticket
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition text-sm font-medium ${
                filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({tickets.length})
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`px-3 py-1.5 rounded-lg transition text-sm font-medium ${
                filter === 'open' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Open ({tickets.filter(t => t.status === 'open').length})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-3 py-1.5 rounded-lg transition text-sm font-medium ${
                filter === 'in_progress' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              In Progress ({tickets.filter(t => t.status === 'in_progress').length})
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`px-3 py-1.5 rounded-lg transition text-sm font-medium ${
                filter === 'closed' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Closed ({tickets.filter(t => t.status === 'closed').length})
            </button>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No tickets found</h3>
              <p className="text-slate-600 text-sm mb-4">
                {filter === 'all' 
                  ? "Create your first ticket to get started" 
                  : `No ${filter.replace('_', ' ')} tickets`}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition text-sm font-medium"
              >
                New Ticket
              </button>
            </div>
          ) : (
            filteredTickets.map(ticket => (
              <div key={ticket.id} className="bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-300 transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-900 mb-1">{ticket.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{ticket.description}</p>
                  </div>
                  <div className="flex space-x-3 ml-4">
                    <button
                      onClick={() => startEdit(ticket)}
                      className="text-slate-600 hover:text-slate-900 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(ticket)}
                      className="text-slate-600 hover:text-rose-600 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded-md font-medium border ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                  
                  <span className={`px-2 py-1 rounded-md font-medium border ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  
                  <span className="text-slate-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        {(showForm || editingTicket) && (
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-5">
                  {editingTicket ? 'Edit Ticket' : 'New Ticket'}
                </h2>
                
                <form onSubmit={editingTicket ? handleUpdateTicket : handleCreateTicket} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition text-slate-900 ${
                        errors.title ? 'border-rose-300' : 'border-slate-300'
                      }`}
                      placeholder="Enter ticket title"
                    />
                    {errors.title && <p className="text-rose-600 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition text-slate-900 ${
                        errors.description ? 'border-rose-300' : 'border-slate-300'
                      }`}
                      placeholder="Describe the issue..."
                    />
                    {errors.description && <p className="text-rose-600 text-xs mt-1">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition text-slate-900"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition text-slate-900"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-5 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingTicket(null);
                        setFormData({ title: '', description: '', status: 'open', priority: 'medium' });
                        setErrors({});
                      }}
                      className="px-4 py-2 text-slate-600 hover:text-slate-900 transition text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition text-sm font-medium"
                    >
                      {editingTicket ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-slate-200 w-full max-w-md">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Delete ticket?</h2>
                <p className="text-slate-600 text-sm mb-5">
                  Are you sure you want to delete "<strong>{deleteConfirm.title}</strong>"? This cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteTicket(deleteConfirm.id)}
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}