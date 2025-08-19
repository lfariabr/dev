"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { ACTIVATE_GOGGINS_MODE } from '@/lib/graphql/mutations/scream.mutations';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const schema = z.object({
  userEmail: z.string().email('Invalid email address'),
  explicitMode: z.boolean().default(false),
});

export type GogginsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// small helper to humanize seconds (e.g., 1h 12m, 04:35)
function formatDuration(seconds?: number | null): string {
  if (seconds == null || seconds <= 0) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m >= 5) return `${m}m`;
  // under 5 minutes show mm:ss
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function GogginsDialog({ open, onOpenChange }: GogginsDialogProps) {
  const [secondsUntilReset, setSecondsUntilReset] = React.useState<number | null>(null);
  const [resultText, setResultText] = React.useState<string>("");
  const [errorText, setErrorText] = React.useState<string>("");
  const [limit, setLimit] = React.useState<number | null>(null);
  const [remaining, setRemaining] = React.useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<z.input<typeof schema>, any, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { userEmail: '', explicitMode: false },
    mode: 'onSubmit',
  });

  const [mutate, { loading }] = useMutation(ACTIVATE_GOGGINS_MODE);

  // countdown
  React.useEffect(() => {
    if (secondsUntilReset == null) return;
    if (secondsUntilReset <= 0) return;
    const id = setInterval(() => {
      setSecondsUntilReset((s) => (s == null ? null : Math.max(0, s - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, [secondsUntilReset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      // reset state when dialog closes
      setSecondsUntilReset(null);
      setResultText("");
      setErrorText("");
      setLimit(null);
      setRemaining(null);
      form.reset();
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: z.output<typeof schema>) => {
    setResultText("");
    setErrorText("");
    // Clear any stale countdown before a new attempt
    setSecondsUntilReset(null);
    try {
      const { data, errors } = await mutate({
        variables: { input: values },
        errorPolicy: 'all',
      });

      // If GraphQL returned errors with 200 OK (e.g., Shield rate limit), surface them
      const gqError = errors?.[0];
      const ext: any = gqError?.extensions;
      if (gqError) {
        if (typeof ext?.limit === 'number') setLimit(ext.limit);
        if (typeof ext?.remaining === 'number') setRemaining(ext.remaining);
        const resetInErr: number | undefined = ext?.resetIn;
        if (typeof resetInErr === 'number') setSecondsUntilReset(resetInErr);
        setErrorText(gqError.message || 'Something went wrong');
        return; // stop; we already showed the error
      }

      const scream = data?.activateGogginsMode;
      if (scream) {
        setResultText(scream.text as string);
        const allowed = scream.rateLimitInfo?.allowed;
        const resetIn = scream.rateLimitInfo?.resetIn as number | undefined;
        const lim = scream.rateLimitInfo?.limit as number | undefined;
        const rem = scream.rateLimitInfo?.remaining as number | undefined;
        if (typeof lim === 'number') setLimit(lim);
        if (typeof rem === 'number') setRemaining(rem);
        // Start countdown when request was blocked or when remaining hits 0 after this success
        if ((allowed === false || rem === 0) && typeof resetIn === 'number') {
          setSecondsUntilReset(resetIn);
          if (allowed === false) setErrorText('Rate limited.');
        } else {
          setSecondsUntilReset(null);
        }
      }
    } catch (e: any) {
      const ext = e?.graphQLErrors?.[0]?.extensions as any;
      if (typeof ext?.limit === 'number') setLimit(ext.limit);
      if (typeof ext?.remaining === 'number') setRemaining(ext.remaining);
      const resetIn: number | undefined = ext?.resetIn;
      if (typeof resetIn === 'number') setSecondsUntilReset(resetIn);
      const message = e?.graphQLErrors?.[0]?.message || 'Something went wrong';
      setErrorText(message);
    }
  };

  const disabled = loading || (secondsUntilReset != null && secondsUntilReset > 0);
  const used = limit != null && remaining != null ? Math.max(0, (limit as number) - (remaining as number)) : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-[92vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[65vw] h-auto max-h-[92vh] md:max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Goggins Mode
            <span
              className="text-[10px] uppercase tracking-wide bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-full"
              aria-label="Beta"
              title="Beta"
            >
              Beta
            </span>
          </DialogTitle>
          <DialogDescription>
            <p className="font-bold">Get a brutal truth bomb.</p>
            <p className="text-muted-foreground">Enter your email to receive the push you didn't even know you needed.</p>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {(limit != null && remaining != null) && (
              <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 text-xs font-medium">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" /> Requests left
                  </span>
                  <span className="text-xs text-muted-foreground">{remaining}/{limit}</span>
                  {used != null && limit != null && (
                    <div className="ml-2 h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-emerald-500" style={{ width: `${(used as number) / (limit as number) * 100}%` }} />
                    </div>
                  )}
                </div>
                {secondsUntilReset != null && secondsUntilReset > 0 && (
                  <span className="text-xs rounded-full bg-amber-100 px-2 py-0.5 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                    Resets in {formatDuration(secondsUntilReset)}
                  </span>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="userEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="explicitMode"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <FormLabel>Explicit Mode</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {resultText && (
              <div className="space-y-3">
                <FormLabel className="text-sm font-medium">Response</FormLabel>
                <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60">
                  <div className="flex gap-3 px-4 py-4">
                    <div className="select-none text-zinc-400 dark:text-zinc-500">“</div>
                    <div className="flex-1">
                      <div className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-4">
                        <p className="whitespace-pre-wrap text-[0.975rem] leading-relaxed">
                          {resultText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(resultText);
                        toast({ title: 'Copied to clipboard' });
                      } catch (err) {
                        toast({ title: 'Copy failed', description: 'Please try again', variant: 'destructive' });
                      }
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}

            {errorText && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errorText}
                  {secondsUntilReset != null && secondsUntilReset > 0 && (
                    <span> Try again in {formatDuration(secondsUntilReset)}.</span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
              <Button type="submit" disabled={disabled}>
                {loading
                  ? 'Generating…'
                  : secondsUntilReset
                  ? `Wait ${formatDuration(secondsUntilReset)}`
                  : remaining != null && limit != null
                  ? `Generate (${remaining}/${limit})`
                  : 'Generate'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
