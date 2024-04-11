import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Image from "next/image";
import { ArrowRight, Check } from 'lucide-react'
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
        <div className='mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/90'>
          <p className='text-sm font-semibold text-gray-700'>
            TestNix is now open in beta!
          </p>
        </div>
        <h1 className='max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl'>
          Split Testing for{' '}
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#FD9248] via-[#FA1768] to-[#F001FF]'>Developers</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">Set up TestNix within 5 minutes to get:</p>
        <ul className='ml-2 py-2 text-lg font-semibold leading-8 text-zinc-300 flex flex-col'>
          <li className="flex items-end mr-auto space-x-1"><Check className="text-[#FA1768]" /><p>Higher newsletter sign-ups</p></li>
          <li className="flex items-end mr-auto space-x-1"><Check className="text-[#FA1768]" /><p>Increased recruiter engagement from your portfolio</p></li>
          <li className="flex items-end mr-auto space-x-1"><Check className="text-[#FA1768]" /><p>A surge in customers on your paid SaaS-plan</p></li>
        </ul>
        <p className="text-lg leading-8 text-gray-300">Leverage Data-driven Experimentation To Win In The Subscription Economy</p>
        <Link
          className={buttonVariants({
            size: 'lg',
            className: 'mt-5',
          })}
          href='/dashboard'
          target='_blank'>
          Get started{' '}
          <ArrowRight className='ml-2 h-5 w-5' />
        </Link>
      </MaxWidthWrapper>

      {/* value proposition section */}
      <div>
        <div className='relative isolate'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FD9248] via-[#FA1768] to-[#F001FF] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
            />
          </div>

          <div>
            <div className='mx-auto max-w-7xl px-6 lg:px-8'>
              <div className='mt-16 flow-root sm:mt-24'>
                <div className='-m-2 rounded-xl bg-gray-500/25 p-1.5 ring-2 ring-inset ring-gray-900/20 lg:-m-4 lg:rounded-2xl lg:p-3'>
                  <Image
                    src='/dashboard-preview.png'
                    alt='product preview'
                    width={1575}
                    height={1000}
                    quality={100}
                    className='bg-background rounded-xl lg:rounded-2xl'
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className='relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#40fce3] to-[#4652ff] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]'
            />
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className='mx-auto mb-32 mt-32 max-w-5xl sm:mt-56'>
        <div className='mb-12 px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl sm:text-center'>
            <h2 className='mt-2 font-bold text-4xl text-gray-100 sm:text-5xl'>
              Start Testing in minutes
            </h2>
            <p className='mt-4 text-lg text-gray-300'>
              TestNix allows you to evaluate the performance of many React components against one another. Find out which layouts, components, and wording perform best for your website.
            </p>
          </div>
        </div>

        {/* steps */}
        <ol className='my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0'>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
              <span className='text-sm font-medium text-blue-600'>
                Step 1
              </span>
              <span className='text-xl font-semibold'>
                Sign up for an account
              </span>
              <span className='mt-2 text-zinc-300'>
                Start with a free plan or Upgrade to our{' '}
                <Link
                  href='/pricing'
                  className='text-blue-700 underline underline-offset-2'>
                  pro plan
                </Link>
                .
              </span>
            </div>
          </li>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
              <span className='text-sm font-medium text-blue-600'>
                Step 2
              </span>
              <span className='text-xl font-semibold'>
                Easy Configuration
              </span>
              <span className='mt-2 text-zinc-300'>
                Create an experiment and you're all set. Your variants are automatically tracked.
              </span>
            </div>
          </li>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
              <span className='text-sm font-medium text-blue-600'>
                Step 3
              </span>
              <span className='text-xl font-semibold'>
                Check Dashboard for Insights
              </span>
              <span className='mt-2 text-zinc-300'>
                Compare your variants side by side to determine which one works best.
              </span>
            </div>
          </li>
        </ol>

        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mt-16 flow-root sm:mt-24'>
            <div className='-m-2 rounded-xl bg-gray-500/25 p-1.5 ring-1 ring-inset ring-gray-900/20 lg:-m-4 lg:rounded-2xl lg:p-3'>
              <Image
                src='/experiment-preview.png'
                alt='uploading preview'
                width={1575}
                height={1000}
                quality={100}
                className='bg-background rounded-xl lg:rounded-2xl'
              />
            </div>
          </div>
        </div>
      </div>
    </>

  )
}