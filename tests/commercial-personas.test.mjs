import assert from "node:assert/strict";
import test from "node:test";
import { origins, passports } from "../app/lib/data.ts";
import { normalizePassport, recommendTrips } from "../app/lib/recommendations.ts";

test("Passport Alias Resolution - UK, USA, Korea, UAE", () => {
  assert.equal(normalizePassport("UK"), "GB");
  assert.equal(normalizePassport("uk"), "GB");
  assert.equal(normalizePassport("Britain"), "GB");
  assert.equal(normalizePassport("USA"), "US");
  assert.equal(normalizePassport("us"), "US");
  assert.equal(normalizePassport("Korea"), "KR");
  assert.equal(normalizePassport("UAE"), "AE");
  assert.equal(normalizePassport("India"), "IN");
});

test("Persona 1: UK passport + London origin + $2000 budget - Tokyo is discovery eligible and reachable via exploration", () => {
  const ukPassport = passports.find((p) => p.countryCode === "GB");
  const londonOrigin = origins.find((o) => o.iata === "LON");
  assert.ok(ukPassport, "UK passport found");
  assert.ok(londonOrigin, "London origin found");

  // Check discovery unblocked (Tokyo is in candidates, not hard-blocked by flightCache)
  let foundTokyo = false;
  for (let offset = 0; offset < 5; offset++) {
    const results = recommendTrips({
      passport: ukPassport.id,
      origin: londonOrigin,
      budget: 2000,
      days: 7,
      preference: "Surprise me",
      offset,
    });
    if (results.some((r) => r.destination.id === "tokyo")) {
      foundTokyo = true;
      const tokyo = results.find((r) => r.destination.id === "tokyo");
      assert.equal(tokyo.destination.city, "Tokyo");
      assert.equal(tokyo.visa.status, "visa_free");
      break;
    }
  }

  assert.ok(foundTokyo, "Tokyo must be discoverable across recommendation pagination without hard cutoff");
});

test("Persona 2: Indian passport + Delhi origin + $2000 budget recommends Tokyo in Top 5", () => {
  const indianPassport = passports.find((p) => p.countryCode === "IN");
  const delhiOrigin = origins.find((o) => o.iata === "DEL");
  assert.ok(indianPassport, "Indian passport found");
  assert.ok(delhiOrigin, "Delhi origin found");

  const results = recommendTrips({
    passport: indianPassport.id,
    origin: delhiOrigin,
    budget: 2000,
    days: 7,
    preference: "Surprise me",
  });

  assert.ok(results.length > 0, "Should return recommendations");
  const tokyo = results.find((r) => r.destination.id === "tokyo");
  assert.ok(tokyo, "Tokyo must appear in India + Delhi recommendation top results");
  assert.equal(tokyo.destination.city, "Tokyo");
});
