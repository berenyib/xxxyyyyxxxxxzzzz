import { Router, type IRouter } from "express";
import {
  CreateListingBody,
  CreateMaintenanceRequestBody,
  CreatePropertyBody,
  CreateRentBody,
  CreateListingResponse,
  CreateMaintenanceRequestResponse,
  CreatePropertyResponse,
  CreateRentResponse,
  DeleteListingParams,
  DeletePropertyParams,
  GetActivityResponse,
  GetDashboardSummaryResponse,
  GetListingParams,
  GetListingResponse,
  ListListingsQueryParams,
  ListListingsResponse,
  ListMaintenanceRequestsQueryParams,
  ListMaintenanceRequestsResponse,
  ListPropertiesResponse,
  ListRentsResponse,
  UpdateListingBody,
  UpdateListingParams,
  UpdateListingResponse,
  UpdateMaintenanceRequestBody,
  UpdateMaintenanceRequestParams,
  UpdateMaintenanceRequestResponse,
  UpdatePropertyBody,
  UpdatePropertyParams,
  UpdatePropertyResponse,
  UpdateRentBody,
  UpdateRentParams,
  UpdateRentResponse,
} from "@workspace/api-zod";

type Listing = {
  id: number;
  title: string;
  city: string;
  address: string;
  price: number;
  bedrooms: number;
  size: number;
  status: "ACTIVE" | "DRAFT" | "RENTED";
  imageUrl: string;
  description?: string;
  tenantName?: string | null;
};

type Property = {
  id: number;
  name: string;
  address: string;
  city: string;
  price: number;
  status: "OCCUPIED" | "AVAILABLE" | "MAINTENANCE";
  imageUrl: string;
  tenantName: string | null;
  nextPaymentDate?: string | null;
};

type Maintenance = {
  id: number;
  propertyId: number;
  propertyName: string;
  tenantName: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
};

type Rent = {
  id: number;
  propertyId: number;
  propertyName: string;
  tenantName: string;
  amount: number;
  dueDate: string;
  status: "PAID" | "PENDING" | "OVERDUE";
};

type Activity = {
  id: number;
  type: string;
  title: string;
  description: string;
  createdAt: string;
};

const listings: Listing[] = [
  {
    id: 1,
    title: "Világos, erkélyes otthon a XI. kerületben",
    city: "Budapest",
    address: "Bartók Béla út 42.",
    price: 320000,
    bedrooms: 2,
    size: 58,
    status: "ACTIVE",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    description: "Csendes, napfényes lakás nagy erkéllyel és modern konyhával.",
    tenantName: null,
  },
  {
    id: 2,
    title: "Felújított belvárosi stúdió",
    city: "Budapest",
    address: "Király utca 18.",
    price: 245000,
    bedrooms: 1,
    size: 36,
    status: "ACTIVE",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    description: "Kompakt és stílusos stúdió a város szívében.",
    tenantName: null,
  },
  {
    id: 3,
    title: "Családi lakás kertkapcsolattal",
    city: "Érd",
    address: "Fenyves köz 7.",
    price: 410000,
    bedrooms: 3,
    size: 86,
    status: "RENTED",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    description: "Tágas, kertkapcsolatos otthon nyugodt környéken.",
    tenantName: "Nagy Anna",
  },
];

const properties: Property[] = [
  {
    id: 1,
    name: "Bartók Béla út 42.",
    address: "Bartók Béla út 42.",
    city: "Budapest",
    price: 320000,
    status: "OCCUPIED",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    tenantName: "Kovács Péter",
    nextPaymentDate: "2026-09-05",
  },
  {
    id: 2,
    name: "Király utca 18.",
    address: "Király utca 18.",
    city: "Budapest",
    price: 245000,
    status: "AVAILABLE",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    tenantName: null,
    nextPaymentDate: null,
  },
  {
    id: 3,
    name: "Fenyves köz 7.",
    address: "Fenyves köz 7.",
    city: "Érd",
    price: 410000,
    status: "OCCUPIED",
    imageUrl:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
    tenantName: "Nagy Anna",
    nextPaymentDate: "2026-09-03",
  },
];

const maintenance: Maintenance[] = [
  {
    id: 1,
    propertyId: 1,
    propertyName: "Bartók Béla út 42.",
    tenantName: "Kovács Péter",
    title: "A konyhai csaptelep szivárog",
    description: "A hidegvíz oldalon lassan folyik a csap, főleg használat után.",
    status: "OPEN",
    priority: "HIGH",
    createdAt: "2026-09-14T09:12:00.000Z",
  },
  {
    id: 2,
    propertyId: 3,
    propertyName: "Fenyves köz 7.",
    tenantName: "Nagy Anna",
    title: "Lámpa csere a folyosón",
    description: "A mennyezeti lámpa villog, izzócserével nem oldódott meg.",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    createdAt: "2026-09-12T14:35:00.000Z",
  },
];

