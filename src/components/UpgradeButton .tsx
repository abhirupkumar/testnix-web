"use client"

import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { createStripeSession } from '@/lib/stripeSession'
import { UserRecord } from 'firebase-admin/auth'

const UpgradeButton = ({ user, planName }: { user: UserRecord, planName: string }) => {

    return (
        <Button onClick={() => createStripeSession({ user, planName })} className='w-full'>
            Upgrade now <ArrowRight className='h-5 w-5 ml-1.5' />
        </Button>
    )
}

export default UpgradeButton