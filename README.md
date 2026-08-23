# SkillTree MAP

Interactive constellation map inspired by SkillTree’s MAP experience — Next.js App Router, ready for Vercel.

## What’s in v1

- Shared chrome: search (UI), `MAP | DASHBOARDS | CHART`, Book a call
- MAP: starfield, 7-department wheel, dive into radial fan, pan/zoom, skill detail card
- Stub data: all 7 departments with reduced job sets
- `/dashboards` and `/chart` placeholders for later iteration

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

```bash
npx vercel
```

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Fonts: Plus Jakarta Sans + Marcellus via `next/font`
- Custom CSS camera (`translate` + `scale`) — no React Flow / Three.js
