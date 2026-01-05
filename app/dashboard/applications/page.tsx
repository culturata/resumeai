'use client';

import { useEffect, useState } from 'react';
import { Briefcase, Loader2, Plus, Filter } from 'lucide-react';
import Link from 'next/link';

interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  status: 'DRAFT' | 'APPLIED' | 'INTERVIEWING' | 'REJECTED' | 'ACCEPTED';
  createdAt: string;
  appliedAt: string | null;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const response = await fetch('/api/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }

  const statusColors = {
    DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
    APPLIED: 'bg-blue-100 text-blue-700 border-blue-200',
    INTERVIEWING: 'bg-green-100 text-green-700 border-green-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
    ACCEPTED: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'ALL') return true;
    return app.status === filter;
  });

  const statusCounts = {
    ALL: applications.length,
    DRAFT: applications.filter((a) => a.status === 'DRAFT').length,
    APPLIED: applications.filter((a) => a.status === 'APPLIED').length,
    INTERVIEWING: applications.filter((a) => a.status === 'INTERVIEWING').length,
    REJECTED: applications.filter((a) => a.status === 'REJECTED').length,
    ACCEPTED: applications.filter((a) => a.status === 'ACCEPTED').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#7A9B92] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-[#2C3E3C] mb-2">
            Applications
          </h1>
          <p className="text-[#2C3E3C]/60">
            Track and manage your job applications
          </p>
        </div>
        <Link
          href="/dashboard/applications/new"
          className="flex items-center gap-2 bg-[#2C3E3C] text-[#FDFBF7] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1a2624] transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          New Application
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-[#2C3E3C]/5">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-[#2C3E3C]/60" />
          <span className="font-medium text-[#2C3E3C]">Filter by status</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['ALL', 'DRAFT', 'APPLIED', 'INTERVIEWING', 'REJECTED', 'ACCEPTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-[#2C3E3C] text-[#FDFBF7]'
                  : 'bg-[#2C3E3C]/5 text-[#2C3E3C] hover:bg-[#2C3E3C]/10'
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()} ({statusCounts[status as keyof typeof statusCounts]})
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-2xl p-8 border border-[#2C3E3C]/5">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-[#2C3E3C]/20 mx-auto mb-4" />
            <p className="text-[#2C3E3C]/60 mb-4">
              {filter === 'ALL' ? 'No applications yet' : `No ${filter.toLowerCase()} applications`}
            </p>
            <Link
              href="/dashboard/applications/new"
              className="inline-flex items-center gap-2 bg-[#2C3E3C] text-[#FDFBF7] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1a2624] transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Your First Application
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApplications.map((app) => (
              <Link
                key={app.id}
                href={`/dashboard/applications/${app.id}`}
                className="block p-6 rounded-xl border border-[#2C3E3C]/5 hover:border-[#7A9B92]/30 hover:bg-[#7A9B92]/5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-serif text-xl text-[#2C3E3C] mb-1">
                      {app.jobTitle}
                    </h3>
                    <p className="text-[#2C3E3C]/60">{app.companyName}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[app.status]}`}>
                    {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-[#2C3E3C]/60">
                  <span>Created: {new Date(app.createdAt).toLocaleDateString()}</span>
                  {app.appliedAt && (
                    <>
                      <span>•</span>
                      <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
