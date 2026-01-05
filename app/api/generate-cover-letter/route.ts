import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { generateCoverLetter } from '@/lib/claude';
import { canPerformAction } from '@/lib/auth';
import { z } from 'zod';

const coverLetterSchema = z.object({
  jobApplicationId: z.string(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const canGenerate = await canPerformAction('cover_letter');
    if (!canGenerate) {
      return new NextResponse(
        'You have reached your free limit. Please upgrade to generate cover letters.',
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = coverLetterSchema.parse(body);

    const jobApplication = await prisma.jobApplication.findUnique({
      where: { id: validated.jobApplicationId },
      include: {
        resume: true,
      },
    });

    if (!jobApplication || jobApplication.userId !== userId) {
      return new NextResponse('Job application not found', { status: 404 });
    }

    const existingCoverLetter = await prisma.coverLetter.findFirst({
      where: { jobApplicationId: validated.jobApplicationId },
    });

    if (existingCoverLetter) {
      return NextResponse.json(existingCoverLetter);
    }

    const coverLetterContent = await generateCoverLetter(
      jobApplication.resume.originalContent,
      jobApplication.jobDescriptionText,
      jobApplication.jobTitle,
      jobApplication.companyName
    );

    const coverLetter = await prisma.coverLetter.create({
      data: {
        jobApplicationId: validated.jobApplicationId,
        content: coverLetterContent,
      },
    });

    return NextResponse.json(coverLetter);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }

    console.error('Error generating cover letter:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
