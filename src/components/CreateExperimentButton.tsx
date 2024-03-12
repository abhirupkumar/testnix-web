"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button, buttonVariants } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { HelpCircleIcon } from 'lucide-react';
import { Input } from './ui/input';

const ExperimentForm = ({ handleClose }: { handleClose: (e: React.MouseEvent<HTMLButtonElement>) => void }) => {
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
        <Input type="text" placeholder="checkout-exp-1" />
      </div>
      <div className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 flex items-center justify-between gap-2">
        <Button className={buttonVariants({
          variant: "accent"
        })} onClick={handleClose}>Cancel</Button>
        <Button>Create</Button>
      </div>
    </form>
  </TooltipProvider>);
}

const CreateExperimentButton = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(false);
  }

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
          <ExperimentForm handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateExperimentButton;