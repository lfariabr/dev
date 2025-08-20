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

- [X] backend: tests, api, rate limit, schema, resolver, mutation, zod schema, typeDefs, 
- [X] frontend: component, layout fine tune, modal, floating button, graphql call, 
  - [ ] Add avatar to the dialog + hide email + quote visualization + disclaiemr about mode (whatsapp ref)
  - [ ] tests

### v3.0.0 🔥 | `feature/resend`
> Goal: Integrate Resend to send emails to users when they activate Goggins Mode. Prepare terrain to receive emails according to desired settings (Desired Hour, Daily, Weekly, Monthly, etc)

- [X] Study Resend's API
- [ ] Integrate Resend to send emails to users when they activate Goggins Mode
- [ ] Prepare terrain to receive emails according to desired settings (Desired Hour, Daily, Weekly, Monthly, etc)

Backlog:
- [ ] when rate limit is achieved, load previous message from registered email
- [ ] Check SEO's progress
- [ ] (Optional) Add a second tab later: "APOD Time Travel" using NASA for an image-based surprise