const rents: Rent[] = [
  { id: 1, propertyId: 1, propertyName: "Bartók Béla út 42.", tenantName: "Kovács Péter", amount: 320000, dueDate: "2026-09-05", status: "PAID" },
  { id: 2, propertyId: 3, propertyName: "Fenyves köz 7.", tenantName: "Nagy Anna", amount: 410000, dueDate: "2026-09-03", status: "PENDING" },
  { id: 3, propertyId: 1, propertyName: "Bartók Béla út 42.", tenantName: "Kovács Péter", amount: 320000, dueDate: "2026-08-05", status: "OVERDUE" },
];

const activity: Activity[] = [
  { id: 1, type: "maintenance", title: "Új karbantartási kérelem", description: "A Bartók Béla úti lakásnál új kérelem érkezett.", createdAt: "2026-09-14T09:12:00.000Z" },
  { id: 2, type: "payment", title: "Bérleti díj megérkezett", description: "Kovács Péter szeptemberi díja rendezve.", createdAt: "2026-09-13T11:30:00.000Z" },
  { id: 3, type: "listing", title: "Hirdetés aktiválva", description: "A Király utcai stúdió megjelent a hirdetések között.", createdAt: "2026-09-11T16:05:00.000Z" },
];

let nextId = 10;
const now = () => new Date().toISOString();
const idFrom = (value: string | string[]) => Number(Array.isArray(value) ? value[0] : value);
const recordActivity = (type: string, title: string, description: string) => {
  activity.unshift({ id: nextId++, type, title, description, createdAt: now() });
};

const router: IRouter = Router();

router.get("/dashboard/summary", (_req, res): void => {
  const paid = rents.filter((rent) => rent.status === "PAID").length;
  res.json(GetDashboardSummaryResponse.parse({
    totalProperties: properties.length,
    activeListings: listings.filter((listing) => listing.status === "ACTIVE").length,
    occupiedProperties: properties.filter((property) => property.status === "OCCUPIED").length,
    openMaintenance: maintenance.filter((request) => request.status === "OPEN" || request.status === "IN_PROGRESS").length,
    pendingRentTotal: rents.filter((rent) => rent.status !== "PAID").reduce((total, rent) => total + rent.amount, 0),
    paidRentPercent: Math.round((paid / Math.max(rents.length, 1)) * 100),
  }));
});

router.get("/activity", (_req, res): void => {
  res.json(GetActivityResponse.parse(activity.slice(0, 8)));
});

router.get("/listings", (req, res): void => {
  const parsed = ListListingsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, city, minPrice, maxPrice } = parsed.data;
  const normalized = search?.toLowerCase();
  const result = listings.filter((listing) =>
    (!normalized || `${listing.title} ${listing.address} ${listing.city}`.toLowerCase().includes(normalized)) &&
    (!city || listing.city.toLowerCase() === city.toLowerCase()) &&
    (minPrice === undefined || listing.price >= minPrice) &&
    (maxPrice === undefined || listing.price <= maxPrice),
  );
  res.json(ListListingsResponse.parse(result));
});

router.post("/listings", (req, res): void => {
  const parsed = CreateListingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const listing: Listing = { id: nextId++, status: "DRAFT", tenantName: null, ...parsed.data };
  listings.unshift(listing);
  recordActivity("listing", "Új hirdetés létrehozva", listing.title);
  res.status(201).json(CreateListingResponse.parse(listing));
});

router.get("/listings/:id", (req, res): void => {
  const parsed = GetListingParams.safeParse({ id: idFrom(req.params.id) });
  const listing = parsed.success ? listings.find((item) => item.id === parsed.data.id) : undefined;
  if (!listing) {
    res.status(404).json({ error: "A hirdetés nem található." });
    return;
  }
  res.json(GetListingResponse.parse(listing));
});

router.patch("/listings/:id", (req, res): void => {
  const params = UpdateListingParams.safeParse({ id: idFrom(req.params.id) });
  const body = UpdateListingBody.safeParse(req.body);
  const listing = params.success ? listings.find((item) => item.id === params.data.id) : undefined;
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Érvénytelen hirdetés." });
    return;
  }
  if (!listing) {
    res.status(404).json({ error: "A hirdetés nem található." });
    return;
  }
  Object.assign(listing, body.data);
  recordActivity("listing", "Hirdetés frissítve", listing.title);
  res.json(UpdateListingResponse.parse(listing));
});

