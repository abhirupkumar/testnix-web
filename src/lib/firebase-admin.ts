import "server-only";

import { cookies } from "next/headers";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { SessionCookieOptions, getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export const firebaseApp =
    getApps().find((it) => it.name === "firebase-admin-app") ||
    initializeApp(
        {
            credential: cert({
                projectId: process.env.PROJECT_ID as string,
                clientEmail: process.env.CLIENT_EMAIL as string,
                privateKey: process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.replace(/\\n/g, '\n') : ""
            })
        },
        "firebase-admin-app"
    );

export const adminAuth = getAuth(firebaseApp);

export const adminDb = getFirestore(firebaseApp);

export async function isUserAuthenticated(session: string | undefined = undefined) {
    const _session = session ?? (await getSession());
    if (!_session) return false;

    try {
        const isRevoked = !(await adminAuth.verifySessionCookie(_session, true));
        return !isRevoked;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function getCurrentUser() {
    const session = await getSession();

    if (!(await isUserAuthenticated(session))) {
        return null;
    }

    const decodedIdToken = await adminAuth.verifySessionCookie(session!);
    const currentUser = await adminAuth.getUser(decodedIdToken.uid);

    return currentUser;
}

async function getSession() {
    try {
        return cookies().get("__session")?.value;
    } catch (error) {
        return undefined;
    }
}

export async function createSessionCookie(idToken: string, sessionCookieOptions: SessionCookieOptions) {
    return adminAuth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
    const decodedIdToken = await adminAuth.verifySessionCookie(session);

    return await adminAuth.revokeRefreshTokens(decodedIdToken.sub);
}