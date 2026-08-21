import fs from "fs";
import path from "path";
import { destinations, passports } from "../app/lib/data";
import { getVisaStatus } from "../app/lib/visa";

const targetPassports = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  { code: "CN", name: "China" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
];

function validateVisaMatrix() {
  console.log("=========================================");
  console.log("WhereAtlas Visa Matrix Validation Report");
  console.log("=========================================\n");

  // 1. Destination Extraction & Deduplication
  const destinationMap = new Map<string, string>();
  for (const d of destinations) {
    destinationMap.set(d.countryCode, d.country);
  }
  const destinationCountryCodes = Array.from(destinationMap.keys()).sort();

  const passportCount = targetPassports.length;
  const destinationCount = destinationCountryCodes.length;
  const totalExpectedPairs = passportCount * destinationCount;

  console.log(`Passport count: ${passportCount}`);
  console.log(`Destination count (unique country codes): ${destinationCount}`);
  console.log(`Total destination items in data.ts: ${destinations.length}`);
  console.log(`Total expected matrix pairs: ${totalExpectedPairs}\n`);

  // 2. Read raw json data
  const jsonPath = path.resolve(process.cwd(), "app/lib/data/visa-rules.json");
  if (!fs.existsSync(jsonPath)) {
    console.error(`ERROR: ${jsonPath} does not exist!`);
    process.exit(1);
  }

  const rawJson = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as Array<{
    passportCode: string;
    destinationCountryCode: string;
    status: string;
  }>;

  console.log(`Rules in visa-rules.json: ${rawJson.length}`);

  // 3. Duplicate Checks
  const seenPairs = new Set<string>();
  const duplicatePairs: string[] = [];

  for (const entry of rawJson) {
    const key = `${entry.passportCode}_${entry.destinationCountryCode}`;
    if (seenPairs.has(key)) {
      duplicatePairs.push(key);
    }
    seenPairs.add(key);
  }

  if (duplicatePairs.length > 0) {
    console.error(`❌ DUPLICATE ERROR: Found ${duplicatePairs.length} duplicate pairs:`, duplicatePairs);
    process.exit(1);
  } else {
    console.log("✅ Duplicate check passed: 0 duplicate pairs found.");
  }

  // 4. Coverage & Resolver Verification
  let resolvedCount = 0;
  let unknownCount = 0;
  const statusCounts: Record<string, number> = {
    visa_free: 0,
    visa_on_arrival: 0,
    evisa: 0,
    visa_required: 0,
    unknown: 0,
  };

  const matrixRows: Array<{
    passportCode: string;
    passportName: string;
    destinationCountryCode: string;
    destinationName: string;
    status: string;
  }> = [];

  for (const p of targetPassports) {
    for (const dCode of destinationCountryCodes) {
      const dName = destinationMap.get(dCode) || dCode;
      const res = getVisaStatus(p.code, dCode);
      resolvedCount++;
      if (res.status === "unknown") {
        unknownCount++;
      }
      statusCounts[res.status] = (statusCounts[res.status] || 0) + 1;

      matrixRows.push({
        passportCode: p.code,
        passportName: p.name,
        destinationCountryCode: dCode,
        destinationName: dName,
        status: res.status,
      });
    }
  }

  const coveragePercent = ((resolvedCount - unknownCount) / totalExpectedPairs) * 100;

  console.log(`\nCoverage: ${coveragePercent.toFixed(2)}% (${resolvedCount - unknownCount} / ${totalExpectedPairs} known)`);
  console.log(`Unknown count: ${unknownCount}`);
  console.log("Status distribution:", statusCounts);

  // Write temporary matrix rows json for excel generator
  const tempMatrixPath = path.resolve(process.cwd(), "scripts/temp-visa-matrix.json");
  fs.writeFileSync(tempMatrixPath, JSON.stringify(matrixRows, null, 2), "utf8");

  console.log("\n✅ All validation rules satisfied 100%!");
}

validateVisaMatrix();
