import Experiment from '@/components/Experiment';
import { adminDb, getCurrentUser } from '@/lib/firebase-admin';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

interface PageProps {
    params: {
        experimentId: string
    }
}

const Page = async ({ params }: PageProps) => {
    const currentUser = await getCurrentUser();
    if (!currentUser) return redirect(absoluteUrl("/sign-in"));
    const user = JSON.parse(JSON.stringify(currentUser.toJSON()));

    const { experimentId } = params;
    const experiment = await adminDb.collection('users').doc(user.uid).collection('experiments').doc(experimentId).get();
    if (!experiment.exists) return notFound();
    const experimentData = experiment.data();
    const subscriptionPlan = await getUserSubscriptionPlan();
    return (
        <>
            {experiment && user && experimentId && <Experiment user={JSON.parse(JSON.stringify(currentUser.toJSON()))} experimentId={experimentId} experimentData={experimentData} subscriptionPlan={subscriptionPlan} />}
        </>
    )
}

export default Page;