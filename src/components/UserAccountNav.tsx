"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'
import { Icons } from './Icons'
import Link from 'next/link'
import { Gem, Loader2 } from 'lucide-react'
import { absoluteUrl } from '@/lib/utils';
import { signOut } from '@/lib/authActions'
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface UserAccountNavProps {
    email: string | undefined
    name: string
    imageUrl: string
}

const UserAccountNav = ({
    email,
    imageUrl,
    name,
}: UserAccountNavProps) => {

    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignOut = async () => {
        setLoading(true);
        const isOk = await signOut();
        if (isOk) window.location.href = absoluteUrl(pathname);
        setLoading(false);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
                className='overflow-visible'>
                <Button className='rounded-full h-8 w-8 aspect-square bg-slate-50'>
                    <Avatar className='relative w-8 h-8'>
                        {imageUrl ? (
                            <div className='relative aspect-square h-full w-full'>
                                <Image
                                    fill
                                    src={imageUrl}
                                    alt='profile picture'
                                    referrerPolicy='no-referrer'
                                />
                            </div>
                        ) : (
                            <AvatarFallback className='bg-popover'>
                                <span className='sr-only'>{name}</span>
                                <Icons.user className='h-4 w-4 text-zinc-50' />
                            </AvatarFallback>
                        )}
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='bg-card border-[1px] border-zinc-500' align='end'>
                <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-0.5 leading-none'>
                        {name && (
                            <p className='font-medium text-sm text-white'>
                                {name}
                            </p>
                        )}
                        {email && (
                            <p className='w-[200px] truncate text-xs text-zinc-50'>
                                {email}
                            </p>
                        )}
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href='/dashboard' className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>

                {/* <DropdownMenuItem asChild>
                    {subscriptionPlan?.isSubscribed ? (
                        <Link href='/dashboard/billing' className="cursor-pointer">
                            Manage Subscription
                        </Link>
                    ) : (
                        <Link href='/pricing' className="cursor-pointer">
                            Upgrade{' '}
                            <Gem className='text-blue-500 h-4 w-4 ml-1.5' />
                        </Link>
                    )}
                </DropdownMenuItem> */}

                <DropdownMenuSeparator />

                <DropdownMenuItem className='cursor-pointer'>
                    <span onClick={handleSignOut}>Log out</span>
                    {loading && <Loader2 className='h-4 w-4 ml-2 animate-spin text-zinc-50' />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserAccountNav