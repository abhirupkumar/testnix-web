"use client"

import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { createStripeSession } from '@/lib/stripeSession'

const UpgradeButton = ({ planName }: { planName: string }) => {

    return (
        <Button onClick={() => createStripeSession({ planName })} className='w-full'>
            Upgrade now <ArrowRight className='h-5 w-5 ml-1.5' />
        </Button>
    )
}

export default UpgradeButton