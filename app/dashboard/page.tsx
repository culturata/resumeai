import { getCurrentUser, checkSubscriptionStatus } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight, FileText, Briefcase, TrendingUp, Upload } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { isSubscribed, isFree } = await checkSubscriptionStatus();

  // Get stats
  const [resumeCount, applicationCount, recentApplications] = await Promise.all([
    prisma.resume.count({ where: { userId: user.id } }),
    prisma.jobApplication.count({ where: { userId: user.id } }),
    prisma.jobApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        resume: true,
      },
    }),
  ]);

  // Count applications by status
  const [draftCount, appliedCount, interviewingCount] = await Promise.all([
    prisma.jobApplication.count({ where: { userId: user.id, status: 'DRAFT' } }),
    prisma.jobApplication.count({ where: { userId: user.id, status: 'APPLIED' } }),
    prisma.jobApplication.count({ where: { userId: user.id, status: 'INTERVIEWING' } }),
  ]);

  // Calculate usage for free tier
  let usageCount = 0;
  if (isFree) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    usageCount = await prisma.jobApplication.count({
      where: {
        userId: user.id,
        createdAt: { gte: thirtyDaysAgo },
      },
    });
  }

  const statusColors = {
    DRAFT: 'bg-gray-100 text-gray-700',
    APPLIED: 'bg-blue-100 text-blue-700',
    INTERVIEWING: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    ACCEPTED: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl text-[#2C3E3C] mb-2">
          Welcome back!
        </h1>
        <p className="text-[#2C3E3C]/60">
          Track your job search progress and optimize your applications
        </p>
      </div>

      {/* Subscription Status */}
      {isFree && (
        <div className="bg-gradient-to-r from-[#7A9B92]/10 to-[#B8927D]/10 border border-[#7A9B92]/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-[#2C3E3C] mb-1">Free Plan</h3>
              <p className="text-[#2C3E3C]/60 text-sm">
                You've used {usageCount} of 3 optimizations this month
              </p>
            </div>
            <Link
              href="/dashboard/billing"
              className="bg-[#2C3E3C] text-[#FDFBF7] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1a2624] transition-all hover:scale-105"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#2C3E3C]/5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#7A9B92]/10 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#7A9B92]" />
            </div>
          </div>
          <div className="text-3xl font-serif text-[#2C3E3C] mb-1">{resumeCount}</div>
          <div className="text-sm text-[#2C3E3C]/60">Total Resumes</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#2C3E3C]/5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#B8927D]/10 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#B8927D]" />
            </div>
          </div>
          <div className="text-3xl font-serif text-[#2C3E3C] mb-1">{applicationCount}</div>
          <div className="text-sm text-[#2C3E3C]/60">Applications</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#2C3E3C]/5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-serif text-[#2C3E3C] mb-1">{appliedCount}</div>
          <div className="text-sm text-[#2C3E3C]/60">Applied</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#2C3E3C]/5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-serif text-[#2C3E3C] mb-1">{interviewingCount}</div>
          <div className="text-sm text-[#2C3E3C]/60">Interviewing</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-8 border border-[#2C3E3C]/5">
        <h2 className="font-serif text-2xl text-[#2C3E3C] mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/resumes"
            className="group flex items-center gap-4 p-6 rounded-xl border-2 border-[#2C3E3C]/10 hover:border-[#7A9B92] hover:bg-[#7A9B92]/5 transition-all"
          >
            <div className="w-12 h-12 bg-[#7A9B92]/10 rounded-xl flex items-center justify-center group-hover:bg-[#7A9B92]/20 transition-colors">
              <Upload className="w-6 h-6 text-[#7A9B92]" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[#2C3E3C] mb-1">Upload Resume</h3>
              <p className="text-sm text-[#2C3E3C]/60">Upload a new resume to get started</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#2C3E3C]/40 group-hover:text-[#7A9B92] group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/dashboard/applications/new"
            className="group flex items-center gap-4 p-6 rounded-xl border-2 border-[#2C3E3C]/10 hover:border-[#B8927D] hover:bg-[#B8927D]/5 transition-all"
          >
            <div className="w-12 h-12 bg-[#B8927D]/10 rounded-xl flex items-center justify-center group-hover:bg-[#B8927D]/20 transition-colors">
              <Briefcase className="w-6 h-6 text-[#B8927D]" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[#2C3E3C] mb-1">New Application</h3>
              <p className="text-sm text-[#2C3E3C]/60">Optimize your resume for a job</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#2C3E3C]/40 group-hover:text-[#B8927D] group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl p-8 border border-[#2C3E3C]/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-[#2C3E3C]">Recent Applications</h2>
          <Link
            href="/dashboard/applications"
            className="text-sm text-[#7A9B92] hover:text-[#6a8b82] font-medium flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-[#2C3E3C]/20 mx-auto mb-4" />
            <p className="text-[#2C3E3C]/60 mb-4">No applications yet</p>
            <Link
              href="/dashboard/applications/new"
              className="inline-flex items-center gap-2 bg-[#2C3E3C] text-[#FDFBF7] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1a2624] transition-all"
            >
              Create Your First Application
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentApplications.map((app: typeof recentApplications[0]) => (
              <Link
                key={app.id}
                href={`/dashboard/applications/${app.id}`}
                className="block p-4 rounded-xl border border-[#2C3E3C]/5 hover:border-[#7A9B92]/30 hover:bg-[#7A9B92]/5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#2C3E3C] mb-1">{app.jobTitle}</h3>
                    <p className="text-sm text-[#2C3E3C]/60">{app.companyName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status as keyof typeof statusColors]}`}>
                      {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                    </span>
                    <span className="text-sm text-[#2C3E3C]/40">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
