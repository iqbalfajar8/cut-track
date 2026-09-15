# CutTrack MVP
Personal cutting tracker (Next.js + Supabase), optimized as a mobile/PWA-style dashboard.

## Run
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill Supabase URL + anon key.
3. Run `supabase/schema.sql` in Supabase SQL Editor.
4. `npm run dev`

Without Supabase env vars, the UI still runs in demo mode.

## MVP included
- 77 kg → 65 kg progress dashboard
- Daily weight + waist check-in
- 8 daily habits: calories, protein, workout, steps, water, creatine, sleep, IF 16:8
- Supabase persistence via `daily_logs`
- Mobile-first dark UI
# cut-track
