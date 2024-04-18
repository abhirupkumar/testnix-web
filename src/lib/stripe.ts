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
            isEventQuotaReached: false,
            isExpQuotaReached: false,
        }
    }

    if (!user.uid) {
        return {
            ...PLANS[0],
            isSubscribed: false,
            isCanceled: false,
            stripeCurrentPeriodEnd: null,
            isEventQuotaReached: false,
            isExpQuotaReached: false
        }
    }

    const dbUserDoc = await adminDb.collection('users').doc(user.uid).get();

    if (!dbUserDoc.exists) {
        return {
            ...PLANS[0],
            isSubscribed: false,
            isCanceled: false,
            stripeCurrentPeriodEnd: null,
            isEventQuotaReached: false,
            isExpQuotaReached: false
        }
    }

    const dbUser = dbUserDoc.data() ?? {};
    const isSubscribed = Boolean(
        dbUser.stripePriceId &&
        dbUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
        (dbUser.stripeCurrentPeriodEnd.toDate()).getTime() + 86_400_000 > Date.now()
    )

    const plan = isSubscribed
        ? PLANS.find((plan) => plan.price.priceIds.test === dbUser.stripePriceId)
        : null

    let isCanceled = false
    if (isSubscribed && dbUser.stripeSubscriptionId) {
        const stripePlan = await stripe.subscriptions.retrieve(
            dbUser.stripeSubscriptionId
        )
        isCanceled = stripePlan.cancel_at_period_end
    }

    let isEventQuotaReached = false;
    const thisMonth = (new Date()).toISOString().split('-').slice(0, 2).join('-');
    let noOfEvents = dbUser?.noOfEvents;
    const index: number = noOfEvents.findIndex((obj: any) => obj.hasOwnProperty(thisMonth));
    if (isSubscribed) {
        const eventQuota = plan?.eventQuota as number
        if (eventQuota < 60000 && eventQuota < noOfEvents[index][thisMonth]) {
            isEventQuotaReached = true;
        }
    }
    else {
        const eventQuota = 1000
        if (eventQuota < noOfEvents[index][thisMonth]) {
            isEventQuotaReached = true;
        }
    }

    let isExpQuotaReached = false;
    const expRef = await adminDb.collection('users').doc(user.uid).collection('experiments').get();
    if (expRef.size) {
        if ((plan?.expQuota as number) <= expRef.size) {
            isExpQuotaReached = true;
        }
    }

    return {
        ...plan,
        stripeSubscriptionId: dbUser.stripeSubscriptionId as string,
        stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd.toDate(),
        stripeCustomerId: dbUser.stripeCustomerId as string,
        isSubscribed,
        isCanceled,
        isEventQuotaReached: isEventQuotaReached,
        isExpQuotaReached: isExpQuotaReached
    }
}