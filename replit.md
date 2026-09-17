# Bérleti kezelő

Modern bérleti hirdető és kezelő alkalmazás, amely egy helyen fogja össze az ingatlanokat, hirdetéseket, karbantartási ügyeket és bérleti díjakat.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the Spring Boot API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `PORT=24952 BASE_PATH=/ pnpm --filter @workspace/berleti-kezelo run build` — build the Angular frontend
- `pnpm --filter @workspace/api-server run build` — package the Spring Boot JAR
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Java 17+ / Spring Boot 3.2
- Frontend: Angular 17 standalone components, Vite development server
- API: Spring Boot REST
- DB: PostgreSQL + Drizzle ORM
- API contract: OpenAPI (`lib/api-spec/openapi.yaml`)
- Frontend build: Vite
- API build: Maven Spring Boot JAR

## Where things live

- `artifacts/berleti-kezelo/src/app.component.ts` — Angular főkomponens, API-hívásokkal és navigációval
- `artifacts/berleti-kezelo/src/app.component.html` — az Angular felület nézetei
- `artifacts/berleti-kezelo/src/app.component.css` — az Angular alkalmazás stílusai
- `artifacts/api-server/spring/src/main/java/hu/berletikezelo/api/RentalController.java` — a Spring REST API
- `artifacts/api-server/src/routes/rental.ts` — a korábbi Express MVP referenciaimplementációja
- `lib/api-spec/openapi.yaml` — az API egyetlen szerződésforrása
- `lib/api-client-react/src/generated/` — a generált React Query kliens

## Architecture decisions

- Az első verzió REST-alapú, hogy a fő CRUD-folyamatok stabilak legyenek; GraphQL és WebSocket későbbi iterációban kerül be.
- Az MVP demó szerepkör-választást használ, így a teljes bérbeadói felület azonnal kipróbálható; valódi hitelesítés a következő biztonsági fázis.
- Az API jelenleg gyorsan indítható, memóriában seedelt bemutató adatokkal működik; a PostgreSQL/Drizzle perzisztencia bevezetése a következő lépés.
- A Spring Boot API ugyanazokat az `/api` REST-végpontokat biztosítja, mint a korábbi MVP, így az Angular átállás nem változtatja meg a kliens szerződését.

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
- A frontend artifact workflow biztosítja a `PORT` és `BASE_PATH` értékeket; a Vite buildet ezekkel a változókkal kell futtatni.
- A kliens TypeScript-konfigurációjához szükséges a `dom.iterable`, mert a generált kliens a `Headers.entries()` API-t használja.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
