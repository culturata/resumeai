import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;

    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        coverLetters: {
          orderBy: { createdAt: 'desc' },
        },
        resume: {
          select: {
            originalFileName: true,
          },
        },
      },
    });

    if (!application || application.userId !== userId) {
      return new NextResponse('Application not found', { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const application = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!application || application.userId !== userId) {
      return new NextResponse('Application not found', { status: 404 });
    }

    const updateData: any = {};

    if (body.status) {
      updateData.status = body.status as ApplicationStatus;

      if (body.status === 'APPLIED' && !application.appliedAt) {
        updateData.appliedAt = new Date();
      }
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
