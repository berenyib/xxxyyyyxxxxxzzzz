package hu.berletikezelo.api;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class RentalController {
  private final AtomicInteger ids = new AtomicInteger(10);
  private final List<Map<String, Object>> listings = new ArrayList<>();
  private final List<Map<String, Object>> properties = new ArrayList<>();
  private final List<Map<String, Object>> maintenance = new ArrayList<>();
  private final List<Map<String, Object>> rents = new ArrayList<>();
  private final List<Map<String, Object>> activity = new ArrayList<>();

  public RentalController() {
    listings.add(listing(1, "Világos, erkélyes otthon a XI. kerületben", "Budapest", "Bartók Béla út 42.", 320000, 2, 58, "ACTIVE", "Kovács Péter", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"));
    listings.add(listing(2, "Felújított belvárosi stúdió", "Budapest", "Király utca 18.", 245000, 1, 36, "ACTIVE", null, "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"));
    listings.add(listing(3, "Családi lakás kertkapcsolattal", "Érd", "Fenyves köz 7.", 410000, 3, 86, "RENTED", "Nagy Anna", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"));

    properties.add(property(1, "Bartók Béla út 42.", "Bartók Béla út 42.", "Budapest", 320000, "OCCUPIED", "Kovács Péter", "2026-09-05", listings.get(0).get("imageUrl")));
    properties.add(property(2, "Király utca 18.", "Király utca 18.", "Budapest", 245000, "AVAILABLE", null, null, listings.get(1).get("imageUrl")));
    properties.add(property(3, "Fenyves köz 7.", "Fenyves köz 7.", "Érd", 410000, "OCCUPIED", "Nagy Anna", "2026-09-03", listings.get(2).get("imageUrl")));

    maintenance.add(maintenance(1, 1, "Bartók Béla út 42.", "Kovács Péter", "A konyhai csaptelep szivárog", "A hidegvíz oldalon lassan folyik a csap.", "OPEN", "HIGH"));
    maintenance.add(maintenance(2, 3, "Fenyves köz 7.", "Nagy Anna", "Lámpa csere a folyosón", "A mennyezeti lámpa villog.", "IN_PROGRESS", "MEDIUM"));
    rents.add(rent(1, 1, "Bartók Béla út 42.", "Kovács Péter", 320000, "2026-09-05", "PAID"));
    rents.add(rent(2, 3, "Fenyves köz 7.", "Nagy Anna", 410000, "2026-09-03", "PENDING"));
    rents.add(rent(3, 1, "Bartók Béla út 42.", "Kovács Péter", 320000, "2026-08-05", "OVERDUE"));
    activity.add(event(1, "maintenance", "Új karbantartási kérelem", "A Bartók Béla úti lakásnál új kérelem érkezett."));
    activity.add(event(2, "payment", "Bérleti díj megérkezett", "Kovács Péter szeptemberi díja rendezve."));
    activity.add(event(3, "listing", "Hirdetés aktiválva", "A Király utcai stúdió megjelent a hirdetések között."));
  }

  @GetMapping("/healthz")
  public Map<String, String> health() { return Map.of("status", "ok"); }

  @GetMapping("/dashboard/summary")
  public Map<String, Object> summary() {
    long paid = rents.stream().filter(r -> "PAID".equals(r.get("status"))).count();
    double pending = rents.stream().filter(r -> !"PAID".equals(r.get("status"))).mapToDouble(r -> ((Number) r.get("amount")).doubleValue()).sum();
    return Map.of("totalProperties", properties.size(), "activeListings", listings.stream().filter(l -> "ACTIVE".equals(l.get("status"))).count(), "occupiedProperties", properties.stream().filter(p -> "OCCUPIED".equals(p.get("status"))).count(), "openMaintenance", maintenance.stream().filter(m -> Set.of("OPEN", "IN_PROGRESS").contains(m.get("status"))).count(), "pendingRentTotal", pending, "paidRentPercent", Math.round((paid * 100.0) / rents.size()));
  }

  @GetMapping("/activity")
  public List<Map<String, Object>> activity() { return activity.stream().limit(8).toList(); }

  @GetMapping("/listings")
  public List<Map<String, Object>> getListings(@RequestParam(required = false) String search, @RequestParam(required = false) String city, @RequestParam(required = false) Double minPrice, @RequestParam(required = false) Double maxPrice) {
    return listings.stream().filter(l -> search == null || (l.get("title") + " " + l.get("address") + " " + l.get("city")).toLowerCase().contains(search.toLowerCase())).filter(l -> city == null || l.get("city").toString().equalsIgnoreCase(city)).filter(l -> minPrice == null || ((Number) l.get("price")).doubleValue() >= minPrice).filter(l -> maxPrice == null || ((Number) l.get("price")).doubleValue() <= maxPrice).toList();
  }

  @PostMapping("/listings")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> createListing(@RequestBody Map<String, Object> body) {
    Map<String, Object> listing = new HashMap<>(body);
    listing.put("id", ids.getAndIncrement()); listing.putIfAbsent("status", "DRAFT"); listing.putIfAbsent("tenantName", null);
    listings.add(0, listing); addEvent("listing", "Új hirdetés létrehozva", String.valueOf(listing.get("title"))); return listing;
  }

  @GetMapping("/listings/{id}")
  public ResponseEntity<Map<String, Object>> getListing(@PathVariable int id) { return find(listings, id); }

  @PatchMapping("/listings/{id}")
  public ResponseEntity<Map<String, Object>> updateListing(@PathVariable int id, @RequestBody Map<String, Object> body) { return update(listings, id, body, "Hirdetés frissítve"); }

  @DeleteMapping("/listings/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteListing(@PathVariable int id) { listings.removeIf(l -> Objects.equals(l.get("id"), id)); }

  @GetMapping("/properties")
  public List<Map<String, Object>> getProperties() { return properties; }

  @PostMapping("/properties")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> createProperty(@RequestBody Map<String, Object> body) { Map<String, Object> p = new HashMap<>(body); p.put("id", ids.getAndIncrement()); p.putIfAbsent("status", "AVAILABLE"); p.putIfAbsent("tenantName", null); p.putIfAbsent("nextPaymentDate", null); properties.add(0, p); return p; }

  @PatchMapping("/properties/{id}")
  public ResponseEntity<Map<String, Object>> updateProperty(@PathVariable int id, @RequestBody Map<String, Object> body) { return update(properties, id, body, "Ingatlan frissítve"); }

  @DeleteMapping("/properties/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteProperty(@PathVariable int id) { properties.removeIf(p -> Objects.equals(p.get("id"), id)); }

  @GetMapping("/maintenance")
  public List<Map<String, Object>> getMaintenance(@RequestParam(required = false) String status) { return status == null ? maintenance : maintenance.stream().filter(m -> status.equals(m.get("status"))).toList(); }

  @PostMapping("/maintenance")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> createMaintenance(@RequestBody Map<String, Object> body) { Map<String, Object> item = new HashMap<>(body); int propertyId = ((Number) body.get("propertyId")).intValue(); Map<String, Object> p = properties.stream().filter(x -> Objects.equals(x.get("id"), propertyId)).findFirst().orElse(Map.of()); item.put("id", ids.getAndIncrement()); item.put("propertyName", p.getOrDefault("name", "Ingatlan")); item.put("tenantName", p.getOrDefault("tenantName", "Bérlő")); item.put("status", "OPEN"); item.put("createdAt", Instant.now().toString()); maintenance.add(0, item); addEvent("maintenance", "Új karbantartási kérelem", String.valueOf(item.get("title"))); return item; }

  @PatchMapping("/maintenance/{id}")
  public ResponseEntity<Map<String, Object>> updateMaintenance(@PathVariable int id, @RequestBody Map<String, Object> body) { return update(maintenance, id, body, "Karbantartási kérelem frissítve"); }

  @GetMapping("/rents")
  public List<Map<String, Object>> getRents() { return rents; }

  @PostMapping("/rents")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> createRent(@RequestBody Map<String, Object> body) { Map<String, Object> item = new HashMap<>(body); int propertyId = ((Number) body.get("propertyId")).intValue(); Map<String, Object> p = properties.stream().filter(x -> Objects.equals(x.get("id"), propertyId)).findFirst().orElse(Map.of()); item.put("id", ids.getAndIncrement()); item.put("propertyName", p.getOrDefault("name", "Ingatlan")); item.putIfAbsent("status", "PENDING"); rents.add(0, item); return item; }

  @PatchMapping("/rents/{id}")
  public ResponseEntity<Map<String, Object>> updateRent(@PathVariable int id, @RequestBody Map<String, Object> body) { return update(rents, id, body, "Bérleti díj frissítve"); }

  private ResponseEntity<Map<String, Object>> update(List<Map<String, Object>> source, int id, Map<String, Object> body, String eventTitle) {
    Optional<Map<String, Object>> found = source.stream().filter(x -> Objects.equals(x.get("id"), id)).findFirst();
    if (found.isEmpty()) return ResponseEntity.notFound().build();
    found.get().putAll(body); addEvent("update", eventTitle, String.valueOf(found.get().getOrDefault("name", found.get().getOrDefault("title", found.get().getOrDefault("propertyName", "Módosítás"))))); return ResponseEntity.ok(found.get());
  }

  private ResponseEntity<Map<String, Object>> find(List<Map<String, Object>> source, int id) { return source.stream().filter(x -> Objects.equals(x.get("id"), id)).findFirst().map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build()); }
  private void addEvent(String type, String title, String description) { activity.add(0, event(ids.getAndIncrement(), type, title, description)); }
  private Map<String, Object> event(int id, String type, String title, String description) { return new HashMap<>(Map.of("id", id, "type", type, "title", title, "description", description, "createdAt", Instant.now().toString())); }
  private Map<String, Object> listing(int id, String title, String city, String address, int price, int bedrooms, int size, String status, String tenant, String image) { return new HashMap<>(Map.of("id", id, "title", title, "city", city, "address", address, "price", price, "bedrooms", bedrooms, "size", size, "status", status, "imageUrl", image, "tenantName", tenant == null ? "" : tenant)); }
  private Map<String, Object> property(int id, String name, String address, String city, int price, String status, String tenant, String next, Object image) { Map<String, Object> p = new HashMap<>(Map.of("id", id, "name", name, "address", address, "city", city, "price", price, "status", status, "imageUrl", image)); p.put("tenantName", tenant); p.put("nextPaymentDate", next); return p; }
  private Map<String, Object> maintenance(int id, int propertyId, String property, String tenant, String title, String desc, String status, String priority) { return new HashMap<>(Map.of("id", id, "propertyId", propertyId, "propertyName", property, "tenantName", tenant, "title", title, "description", desc, "status", status, "priority", priority, "createdAt", Instant.now().toString())); }
  private Map<String, Object> rent(int id, int propertyId, String property, String tenant, int amount, String due, String status) { return new HashMap<>(Map.of("id", id, "propertyId", propertyId, "propertyName", property, "tenantName", tenant, "amount", amount, "dueDate", due, "status", status)); }
}