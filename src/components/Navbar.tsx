import React from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { ArrowRight } from 'lucide-react';
import MobileNav from './MobileNav';
import UserAccountNav from './UserAccountNav';
import { getCurrentUser } from '@/lib/firebase-admin';


const Navbar = async () => {

    const currentUser = await getCurrentUser();
    const user = !!currentUser ? currentUser.toJSON() as typeof currentUser : null;

    return (
        <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 backdrop-blur-lg transition-all'>
            <MaxWidthWrapper>
                <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
                    <Link
                        href='/'
                        className='flex z-40 font-semibold'>
                        <span className='flex items-center justify-center'>
                            <img src="/logo.svg" alt="logo" className='h-14 w-14' />
                            <p className='font-mono text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#FD9248] via-[#FA1768] to-[#F001FF] font-semibold'>TestNix</p>
                        </span>
                    </Link>

                    <MobileNav isAuth={!!user} />

                    <div className='hidden items-center space-x-4 sm:flex'>
                        {!user ? (
                            <>
                                <Link
                                    href='/pricing'
                                    className={buttonVariants({
                                        variant: 'ghost',
                                        size: 'sm',
                                    })}>
                                    Pricing
                                </Link>
                                <Link
                                    href='/sign-in'
                                    className={buttonVariants({
                                        variant: 'ghost',
                                        size: 'sm',
                                    })}>
                                    Sign in
                                </Link>
                                <Link
                                    href='/sign-in'
                                    className={buttonVariants({
                                        size: 'sm',
                                    })}>
                                    Get started{' '}
                                    <ArrowRight className='ml-1.5 h-5 w-5' />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href='/contact'
                                    className={buttonVariants({
                                        variant: 'ghost',
                                        size: 'sm',
                                    })}>
                                    Contact
                                </Link>
                                <Link
                                    href='/dashboard'
                                    className={buttonVariants({
                                        variant: 'ghost',
                                        size: 'sm',
                                    })}>
                                    Dashboard
                                </Link>

                                <UserAccountNav
                                    name={
                                        !user.displayName
                                            ? 'Your Account'
                                            : `${user.displayName}`
                                    }
                                    email={user.email ?? ''}
                                    imageUrl={user.photoURL ?? ''}
                                />
                            </>
                        )}
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar
