import React from 'react';
import BillingForm from '@/components/BillingForm';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { getCurrentUser } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import { absoluteUrl } from '@/lib/utils';

const Page = async () => {
    const currentUser = await getCurrentUser();
    const subscriptionPlan = await getUserSubscriptionPlan();
    if (!currentUser) redirect(absoluteUrl("/sign-in"))

    return <BillingForm subscriptionPlan={subscriptionPlan} />
}

export default Page;