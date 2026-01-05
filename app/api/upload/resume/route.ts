import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { uploadFile } from '@/lib/blob';
import { parseResume } from '@/lib/parsers';
import { FileType } from '@prisma/client';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf', 'text/markdown', 'text/plain'];

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';

    // Handle pasted text (JSON)
    if (contentType.includes('application/json')) {
      try {
        const { content, fileName } = await req.json();

        if (!content || !fileName) {
          return new NextResponse('Content and fileName are required', { status: 400 });
        }

        if (content.length > MAX_FILE_SIZE) {
          return new NextResponse('Content too large (max 10MB)', { status: 400 });
        }

        console.log('Uploading pasted resume:', { fileName, contentLength: content.length });

        // Create a File object from the pasted text
        const blob = new Blob([content], { type: 'text/plain' });
        const file = new File([blob], fileName, { type: 'text/plain' });

        const fileUrl = await uploadFile(file, 'resumes');
        console.log('File uploaded to blob storage:', fileUrl);

        const resume = await prisma.resume.create({
          data: {
            userId,
            originalFileName: fileName,
            originalFileUrl: fileUrl,
            fileType: FileType.MARKDOWN,
            originalContent: content,
          },
        });

        console.log('Resume saved to database:', resume.id);
        return NextResponse.json(resume);
      } catch (error) {
        console.error('Error uploading pasted resume:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new NextResponse(`Upload failed: ${errorMessage}`, { status: 500 });
      }
    }

    // Handle file upload (FormData)
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return new NextResponse('No file provided', { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return new NextResponse('File too large (max 10MB)', { status: 400 });
      }

      if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.md')) {
        return new NextResponse('Invalid file type. Only PDF and Markdown are allowed', {
          status: 400,
        });
      }

      console.log('Uploading file:', { name: file.name, type: file.type, size: file.size });

      const fileType: FileType =
        file.type === 'application/pdf' ? FileType.PDF : FileType.MARKDOWN;

      const fileUrl = await uploadFile(file, 'resumes');
      console.log('File uploaded to blob storage:', fileUrl);

      const originalContent = await parseResume(file, fileType);
      console.log('File parsed, content length:', originalContent.length);

      const resume = await prisma.resume.create({
        data: {
          userId,
          originalFileName: file.name,
          originalFileUrl: fileUrl,
          fileType,
          originalContent,
        },
      });

      console.log('Resume saved to database:', resume.id);
      return NextResponse.json(resume);
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return new NextResponse(`Upload failed: ${errorMessage}`, { status: 500 });
    }
  } catch (error) {
    console.error('Error in upload route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(`Internal Server Error: ${errorMessage}`, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
