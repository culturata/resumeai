import { put, del } from '@vercel/blob';

export async function uploadFile(file: File, folder: string = 'resumes') {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not set');
  }

  const filename = `${folder}/${Date.now()}-${file.name}`;

  const blob = await put(filename, file, {
    access: 'public',
  });

  return blob.url;
}

export async function deleteFile(url: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not set');
  }

  await del(url);
}
