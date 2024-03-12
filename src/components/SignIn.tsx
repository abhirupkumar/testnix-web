"use client";

import { signIn } from '@/lib/authActions';
import { absoluteUrl } from '@/lib/utils';
import { GithubAuthProvider, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SignIn = () => {

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const pathname = usePathname();
    async function GoogleAuthentication() {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        const isOk = await signIn(provider);
        if (isOk) window.location.href = absoluteUrl("/dashboard");
        else setLoading(false);
    }

    async function GithubAuthentication() {
        setLoading(true);
        const provider = new GithubAuthProvider();
        const isOk = await signIn(provider);
        if (isOk) window.location.href = absoluteUrl("/dashboard");
        else setLoading(false);
    }

    async function MicrosoftAuthentication() {
        setLoading(true);
        const provider = new OAuthProvider('microsoft.com');
        const isOk = await signIn(provider);
        if (isOk) window.location.href = absoluteUrl("/dashboard");
        else setLoading(false);
    }

    return (
        <div className="grid h-full w-full place-items-center px-2 pt-20 sm:px-0">
            <section className="grid items-center gap-8 pb-8 pt-6 md:py-8 container max-w-lg">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="flex flex-col p-6 space-y-1">
                        <h3 className="font-semibold leading-none tracking-tight mb-1 text-2xl">Let's get you signed in</h3>
                    </div>
                    <div className="p-6 pt-0 grid gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Sign in with</span>
                            </div>
                        </div>
                        {loading && <Loader2 className='h-8 w-8 my-2 mx-auto animate-spin text-zinc-100' />}
                        <button onClick={() => GoogleAuthentication()} className="active:scale-95 inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 w-full bg-background ring-0 ring-offset-0 sm:w-auto">
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 512 512"><path fill="#167EE6" d="M492.668,211.489l-208.84-0.01c-9.222,0-16.697,7.474-16.697,16.696v66.715  c0,9.22,7.475,16.696,16.696,16.696h117.606c-12.878,33.421-36.914,61.41-67.58,79.194L384,477.589  c80.442-46.523,128-128.152,128-219.53c0-13.011-0.959-22.312-2.877-32.785C507.665,217.317,500.757,211.489,492.668,211.489z"></path><path fill="#12B347" d="M256,411.826c-57.554,0-107.798-31.446-134.783-77.979l-86.806,50.034  C78.586,460.443,161.34,512,256,512c46.437,0,90.254-12.503,128-34.292v-0.119l-50.147-86.81  C310.915,404.083,284.371,411.826,256,411.826z"></path><path fill="#0F993E" d="M384,477.708v-0.119l-50.147-86.81c-22.938,13.303-49.48,21.047-77.853,21.047V512  C302.437,512,346.256,499.497,384,477.708z"></path><path fill="#FFD500" d="M100.174,256c0-28.369,7.742-54.91,21.043-77.847l-86.806-50.034C12.502,165.746,0,209.444,0,256  s12.502,90.254,34.411,127.881l86.806-50.034C107.916,310.91,100.174,284.369,100.174,256z"></path><path fill="#FF4B26" d="M256,100.174c37.531,0,72.005,13.336,98.932,35.519c6.643,5.472,16.298,5.077,22.383-1.008  l47.27-47.27c6.904-6.904,6.412-18.205-0.963-24.603C378.507,23.673,319.807,0,256,0C161.34,0,78.586,51.557,34.411,128.119  l86.806,50.034C148.202,131.62,198.446,100.174,256,100.174z"></path><path fill="#D93F21" d="M354.932,135.693c6.643,5.472,16.299,5.077,22.383-1.008l47.27-47.27  c6.903-6.904,6.411-18.205-0.963-24.603C378.507,23.672,319.807,0,256,0v100.174C293.53,100.174,328.005,113.51,354.932,135.693z"></path></svg>
                            Google
                        </button>
                        <button onClick={() => GithubAuthentication()} className="active:scale-95 inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 w-full bg-background ring-0 ring-offset-0 sm:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="mr-2 h-5 w-5"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                            Github
                        </button>
                        <button onClick={() => MicrosoftAuthentication()} className="active:scale-95 inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 w-full bg-background ring-0 ring-offset-0 sm:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="mr-2 h-5 w-5">
                                <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)"></path><path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)"></path><path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)"></path><path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)"></path>
                            </svg>
                            Microsoft
                        </button>
                    </div>
                    <div className=" p-6 pt-0 flex flex-wrap items-center space-x-2">
                        <p className="text-xs text-zinc-300">By signing in, you agree to our <Link className="text-blue-600" href="/terms">Terms of Service</Link> and our <Link className="text-blue-600" href="/privacy">Privacy Policy</Link></p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default SignIn;