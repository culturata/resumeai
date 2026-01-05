import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set');
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function optimizeResumeForATS(
  resumeContent: string,
  jobDescription: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are an expert resume optimizer specializing in ATS (Applicant Tracking System) compliance.

Given the following resume and job description, optimize the resume to be ATS-friendly while maintaining truthfulness. Do not fabricate any experience or skills.

**Job Description:**
${jobDescription}

**Original Resume:**
${resumeContent}

**Instructions:**
1. Extract key requirements, skills, and keywords from the job description
2. Optimize the resume format for ATS scanning (use clear section headers, standard formatting)
3. Incorporate relevant keywords naturally throughout the resume
4. Highlight relevant experience and skills that match the job requirements
5. Use action verbs and quantifiable achievements where present
6. Ensure proper formatting with clear section headers (e.g., "Work Experience", "Education", "Skills")
7. Remove any graphics, tables, or complex formatting that may confuse ATS
8. DO NOT fabricate any information - only reorganize and optimize what's already there
9. Return ONLY the optimized resume content, no additional commentary

Optimized Resume:`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }

  throw new Error('Unexpected response type from Claude');
}

export async function generateCoverLetter(
  resumeContent: string,
  jobDescription: string,
  jobTitle: string,
  companyName: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are an expert cover letter writer.

Generate a professional, personalized cover letter for the following job application.

**Job Title:** ${jobTitle}
**Company Name:** ${companyName}

**Job Description:**
${jobDescription}

**Candidate's Resume:**
${resumeContent}

**Instructions:**
1. Write a compelling cover letter that highlights relevant experience from the resume
2. Match the tone to the company and role (professional, enthusiastic, but not overly casual)
3. Show genuine interest in the role and company
4. Highlight 2-3 key achievements or experiences that align with the job requirements
5. Keep it concise (3-4 paragraphs)
6. Use a professional business letter format
7. DO NOT fabricate any information - only reference what's in the resume
8. Return ONLY the cover letter content (starting with the greeting), no additional commentary

Cover Letter:`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }

  throw new Error('Unexpected response type from Claude');
}

export async function scrapeJobDescriptionFromURL(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const textOnly = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return textOnly.slice(0, 10000);
  } catch (error) {
    console.error('Error scraping job description:', error);
    throw new Error('Failed to fetch job description from URL');
  }
}
