"use client";

import { AreaChart } from '@tremor/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const chartdata = [
    {
        date: 'Jan 22',
        SemiAnalysis: 2890,
        'The Pragmatic Engineer': 2338,
    },
    {
        date: 'Feb 22',
        SemiAnalysis: 2756,
        'The Pragmatic Engineer': 2103,
    },
    {
        date: 'Mar 22',
        SemiAnalysis: 3322,
        'The Pragmatic Engineer': 2194,
    },
    {
        date: 'Apr 22',
        SemiAnalysis: 3470,
        'The Pragmatic Engineer': 2108,
    },
    {
        date: 'May 22',
        SemiAnalysis: 3475,
        'The Pragmatic Engineer': 1812,
    },
    {
        date: 'Jun 22',
        SemiAnalysis: 3129,
        'The Pragmatic Engineer': 1726,
    },
    {
        date: 'Jul 22',
        SemiAnalysis: 3490,
        'The Pragmatic Engineer': 1982,
    },
    {
        date: 'Aug 22',
        SemiAnalysis: 2903,
        'The Pragmatic Engineer': 2012,
    },
    {
        date: 'Sep 22',
        SemiAnalysis: 2643,
        'The Pragmatic Engineer': 2342,
    },
    {
        date: 'Oct 22',
        SemiAnalysis: 2837,
        'The Pragmatic Engineer': 2473,
    },
    {
        date: 'Nov 22',
        SemiAnalysis: 2954,
        'The Pragmatic Engineer': 3848,
    },
    {
        date: 'Dec 22',
        SemiAnalysis: 3239,
        'The Pragmatic Engineer': 3736,
    },
];

const valueFormatter = function (number: number | bigint) {
    return '$ ' + new Intl.NumberFormat('us').format(number).toString();
};

export default function Chart() {
    return (
        <>
            <Card className="w-full mt-6">
                <CardHeader>
                    <CardTitle>History </CardTitle>
                </CardHeader>
                <CardContent>
                    <AreaChart
                        className="mt-4 h-72 text-white"
                        data={chartdata}
                        index="date"
                        yAxisWidth={65}
                        categories={['SemiAnalysis', 'The Pragmatic Engineer']}
                        valueFormatter={valueFormatter}
                    />
                </CardContent>
            </Card>
        </>
    );
}