import fs from "fs";
import path from "path";
import { destinations, passports } from "../app/lib/data";

const targetPassportCodes = [
  "US",
  "GB",
  "CA",
  "AU",
  "IN",
  "CN",
  "DE",
  "FR",
  "ES",
  "NL",
  "JP",
  "KR",
  "SG",
  "AE",
  "SA",
];

// Unique destination country codes
const destinationCountryCodes = Array.from(
  new Set(destinations.map((d) => d.countryCode)),
).sort();

// Read CSV
const csvPath = path.resolve(process.cwd(), "passport-index-tidy-iso2.csv");
const csvContent = fs.readFileSync(csvPath, "utf8");
const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);

const csvMap = new Map<string, string>();
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(",");
  if (parts.length >= 3) {
    const p = parts[0].trim().toUpperCase();
    const d = parts[1].trim().toUpperCase();
    const req = parts[2].trim().toLowerCase();
    csvMap.set(`${p}_${d}`, req);
  }
}

export type VisaRuleEntry = {
  passportCode: string;
  destinationCountryCode: string;
  status: "visa_free" | "visa_on_arrival" | "evisa" | "visa_required" | "unknown";
};

export function mapRequirementToStatus(
  req: string | undefined,
): "visa_free" | "visa_on_arrival" | "evisa" | "visa_required" | "unknown" {
  if (!req) return "unknown";
  const r = req.trim().toLowerCase();
  if (r === "visa free" || /^\d+$/.test(r)) return "visa_free";
  if (r === "visa on arrival") return "visa_on_arrival";
  if (r === "eta" || r === "e-visa" || r === "evisa") return "evisa";
  if (r === "visa required" || r === "no admission") return "visa_required";
  if (r === "-1") return "visa_free"; // passport equals destination country
  return "unknown";
}

const visaRules: VisaRuleEntry[] = [];
for (const p of targetPassportCodes) {
  for (const d of destinationCountryCodes) {
    const key = `${p}_${d}`;
    const raw = csvMap.get(key) ?? (p === d ? "-1" : undefined);
    const status = mapRequirementToStatus(raw);
    visaRules.push({
      passportCode: p,
      destinationCountryCode: d,
      status,
    });
  }
}

const outputPath = path.resolve(process.cwd(), "app/lib/data/visa-rules.json");
fs.writeFileSync(outputPath, JSON.stringify(visaRules, null, 2), "utf8");
console.log(`Generated ${visaRules.length} visa rules at ${outputPath}`);
