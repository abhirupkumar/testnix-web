'use client'

import { getUserSubscriptionPlan } from '@/lib/stripe'
import { useToast } from './ui/use-toast'
import MaxWidthWrapper from './MaxWidthWrapper'
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from './ui/card'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'
import { absoluteUrl } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface BillingFormProps {
    subscriptionPlan: Awaited<
        ReturnType<typeof getUserSubscriptionPlan>
    >
}

const BillingForm = ({
    subscriptionPlan,
}: BillingFormProps) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const createSession = async () => {
        setIsLoading(true);
        if (!subscriptionPlan.isSubscribed) return router.push(absoluteUrl('/pricing'));
        const fetchData = await fetch(absoluteUrl('/api/create-stripe-session'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ planName: subscriptionPlan.name }),
        })
        const data = await fetchData.json();
        if (data.success) window.location.href = data.url
        if (!data.success) {
            toast({
                title: 'There was a problem...',
                description: 'Please try again in a moment',
                variant: 'destructive',
            })
        }
        setIsLoading(false);
    }

    return (
        <MaxWidthWrapper className='max-w-5xl'>
            <form
                className='mt-12'
                onSubmit={(e) => {
                    e.preventDefault();
                    createSession();
                }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Plan</CardTitle>
                        <CardDescription>
                            You are currently on the{' '}
                            <strong>{subscriptionPlan.isSubscribed ? subscriptionPlan.name : "Free"}</strong> plan.
                        </CardDescription>
                    </CardHeader>

                    <CardFooter className='flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0'>
                        <Button type='submit'>
                            {isLoading ? (
                                <Loader2 className='mr-4 h-4 w-4 animate-spin' />
                            ) : null}
                            {subscriptionPlan.isSubscribed
                                ? 'Manage Subscription'
                                : 'Upgrade Now'}
                        </Button>

                        {subscriptionPlan.isSubscribed ? (
                            <p className='rounded-full text-xs font-medium'>
                                {subscriptionPlan.isCanceled
                                    ? 'Your plan will be canceled on '
                                    : 'Your plan renews on '}
                                {format(
                                    subscriptionPlan.stripeCurrentPeriodEnd!,
                                    'dd.MM.yyyy'
                                )}
                                .
                            </p>
                        ) : null}
                    </CardFooter>
                </Card>
            </form>
        </MaxWidthWrapper>
    )
}

export default BillingForm