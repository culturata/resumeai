'use client';

import { useEffect, useState } from 'react';
import { Upload, FileText, Trash2, Download, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Resume {
  id: string;
  originalFileName: string;
  originalFileUrl: string;
  fileType: 'PDF' | 'MARKDOWN';
  createdAt: string;
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'paste'>('file');
  const [pastedText, setPastedText] = useState('');
  const [resumeName, setResumeName] = useState('');
  const router = useRouter();

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

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchResumes();
        e.target.value = '';
      } else {
        const error = await response.text();
        alert(`Upload failed: ${error}`);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  }

  async function handlePasteSubmit() {
    if (!pastedText.trim() || !resumeName.trim()) {
      alert('Please provide both a resume name and content');
      return;
    }

    setUploading(true);

    try {
      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: pastedText,
          fileName: resumeName.endsWith('.md') ? resumeName : `${resumeName}.md`,
        }),
      });

      if (response.ok) {
        await fetchResumes();
        setPastedText('');
        setResumeName('');
      } else {
        const error = await response.text();
        alert(`Upload failed: ${error}`);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#7A9B92] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl text-[#2C3E3C] mb-2">
          Your Resumes
        </h1>
        <p className="text-[#2C3E3C]/60">
          Upload and manage your resume files
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-[#2C3E3C]/20 hover:border-[#7A9B92] transition-colors">
        {/* Mode Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setUploadMode('file')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              uploadMode === 'file'
                ? 'bg-[#2C3E3C] text-[#FDFBF7]'
                : 'bg-[#2C3E3C]/10 text-[#2C3E3C] hover:bg-[#2C3E3C]/20'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setUploadMode('paste')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              uploadMode === 'paste'
                ? 'bg-[#2C3E3C] text-[#FDFBF7]'
                : 'bg-[#2C3E3C]/10 text-[#2C3E3C] hover:bg-[#2C3E3C]/20'
            }`}
          >
            Paste Text
          </button>
        </div>

        {uploadMode === 'file' ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#7A9B92]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-[#7A9B92]" />
            </div>
            <h3 className="font-serif text-xl text-[#2C3E3C] mb-2">
              Upload Resume
            </h3>
            <p className="text-[#2C3E3C]/60 mb-6 max-w-md mx-auto">
              Upload your resume in PDF or Markdown format. Files are stored for your records.
            </p>
            <div className="bg-[#7A9B92]/10 border border-[#7A9B92]/20 rounded-lg p-3 mb-4 max-w-md mx-auto">
              <p className="text-xs text-[#2C3E3C]/70">
                💡 Tip: For best AI optimization results, use "Paste Text" instead. PDF text extraction may not work in all environments.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 bg-[#2C3E3C] text-[#FDFBF7] px-8 py-4 rounded-full text-base font-medium hover:bg-[#1a2624] transition-all hover:scale-105 cursor-pointer">
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Choose File
                </>
              )}
              <input
                type="file"
                accept=".pdf,.md,.markdown"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            <p className="text-xs text-[#2C3E3C]/40 mt-4">
              Supported formats: PDF, Markdown (.md) • Max size: 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-[#7A9B92]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#7A9B92]" />
            </div>
            <h3 className="font-serif text-xl text-[#2C3E3C] mb-2 text-center">
              Paste Resume Text
            </h3>
            <p className="text-[#2C3E3C]/60 mb-6 max-w-md mx-auto text-center">
              Copy and paste your resume content directly. Great for plain text resumes.
            </p>

            <input
              type="text"
              placeholder="Resume Name (e.g., My Resume)"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              className="w-full px-4 py-3 border border-[#2C3E3C]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A9B92] focus:border-transparent"
            />

            <textarea
              placeholder="Paste your resume content here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-[#2C3E3C]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A9B92] focus:border-transparent font-mono text-sm resize-y"
            />

            <button
              onClick={handlePasteSubmit}
              disabled={uploading || !pastedText.trim() || !resumeName.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#2C3E3C] text-[#FDFBF7] px-8 py-4 rounded-full text-base font-medium hover:bg-[#1a2624] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Save Resume
                </>
              )}
            </button>

            <p className="text-xs text-[#2C3E3C]/40 text-center">
              Your pasted text will be saved as a Markdown file
            </p>
          </div>
        )}
      </div>

      {/* Resumes List */}
      <div className="bg-white rounded-2xl p-8 border border-[#2C3E3C]/5">
        <h2 className="font-serif text-2xl text-[#2C3E3C] mb-6">Uploaded Resumes</h2>

        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-[#2C3E3C]/20 mx-auto mb-4" />
            <p className="text-[#2C3E3C]/60">No resumes uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-[#2C3E3C]/5 hover:border-[#7A9B92]/30 hover:bg-[#7A9B92]/5 transition-all"
              >
                <div className="w-12 h-12 bg-[#7A9B92]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#7A9B92]" />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-[#2C3E3C] mb-1">
                    {resume.originalFileName}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-[#2C3E3C]/60">
                    <span className="px-2 py-0.5 bg-[#2C3E3C]/10 rounded text-xs">
                      {resume.fileType}
                    </span>
                    <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={resume.originalFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-[#7A9B92]/10 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5 text-[#2C3E3C]/60" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      {resumes.length > 0 && (
        <div className="bg-[#7A9B92]/10 border border-[#7A9B92]/20 rounded-2xl p-6">
          <h3 className="font-medium text-[#2C3E3C] mb-2">Ready to apply?</h3>
          <p className="text-[#2C3E3C]/60 mb-4">
            Use your uploaded resumes to create optimized applications for specific jobs.
          </p>
          <button
            onClick={() => router.push('/dashboard/applications/new')}
            className="bg-[#2C3E3C] text-[#FDFBF7] px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a2624] transition-all"
          >
            Create New Application
          </button>
        </div>
      )}
    </div>
  );
}
