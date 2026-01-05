import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const applications = await prisma.jobApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        resume: {
          select: {
            originalFileName: true,
          },
        },
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
