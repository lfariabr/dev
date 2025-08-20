import { GraphQLError } from 'graphql';
import Scream from '../../models/Scream';
import { rateLimiter } from '../../services/rateLimiter';
import { chatWithAI } from '../../services/openai';

// Simple email normalization/validation (replace later with zod schema)
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const isValidEmail = (email: string) => /.+@.+\..+/.test(email);

const buildPrompt = (explicitMode: boolean) => {
  const base = `You're “Goggins Mode” — a relentless motivator for software engineers. Use tough love, not fluff. Be brutally honest, driven by discipline, ownership, and action. Keep responses sharp, between 100–120 characters or short punchy paragraphs. Always sign off with: — Goggins Mode.`;

  if (explicitMode) {
    return base + ` Don't hold back. Drop raw truths with grit. Use censored language like "fk", "fkn", "mtfkn" to drive it home.`;
  }

  return base + ` Stay intense but clean — no profanity. Focus on power, ownership, and next steps.`;
};

export const activateGogginsMode = async (_: any, { input }: any) => {
  const userEmailRaw = input?.userEmail;
  const explicitMode = Boolean(input?.explicitMode);

  if (!userEmailRaw || !isValidEmail(userEmailRaw)) {
    throw new GraphQLError('Invalid email address', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const userEmail = normalizeEmail(userEmailRaw);

  // Redis rate limit (2/day)
  const key = `goggins:${userEmail}`;
  const limitResult = await rateLimiter.limit(key, 2, 86400);

  if (!limitResult.success) {
    const resetIn = Math.max(0, Math.ceil((limitResult.resetTime.getTime() - Date.now()) / 1000));
    throw new GraphQLError('Rate limit exceeded', {
      extensions: {
        code: 'RATE_LIMITED',
        limit: limitResult.limit,
        remaining: 0,
        resetTime: limitResult.resetTime.toISOString(),
        resetIn,
      },
    });
  }

  // Generate scream via OpenAI
  const modelUsed = 'gpt-3.5-turbo'; // keep aligned with chatWithAI default
  const prompt = buildPrompt(explicitMode);
  const text = await chatWithAI(prompt, modelUsed);

  // Persist
  const isSubscriber = true; // TODO: replace with Stripe/customer check
  const subscriptionType = 'free';

  const newScream = await Scream.create({
    userEmail,
    text,
    modelUsed: modelUsed,
    explicitMode,
    isSubscriber,
    subscriptionType,
  });

  const resetIn = Math.max(0, Math.ceil((limitResult.resetTime.getTime() - Date.now()) / 1000));

  // Match SDL Scream type (RateLimitInfo { allowed, resetIn, limit, remaining })
  return {
    id: newScream.id,
    userEmail: newScream.userEmail,
    text: newScream.text,
    modelUsed: newScream.modelUsed,
    explicitMode: newScream.explicitMode,
    isSubscriber: newScream.isSubscriber,
    createdAt: newScream.createdAt.toISOString(),
    rateLimitInfo: {
      allowed: true,
      resetIn,
      limit: limitResult.limit,
      remaining: limitResult.remaining,
    },
  };
};

export const screamMutations = {
  activateGogginsMode,
};