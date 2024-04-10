"use client";

import { AreaChart } from '@tremor/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const chartdata = [
    {
        date: 'Jan 22',
        'v-1': 1,
        'v-2': 4,
    },
    {
        date: 'Feb 22',
        'v-1': 2,
        'v-2': 4,
    },
    {
        date: 'Mar 22',
        'v-1': 1,
        'v-2': 4,
    },
    {
        date: 'Apr 22',
        'v-1': 2,
        'v-2': 4,
    },
    {
        date: 'May 22',
        'v-1': 1,
        'v-2': 4,
    },
    {
        date: 'Jun 22',
        'v-1': 4,
        'v-2': 7,
    },
    {
        date: 'Jul 22',
        'v-1': 9,
        'v-2': 3,
    },
    {
        date: 'Aug 22',
        'v-1': 6,
        'v-2': 5,
    },
    {
        date: 'Sep 22',
        'v-1': 3,
        'v-2': 5,
    },
    {
        date: 'Oct 22',
        'v-1': 2,
        'v-2': 1,
    },
    {
        date: 'Nov 22',
        'v-1': 6,
        'v-2': 1,
    },
    {
        date: 'Dec 22',
        'v-1': 9,
        'v-2': 6,
    },
];

const colorsArray = ["red", "blue", "yellow", "green", "orange", "amber", "cyan", "lime", "emerald", "teal", "sky", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "slate", "gray", "zinc", "neutral", "stone",];

export default function Chart({ variants }: { variants: DocumentData[] }) {

    const [impressions, setImpressions] = useState<any[]>([]);

    useEffect(() => {
        let imps: any[] = [];
        variants.map((variant: DocumentData) => {
            variant.impressions.map((imp: any) => {
                const key = Object.keys(imp)[0];
                imps.push({ date: key, [variant.name]: Object.values(imp)[0] as number });
            });
        });

        setImpressions(imps);
        console.log(imps)
    }, [variants]);

    return (
        <Card className="w-full mt-6">
            <CardHeader>
                <CardTitle>History </CardTitle>
            </CardHeader>
            <CardContent>
                <AreaChart
                    data={impressions}
                    index="date"
                    categories={variants.map(variant => variant.name)}
                    colors={[colorsArray[0], colorsArray[1]]}
                    yAxisWidth={60}
                />
            </CardContent>
        </Card>
    );
}