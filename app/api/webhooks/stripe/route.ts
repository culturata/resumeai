import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { SubscriptionStatus } from '@prisma/client';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return new NextResponse('No signature', { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionResponse = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const subscription = subscriptionResponse as any as Stripe.Subscription;

        const userId = session.metadata?.userId;

        if (!userId) {
          throw new Error('No userId in metadata');
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: SubscriptionStatus.ACTIVE,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        });

        console.log(`Subscription activated for user ${userId}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          throw new Error(`User not found for customer ${customerId}`);
        }

        let status: SubscriptionStatus;
        if (subscription.status === 'active') {
          status = SubscriptionStatus.ACTIVE;
        } else if (subscription.status === 'canceled') {
          status = SubscriptionStatus.CANCELLED;
        } else if (subscription.status === 'past_due') {
          status = SubscriptionStatus.PAST_DUE;
        } else {
          status = SubscriptionStatus.FREE;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: status,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        });

        console.log(`Subscription updated for user ${user.id}: ${status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          throw new Error(`User not found for customer ${customerId}`);
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: SubscriptionStatus.CANCELLED,
            stripeSubscriptionId: null,
            currentPeriodEnd: null,
          },
        });

        console.log(`Subscription cancelled for user ${user.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}
