import Dashboard from '@/components/Dashboard';
import { getCurrentUser } from '@/lib/firebase-admin';
import { absoluteUrl } from '@/lib/utils';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {

    const currentUser = await getCurrentUser();
    if (!currentUser) return redirect(absoluteUrl("/sign-in"));
    const user = JSON.parse(JSON.stringify(currentUser.toJSON()));

    return (
        <>
            {currentUser && user && <Dashboard user={user} />}
        </>
    )
}

export default Page;