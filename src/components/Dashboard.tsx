"use client";

import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import CreateExperimentButton from './CreateExperimentButton';
import { UserRecord } from 'firebase-admin/auth';
import { DocumentData, collection, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Code2, MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/utils';

const Dashboard = ({ user }: { user: UserRecord }) => {

  const [experiments, setExperiments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userRef = doc(collection(db, 'users'), user.uid);
    const unsubscribe = onSnapshot(query(collection(userRef, 'experiments')), (snapshot) => {
      const exps: DocumentData[] = [];
      snapshot.forEach((doc) => {
        exps.push(doc.data());
      });
      setExperiments(exps);
      setLoading(false);
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
      {experiments && experiments?.length !== 0 ? (
        <ul className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {experiments
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((experiment, index) => (
              <li
                key={index}
                className='col-span-1 divide-y rounded-lg bg-[#121626] border-[1px] border-zinc-800 hover:border-zinc-600'>
                <Link
                  href={absoluteUrl(`/dashboard/${experiment.experimentId}`)}
                  className='flex flex-col gap-2'>
                  <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
                    <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-tr from-[#FD9248] via-[#FA1768] to-[#F001FF]' />
                    <div className='flex-1 truncate'>
                      <div className='flex items-center space-x-3'>
                        <h3 className='truncate text-lg font-medium text-white'>
                          {experiment.experimentId}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className='px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-50'>
                  <div className='flex items-center gap-2'>
                    <Plus className='h-4 w-4' />
                    {new Date(experiment.createdAt).toLocaleDateString()}
                  </div>

                  <div className='flex items-center gap-2'>
                    <MessageSquare className='h-4 w-4' />
                    Experiment
                  </div>
                </div>
              </li>
            ))}
        </ul>
      ) : loading ? (
        <SkeletonTheme baseColor="#36383e" highlightColor="#444">
          <Skeleton count={3} height={100} className="my-2" />
        </SkeletonTheme>
      ) : (
        <div className='mt-16 flex flex-col items-center gap-2'>
          <Code2 className='h-8 w-8 text-zinc-50' />
          <h3 className='font-semibold text-xl'>
            Pretty empty around here
          </h3>
          <p>To get started, create your first experiment.</p>
        </div>
      )}
    </main>
  )
}

export default Dashboard;