import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { hash, experimentId, variantIds } = reqBody;
    if (!hash || !experimentId || !variantIds)
        return NextResponse.json({ success: false, data: "Invalid request." });
    const variantId = variantIds[Math.floor(Math.random() * variantIds.length)];
    return NextResponse.json({ success: true, data: variantId });
}