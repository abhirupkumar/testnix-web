import { PLANS } from '@/config/stripe'
import Stripe from 'stripe'
import { adminDb, getCurrentUser } from './firebase-admin';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2023-10-16',
    typescript: true,
})

export async function getUserSubscriptionPlan() {
    const currentUser = await getCurrentUser();
    const user = currentUser ? JSON.parse(JSON.stringify(currentUser.toJSON())) : null;

    if (!user) {
        return {
            ...PLANS[0],
            isSubscribed: false,
            isCanceled: false,
            stripeCurrentPeriodEnd: null,
        }
    }

    if (!user.uid) {
        return {
            ...PLANS[0],
            isSubscribed: false,
            isCanceled: false,
            stripeCurrentPeriodEnd: null,
        }
    }

    const dbUserDoc = await adminDb.collection('users').doc(user.uid).get();

    if (!dbUserDoc.exists) {
        return {
            ...PLANS[0],
            isSubscribed: false,
            isCanceled: false,
            stripeCurrentPeriodEnd: null,
        }
    }

    const dbUser = dbUserDoc.data() ?? {};
    const isSubscribed = Boolean(
        dbUser.stripePriceId &&
        dbUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
        dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
    )

    const plan = isSubscribed
        ? PLANS.find((plan) => plan.price.priceIds.production === dbUser.stripePriceId)
        : null

    let isCanceled = false
    if (isSubscribed && dbUser.stripeSubscriptionId) {
        const stripePlan = await stripe.subscriptions.retrieve(
            dbUser.stripeSubscriptionId
        )
        isCanceled = stripePlan.cancel_at_period_end
    }

    return {
        ...plan,
        stripeSubscriptionId: dbUser.stripeSubscriptionId,
        stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
        stripeCustomerId: dbUser.stripeCustomerId,
        isSubscribed,
        isCanceled,
    }
}