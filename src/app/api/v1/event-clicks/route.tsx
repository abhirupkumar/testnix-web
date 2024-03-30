import { adminDb } from "@/lib/firebase-admin";
import { APIResponse } from "@/types";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { hash, experimentId, variantId } = reqBody;
    if (!hash || !experimentId || !variantId)
        return NextResponse.json<APIResponse<string>>({ success: false, error: "Invalid request." });
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

    return NextResponse.json<APIResponse<string>>({ success: true, data: "Clicks recorded." });
}