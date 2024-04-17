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
        if (!dates.includes(today.toISOString().split("T")[0])) dates.push(today.toISOString().split("T")[0]);
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

    const customTooltip = (props: any) => {
        const { payload, active } = props;
        if (!active || !payload) return null;
        return (
            <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
                <div className="text-black">{payload[0].payload.date}</div>
                {payload.map((category: any, idx: any) => {
                    return <div key={idx} className="flex flex-1 space-x-2.5 items-center">
                        <div
                            className={`flex w-2 h-2 bg-${category.color}-400 rounded`}
                        />
                        <div className="flex space-x-1">
                            <p className="text-tremor-content">{category.dataKey}</p>
                            :
                            <p className={`font-medium text-${category.color}-400`}>
                                {category.value as number}
                            </p>
                        </div>
                    </div>
                })}
            </div>
        );
    }


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
                    customTooltip={customTooltip}
                />
            </CardContent>
        </Card>
    );
}