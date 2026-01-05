import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { LayoutDashboard, FileText, Briefcase, CreditCard } from 'lucide-react';

// Force dynamic rendering for all dashboard pages to prevent build-time errors
export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-[#2C3E3C]/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-serif tracking-tight text-[#2C3E3C]">
            ResumeAI
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar Navigation */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-[#2C3E3C]/10 p-6">
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#2C3E3C] hover:bg-[#7A9B92]/10 transition-colors group"
            >
              <LayoutDashboard className="w-5 h-5 text-[#2C3E3C]/60 group-hover:text-[#7A9B92]" />
              <span className="font-medium">Overview</span>
            </Link>

            <Link
              href="/dashboard/resumes"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#2C3E3C] hover:bg-[#7A9B92]/10 transition-colors group"
            >
              <FileText className="w-5 h-5 text-[#2C3E3C]/60 group-hover:text-[#7A9B92]" />
              <span className="font-medium">Resumes</span>
            </Link>

            <Link
              href="/dashboard/applications"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#2C3E3C] hover:bg-[#7A9B92]/10 transition-colors group"
            >
              <Briefcase className="w-5 h-5 text-[#2C3E3C]/60 group-hover:text-[#7A9B92]" />
              <span className="font-medium">Applications</span>
            </Link>

            <Link
              href="/dashboard/billing"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#2C3E3C] hover:bg-[#7A9B92]/10 transition-colors group"
            >
              <CreditCard className="w-5 h-5 text-[#2C3E3C]/60 group-hover:text-[#7A9B92]" />
              <span className="font-medium">Billing</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
