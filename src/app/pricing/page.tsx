import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import UpgradeButton from '@/components/UpgradeButton ';
import { Button, buttonVariants } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { pricingItems } from '@/config/pricing';
import { PLANS } from '@/config/stripe';
import { getCurrentUser } from '@/lib/firebase-admin';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { absoluteUrl, cn } from '@/lib/utils';
import {
    ArrowRight,
    Check,
    HelpCircle,
    Minus,
} from 'lucide-react'
import Link from 'next/link'

const Page = async () => {

    const currentUser = await getCurrentUser();
    const user = currentUser ? JSON.parse(JSON.stringify(currentUser.toJSON())) : null;

    const subscriptionPlan = await getUserSubscriptionPlan();

    return (
        <>
            <MaxWidthWrapper className='mb-8 mt-24 text-center max-w-[84rem]'>
                <div className='mx-auto mb-10 sm:max-w-lg'>
                    <h1 className='text-6xl font-bold sm:text-7xl'>
                        Pricing
                    </h1>
                    <p className='mt-5 text-gray-600 sm:text-lg'>
                        Whether you&apos;re just trying out our service
                        or need more, we&apos;ve got you covered.
                    </p>
                </div>

                <div className='pt-12 grid grid-cols-1 gap-10 lg:grid-cols-3'>
                    <TooltipProvider>
                        {pricingItems.map(
                            ({ plan, tagline, eventQuota, features }) => {
                                const price =
                                    PLANS.find(
                                        (p) => p.slug === plan.toLowerCase()
                                    )?.price.amount || 0

                                return (
                                    <div
                                        key={plan}
                                        className={cn(
                                            'relative rounded-2xl bg-card shadow-lg',
                                        )}>

                                        <div className='p-5'>
                                            <h3 className='my-3 text-center font-display text-3xl font-bold'>
                                                {plan}
                                            </h3>
                                            <p className='text-gray-500'>
                                                {tagline}
                                            </p>
                                            <p className='my-5 font-display text-6xl font-semibold'>
                                                ₹{price}
                                            </p>
                                            <p className='text-gray-500'>
                                                per month
                                            </p>
                                        </div>

                                        <div className='flex h-20 items-center justify-center border-b border-t border-gray-400 bg-card'>
                                            <div className='flex items-center space-x-1'>
                                                <p>
                                                    {eventQuota > 50000 ? "Unlimited" : eventQuota.toLocaleString()} events/month included.
                                                </p>

                                                <Tooltip delayDuration={300}>
                                                    <TooltipTrigger className='cursor-default ml-1.5'>
                                                        <HelpCircle className='h-4 w-4 text-zinc-500' />
                                                    </TooltipTrigger>
                                                    <TooltipContent className='w-80 p-2'>
                                                        The events collected per month. One impression, click or conversion counts as one event.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>

                                        <ul className='my-10 space-y-5 px-8'>
                                            {features.map(
                                                ({ text, footnote, negative }) => (
                                                    <li
                                                        key={text}
                                                        className='flex space-x-5'>
                                                        <div className='flex-shrink-0'>
                                                            {negative ? (
                                                                <Minus className='h-6 w-6 line-through text-gray-400' />
                                                            ) : (
                                                                <Check className='h-6 w-6 text-green-500' />
                                                            )}
                                                        </div>
                                                        {footnote ? (
                                                            <div className='flex items-center space-x-1'>
                                                                <p
                                                                    className={cn(
                                                                        'text-gray-50',
                                                                        {
                                                                            'text-gray-400': negative,
                                                                        }
                                                                    )}>
                                                                    {text}
                                                                </p>
                                                                <Tooltip
                                                                    delayDuration={300}>
                                                                    <TooltipTrigger className='cursor-default ml-1.5'>
                                                                        <HelpCircle className='h-4 w-4 text-zinc-500' />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className='w-80 p-2'>
                                                                        {footnote}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                        ) : (
                                                            <p
                                                                className={cn(
                                                                    'text-gray-50',
                                                                    {
                                                                        'text-gray-400': negative,
                                                                    }
                                                                )}>
                                                                {text}
                                                            </p>
                                                        )}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                        <div className='border-t border-gray-200' />
                                        <div className='p-5'>
                                            {plan === 'Free' ? (
                                                <Link
                                                    href={
                                                        user ? '/dashboard' : '/sign-in'
                                                    }
                                                    className={buttonVariants({
                                                        className: 'w-full',
                                                        variant: 'secondary',
                                                    })}>
                                                    {user ? 'Dashboard' : 'Sign up'}
                                                    <ArrowRight className='h-5 w-5 ml-1.5' />
                                                </Link>
                                            ) : user ? (
                                                subscriptionPlan.isSubscribed && subscriptionPlan.name == plan ? <Link
                                                    href='/dashboard/billing'
                                                    className={buttonVariants({
                                                        className: 'w-full',
                                                    })}>
                                                    Manage Subscription
                                                </Link> : subscriptionPlan.isSubscribed && subscriptionPlan.name == "Bussiness" ? <Link
                                                    href='/dashboard/billing'
                                                    className={buttonVariants({
                                                        className: 'w-full',
                                                    })}>
                                                    Manage Subscription
                                                </Link> : <UpgradeButton planName={plan} />
                                            ) : (
                                                <Link
                                                    href='/sign-in'
                                                    className={buttonVariants({
                                                        className: 'w-full',
                                                    })}>
                                                    {user ? 'Upgrade now' : 'Sign up'}
                                                    <ArrowRight className='h-5 w-5 ml-1.5' />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )
                            }
                        )}
                    </TooltipProvider>
                </div>
            </MaxWidthWrapper>
        </>
    )
}

export default Page;