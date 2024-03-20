import { AreaChart } from '@tremor/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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

export default function Chart() {

    const colorsArray = ["red", "blue", "yellow", "green", "orange", "amber", "cyan", "lime", "emerald", "teal", "sky", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "slate", "gray", "zinc", "neutral", "stone",];

    return (
        <Card className="w-full mt-6">
            <CardHeader>
                <CardTitle>History </CardTitle>
            </CardHeader>
            <CardContent>
                <AreaChart
                    data={chartdata}
                    index="date"
                    categories={['v-1', 'v-2']}
                    colors={[colorsArray[0], colorsArray[1]]}
                    yAxisWidth={60}
                />
            </CardContent>
        </Card>
    );
}