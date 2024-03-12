import SignIn from '@/components/SignIn';
import { isUserAuthenticated } from '@/lib/firebase-admin';
import { absoluteUrl } from '@/lib/utils';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {

    if (await isUserAuthenticated()) redirect(absoluteUrl("/dashboard"));

    return (
        <SignIn />
    )
}

export default Page;