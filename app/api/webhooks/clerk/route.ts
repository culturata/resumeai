import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (!email) {
      return new NextResponse('No email found', { status: 400 });
    }

    try {
      await prisma.user.create({
        data: {
          id,
          email,
        },
      });
      console.log(`User ${id} created in database`);
    } catch (error) {
      console.error('Error creating user:', error);
      return new NextResponse('Error creating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    if (!id) {
      return new NextResponse('No user ID found', { status: 400 });
    }

    try {
      await prisma.user.delete({
        where: { id },
      });
      console.log(`User ${id} deleted from database`);
    } catch (error) {
      console.error('Error deleting user:', error);
      return new NextResponse('Error deleting user', { status: 500 });
    }
  }

  return new NextResponse('Webhook processed', { status: 200 });
}
