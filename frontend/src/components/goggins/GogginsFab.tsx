"use client";

import React from 'react';
import { GogginsDialog } from './GogginsDialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function GogginsFab() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <GogginsDialog open={open} onOpenChange={setOpen} />
      <div className="fixed bottom-6 right-6 z-50">
        <span className="relative inline-flex">
          <Button
            onClick={() => setOpen(true)}
            className="rounded-full h-12 w-12 p-0 shadow-lg"
            aria-label="Activate Goggins Mode"
          >
            {/* inner circle to host the image */}
            <span className="relative h-10 w-10 rounded-full overflow-hidden bg-white ring-1 ring-black/10 dark:ring-white/20">
              <Image
                src="/goggins.png"
                alt="Goggins"
                fill
                sizes="40px"
                className="object-cover rounded-full select-none pointer-events-none"
                priority
              />
            </span>
          </Button>
          {/* pulse overlay should not intercept clicks */}
          <span className="pointer-events-none animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20" />
        </span>
      </div>
    </>
  );
}