router.delete("/listings/:id", (req, res): void => {
  const parsed = DeleteListingParams.safeParse({ id: idFrom(req.params.id) });
  const index = parsed.success ? listings.findIndex((item) => item.id === parsed.data.id) : -1;
  if (index < 0) {
    res.status(404).json({ error: "A hirdetés nem található." });
    return;
  }
  const [removed] = listings.splice(index, 1);
  recordActivity("listing", "Hirdetés törölve", removed.title);
  res.sendStatus(204);
});

router.get("/properties", (_req, res): void => {
  res.json(ListPropertiesResponse.parse(properties));
});

router.post("/properties", (req, res): void => {
  const parsed = CreatePropertyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const property: Property = { id: nextId++, status: "AVAILABLE", tenantName: null, nextPaymentDate: null, ...parsed.data };
  properties.unshift(property);
  recordActivity("property", "Új ingatlan hozzáadva", property.name);
  res.status(201).json(CreatePropertyResponse.parse(property));
});

router.patch("/properties/:id", (req, res): void => {
  const params = UpdatePropertyParams.safeParse({ id: idFrom(req.params.id) });
  const body = UpdatePropertyBody.safeParse(req.body);
  const property = params.success ? properties.find((item) => item.id === params.data.id) : undefined;
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Érvénytelen ingatlan." });
    return;
  }
  if (!property) {
    res.status(404).json({ error: "Az ingatlan nem található." });
    return;
  }
  Object.assign(property, body.data);
  res.json(UpdatePropertyResponse.parse(property));
});

router.delete("/properties/:id", (req, res): void => {
  const parsed = DeletePropertyParams.safeParse({ id: idFrom(req.params.id) });
  const index = parsed.success ? properties.findIndex((item) => item.id === parsed.data.id) : -1;
  if (index < 0) {
    res.status(404).json({ error: "Az ingatlan nem található." });
    return;
  }
  properties.splice(index, 1);
  res.sendStatus(204);
});

router.get("/maintenance", (req, res): void => {
  const parsed = ListMaintenanceRequestsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const result = parsed.data.status ? maintenance.filter((item) => item.status === parsed.data.status) : maintenance;
  res.json(ListMaintenanceRequestsResponse.parse(result));
});

router.post("/maintenance", (req, res): void => {
  const parsed = CreateMaintenanceRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const property = properties.find((item) => item.id === parsed.data.propertyId);
  if (!property) {
    res.status(404).json({ error: "Az ingatlan nem található." });
    return;
  }
  const request: Maintenance = { id: nextId++, propertyName: property.name, tenantName: property.tenantName ?? "Bérlő", status: "OPEN", createdAt: now(), ...parsed.data };
  maintenance.unshift(request);
  recordActivity("maintenance", "Új karbantartási kérelem", request.title);
  res.status(201).json(CreateMaintenanceRequestResponse.parse(request));
});

router.patch("/maintenance/:id", (req, res): void => {
  const params = UpdateMaintenanceRequestParams.safeParse({ id: idFrom(req.params.id) });
  const body = UpdateMaintenanceRequestBody.safeParse(req.body);
  const request = params.success ? maintenance.find((item) => item.id === params.data.id) : undefined;
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Érvénytelen karbantartási kérelem." });
    return;
  }
  if (!request) {
    res.status(404).json({ error: "A kérelem nem található." });
    return;
  }
  Object.assign(request, body.data);
  recordActivity("maintenance", "Karbantartási kérelem frissítve", request.title);
  res.json(UpdateMaintenanceRequestResponse.parse(request));
});

router.get("/rents", (_req, res): void => {
  res.json(ListRentsResponse.parse(rents));
});

router.post("/rents", (req, res): void => {
  const parsed = CreateRentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const property = properties.find((item) => item.id === parsed.data.propertyId);
  const rent: Rent = { id: nextId++, propertyName: property?.name ?? "Ismeretlen ingatlan", status: "PENDING", ...parsed.data };
  rents.unshift(rent);
  res.status(201).json(CreateRentResponse.parse(rent));
});

router.patch("/rents/:id", (req, res): void => {
  const params = UpdateRentParams.safeParse({ id: idFrom(req.params.id) });
  const body = UpdateRentBody.safeParse(req.body);
  const rent = params.success ? rents.find((item) => item.id === params.data.id) : undefined;
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Érvénytelen bérleti díj." });
    return;
  }
  if (!rent) {
    res.status(404).json({ error: "A bérleti díj nem található." });
    return;
  }
  Object.assign(rent, body.data);
  recordActivity("payment", "Bérleti díj frissítve", rent.propertyName);
  res.json(UpdateRentResponse.parse(rent));
});

export default router;