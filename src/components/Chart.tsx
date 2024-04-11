"use client";

import { AreaChart } from '@tremor/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const colorsArray = ["red", "blue", "yellow", "green", "orange", "amber", "cyan", "lime", "emerald", "teal", "sky", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "slate", "gray", "zinc", "neutral", "stone",];

export default function Chart({ variants }: { variants: DocumentData[] }) {

    const [impressions, setImpressions] = useState<any[]>([]);

    useEffect(() => {
        let imps: any[] = [];
        variants.map((variant: DocumentData) => {
            variant.impressions.map((imp: any) => {
                // remove the year from the key
                const key = Object.keys(imp)[0].split("-").slice(1).join("-");
                imps.push({ date: key, [variant.name]: Object.values(imp)[0] as number });
            });
        });

        const dates = imps.map(imp => imp.date);
        let newImps: any[] = [];
        dates.forEach(date => {
            let obj: any = { date };
            variants.forEach(variant => {
                const found = imps.find(imp => imp.date === date && imp[variant.name]);
                if (found) {
                    obj[variant.name] = found[variant.name];
                } else
                    obj[variant.name] = 0;
            });
            newImps.push(obj);
        });
        newImps.sort((a, b) => a.date.localeCompare(b.date));
        setImpressions(newImps);
        console.log(newImps)
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