### v3.0.0 🔥 | `feature/resend`
> Goal: Integrate Resend to send emails to users when they activate Goggins Mode. Prepare terrain to receive emails according to desired settings (Desired Hour, Daily, Weekly, Monthly, etc)

- [x] Study Resend's API
- [x] Create resend resolver/mutation (`sendGogginsEmail`)
- [ ] Test sending via API apollo playground
- [ ] Point domain to IP (DNS A record) and verify domain in Resend
- [ ] Prepare schedules (Desired Hour, Daily, Weekly, Monthly)

---

## Setup Steps

1) Create a Resend account and API key
- Go to https://resend.com
- Create an API key (project or environment specific)
- Copy the key

2) Backend environment
- Add to `backend/.env` (or your environment manager):
```
RESEND_API_KEY=your_resend_api_key_here
```
- Ensure it’s also present in production (Docker/CI/CD secrets). If using Docker Compose, add `RESEND_API_KEY` under `backend` service `environment:`

3) Verify domain and sender
- In Resend dashboard, add domain `luisfaria.dev`
- Add the provided DNS records (TXT, CNAME, MX as required) at your DNS provider
- Wait for verification to complete
- Use a verified from address. Code currently uses:
```
From: "Luis Maluco" <goggins@luisfaria.dev>
```
- Adjust `backend/src/services/resendMailer.ts` if you want a different sender

4) Code wiring
- Service: `backend/src/services/resendMailer.ts` (uses `resend` SDK)
- Schema change: `backend/src/schemas/typeDefs.ts` adds `sendGogginsEmail(to: String!): Boolean!`
- Resolver: `backend/src/resolvers.ts` implements mutation and a basic `hello` query
- Auth: `backend/src/validation/shield.ts` protects `sendGogginsEmail` with `isAuthenticated`

5) Local test
- Start backend: `cd backend && npm run dev`
- Open GraphQL at `http://localhost:4000/graphql`
- With a valid auth context (login or add header), run:
```
mutation TestSend {
  sendGogginsEmail(to: "your@email.com")
}
```
- Expected: `true` and server logs `Email sent successfully`

6) Production notes
- Ensure `RESEND_API_KEY` is configured in your prod environment
- Domain DNS must be fully verified before sending from `@luisfaria.dev`
- Monitor bounces/complaints via Resend dashboard

## Next: Scheduling (Goggins Mode)
- Add schedule preferences to User model (e.g., `emailSchedule: NONE|DAILY|WEEKLY|MONTHLY` + `preferredHour`)
- Create cron/queue worker (BullMQ/Agenda/Cloud scheduler) to dispatch `sendGogginsEmail`
- Allow “Activate Goggins Mode” to opt-in and trigger an immediate email
