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

    return NextResponse.json<APIResponse<string>>({ success: true, data: "Clicks recorded." });
}