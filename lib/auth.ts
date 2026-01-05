import { auth as clerkAuth, currentUser } from '@clerk/nextjs/server';
import { prisma } from './prisma';
import { SubscriptionStatus } from '@prisma/client';

export async function getCurrentUser() {
  const { userId } = await clerkAuth();
  if (!userId) return null;

  // Try to find the user in the database
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // If user doesn't exist in DB, create them (auto-sync from Clerk)
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    user = await prisma.user.create({
      data: {
        id: userId,
        email: email,
        subscriptionStatus: SubscriptionStatus.FREE,
      },
    });
  }

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function checkSubscriptionStatus() {
  const user = await getCurrentUser();
  if (!user) return { isSubscribed: false, isFree: true };

  const isSubscribed =
    user.subscriptionStatus === SubscriptionStatus.ACTIVE &&
    user.currentPeriodEnd &&
    user.currentPeriodEnd > new Date();

  return {
    isSubscribed,
    isFree: user.subscriptionStatus === SubscriptionStatus.FREE,
    status: user.subscriptionStatus,
    currentPeriodEnd: user.currentPeriodEnd,
  };
}

export async function canPerformAction(actionType: 'optimize' | 'cover_letter') {
  const { isSubscribed, isFree } = await checkSubscriptionStatus();

  if (isSubscribed) return true;

  if (isFree && actionType === 'optimize') {
    const user = await getCurrentUser();
    if (!user) return false;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const optimizationCount = await prisma.jobApplication.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    return optimizationCount < 3;
  }

  return false;
}
