"use client";

import { AreaChart } from '@tremor/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const colorsArray = ["red", "green", "blue", "yellow", "orange", "amber", "cyan", "lime", "emerald", "teal", "sky", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "slate", "gray", "zinc", "neutral", "stone",];

export default function Chart({ variants, experiment }: { variants: DocumentData[], experiment: DocumentData | undefined }) {

    const [impressions, setImpressions] = useState<any[]>([]);

    useEffect(() => {
        let imps: any[] = [];
        variants.map((variant: DocumentData) => {
            variant.impressions.map((imp: any) => {
                const key = Object.keys(imp)[0];
                imps.push({ date: key, [variant.name]: Object.values(imp)[0] as number });
            });
        });
        const allVariants = variants.map(variant => variant.name);
        let dates: string[] = [];
        let currentDate = new Date(experiment?.createdAt);
        let today = new Date();
        while (currentDate <= today) {
            dates.push(currentDate.toISOString().split("T")[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        let newImps: any = {};
        dates.forEach(date => {
            allVariants.forEach(variant => {
                const found = imps.find(imp => imp.date === date && imp[variant]);
                if (!newImps[date]) {
                    newImps[date] = {};
                }
                if (found) {
                    newImps[date][variant] = found[variant];
                }
                else {
                    newImps[date][variant] = 0;
                }
            })
        });
        const arrayImps = Object.keys(newImps).map(date => {
            return { date, ...newImps[date] };
        });
        setImpressions(arrayImps);
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
                    colors={colorsArray.filter((color, index) => index < variants.length)}
                    yAxisWidth={60}
                />
            </CardContent>
        </Card>
    );
}