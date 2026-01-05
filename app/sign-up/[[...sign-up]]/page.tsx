import { SignUp } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-[#2C3E3C] mb-2">
            Get Started
          </h1>
          <p className="text-[#2C3E3C]/60">
            Create your account and start optimizing your resumes
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl border border-[#2C3E3C]/10',
            },
          }}
        />
      </div>
    </div>
  );
}
