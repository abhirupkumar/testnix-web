"use client";

import React, { useState } from 'react'
import { DropdownMenuItem } from './ui/dropdown-menu';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/authActions';
import { absoluteUrl } from '@/lib/utils';

const SignOut = () => {

    const pathname = usePathname();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignOut = async () => {
        setLoading(true);
        const isOk = await signOut();
        if (isOk) window.location.href = absoluteUrl(pathname);
        setLoading(false);
    }

    return (
        <DropdownMenuItem className='cursor-pointer'>
            <span onClick={handleSignOut}>Log out</span>
            {loading && <Loader2 className='h-4 w-4 ml-2 animate-spin text-zinc-50' />}
        </DropdownMenuItem>
    )
}

export default SignOut;