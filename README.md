# BoothPilot AI

BoothPilot AI is an autonomous expo revenue agent for the AI Agent Olympics Hackathon. It turns a booth conversation into a qualified CRM lead with a generated follow-up.

## Demo Flow

```text
Live/Uploaded Audio
  -> Speechmatics transcript with speaker diarization
  -> Gemini badge/business card extraction
  -> Gemini Listener, Qualification, Strategy, Follow-Up agents
  -> PostgreSQL lead record
  -> Internal CRM + Lost Revenue Detector dashboard
```

## Tech Stack

- Next.js 15 full-stack app
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Recharts
- Speechmatics for transcription
- Gemini for multimodal OCR and lead reasoning
- Vultr Coolify VM for hosting frontend, backend, database, and agent logs

## Environment

Copy `.env.example` to `.env`:

```env
GEMINI_API_KEY=
SPEECHMATICS_API_KEY=
DATABASE_URL=postgresql://boothpilot:password@localhost:5432/boothpilot
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

The app includes demo fallbacks when Gemini or Speechmatics keys are missing, so the hackathon demo remains reliable.

## Local Development

```bash
npm install
docker compose up -d postgres
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Vultr Coolify Deployment

1. Create a Vultr Ubuntu VM.
2. Install Coolify from the Vultr marketplace or Coolify setup script.
3. Create a new Coolify project.
4. Add a PostgreSQL resource named `postgres`.
5. Add this app from GitHub as a Docker app.
6. Set environment variables:

```env
GEMINI_API_KEY=your_google_ai_studio_key
SPEECHMATICS_API_KEY=your_speechmatics_key
DATABASE_URL=postgresql://boothpilot:password@postgres:5432/boothpilot
NEXT_PUBLIC_APP_URL=https://your-vultr-domain.com
NODE_ENV=production
```

7. Deploy the app.
8. Run Prisma migration/setup from Coolify terminal:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

## Prize Positioning

- **Vultr:** hosts frontend, backend, PostgreSQL, transcripts, lead scores, CRM state, and agent logs.
- **Gemini:** powers badge OCR, buyer-signal extraction, BANT scoring, next-best-action strategy, and follow-up generation.
- **Speechmatics:** powers audio upload and live-recorded booth conversation transcription with diarization.

## Demo Script

1. Open the Vultr public URL.
2. Show the exhibitor profile.
3. Record or upload a booth conversation.
4. Upload a badge or business card.
5. Run BoothPilot.
6. Show the command center trace.
7. Open the hot lead in CRM.
8. Show the generated follow-up.
9. End on the Lost Revenue Detector dashboard.

Final line:

> BoothPilot turns every conference booth into an autonomous revenue engine.
