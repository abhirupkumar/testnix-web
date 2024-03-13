"use client";

import { getCurrentUser } from '@/lib/firebase-admin';
import { absoluteUrl } from '@/lib/utils';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import CreateExperimentButton from './CreateExperimentButton';
import { UserRecord } from 'firebase-admin/auth';
import { DocumentData, QueryDocumentSnapshot, collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Dashboard = ({ user }: { user: UserRecord }) => {

  const [experiments, setExperiments] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'experiments', user.uid)), (snapshot) => {
      setExperiments(snapshot.docs);
      console.log(snapshot.docs);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <main className='mx-auto max-w-7xl md:p-10 p-4'>
      <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
        <h1 className='font-bold text-4xl text-gray-50'>
          My Experiments
        </h1>
        <CreateExperimentButton user={user} />
      </div>

      {/* display all user files */}
      {/* {files && files?.length !== 0 ? (
        <ul className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className='col-span-1 divide-y rounded-lg bg-[#121626] border-[1px] border-zinc-800 hover:border-zinc-600'>
                <Link
                  href={`/dashboard/${file.id}`}
                  className='flex flex-col gap-2'>
                  <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
                    <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500' />
                    <div className='flex-1 truncate'>
                      <div className='flex items-center space-x-3'>
                        <h3 className='truncate text-lg font-medium text-white'>
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className='px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-50'>
                  <div className='flex items-center gap-2'>
                    <Plus className='h-4 w-4' />
                    {format(
                      new Date(file.createdAt),
                      'MMM yyyy'
                    )}
                  </div>

                  <div className='flex items-center gap-2'>
                    <MessageSquare className='h-4 w-4' />
                    pdf
                  </div>

                  <Button
                    onClick={() =>
                      deleteFile({ id: file.id })
                    }
                    size='sm'
                    className='w-full bg-red-600 hover:bg-red-700'
                    variant='destructive'>
                    {currentlyDeletingFile === file.id ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Trash className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <SkeletonTheme baseColor="#121626" highlightColor="#444">
          <Skeleton count={3} height={100} className="my-2" />
        </SkeletonTheme>
      ) : (
        <div className='mt-16 flex flex-col items-center gap-2'>
          <Ghost className='h-8 w-8 text-zinc-50' />
          <h3 className='font-semibold text-xl'>
            Pretty empty around here
          </h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )} */}
    </main>
  )
}

export default Dashboard;