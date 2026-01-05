import { getCurrentUser, checkSubscriptionStatus } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CreditCard, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default async function BillingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { isSubscribed, isFree, currentPeriodEnd } = await checkSubscriptionStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl text-[#2C3E3C] mb-2">
          Billing & Subscription
        </h1>
        <p className="text-[#2C3E3C]/60">
          Manage your subscription and payment details
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-2xl p-8 border border-[#2C3E3C]/5">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl text-[#2C3E3C] mb-2">
              Current Plan
            </h2>
            <p className="text-3xl font-serif text-[#7A9B92] mb-4">
              {isSubscribed ? 'Premium' : 'Free'}
            </p>
            {isSubscribed && currentPeriodEnd && (
              <p className="text-sm text-[#2C3E3C]/60">
                Renews on {new Date(currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          <CreditCard className="w-12 h-12 text-[#7A9B92]/20" />
        </div>

        {isSubscribed ? (
          <div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#7A9B92]" />
                <span className="text-[#2C3E3C]">Unlimited resume optimizations</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#7A9B92]" />
                <span className="text-[#2C3E3C]">Unlimited cover letter generation</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#7A9B92]" />
                <span className="text-[#2C3E3C]">Priority support</span>
              </div>
            </div>

            <form action="/api/stripe/create-portal" method="POST">
              <button
                type="submit"
                className="bg-[#2C3E3C] text-[#FDFBF7] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1a2624] transition-all"
              >
                Manage Subscription
              </button>
            </form>
          </div>
        ) : (
          <div>
            <p className="text-[#2C3E3C]/60 mb-6">
              You're currently on the free plan with 3 optimizations per month.
            </p>
            <form action="/api/stripe/create-checkout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#2C3E3C] text-[#FDFBF7] px-8 py-4 rounded-full text-base font-medium hover:bg-[#1a2624] transition-all hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                Upgrade to Premium
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Pricing Comparison */}
      {!isSubscribed && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl p-8 border border-[#2C3E3C]/10">
            <h3 className="font-serif text-2xl text-[#2C3E3C] mb-2">Free</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-serif text-[#2C3E3C]">$0</span>
              <span className="text-[#2C3E3C]/50">/month</span>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7A9B92] flex-shrink-0 mt-0.5" />
                <span className="text-[#2C3E3C]/70">3 resume optimizations per month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7A9B92] flex-shrink-0 mt-0.5" />
                <span className="text-[#2C3E3C]/70">Basic ATS compliance</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7A9B92] flex-shrink-0 mt-0.5" />
                <span className="text-[#2C3E3C]/70">Application tracking</span>
              </li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="bg-[#2C3E3C] text-[#FDFBF7] rounded-2xl p-8 border-2 border-[#7A9B92] relative">
            <div className="absolute top-4 right-4">
              <span className="bg-[#7A9B92] text-[#FDFBF7] px-3 py-1 rounded-full text-xs font-medium">
                POPULAR
              </span>
            </div>

            <h3 className="font-serif text-2xl mb-2">Premium</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-serif">$19.99</span>
              <span className="text-[#FDFBF7]/50">/month</span>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7A9B92] flex-shrink-0 mt-0.5" />
                <span className="text-[#FDFBF7]/90">Unlimited resume optimizations</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7A9B92] flex-shrink-0 mt-0.5" />
                <span className="text-[#FDFBF7]/90">Unlimited cover letters</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7A9B92] flex-shrink-0 mt-0.5" />
                <span className="text-[#FDFBF7]/90">Advanced ATS analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7A9B92] flex-shrink-0 mt-0.5" />
                <span className="text-[#FDFBF7]/90">Priority support</span>
              </li>
            </ul>

            <form action="/api/stripe/create-checkout" method="POST">
              <button
                type="submit"
                className="w-full bg-[#7A9B92] text-[#FDFBF7] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#6a8b82] transition-all"
              >
                Get Premium
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
