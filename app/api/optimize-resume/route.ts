import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { optimizeResumeForATS, scrapeJobDescriptionFromURL } from '@/lib/claude';
import { canPerformAction } from '@/lib/auth';
import { z } from 'zod';

const optimizeSchema = z.object({
  resumeId: z.string(),
  jobTitle: z.string().min(1),
  companyName: z.string().min(1),
  jobDescriptionText: z.string().optional(),
  jobDescriptionUrl: z.string().url().optional(),
}).refine(
  (data) => data.jobDescriptionText || data.jobDescriptionUrl,
  'Either jobDescriptionText or jobDescriptionUrl must be provided'
);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const canOptimize = await canPerformAction('optimize');
    if (!canOptimize) {
      return new NextResponse(
        'You have reached your free optimization limit. Please upgrade to continue.',
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = optimizeSchema.parse(body);

    const resume = await prisma.resume.findUnique({
      where: { id: validated.resumeId },
    });

    if (!resume || resume.userId !== userId) {
      return new NextResponse('Resume not found', { status: 404 });
    }

    let jobDescription = validated.jobDescriptionText || '';

    if (validated.jobDescriptionUrl && !jobDescription) {
      try {
        jobDescription = await scrapeJobDescriptionFromURL(validated.jobDescriptionUrl);
      } catch (error) {
        return new NextResponse(
          'Failed to fetch job description from URL. Please paste the job description instead.',
          { status: 400 }
        );
      }
    }

    const optimizedContent = await optimizeResumeForATS(
      resume.originalContent,
      jobDescription
    );

    const jobApplication = await prisma.jobApplication.create({
      data: {
        userId,
        resumeId: resume.id,
        jobTitle: validated.jobTitle,
        companyName: validated.companyName,
        jobDescriptionText: jobDescription,
        jobDescriptionUrl: validated.jobDescriptionUrl,
        optimizedResumeContent: optimizedContent,
      },
    });

    return NextResponse.json(jobApplication);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }

    console.error('Error optimizing resume:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
