# FoundryHQ Master Build Document

## Core Vision

FoundryHQ is not just a website builder.

FoundryHQ is an AI business builder.

The user should feel like they are speaking to an experienced business partner who helps them validate, shape, brand, build, launch, and market a business from scratch.

The AI should behave like a practical co-founder, not a form.

## Main User Journey

1. Business idea intake
2. Business viability check
3. Product/service clarification
4. Sourcing and fulfilment questions
5. Competition and pricing review
6. Name generation
7. Domain search
8. Logo and brand direction
9. Website/app generation
10. Payment setup
11. CRM/dashboard setup
12. Marketing content creation
13. Social media ad content
14. Premium growth tools

## First Product Principle

Do not build logos, websites, or marketing until the business idea has been checked for viability.

The first experience must be conversational.

Example tone:

“Before we build anything, tell me your idea. I’ll help you work out if this is worth pursuing and what needs to be true for it to work.”

## Build Order

### Sprint 1 — Foundation

- Next.js
- TypeScript
- Tailwind
- App Router
- Clean homepage
- Login placeholder
- Dashboard placeholder
- AI onboarding placeholder
- Supabase-ready structure
- Stripe-ready structure
- Vercel-ready structure

### Sprint 2 — AI Business Interview

Build a ChatGPT-style onboarding flow that asks:
- What is your business idea?
- Is it a product, service, app, marketplace, content business, or local business?
- Does the user already have the product/service?
- Do they need to source, manufacture, import, dropship, or create it?
- What problem does it solve?
- Who is the customer?
- How will it make money?
- What budget do they have?
- How much time can they commit?
- Is there anything legal, regulated, or risky?
- What would make this idea fail?

### Sprint 3 — Viability Score

Create a practical viability result:
- Strong idea
- Needs work
- High risk
- Not recommended yet

Explain why in plain English.

### Sprint 4 — Brand Builder

Only after viability:
- Business names
- Domain ideas
- Brand colours
- Logo direction
- Tagline
- Brand tone

### Sprint 5 — Website/App Builder

Generate:
- Landing page
- Product/service page
- Contact form
- Checkout/payment placeholder
- Dashboard preview

### Sprint 6 — Marketing Builder

Premium users get:
- Instagram posts
- TikTok scripts
- Facebook ad copy
- Google ad copy
- Email campaigns
- Launch plan
- Simple AI video scripts
- Social media content calendar

## Pricing Tiers

### Growth Spark

Low-cost monthly plan for basic business setup and guidance.

### Launch Kit

One-off setup option for users who want a guided launch.

### Empire Builder

Premium monthly plan with unlimited business building, marketing, content, automation, and growth tools.

## Technical Rules

- Use Next.js with App Router.
- Use TypeScript.
- Use Tailwind for styling.
- Keep the interface clean, modern, and simple.
- Avoid overbuilding.
- Do not add fake integrations.
- Use placeholders where API keys or live services are needed.
- Keep code modular.
- Use clear folder names.
- Every major feature should be built as a separate PR.
- Do not touch unrelated files.
- Do not stage files outside the FoundryHQ project folder.

## AI Personality Rules

The FoundryHQ AI should be:
- Practical
- Honest
- Encouraging
- Direct
- Commercially minded
- Simple to understand
- Like a co-founder, not a chatbot

It should avoid:
- Fluffy startup language
- Overpromising
- Long lectures
- Generic advice
- Building things before validation

## User Experience Rules

The user should never feel lost.

Each step should answer:
- What are we doing now?
- Why are we doing it?
- What happens next?

## Current Priority

The current priority is to build the clean foundation and AI business interview flow before anything else.

Do not prioritise logos, websites, or marketing until the business viability flow works well.
