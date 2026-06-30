# Car Match

## What I built and why
Car Match is a compact full-stack MVP that helps a confused car buyer move from uncertainty to a shortlist quickly. A short questionnaire gathers budget, body style, daily usage, safety preference, and fuel-efficiency priority, then the backend ranks a small dataset of cars and returns the best fits.

## What I deliberately cut
- No authentication or user accounts
- No real vehicle inventory or live pricing feeds
- No advanced filtering, comparison charts, or saved shortlists
- No polished design system beyond a clear, functional experience

## Tech stack
- React + Vite for the frontend experience
- Express for the backend API and recommendation logic
- CSS for the layout and styling
- Node.js for local development and deployment readiness

## What was delegated to AI vs. done manually
- AI-assisted: initial scaffold, backend scoring logic, UI structure, and styling
- Manual: product scoping, data choices, wording, and verification of the end-to-end experience

## Where the tools helped most
- Fast scaffolding of the app structure
- Rapid iteration on the recommendation logic and UI layout

## Where they got in the way
- They occasionally over-generated code that needed trimming back to keep the MVP focused
- Some small UI and copy decisions were easier to adjust manually

## If I had another 4 hours
- Add persistent shortlists and comparison cards
- Connect to a richer car dataset and real review summaries
- Add charts for price, safety, and mileage trade-offs
- Improve accessibility and mobile polish

## Run locally
```bash
npm install
npm run dev
```
Then open http://localhost:3000
