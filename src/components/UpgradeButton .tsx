"use client"

import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast';
import { useState } from 'react';
import { absoluteUrl } from '@/lib/utils';

const UpgradeButton = ({ planName }: { planName: string }) => {

    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const createSession = async () => {
        setLoading(true);
        const fetchData = await fetch(absoluteUrl('/api/create-stripe-session'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ planName }),
        })
        const data = await fetchData.json();
        if (data.success) window.location.href = data.url
        if (!data.success) {
            toast({
                title: 'There was a problem...',
                description: 'Please try again in a moment',
                variant: 'destructive',
            })
        }
        setLoading(false);
    }

    return (
        <Button onClick={() => createSession()} className='w-full'>
            Upgrade now {loading ? <Loader2 className='ml-1.5 h-5 w-5 animate-spin' /> : <ArrowRight className='h-5 w-5 ml-1.5' />}
        </Button>
    )
}

export default UpgradeButton