export async function parsePDF(fileBuffer: Buffer): Promise<string> {
  try {
    const pdfParse = await import('pdf-parse');
    const parseFn = (pdfParse as any).default || pdfParse;
    const data = await parseFn(fileBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
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
