import { adminDb } from "@/lib/firebase-admin";
import { APIResponse } from "@/types";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { hash, experimentId, variantIds } = reqBody;
    if (!hash || !experimentId || !variantIds)
        return NextResponse.json<APIResponse<string>>({ success: false, error: "Invalid request." });

    const variantId = variantIds[Math.floor(Math.random() * variantIds.length)];
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
            if (variantIds.includes(ipDoc.data()?.variantId))
                return NextResponse.json<APIResponse<string>>({ success: true, data: ipDoc.data()?.variantId });
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
    await adminDb.collection("experiment-hashes").doc(hash).collection("variants").doc(variantId).set({
        impressions: variant?.impressions ? variant?.impressions + 1 : 1,
        clicks: variant?.clicks ? variant?.clicks : 0,
        conversions: variant?.conversions ? variant?.conversions : 0,
    })

    return NextResponse.json<APIResponse<string>>({ success: true, data: variantId });
}