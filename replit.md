# Bérleti kezelő

Modern bérleti hirdető és kezelő alkalmazás, amely egy helyen fogja össze az ingatlanokat, hirdetéseket, karbantartási ügyeket és bérleti díjakat.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/berleti-kezelo/src/App.tsx` — a teljes reszponzív alkalmazásfelület és az oldalak
- `artifacts/berleti-kezelo/src/index.css` — alkalmazás-téma és vizuális tokenek
- `artifacts/api-server/src/routes/rental.ts` — a hirdetési, ingatlan-, karbantartási és bérleti díj API
- `lib/api-spec/openapi.yaml` — az API egyetlen szerződésforrása
- `lib/api-client-react/src/generated/` — a generált React Query kliens

## Architecture decisions

- Az első verzió REST-alapú, hogy a fő CRUD-folyamatok stabilak legyenek; GraphQL és WebSocket későbbi iterációban kerül be.
- Az MVP demó szerepkör-választást használ, így a teljes bérbeadói felület azonnal kipróbálható; valódi hitelesítés a következő biztonsági fázis.
- Az API jelenleg gyorsan indítható, memóriában seedelt bemutató adatokkal működik; a PostgreSQL/Drizzle perzisztencia bevezetése a következő lépés.
- Az OpenAPI szerződésből készülnek a kliens hookok, ezért a frontend nem kézzel írt API-típusokra támaszkodik.

## Product

- Dashboard áttekintő ingatlan-, hirdetés-, karbantartási- és fizetési mutatókkal.
- Hirdetések keresése, szűrése, létrehozása, módosítása és törlése.
- Ingatlanportfólió kezelése.
- Karbantartási kérelmek beküldése, szűrése és állapotváltása.
- Bérleti díjak rögzítése, követése és státuszkezelése.
- Közös naptárnézet a fizetési és karbantartási eseményekkel.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- OpenAPI módosítás után mindig futtatni kell a `pnpm --filter @workspace/api-spec run codegen` parancsot.
- A frontend artifact workflow biztosítja a `PORT` és `BASE_PATH` értékeket; a Vite buildet workflow-n keresztül kell futtatni.
- A kliens TypeScript-konfigurációjához szükséges a `dom.iterable`, mert a generált kliens a `Headers.entries()` API-t használja.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
