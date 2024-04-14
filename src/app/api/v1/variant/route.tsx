import { PLANS } from "@/config/stripe";
import { adminDb } from "@/lib/firebase-admin";
import { APIResponse } from "@/types";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { hash, experimentId, variantIds } = reqBody;
    if (!hash || !experimentId || !variantIds)
        return NextResponse.json<APIResponse<string>>({ success: false, error: "Invalid request." });

    // check if the experiment exists
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
    // check if the experiment user is subscribed or not
    const isSubscribed = Boolean(
        userData?.stripePriceId &&
        userData?.stripeCurrentPeriodEnd && // 86400000 = 1 day
        (userData?.stripeCurrentPeriodEnd.toDate()).getTime() + 86_400_000 > Date.now()
    )
    const plan = isSubscribed
        ? PLANS.find((plan) => plan.price.priceIds.test === userData?.stripePriceId)
        : null

    //check the event limit is exceed or not
    const thisMonth = (new Date()).toISOString().split('-').slice(0, 2).join('-');
    let noOfEvents = userData?.noOfEvents;
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

    let variantId = variantIds[Math.floor(Math.random() * variantIds.length)];
    const ipAddress = request.ip || headers().get('x-real-ip') || headers().get('x-forwarded-for') || "";
    if (ipAddress == null || ipAddress == "" || ipAddress == undefined) {
        await adminDb.collection('ip-addresses').doc("development-ip").collection("experiments").doc(hash).set({
            experimentId: experimentId,
            hash: hash,
            variantId: variantId,
            timestamp: Date.now(),
        });
    }
    else {
        const ipDoc = await adminDb.collection('ip-addresses').doc(ipAddress).collection("experiments").doc(hash).get();
        const variantTime = ipDoc.data()?.timestamp
        if (!ipDoc.exists || Date.now() - variantTime > 86400000) {
            await adminDb.collection('ip-addresses').doc(ipAddress).collection("experiments").doc(hash).set({
                experimentId: experimentId,
                hash: hash,
                variantId: variantId,
                timestamp: Date.now(),
            });
        }
        else {
            if (variantIds.includes(ipDoc.data()?.variantId)) {
                variantId = ipDoc.data()?.variantId;
            }
            else {
                await adminDb.collection('ip-addresses').doc(ipAddress).collection("experiments").doc(hash).set({
                    experimentId: experimentId,
                    hash: hash,
                    variantId: variantId,
                    timestamp: Date.now(),
                });
            }
        }
    }
    const variantData = await adminDb.collection("experiment-hashes").doc(hash).collection("variants").doc(variantId).get();
    const variant = variantData.data();
    const today = new Date().toISOString().split('T')[0];
    let impressions = variant?.impressions;
    if (impressions) {
        const index: number = impressions.findIndex((obj: any) => obj.hasOwnProperty(today));
        if (index !== -1) {
            impressions[index][today]++;
        }
        else {
            impressions.push({ [today]: 1 });
        }
    }
    else {
        impressions = [{ [today]: 1 }];
    }
    await adminDb.collection("experiment-hashes").doc(hash).collection("variants").doc(variantId).set({
        impressions: impressions,
        clicks: variant?.clicks ? variant?.clicks : [],
        conversions: variant?.conversions ? variant?.conversions : [],
    })
    await adminDb.collection("users").doc(hashData?.userId).update({
        noOfEvents: noOfEvents
    })

    return NextResponse.json<APIResponse<string>>({ success: true, data: variantId });
}