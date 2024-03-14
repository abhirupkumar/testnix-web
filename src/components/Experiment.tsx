"use client";

import React, { useEffect, useState } from 'react'
import MaxWidthWrapper from './MaxWidthWrapper';
import { UserRecord } from 'firebase-admin/auth';
import { DocumentData, collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { HelpCircleIcon } from 'lucide-react';
import { BarList } from "@tremor/react"
import Chart from './Chart';

const Experiment = ({ user, experimentId, experimentData }: {
    user: UserRecord,
    experimentId: string,
    experimentData: DocumentData | undefined
}) => {

    const data = [
        {
            name: 'Twitter',
            value: 456,
        },
        {
            name: 'Google',
            value: 351,
        },
        {
            name: 'GitHub',
            value: 271,
        },
    ]

    const [experiment, setExperiment] = useState<DocumentData | undefined>(experimentData);

    useEffect(() => {
        const userRef = doc(collection(db, 'users'), user.uid);
        const unsubscribe = onSnapshot(query(collection(userRef, 'experiments'), where("experimentId", "==", experimentId)), (snapshot) => {
            setExperiment(snapshot.docs[0].data());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <MaxWidthWrapper>
            <h1 className="mb-4 mt-10 text-4xl">Insights for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD9248] via-[#FA1768] to-[#F001FF]">{experimentId}</span></h1>
            <TooltipProvider>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Impressions <Tooltip defaultOpen={false} delayDuration={300}>
                                <TooltipTrigger className='cursor-default ml-1.5'>
                                    <HelpCircleIcon className='h-4 w-4 text-zinc-300' />
                                </TooltipTrigger>
                                <TooltipContent>
                                    The amount of times your visitors have seen your variants.
                                </TooltipContent>
                            </Tooltip></CardTitle>
                            <CardDescription><strong className='text-3xl'>0</strong> Total</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex w-full flex-row justify-between items-center">
                                <p className="">Variant</p>
                                <p className=" text-right">of which</p>
                            </div>
                            <div className="mt-2 w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-sm">
                                {/* <>
                                <p>No data yet.</p>
                                <a className="text-[#FD9248] underline underline-offset-2" href="#">Get started</a>
                                </> */}
                                <BarList color="blue" data={data} className="mt-2" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Clicks <Tooltip defaultOpen={false} delayDuration={300}>
                                <TooltipTrigger className='cursor-default ml-1.5'>
                                    <HelpCircleIcon className='h-4 w-4 text-zinc-300' />
                                </TooltipTrigger>
                                <TooltipContent>
                                    The amount of times your visitors clicked a variant.
                                </TooltipContent>
                            </Tooltip></CardTitle>
                            <CardDescription><strong className='text-3xl'>0</strong> Total</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex w-full flex-row justify-between items-center">
                                <p className="">Variant</p>
                                <p className=" text-right">of which</p>
                            </div>
                            <div className="mt-2 w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-sm">
                                <p>No data yet.</p>
                                <a className="text-[#FD9248] underline underline-offset-2" href="#">Get started</a>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Conversions <Tooltip defaultOpen={false} delayDuration={300}>
                                <TooltipTrigger className='cursor-default ml-1.5'>
                                    <HelpCircleIcon className='h-4 w-4 text-zinc-300' />
                                </TooltipTrigger>
                                <TooltipContent>
                                    The amount of times your visitors have performed a desired action.
                                </TooltipContent>
                            </Tooltip></CardTitle>
                            <CardDescription><strong className='text-3xl'>0</strong> Total</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex w-full flex-row justify-between items-center">
                                <p className="">Variant</p>
                                <p className=" text-right">of which</p>
                            </div>
                            <div className="mt-2 w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-sm">
                                <p>No data yet.</p>
                                <a className="text-[#FD9248] underline underline-offset-2" href="#">Get started</a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TooltipProvider>
            <Chart />
        </MaxWidthWrapper>
    )
}

export default Experiment;