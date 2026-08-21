import visaRulesData from "./data/visa-rules.json";
import { normalizePassport } from "./recommendations";

export type VisaRuleStatus =
  | "visa_free"
  | "visa_on_arrival"
  | "evisa"
  | "visa_required"
  | "unknown";

export type VisaStatusResult = {
  status: VisaRuleStatus;
};

type VisaRuleItem = {
  passportCode: string;
  destinationCountryCode: string;
  status: string;
};

const visaRulesList = visaRulesData as unknown as VisaRuleItem[];

// Fast O(1) Map lookup
const visaMatrixMap = new Map<string, VisaRuleStatus>();
for (const rule of visaRulesList) {
  visaMatrixMap.set(
    `${rule.passportCode.toUpperCase()}_${rule.destinationCountryCode.toUpperCase()}`,
    rule.status as VisaRuleStatus,
  );
}

/**
 * Resolves verified travel visa status for a passport and destination country.
 * Returns { status: "unknown" } if not found — never falls back to "visa_required".
 */
export function getVisaStatus(
  passportCode: string,
  destinationCountryCode: string,
): VisaStatusResult {
  if (!passportCode || !destinationCountryCode) {
    return { status: "unknown" };
  }

  const pCode = normalizePassport(passportCode).toUpperCase();
  const dCode = destinationCountryCode.trim().toUpperCase();

  const status = visaMatrixMap.get(`${pCode}_${dCode}`);
  if (status) {
    return { status };
  }

  return { status: "unknown" };
}
