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

export function GogginsDialog({ open, onOpenChange }: GogginsDialogProps) {
  const [secondsUntilReset, setSecondsUntilReset] = React.useState<number | null>(null);
  const [resultText, setResultText] = React.useState<string>("");
  const [errorText, setErrorText] = React.useState<string>("");
  const [limit, setLimit] = React.useState<number | null>(null);
  const [remaining, setRemaining] = React.useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
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

  const onSubmit = async (values: z.infer<typeof schema>) => {
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[100vw] max-w-[90vw] xl:max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            🧠 Goggins Mode
            <span className="text-xs bg-black text-white dark:bg-white dark:text-black px-2 py-1 rounded-full">
              BETA
            </span>
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-4">
            <img
              src="/goggins.png"
              alt="Goggins"
              className="w-14 h-14 rounded-full border-2 border-black shadow"
            />
            <div>
              {/* <h3 className="text-lg font-bold">Goggins Mode Activated</h3> */}
              <p className="text-sm text-muted-foreground">
              <span className="font-bold">Get a brutal truth bomb.</span>
              </p>
              <p className="text-sm text-muted-foreground">
              Enter your email to receive today’s push.
              </p>
            </div>
          </div>
          </DialogDescription>
        </DialogHeader>
        

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!resultText && (
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
          )}
          <FormField
              control={form.control}
              name="explicitMode"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="font-bold">Select your tone:</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {field.value
                      ? '🔥 Unfiltered: Expect profanity and max intensity.'
                      : '⚡ Respectful Mode: No swearing, but still brutally honest.'}
                  </p>
                </FormItem>
              )}
            />

            {resultText && (
              <div className="space-y-2">
                <FormLabel>💬 Goggins Has Spoken</FormLabel>
                {/* <Textarea
                  readOnly
                  value={resultText}
                  className="min-h-[35vh] p-4 text-base leading-relaxed border-l-4 border-black bg-zinc-50 font-mono shadow-inner"
                /> */}
                  <blockquote className="text-base italic bg-zinc-50 border-l-4 border-orange-600 pl-4 pr-2 py-3 rounded-md shadow-sm">
                    {resultText}
                  </blockquote>
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
                    <span> Try again in {secondsUntilReset}s.</span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
              <Button type="submit" disabled={disabled}>
                {loading ? 'Generating…' : secondsUntilReset ? `Wait ${secondsUntilReset}s` : 'Generate'}
              </Button>
            </DialogFooter>
            {(limit != null && remaining != null) && (
              <p className="text-xs font-mono text-zinc-500">
                <span className="text-xs">🧾 Requests left:</span>
                <span className="ml-1 font-semibold text-black">{remaining}/{limit}</span>
                {secondsUntilReset != null && secondsUntilReset > 0 && (
                  <span className="ml-2 text-red-500 animate-pulse">⏳ resets in {secondsUntilReset}s</span>
                )}
              </p>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
