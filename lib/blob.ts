import { getStore } from '@netlify/blobs';

export async function uploadFile(file: File, folder: string = 'resumes') {
  try {
    // Netlify auto-injects credentials in production
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

    // Construct the public URL - Netlify provides these env vars automatically
    const baseUrl = process.env.URL ||
                    process.env.DEPLOY_URL ||
                    process.env.NEXT_PUBLIC_APP_URL ||
                    'http://localhost:8888';

    const url = `${baseUrl}/.netlify/blobs/serve/resumeai/${filename}`;

    console.log('File uploaded to Netlify Blobs:', { filename, url });

    return url;
  } catch (error) {
    console.error('Error uploading file to Netlify Blobs:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteFile(url: string) {
  try {
    const store = getStore('resumeai');

    // Extract the key from the URL
    const key = url.split('/.netlify/blobs/serve/resumeai/')[1];

    if (key) {
      await store.delete(key);
      console.log('File deleted from Netlify Blobs:', key);
    } else {
      console.warn('Could not extract key from URL:', url);
    }
  } catch (error) {
    console.error('Error deleting file from Netlify Blobs:', error);
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
