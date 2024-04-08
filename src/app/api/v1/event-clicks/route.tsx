import { PLANS } from "@/config/stripe";
import { adminDb } from "@/lib/firebase-admin";
import { APIResponse } from "@/types";
import { headers } from "next/headers";
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
    const userDoc = await adminDb.collection("user").doc(hashData?.userId).get();
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
    if (isSubscribed) {
        const eventQuota = plan?.eventQuota as number
        if (eventQuota < 60000 && eventQuota < hashData?.noOfEvents) {
            return NextResponse.json<APIResponse<string>>({ success: false, error: "[TestNix] Limit Reached!" });
        }
    }
    else {
        const eventQuota = 1000
        if (eventQuota < hashData?.noOfEvents) {
            return NextResponse.json<APIResponse<string>>({ success: false, error: "[TestNix] Limit Reached!" });
        }
    }
    const variantData = await adminDb.collection("experiment-hashes").doc(hash).collection("variants").doc(variantId).get();
    const variant = variantData.data();
    const today = new Date().toISOString().split('T')[0];
    let clicks = variant?.clicks;
    if (clicks) {
        const index: number = clicks.findIndex((obj: any) => obj.hasOwnProperty(today));
        if (index !== -1) {
            clicks[index][today]++;
        }
        else {
            clicks.push({ [today]: 1 });
        }
    }
    else {
        clicks = [{ [today]: 1 }];
    }
    await adminDb.collection("experiment-hashes").doc(hash).collection("variants").doc(variantId).set({
        impressions: variant?.impressions ? variant?.impressions : [],
        clicks: clicks,
        conversions: variant?.conversions ? variant?.conversions : [],
    })
    await adminDb.collection("experiment-hashes").doc(hash).update({
        noOfEvents: hashData?.noOfEvents + 1
    })

    return NextResponse.json<APIResponse<string>>({ success: true, data: "Clicks recorded." });
}