'use client';

import { useEffect, useState } from 'react';
import { Loader2, Sparkles, FileText, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Resume {
  id: string;
  originalFileName: string;
  fileType: 'PDF' | 'MARKDOWN';
}

export default function NewApplicationPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    resumeId: '',
    jobTitle: '',
    companyName: '',
    jobDescriptionText: '',
    jobDescriptionUrl: '',
  });

  useEffect(() => {
    fetchResumes();
  }, []);

  async function fetchResumes() {
    try {
      const response = await fetch('/api/upload/resume');
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setOptimizing(true);

    try {
      const response = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const application = await response.json();
      router.push(`/dashboard/applications/${application.id}`);
    } catch (error: any) {
      console.error('Error creating application:', error);
      setError(error.message || 'Failed to create application');
    } finally {
      setOptimizing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#7A9B92] animate-spin" />
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-12 border border-[#2C3E3C]/5 text-center">
          <FileText className="w-16 h-16 text-[#2C3E3C]/20 mx-auto mb-6" />
          <h2 className="font-serif text-2xl text-[#2C3E3C] mb-3">
            No Resumes Found
          </h2>
          <p className="text-[#2C3E3C]/60 mb-6">
            You need to upload a resume before creating an application
          </p>
          <button
            onClick={() => router.push('/dashboard/resumes')}
            className="bg-[#2C3E3C] text-[#FDFBF7] px-8 py-3 rounded-full text-base font-medium hover:bg-[#1a2624] transition-all"
          >
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl text-[#2C3E3C] mb-2">
          New Application
        </h1>
        <p className="text-[#2C3E3C]/60">
          Create an ATS-optimized resume for a specific job
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-[#2C3E3C]/5 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900 mb-1">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Resume Selection */}
        <div>
          <label className="block text-sm font-medium text-[#2C3E3C] mb-2">
            Select Resume
          </label>
          <select
            value={formData.resumeId}
            onChange={(e) => setFormData({ ...formData, resumeId: e.target.value })}
            required
            className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#2C3E3C]/20 rounded-xl text-[#2C3E3C] focus:outline-none focus:ring-2 focus:ring-[#7A9B92] focus:border-transparent"
          >
            <option value="">Choose a resume...</option>
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.originalFileName}
              </option>
            ))}
          </select>
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-[#2C3E3C] mb-2">
            Job Title
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            required
            placeholder="e.g. Senior Software Engineer"
            className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#2C3E3C]/20 rounded-xl text-[#2C3E3C] placeholder:text-[#2C3E3C]/40 focus:outline-none focus:ring-2 focus:ring-[#7A9B92] focus:border-transparent"
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-[#2C3E3C] mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
            placeholder="e.g. Tech Company Inc."
            className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#2C3E3C]/20 rounded-xl text-[#2C3E3C] placeholder:text-[#2C3E3C]/40 focus:outline-none focus:ring-2 focus:ring-[#7A9B92] focus:border-transparent"
          />
        </div>

        {/* Job Description URL */}
        <div>
          <label className="block text-sm font-medium text-[#2C3E3C] mb-2">
            Job Posting URL (Optional)
          </label>
          <input
            type="url"
            value={formData.jobDescriptionUrl}
            onChange={(e) => setFormData({ ...formData, jobDescriptionUrl: e.target.value })}
            placeholder="https://example.com/jobs/123"
            className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#2C3E3C]/20 rounded-xl text-[#2C3E3C] placeholder:text-[#2C3E3C]/40 focus:outline-none focus:ring-2 focus:ring-[#7A9B92] focus:border-transparent"
          />
          <p className="text-xs text-[#2C3E3C]/60 mt-2">
            We'll try to extract the job description from this URL
          </p>
        </div>

        {/* Job Description Text */}
        <div>
          <label className="block text-sm font-medium text-[#2C3E3C] mb-2">
            Job Description
          </label>
          <textarea
            value={formData.jobDescriptionText}
            onChange={(e) => setFormData({ ...formData, jobDescriptionText: e.target.value })}
            required={!formData.jobDescriptionUrl}
            rows={8}
            placeholder="Paste the full job description here..."
            className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#2C3E3C]/20 rounded-xl text-[#2C3E3C] placeholder:text-[#2C3E3C]/40 focus:outline-none focus:ring-2 focus:ring-[#7A9B92] focus:border-transparent resize-none"
          />
          <p className="text-xs text-[#2C3E3C]/60 mt-2">
            {formData.jobDescriptionUrl ? 'Optional if URL is provided' : 'Required if no URL provided'}
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={optimizing}
            className="w-full flex items-center justify-center gap-2 bg-[#2C3E3C] text-[#FDFBF7] px-8 py-4 rounded-full text-base font-medium hover:bg-[#1a2624] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {optimizing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Optimizing Resume...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Optimize Resume
              </>
            )}
          </button>
          <p className="text-xs text-center text-[#2C3E3C]/60 mt-3">
            This may take 10-30 seconds while AI analyzes the job description
          </p>
        </div>
      </form>

      {/* Info Box */}
      <div className="bg-[#7A9B92]/10 border border-[#7A9B92]/20 rounded-2xl p-6">
        <h3 className="font-medium text-[#2C3E3C] mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#7A9B92]" />
          How it works
        </h3>
        <ul className="space-y-2 text-sm text-[#2C3E3C]/70">
          <li>• Our AI analyzes the job description to identify key requirements</li>
          <li>• Your resume is optimized with relevant keywords and formatting</li>
          <li>• The result is ATS-friendly and tailored to the specific role</li>
          <li>• You can then generate a matching cover letter</li>
        </ul>
      </div>
    </div>
  );
}
