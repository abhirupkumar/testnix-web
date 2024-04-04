import { absoluteUrl } from "./utils";
import { collection, doc, getDoc } from "firebase/firestore";
import { getUserSubscriptionPlan, stripe } from "./stripe";
import { PLANS } from "@/config/stripe";
import { db } from "./firebase";
import { getCurrentUser } from "./firebase-admin";

export const createStripeSession = async ({ planName }: { planName: string }) => {
    const billingUrl = absoluteUrl('/dashboard/billing');
    const currentUser = await getCurrentUser();
    if (!currentUser)
        throw new Error("UNAUTHORIZED");
    const user = JSON.parse(JSON.stringify(currentUser.toJSON()));
    const userId = user.uid;
    if (!userId)
        throw new Error("UNAUTHORIZED");

    const dbUserDoc = await getDoc(doc(collection(db, "users"), userId));
    const dbUser = dbUserDoc.data() ?? {};

    if (!dbUser)
        throw new Error("UNAUTHORIZED");

    const subscriptionPlan =
        await getUserSubscriptionPlan();

    if (
        subscriptionPlan.isSubscribed &&
        dbUser.stripeCustomerId
    ) {
        const stripeSession =
            await stripe.billingPortal.sessions.create({
                customer: dbUser.stripeCustomerId,
                return_url: billingUrl,
            })

        return { url: stripeSession.url }
    }

    const stripeSession =
        await stripe.checkout.sessions.create({
            success_url: billingUrl,
            cancel_url: billingUrl,
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: PLANS.find(
                        (plan) => plan.name === planName
                    )?.price.priceIds.test,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: userId,
            },
        })

    return { url: stripeSession.url }
}