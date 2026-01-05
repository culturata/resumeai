export async function parsePDF(fileBuffer: Buffer): Promise<string> {
  try {
    // Try to parse PDF with pdf-parse
    const pdfParse = await import('pdf-parse');
    const parseFn = (pdfParse as any).default || pdfParse;
    const data = await parseFn(fileBuffer);
    return data.text;
  } catch (error) {
    console.warn('PDF parsing failed (common in serverless), storing file without text extraction:', error);
    // Return a placeholder - the actual PDF file is still stored in blob storage
    // Users can download the original PDF, and AI can still optimize based on job description
    return '[PDF file stored - text extraction unavailable in serverless environment. Original file available for download.]';
  }
}

export function parseMarkdown(content: string): string {
  return content;
}

export async function parseResume(
  file: File,
  fileType: 'PDF' | 'MARKDOWN'
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (fileType === 'PDF') {
    return parsePDF(buffer);
  } else {
    const text = buffer.toString('utf-8');
    return parseMarkdown(text);
  }
}
