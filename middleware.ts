import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

// Check if we have real Clerk keys or placeholders
const hasRealClerkKeys = () => {
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return pubKey && !pubKey.includes('placeholder');
};

// If we have placeholder keys, use a passthrough middleware
const passthroughMiddleware = (req: NextRequest) => {
  return NextResponse.next();
};

// Use real Clerk middleware if we have real keys, otherwise passthrough
export default hasRealClerkKeys()
  ? clerkMiddleware(async (auth, req) => {
      if (!isPublicRoute(req)) {
        await auth.protect();
      }
    })
  : passthroughMiddleware;

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
