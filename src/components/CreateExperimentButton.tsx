"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button, buttonVariants } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { HelpCircleIcon, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { addDoc, collection, collectionGroup, doc, getDoc, query, setDoc, where } from 'firebase/firestore';
import { UserRecord } from 'firebase-admin/auth';
import { db } from '@/lib/firebase';

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
      await setDoc(doc(expRef, expId), {
        experimentId: expId,
        variants: [],
        createdAt: new Date().toISOString(),
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
        })} onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button disabled={loading} onClick={handleCreateExperiment}>Create {loading && <Loader2 className='h-4 w-4 ml-2 animate-spin text-zinc-800' />}</Button>
      </div>
    </form>
    {error != "" && <div className="text-red-500 text-sm text-center">{error}</div>}
  </TooltipProvider>);
}

const CreateExperimentButton = ({ user }: { user: UserRecord }) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);

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
          <ExperimentForm user={user} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateExperimentButton;