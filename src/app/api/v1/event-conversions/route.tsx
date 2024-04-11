import { PLANS } from "@/config/stripe";
import { adminDb } from "@/lib/firebase-admin";
import { APIResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { hash, experimentId, variantId } = reqBody;
    if (!hash || !experimentId || !variantId)
        return NextResponse.json<APIResponse<string>>({ success: false, error: "Invalid request." });
    const hashDoc = await adminDb.collection("experiment-hashes").doc(hash).get();
    if (!hashDoc.exists) {
        return NextResponse.json<APIResponse<string>>({ success: false, error: "Experiment Not Found." });
    }
    const hashData = hashDoc.data();
    const userDoc = await adminDb.collection("users").doc(hashData?.userId).get();
    if (!userDoc.exists && !!userDoc.data()) {
        return NextResponse.json<APIResponse<string>>({ success: false, error: "Experiment Not Found." });
    }
    const userData = userDoc.data();
    const isSubscribed = Boolean(
        userData?.stripePriceId &&
        userData?.stripeCurrentPeriodEnd && // 86400000 = 1 day
        (userData?.stripeCurrentPeriodEnd.toDate()).getTime() + 86_400_000 > Date.now()
    )
    const plan = isSubscribed
        ? PLANS.find((plan) => plan.price.priceIds.test === userData?.stripePriceId)
        : null
    const thisMonth = (new Date()).toISOString().split('-').slice(0, 2).join('-');
    let noOfEvents = hashData?.noOfEvents;
    if (noOfEvents) {
        const index: number = noOfEvents.findIndex((obj: any) => obj.hasOwnProperty(thisMonth));
        if (index !== -1) {
            if (isSubscribed) {
                const eventQuota = plan?.eventQuota as number
                if (eventQuota < 60000 && eventQuota < noOfEvents[index][thisMonth]) {
                    return NextResponse.json<APIResponse<string>>({ success: false, error: "[TestNix] Limit Reached!" });
                }
            }
            else {
                const eventQuota = 1000
                if (eventQuota < noOfEvents[index][thisMonth]) {
                    return NextResponse.json<APIResponse<string>>({ success: false, error: "[TestNix] Limit Reached!" });
                }
            }
            noOfEvents[index][thisMonth]++;
        }
        else {
            noOfEvents.push({ [thisMonth]: 1 });
        }
    }
    else {
        noOfEvents = [{ [thisMonth]: 1 }];
    }
    const variantData = await adminDb.collection("experiment-hashes").doc(hash).collection("variants").doc(variantId).get();
    const variant = variantData.data();
    const today = new Date().toISOString().split('T')[0];
    let conversions = variant?.conversions;
    if (conversions) {
        const index: number = conversions.findIndex((obj: any) => obj.hasOwnProperty(today));
        if (index !== -1) {
            conversions[index][today]++;
        }
        else {
            conversions.push({ [today]: 1 });
        }
    }
    else {
        conversions = [{ [today]: 1 }];
    }
    await adminDb.collection("experiment-hashes").doc(hash).collection("variants").doc(variantId).set({
        impressions: variant?.impressions ? variant?.impressions : [],
        clicks: variant?.clicks ? variant?.clicks : [],
        conversions: conversions,
    })
    await adminDb.collection("experiment-hashes").doc(hash).update({
        noOfEvents: noOfEvents
    })

    return NextResponse.json<APIResponse<string>>({ success: true, data: "Conversions recorded." });
}