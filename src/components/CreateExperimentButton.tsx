"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button, buttonVariants } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { HelpCircleIcon, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { UserRecord } from 'firebase-admin/auth';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import Link from 'next/link';

async function generateHashId() {
  const randomString = Math.random().toString(36).substring(2, 14);
  const skuId = uuidv4() + randomString;
  return skuId.toUpperCase();
}

const ExperimentForm = ({ user, setIsOpen }: { user: UserRecord, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [expId, setExpId] = useState<string>("");
  const handleExpIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpId(e.target.value);
    setError("");
  }
  const handleCreateExperiment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (expId == "" || expId == " ") return;
    setLoading(true);
    const userRef = doc(collection(db, 'users'), user.uid);
    const expRef = collection(userRef, 'experiments');
    const expDoc = await getDoc(doc(expRef, expId));
    if (expDoc.exists()) {
      setError("Experiment with this Id already exists");
      setLoading(false);
    }
    else {
      const hashId = await generateHashId();
      await setDoc(doc(expRef, expId), {
        experimentId: expId,
        hash: hashId,
        createdAt: new Date().toISOString(),
        userId: user.uid
      });
      await setDoc(doc(collection(db, "experiment-hashes"), hashId), {
        experimentId: expId,
        hash: hashId,
        createdAt: new Date().toISOString(),
        userId: user.uid,
      });
      setIsOpen(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (error != "") {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [error]);

  return (<TooltipProvider>
    <div className="flex flex-col space-y-1.5 text-center sm:text-left rounded-t-md bg-zinc-800">
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-100 px-4 py-4 pt-8 sm:px-16">
        <img src="/logo.svg" alt="logo" className='h-14 w-14' />
        <h3 className="text-lg font-medium">Create A New Experiment</h3>
      </div>
    </div>
    <form className="space-y-4">
      <div className="flex flex-col space-y-2 pt-4">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2" htmlFor="name">Experiment Id
          <Tooltip defaultOpen={false} delayDuration={300}>
            <TooltipTrigger className='cursor-default ml-1.5'>
              <HelpCircleIcon className='h-4 w-4 text-zinc-300' />
            </TooltipTrigger>
            <TooltipContent>
              This is how you will later refer to your experiment in your code.
            </TooltipContent>
          </Tooltip>
        </label>
        <Input value={expId} onChange={handleExpIdChange} type="text" placeholder="checkout-exp-1" className='lowercase' />
      </div>
      <div className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 flex items-center justify-between gap-2">
        <Button disabled={loading} className={buttonVariants({
          variant: "accent"
        })} onClick={(e) => {
          e.preventDefault();
          setIsOpen(false)
        }}>Cancel</Button>
        <Button disabled={loading} onClick={handleCreateExperiment}>Create {loading && <Loader2 className='h-4 w-4 ml-2 animate-spin text-zinc-800' />}</Button>
      </div>
    </form>
    {error != "" && <div className="text-red-500 text-sm text-center">{error}</div>}
  </TooltipProvider>);
}

const CreateExperimentButton = ({ user, subscriptionPlan }: {
  user: UserRecord, subscriptionPlan: Awaited<
    ReturnType<typeof getUserSubscriptionPlan>
  >
}) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const text: string = subscriptionPlan.name === "Free" ? "On a Free Plan you can create upto 3 Experiments! Upgrade to a paid plan to create more experiments" : subscriptionPlan.isCanceled !== false ? "Your plan has expired!" : "You have reached the limit of experiments you can create in your current plan. Upgrade to create more experiments."

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={(v) => {
          if (!v) {
            setIsOpen(v)
          }
        }}>
        <DialogTrigger
          onClick={() => setIsOpen(true)}
          asChild>
          <Button>Create Experiment</Button>
        </DialogTrigger>
        <DialogContent>
          {!subscriptionPlan.isExpQuotaReached ? <ExperimentForm user={user} setIsOpen={setIsOpen} />
            :
            <UserNotSubscribedForm text={text} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

const UserNotSubscribedForm = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col space-y-1.5 text-center sm:text-left rounded-t-md bg-zinc-800">
      <div className="flex flex-col items-center text-center justify-center space-y-3 border-b border-gray-100 px-4 py-4 pt-8 sm:px-16">
        <img src="/logo.svg" alt="logo" className='h-14 w-14' />
        <h3 className="text-lg text-center font-medium">{text}</h3>
        <Link href='/dashboard/billing' className={buttonVariants({
          size: 'sm',
        })}>
          Manage Subscription
        </Link>
      </div>
    </div>
  )
}

export default CreateExperimentButton;