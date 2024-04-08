import { adminDb } from '@/lib/firebase-admin';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import type Stripe from 'stripe';

export async function POST(request: Request) {
    const body = await request.text()
    const signature = headers().get('stripe-signature') ?? '';

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        )
    } catch (err) {
        return new Response(
            `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'
            }`,
            { status: 400 }
        )
    }

    const session = event.data
        .object as Stripe.Checkout.Session

    if (!session?.metadata?.userId) {
        return new Response("userId not present", {
            status: 200,
        })
    }

    if (event.type === 'checkout.session.completed') {
        const subscription =
            await stripe.subscriptions.retrieve(
                session.subscription as string
            )
        try {
            await adminDb.collection('users').doc(session.metadata.userId).set({
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            }, { merge: true });
        }
        catch (err) {
            return new Response(err instanceof Error ? err.message : 'Unknown Error', { status: 200 })
        }
    }

    if (event.type === 'invoice.payment_succeeded') {
        // Retrieve the subscription details from Stripe.
        const subscription =
            await stripe.subscriptions.retrieve(
                session.subscription as string
            )

        // const querySnapshot = await adminDb.collection("users").doc(session.metadata.userId).get();
        // if (!querySnapshot.exists || !!querySnapshot.data().stripeSubscriptionId) {
        //     console.log('No matching documents.');
        //     return new Response(null, { status: 500 });
        // }
        // const userDoc = querySnapshot.data()
        await adminDb.collection("users").doc(session.metadata.userId).update({
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
            ),
        })

    }

    return new Response(session.metadata.userId, { status: 200 })
}