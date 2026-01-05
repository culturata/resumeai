import Link from 'next/link';
import { ArrowRight, Sparkles, Target, FileText, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#FDFBF7]/80 backdrop-blur-md z-50 border-b border-[#2C3E3C]/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-serif tracking-tight text-[#2C3E3C]">
            ResumeAI
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/sign-in"
              className="text-[#2C3E3C]/70 hover:text-[#2C3E3C] transition-colors text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="bg-[#2C3E3C] text-[#FDFBF7] px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a2624] transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <div className="flex items-center gap-2 bg-[#7A9B92]/10 text-[#7A9B92] px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Optimization
                </div>
              </div>

              <h1 className="font-serif text-6xl lg:text-7xl leading-[1.1] text-[#2C3E3C] tracking-tight">
                Your Resume,
                <br />
                <span className="italic text-[#7A9B92]">Optimized</span>
                <br />
                for Success
              </h1>

              <p className="text-xl text-[#2C3E3C]/60 leading-relaxed max-w-lg font-light">
                Stop losing opportunities to Applicant Tracking Systems.
                Our AI analyzes job descriptions and tailors your resume to pass ATS filters
                and land interviews.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/sign-up"
                  className="group bg-[#2C3E3C] text-[#FDFBF7] px-8 py-4 rounded-full text-base font-medium hover:bg-[#1a2624] transition-all hover:scale-105 flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#pricing"
                  className="border-2 border-[#2C3E3C] text-[#2C3E3C] px-8 py-4 rounded-full text-base font-medium hover:bg-[#2C3E3C] hover:text-[#FDFBF7] transition-all inline-block"
                >
                  View Pricing
                </a>
              </div>

              <div className="flex items-center gap-8 pt-8 text-sm">
                <div>
                  <div className="text-3xl font-serif text-[#2C3E3C]">94%</div>
                  <div className="text-[#2C3E3C]/50">ATS Pass Rate</div>
                </div>
                <div className="h-12 w-px bg-[#2C3E3C]/10" />
                <div>
                  <div className="text-3xl font-serif text-[#2C3E3C]">3x</div>
                  <div className="text-[#2C3E3C]/50">More Interviews</div>
                </div>
                <div className="h-12 w-px bg-[#2C3E3C]/10" />
                <div>
                  <div className="text-3xl font-serif text-[#2C3E3C]">10k+</div>
                  <div className="text-[#2C3E3C]/50">Happy Users</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-[#7A9B92]/20 p-8 border border-[#2C3E3C]/5">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-[#7A9B92]/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-[#7A9B92]" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-[#2C3E3C]/10 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-[#2C3E3C]/5 rounded w-full mb-1" />
                      <div className="h-3 bg-[#2C3E3C]/5 rounded w-5/6" />
                    </div>
                  </div>

                  <div className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="w-12 h-12 rounded-full bg-[#B8927D]/10 flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-[#B8927D]" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-[#2C3E3C]/10 rounded w-2/3 mb-2" />
                      <div className="h-3 bg-[#2C3E3C]/5 rounded w-full mb-1" />
                      <div className="h-3 bg-[#2C3E3C]/5 rounded w-4/5" />
                    </div>
                  </div>

                  <div className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="w-12 h-12 rounded-full bg-[#7A9B92]/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-[#7A9B92]" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-[#2C3E3C]/10 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-[#2C3E3C]/5 rounded w-full mb-1" />
                      <div className="h-3 bg-[#2C3E3C]/5 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#7A9B92]/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#B8927D]/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl text-[#2C3E3C] mb-4">
              Everything You Need to Land Your Next Role
            </h2>
            <p className="text-lg text-[#2C3E3C]/60 max-w-2xl mx-auto">
              Powerful features designed to give you an edge in the job market
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group p-8 rounded-2xl border border-[#2C3E3C]/5 hover:border-[#7A9B92]/30 hover:shadow-xl hover:shadow-[#7A9B92]/10 transition-all duration-300">
              <div className="w-14 h-14 bg-[#7A9B92]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#7A9B92]/20 transition-all">
                <Sparkles className="w-7 h-7 text-[#7A9B92]" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C3E3C] mb-3">
                AI Optimization
              </h3>
              <p className="text-[#2C3E3C]/60 leading-relaxed">
                Our AI analyzes job descriptions and optimizes your resume with relevant keywords and formatting
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-[#2C3E3C]/5 hover:border-[#B8927D]/30 hover:shadow-xl hover:shadow-[#B8927D]/10 transition-all duration-300">
              <div className="w-14 h-14 bg-[#B8927D]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#B8927D]/20 transition-all">
                <Target className="w-7 h-7 text-[#B8927D]" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C3E3C] mb-3">
                ATS Compliance
              </h3>
              <p className="text-[#2C3E3C]/60 leading-relaxed">
                Ensure your resume passes Applicant Tracking Systems with proper formatting and structure
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-[#2C3E3C]/5 hover:border-[#7A9B92]/30 hover:shadow-xl hover:shadow-[#7A9B92]/10 transition-all duration-300">
              <div className="w-14 h-14 bg-[#7A9B92]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#7A9B92]/20 transition-all">
                <FileText className="w-7 h-7 text-[#7A9B92]" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C3E3C] mb-3">
                Cover Letters
              </h3>
              <p className="text-[#2C3E3C]/60 leading-relaxed">
                Generate personalized cover letters that complement your optimized resume
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-[#2C3E3C]/5 hover:border-[#B8927D]/30 hover:shadow-xl hover:shadow-[#B8927D]/10 transition-all duration-300">
              <div className="w-14 h-14 bg-[#B8927D]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#B8927D]/20 transition-all">
                <TrendingUp className="w-7 h-7 text-[#B8927D]" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C3E3C] mb-3">
                Application Tracking
              </h3>
              <p className="text-[#2C3E3C]/60 leading-relaxed">
                Track all your applications in one place and never lose sight of opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl text-[#2C3E3C] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-[#2C3E3C]/60">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-3xl p-10 border-2 border-[#2C3E3C]/10 hover:border-[#7A9B92]/30 transition-all hover:shadow-2xl hover:shadow-[#7A9B92]/10">
              <div className="mb-8">
                <h3 className="font-serif text-3xl text-[#2C3E3C] mb-2">Free</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-serif text-[#2C3E3C]">$0</span>
                  <span className="text-[#2C3E3C]/50">/month</span>
                </div>
                <p className="text-[#2C3E3C]/60">Perfect for trying out the platform</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#7A9B92]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#7A9B92]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#2C3E3C]/70">3 resume optimizations per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#7A9B92]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#7A9B92]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#2C3E3C]/70">Basic ATS compliance check</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#7A9B92]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#7A9B92]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#2C3E3C]/70">Application tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#2C3E3C]/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#2C3E3C]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-[#2C3E3C]/30">Cover letter generation</span>
                </li>
              </ul>

              <Link
                href="/sign-up"
                className="block w-full text-center border-2 border-[#2C3E3C] text-[#2C3E3C] px-8 py-4 rounded-full text-base font-medium hover:bg-[#2C3E3C] hover:text-[#FDFBF7] transition-all"
              >
                Start Free
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="bg-[#2C3E3C] text-[#FDFBF7] rounded-3xl p-10 border-2 border-[#7A9B92] relative overflow-hidden hover:scale-105 transition-transform shadow-2xl shadow-[#2C3E3C]/20">
              <div className="absolute top-6 right-6">
                <div className="bg-[#7A9B92] text-[#FDFBF7] px-4 py-1.5 rounded-full text-xs font-medium">
                  POPULAR
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-serif text-3xl mb-2">Premium</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-serif">$19.99</span>
                  <span className="text-[#FDFBF7]/50">/month</span>
                </div>
                <p className="text-[#FDFBF7]/60">For serious job seekers</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#7A9B92] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#FDFBF7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#FDFBF7]/90">Unlimited resume optimizations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#7A9B92] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#FDFBF7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#FDFBF7]/90">Advanced ATS analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#7A9B92] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#FDFBF7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#FDFBF7]/90">Unlimited cover letters</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#7A9B92] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#FDFBF7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#FDFBF7]/90">Priority support</span>
                </li>
              </ul>

              <Link
                href="/sign-up"
                className="block w-full text-center bg-[#7A9B92] text-[#FDFBF7] px-8 py-4 rounded-full text-base font-medium hover:bg-[#6a8b82] transition-all"
              >
                Get Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#2C3E3C] text-[#FDFBF7]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-5xl mb-6">
            Ready to Beat the ATS?
          </h2>
          <p className="text-xl text-[#FDFBF7]/70 mb-10 max-w-2xl mx-auto">
            Join thousands of job seekers who have landed their dream roles with optimized resumes
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-[#7A9B92] text-[#FDFBF7] px-10 py-5 rounded-full text-lg font-medium hover:bg-[#6a8b82] transition-all hover:scale-105"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#FDFBF7] border-t border-[#2C3E3C]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-serif text-[#2C3E3C]">
              ResumeAI
            </div>
            <div className="text-sm text-[#2C3E3C]/50">
              © 2025 ResumeAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
