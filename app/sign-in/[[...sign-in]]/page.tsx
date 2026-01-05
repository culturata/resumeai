import { SignIn } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-[#2C3E3C] mb-2">
            Welcome Back
          </h1>
          <p className="text-[#2C3E3C]/60">
            Sign in to continue optimizing your resumes
          </p>
        </div>
        <SignIn
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
