import { GithubAuthProvider, GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import { APIResponse } from "@/types";

export async function signIn(provider: GoogleAuthProvider | GithubAuthProvider | OAuthProvider) {

    try {
        const userCreds = await signInWithPopup(auth, provider);
        const idToken = await userCreds.user.getIdToken();

        const response = await fetch("/api/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
        });
        const resBody = (await response.json()) as unknown as APIResponse<string>;
        if (response.ok && resBody.success) {
            return true;
        } else return false;
    } catch (error) {
        console.error("Error signing in with Google", error);
        return false;
    }
}

export async function signOut() {
    try {
        await auth.signOut();

        const response = await fetch("/api/sign-out", {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const resBody = (await response.json()) as unknown as APIResponse<string>;
        if (response.ok && resBody.success) {
            return true;
        } else return false;
    } catch (error) {
        console.error("Error signing out with Google", error);
        return false;
    }
}