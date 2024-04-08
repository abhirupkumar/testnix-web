import { PLANS } from "@/config/stripe";
import { adminDb, getCurrentUser } from "@/lib/firebase-admin";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const reqBody = (await request.json()) as { planName: string };
    const planName = reqBody.planName;
    const billingUrl = absoluteUrl('/dashboard/billing');
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser)
            throw new Error("UNAUTHORIZED");
        const user = JSON.parse(JSON.stringify(currentUser.toJSON()));
        const userId = user.uid;
        if (!userId)
            throw new Error("UNAUTHORIZED");

        const dbUserDoc = await adminDb.collection("users").doc(userId).get();
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

            return NextResponse.json({ success: true, url: stripeSession.url });
        }

        const stripeSession =
            await stripe.checkout.sessions.create({
                success_url: billingUrl,
                cancel_url: billingUrl,
                payment_method_types: ["card"],
                currency: "INR",
                mode: 'subscription',
                customer_email: user.email,
                billing_address_collection: "auto",
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

        return NextResponse.json({ success: true, url: stripeSession.url });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, error: error });
    }
}