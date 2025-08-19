Done:
- Fix "tags" at projects that are not being properly saved
- Integrate discord webhook to notify about new users + chatbot messages 
- Integrate google analytics
- Add support to markdown on Projects and Articles
- Add support to images on Projects and Articles (uses markdown syntax)
- Optimize the flow of chatbot, make it more clear to user
- Update Articles and Projects URL exhibition to match url strucutre instead of random code

In Progress:
### v2.0.0 🔥 | `feature/mistery-goglins-mode`
> Goal: Activate "Goggins Mode" — a mysterious floating button opens a modal asking for email. After a valid email and clicking "Surprise Me", generate a short, intense, motivational message tailored for builders version 18+ and version 18- (depending on choice, either safe and respectful tone or adult language, profanity or insults; motivate with discipline, ownership, and action.) using the existing OpenAI service.

Here's the plan to accomplish it:

#### Backend:
- New GraphQL mutation: `surpriseGoggins(email: String!): GogginsResponse!`
  - Response: `{ text: String!, modelUsed: String!, rateLimitInfo: RateLimitInfo }`
- Use existing OpenAI service (`backend/src/services/openai.ts`) with a curated system prompt ("David Goggins Mode" — tough love, but professional and non-abusive depending on type (18+ or 18-)). Include a short signature line.
- Zod validation for email (`backend/src/validation/schemas/goggins.schema.ts`).
- Redis rate limit: 2 requests per 24h keyed by normalized email; optional IP fallback.
  - Reuse `rateLimiter.limit("goggins:<email>", 2, 86400)` from `backend/src/services/rateLimiter.ts` (no auth required).
- Schema/types wiring:
  - Add `GogginsResponse` type and extend `Mutation` in `backend/src/schemas/types/...` and include in `backend/src/schemas/typeDefs.ts`.
  - Register resolver in `backend/src/resolvers/index.ts` under `Mutation`.

#### AI context (prompt guidelines):
- "Goggins Mode" activation: software engineer voice with Goggins energy.
- Purpose: a focused wake-up call to get out of the comfort zone (60–120 words).
- Constraints: can use adult language, profanity or insults; motivate with discipline, ownership, and action. Needs to be 18+
- Optional variables: day/time, recent commits/projects (if available) to personalize.

#### Frontend
- Floating button to activate Goggins Mode (subtle pulse).
- Modal dialog with email + zod validation.
- Calls GraphQL mutation and shows the AI response in the modal.
- Actions: Close, Copy to clipboard, Share (SMS/Email/Discord/WhatsApp/Instagram/TikTok/Twitter/X) via Web Share API fallback.
- Error handling: show rate limit message with reset time when applicable.

#### Observability
- Log success with email hash (do not persist raw email), timestamp, and model used.
- Optional: Discord webhook notification with a short snippet (first 100 chars).

# status:
- [X] created screamtype
- [X] created rate limit info
- [X] imported screamtype and mutation to typeDefs
- [X] created model to store data Scream.ts and possibly grow it to subscription based product
- [X] create activateGogginsMode resolver ( `src/resolvers/screams/mutations.ts`)
- [X] register resolver at `src/resolvers/index.ts`
- [X] test mutation via graphQL Playground
- [X] add screamInput Zod schema and guard explicitMode
- [X] update unit test for rate limit paths (allowed vs blocked) and resetIn correctness
- [X] integration test for activateGogginsMode with in-memory mongo/redis and mocked openAI  
- [ ] build frontend dialog modal with graphql Call + apollo mutation to hit activateGogginsMode, show message, handle rate-limit (use resetIn for countdown).

Backlog:
- Check SEO's progress
- (Optional) Add a second tab later: "APOD Time Travel" using NASA for an image-based surprise
