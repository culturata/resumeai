import { getStore } from '@netlify/blobs';

export async function uploadFile(file: File, folder: string = 'resumes') {
  const store = getStore('resumeai');

  const filename = `${folder}/${Date.now()}-${file.name}`;

  // Convert File to Blob for Netlify Blobs
  const arrayBuffer = await file.arrayBuffer();

  // Store the file (wrap in Blob for proper TypeScript typing)
  await store.set(filename, new Blob([arrayBuffer], { type: file.type }), {
    metadata: {
      contentType: file.type,
      originalName: file.name,
    }
  });

  // Return the public URL
  // Netlify Blobs URLs follow the pattern: /.netlify/blobs/serve/store/{key}
  const url = `${process.env.NEXT_PUBLIC_APP_URL || ''}/.netlify/blobs/serve/resumeai/${filename}`;

  return url;
}

export async function deleteFile(url: string) {
  const store = getStore('resumeai');

  // Extract the key from the URL
  const key = url.split('/.netlify/blobs/serve/resumeai/')[1];

  if (key) {
    await store.delete(key);
  }
}
