'use client';

import { useEffect, useState } from 'react';
import { Loader2, FileText, Mail, Copy, Check, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  jobDescriptionText: string;
  jobDescriptionUrl: string | null;
  optimizedResumeContent: string;
  status: 'DRAFT' | 'APPLIED' | 'INTERVIEWING' | 'REJECTED' | 'ACCEPTED';
  createdAt: string;
  appliedAt: string | null;
  notes: string | null;
  coverLetters: Array<{
    id: string;
    content: string;
    createdAt: string;
  }>;
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [params.id]);

  async function fetchApplication() {
    try {
      const response = await fetch(`/api/applications/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setApplication(data);
      } else if (response.status === 404) {
        router.push('/dashboard/applications');
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  }

  async function generateCoverLetter() {
    if (!application) return;

    setGeneratingCoverLetter(true);
    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobApplicationId: application.id }),
      });

      if (response.ok) {
        await fetchApplication();
      } else {
        const error = await response.text();
        alert(`Failed to generate cover letter: ${error}`);
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      alert('Failed to generate cover letter');
    } finally {
      setGeneratingCoverLetter(false);
    }
  }

  async function updateStatus(newStatus: Application['status']) {
    if (!application) return;

    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchApplication();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  }

  function copyToClipboard(text: string, type: 'resume' | 'coverLetter') {
    navigator.clipboard.writeText(text);
    if (type === 'resume') {
      setCopiedResume(true);
      setTimeout(() => setCopiedResume(false), 2000);
    } else {
      setCopiedCoverLetter(true);
      setTimeout(() => setCopiedCoverLetter(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#7A9B92] animate-spin" />
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const statusColors = {
    DRAFT: 'bg-gray-100 text-gray-700',
    APPLIED: 'bg-blue-100 text-blue-700',
    INTERVIEWING: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    ACCEPTED: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <Link
        href="/dashboard/applications"
        className="inline-flex items-center gap-2 text-[#2C3E3C]/60 hover:text-[#2C3E3C] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Applications
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl p-8 border border-[#2C3E3C]/5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-serif text-3xl text-[#2C3E3C] mb-2">
              {application.jobTitle}
            </h1>
            <p className="text-xl text-[#2C3E3C]/60">{application.companyName}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[application.status]}`}>
            {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-[#2C3E3C]/60 mb-6">
          <span>Created: {new Date(application.createdAt).toLocaleDateString()}</span>
          {application.appliedAt && (
            <>
              <span>•</span>
              <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
            </>
          )}
        </div>

        {/* Status Update */}
        <div>
          <label className="block text-sm font-medium text-[#2C3E3C] mb-2">
            Update Status
          </label>
          <div className="flex flex-wrap gap-2">
            {(['DRAFT', 'APPLIED', 'INTERVIEWING', 'REJECTED', 'ACCEPTED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                disabled={updatingStatus || application.status === status}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  application.status === status
                    ? 'bg-[#2C3E3C] text-[#FDFBF7]'
                    : 'bg-[#2C3E3C]/5 text-[#2C3E3C] hover:bg-[#2C3E3C]/10 disabled:opacity-50'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Optimized Resume */}
      <div className="bg-white rounded-2xl p-8 border border-[#2C3E3C]/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-[#2C3E3C] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#7A9B92]" />
            Optimized Resume
          </h2>
          <button
            onClick={() => copyToClipboard(application.optimizedResumeContent, 'resume')}
            className="flex items-center gap-2 px-4 py-2 bg-[#7A9B92]/10 text-[#7A9B92] rounded-lg hover:bg-[#7A9B92]/20 transition-colors text-sm font-medium"
          >
            {copiedResume ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>

        <div className="bg-[#FDFBF7] rounded-xl p-6 border border-[#2C3E3C]/10">
          <pre className="whitespace-pre-wrap font-mono text-sm text-[#2C3E3C] leading-relaxed">
            {application.optimizedResumeContent}
          </pre>
        </div>
      </div>

      {/* Cover Letter */}
      <div className="bg-white rounded-2xl p-8 border border-[#2C3E3C]/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-[#2C3E3C] flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#B8927D]" />
            Cover Letter
          </h2>
          {application.coverLetters.length > 0 && (
            <button
              onClick={() => copyToClipboard(application.coverLetters[0].content, 'coverLetter')}
              className="flex items-center gap-2 px-4 py-2 bg-[#B8927D]/10 text-[#B8927D] rounded-lg hover:bg-[#B8927D]/20 transition-colors text-sm font-medium"
            >
              {copiedCoverLetter ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>

        {application.coverLetters.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-[#2C3E3C]/20 mx-auto mb-4" />
            <p className="text-[#2C3E3C]/60 mb-4">No cover letter generated yet</p>
            <button
              onClick={generateCoverLetter}
              disabled={generatingCoverLetter}
              className="inline-flex items-center gap-2 bg-[#2C3E3C] text-[#FDFBF7] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1a2624] transition-all disabled:opacity-50"
            >
              {generatingCoverLetter ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Generate Cover Letter
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-[#FDFBF7] rounded-xl p-6 border border-[#2C3E3C]/10">
            <pre className="whitespace-pre-wrap font-mono text-sm text-[#2C3E3C] leading-relaxed">
              {application.coverLetters[0].content}
            </pre>
          </div>
        )}
      </div>

      {/* Job Description */}
      <div className="bg-white rounded-2xl p-8 border border-[#2C3E3C]/5">
        <h2 className="font-serif text-2xl text-[#2C3E3C] mb-4">
          Job Description
        </h2>
        {application.jobDescriptionUrl && (
          <p className="text-sm text-[#2C3E3C]/60 mb-4">
            Source:{' '}
            <a
              href={application.jobDescriptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7A9B92] hover:underline"
            >
              {application.jobDescriptionUrl}
            </a>
          </p>
        )}
        <div className="bg-[#FDFBF7] rounded-xl p-6 border border-[#2C3E3C]/10">
          <pre className="whitespace-pre-wrap text-sm text-[#2C3E3C] leading-relaxed">
            {application.jobDescriptionText}
          </pre>
        </div>
      </div>
    </div>
  );
}
