import type { Hono } from "hono";

// ─── Country prefix database (50+ countries) ────────────────────────────────
interface CountryInfo {
  code: string;       // ISO 3166-1 alpha-2
  name: string;
  prefix: string;     // e.g. "+1"
  mobileLength: number[];  // valid digit counts (after country code)
  landlineLength: number[];
  mobileStartDigits?: string[]; // digit(s) after country code that indicate mobile
}

const COUNTRY_DB: CountryInfo[] = [
  // North America
  { code: "US", name: "United States", prefix: "+1", mobileLength: [10], landlineLength: [10] },
  { code: "CA", name: "Canada", prefix: "+1", mobileLength: [10], landlineLength: [10] },

  // Europe
  { code: "GB", name: "United Kingdom", prefix: "+44", mobileLength: [10], landlineLength: [10], mobileStartDigits: ["7"] },
  { code: "FR", name: "France", prefix: "+33", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["6", "7"] },
  { code: "DE", name: "Germany", prefix: "+49", mobileLength: [10, 11], landlineLength: [5, 6, 7, 8, 9, 10, 11], mobileStartDigits: ["15", "16", "17"] },
  { code: "IT", name: "Italy", prefix: "+39", mobileLength: [9, 10], landlineLength: [6, 7, 8, 9, 10], mobileStartDigits: ["3"] },
  { code: "ES", name: "Spain", prefix: "+34", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["6", "7"] },
  { code: "PT", name: "Portugal", prefix: "+351", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["9"] },
  { code: "NL", name: "Netherlands", prefix: "+31", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["6"] },
  { code: "BE", name: "Belgium", prefix: "+32", mobileLength: [9], landlineLength: [8, 9], mobileStartDigits: ["4"] },
  { code: "CH", name: "Switzerland", prefix: "+41", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["7"] },
  { code: "AT", name: "Austria", prefix: "+43", mobileLength: [10, 11], landlineLength: [4, 5, 6, 7, 8, 9, 10, 11], mobileStartDigits: ["6"] },
  { code: "SE", name: "Sweden", prefix: "+46", mobileLength: [9], landlineLength: [7, 8, 9], mobileStartDigits: ["7"] },
  { code: "NO", name: "Norway", prefix: "+47", mobileLength: [8], landlineLength: [8], mobileStartDigits: ["4", "9"] },
  { code: "DK", name: "Denmark", prefix: "+45", mobileLength: [8], landlineLength: [8] },
  { code: "FI", name: "Finland", prefix: "+358", mobileLength: [9, 10], landlineLength: [5, 6, 7, 8, 9], mobileStartDigits: ["4", "5"] },
  { code: "IE", name: "Ireland", prefix: "+353", mobileLength: [9], landlineLength: [7, 8, 9], mobileStartDigits: ["8"] },
  { code: "PL", name: "Poland", prefix: "+48", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["5", "6", "7", "8"] },
  { code: "CZ", name: "Czech Republic", prefix: "+420", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["6", "7"] },
  { code: "RO", name: "Romania", prefix: "+40", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["7"] },
  { code: "GR", name: "Greece", prefix: "+30", mobileLength: [10], landlineLength: [10], mobileStartDigits: ["69"] },
  { code: "HU", name: "Hungary", prefix: "+36", mobileLength: [9], landlineLength: [8, 9], mobileStartDigits: ["20", "30", "31", "70"] },
  { code: "HR", name: "Croatia", prefix: "+385", mobileLength: [8, 9], landlineLength: [8, 9], mobileStartDigits: ["9"] },
  { code: "BG", name: "Bulgaria", prefix: "+359", mobileLength: [8, 9], landlineLength: [7, 8, 9], mobileStartDigits: ["87", "88", "89", "98", "99"] },
  { code: "SK", name: "Slovakia", prefix: "+421", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["9"] },
  { code: "UA", name: "Ukraine", prefix: "+380", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["50", "63", "66", "67", "68", "73", "93", "95", "96", "97", "98", "99"] },
  { code: "RU", name: "Russia", prefix: "+7", mobileLength: [10], landlineLength: [10], mobileStartDigits: ["9"] },

  // Asia
  { code: "CN", name: "China", prefix: "+86", mobileLength: [11], landlineLength: [10, 11], mobileStartDigits: ["13", "14", "15", "16", "17", "18", "19"] },
  { code: "JP", name: "Japan", prefix: "+81", mobileLength: [10], landlineLength: [9, 10], mobileStartDigits: ["70", "80", "90"] },
  { code: "KR", name: "South Korea", prefix: "+82", mobileLength: [10, 11], landlineLength: [8, 9, 10], mobileStartDigits: ["10", "11"] },
  { code: "IN", name: "India", prefix: "+91", mobileLength: [10], landlineLength: [10], mobileStartDigits: ["6", "7", "8", "9"] },
  { code: "ID", name: "Indonesia", prefix: "+62", mobileLength: [9, 10, 11, 12], landlineLength: [7, 8, 9, 10], mobileStartDigits: ["8"] },
  { code: "TH", name: "Thailand", prefix: "+66", mobileLength: [9], landlineLength: [8, 9], mobileStartDigits: ["6", "8", "9"] },
  { code: "VN", name: "Vietnam", prefix: "+84", mobileLength: [9, 10], landlineLength: [9, 10], mobileStartDigits: ["3", "5", "7", "8", "9"] },
  { code: "PH", name: "Philippines", prefix: "+63", mobileLength: [10], landlineLength: [7, 8, 9, 10], mobileStartDigits: ["9"] },
  { code: "MY", name: "Malaysia", prefix: "+60", mobileLength: [9, 10], landlineLength: [8, 9], mobileStartDigits: ["1"] },
  { code: "SG", name: "Singapore", prefix: "+65", mobileLength: [8], landlineLength: [8], mobileStartDigits: ["8", "9"] },
  { code: "HK", name: "Hong Kong", prefix: "+852", mobileLength: [8], landlineLength: [8], mobileStartDigits: ["5", "6", "9"] },
  { code: "TW", name: "Taiwan", prefix: "+886", mobileLength: [9], landlineLength: [8, 9], mobileStartDigits: ["9"] },
  { code: "PK", name: "Pakistan", prefix: "+92", mobileLength: [10], landlineLength: [9, 10], mobileStartDigits: ["3"] },
  { code: "BD", name: "Bangladesh", prefix: "+880", mobileLength: [10], landlineLength: [8, 9, 10], mobileStartDigits: ["1"] },
  { code: "LK", name: "Sri Lanka", prefix: "+94", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["7"] },

  // Middle East
  { code: "AE", name: "United Arab Emirates", prefix: "+971", mobileLength: [9], landlineLength: [8, 9], mobileStartDigits: ["5"] },
  { code: "SA", name: "Saudi Arabia", prefix: "+966", mobileLength: [9], landlineLength: [8, 9], mobileStartDigits: ["5"] },
  { code: "IL", name: "Israel", prefix: "+972", mobileLength: [9], landlineLength: [8, 9], mobileStartDigits: ["5"] },
  { code: "TR", name: "Turkey", prefix: "+90", mobileLength: [10], landlineLength: [10], mobileStartDigits: ["5"] },

  // Africa
  { code: "ZA", name: "South Africa", prefix: "+27", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["6", "7", "8"] },
  { code: "NG", name: "Nigeria", prefix: "+234", mobileLength: [10], landlineLength: [7, 8], mobileStartDigits: ["7", "8", "9"] },
  { code: "KE", name: "Kenya", prefix: "+254", mobileLength: [9], landlineLength: [8, 9], mobileStartDigits: ["7", "1"] },
  { code: "EG", name: "Egypt", prefix: "+20", mobileLength: [10], landlineLength: [8, 9, 10], mobileStartDigits: ["10", "11", "12", "15"] },
  { code: "MA", name: "Morocco", prefix: "+212", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["6", "7"] },
  { code: "GH", name: "Ghana", prefix: "+233", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["2", "5"] },
  { code: "CM", name: "Cameroon", prefix: "+237", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["6"] },
  { code: "CI", name: "Ivory Coast", prefix: "+225", mobileLength: [10], landlineLength: [10], mobileStartDigits: ["0", "05", "07"] },
  { code: "SN", name: "Senegal", prefix: "+221", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["7"] },

  // Oceania
  { code: "AU", name: "Australia", prefix: "+61", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["4"] },
  { code: "NZ", name: "New Zealand", prefix: "+64", mobileLength: [8, 9, 10], landlineLength: [7, 8], mobileStartDigits: ["2"] },

  // South America
  { code: "BR", name: "Brazil", prefix: "+55", mobileLength: [10, 11], landlineLength: [10], mobileStartDigits: ["9"] },
  { code: "AR", name: "Argentina", prefix: "+54", mobileLength: [10], landlineLength: [10] },
  { code: "MX", name: "Mexico", prefix: "+52", mobileLength: [10], landlineLength: [10] },
  { code: "CO", name: "Colombia", prefix: "+57", mobileLength: [10], landlineLength: [10], mobileStartDigits: ["3"] },
  { code: "CL", name: "Chile", prefix: "+56", mobileLength: [9], landlineLength: [9], mobileStartDigits: ["9"] },
  { code: "PE", name: "Peru", prefix: "+51", mobileLength: [9], landlineLength: [8, 9], mobileStartDigits: ["9"] },
];

// Sort by prefix length descending so longer prefixes match first (+852 before +8)
const SORTED_COUNTRIES = [...COUNTRY_DB].sort((a, b) => b.prefix.length - a.prefix.length);

// ─── Toll-free prefixes ─────────────────────────────────────────────────────
const TOLL_FREE_PREFIXES_US = ["800", "888", "877", "866", "855", "844", "833"];

// ─── Carrier heuristic database (US/UK/FR examples) ─────────────────────────
interface CarrierRange {
  country: string;
  prefix: string;  // digits after country code
  carrier: string;
}

const CARRIER_DB: CarrierRange[] = [
  // US major carriers (NPA-NXX ranges simplified)
  { country: "US", prefix: "201", carrier: "Verizon" },
  { country: "US", prefix: "202", carrier: "T-Mobile" },
  { country: "US", prefix: "212", carrier: "AT&T" },
  { country: "US", prefix: "213", carrier: "T-Mobile" },
  { country: "US", prefix: "310", carrier: "T-Mobile" },
  { country: "US", prefix: "312", carrier: "AT&T" },
  { country: "US", prefix: "347", carrier: "T-Mobile" },
  { country: "US", prefix: "404", carrier: "AT&T" },
  { country: "US", prefix: "415", carrier: "AT&T" },
  { country: "US", prefix: "512", carrier: "T-Mobile" },
  { country: "US", prefix: "646", carrier: "Verizon" },
  { country: "US", prefix: "718", carrier: "Verizon" },
  { country: "US", prefix: "917", carrier: "T-Mobile" },
  // France
  { country: "FR", prefix: "6", carrier: "Orange / SFR / Bouygues / Free" },
  { country: "FR", prefix: "7", carrier: "Free Mobile / MVNO" },
  // UK
  { country: "GB", prefix: "71", carrier: "Vodafone" },
  { country: "GB", prefix: "72", carrier: "O2" },
  { country: "GB", prefix: "73", carrier: "EE" },
  { country: "GB", prefix: "74", carrier: "Three" },
  { country: "GB", prefix: "75", carrier: "Vodafone" },
  { country: "GB", prefix: "77", carrier: "O2" },
  { country: "GB", prefix: "78", carrier: "Three" },
  { country: "GB", prefix: "79", carrier: "EE" },
];

// ─── Core validation logic ──────────────────────────────────────────────────

function cleanNumber(raw: string): string {
  // Remove spaces, dashes, dots, parens
  let cleaned = raw.replace(/[\s\-.\(\)]/g, "");
  // Convert 00 prefix to +
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  }
  // If no +, assume it might already have country code or is local
  return cleaned;
}

function detectCountry(e164: string): CountryInfo | null {
  const digits = e164.startsWith("+") ? e164.slice(1) : e164;
  for (const c of SORTED_COUNTRIES) {
    const prefixDigits = c.prefix.slice(1); // remove +
    if (digits.startsWith(prefixDigits)) {
      return c;
    }
  }
  return null;
}

function getSubscriberDigits(e164: string, country: CountryInfo): string {
  const digits = e164.startsWith("+") ? e164.slice(1) : e164;
  const prefixDigits = country.prefix.slice(1);
  return digits.slice(prefixDigits.length);
}

function detectLineType(subscriber: string, country: CountryInfo): string {
  // Check toll-free (US/CA)
  if ((country.code === "US" || country.code === "CA") && subscriber.length === 10) {
    const areaCode = subscriber.slice(0, 3);
    if (TOLL_FREE_PREFIXES_US.includes(areaCode)) return "toll_free";
  }

  if (!country.mobileStartDigits || country.mobileStartDigits.length === 0) {
    // No mobile hint data — use length heuristic
    if (country.mobileLength.some((l) => l === subscriber.length)) return "mobile";
    if (country.landlineLength.some((l) => l === subscriber.length)) return "landline";
    return "unknown";
  }

  for (const prefix of country.mobileStartDigits) {
    if (subscriber.startsWith(prefix)) return "mobile";
  }

  return "landline";
}

function detectCarrier(subscriber: string, countryCode: string): string | null {
  // Try longest prefix match
  const candidates = CARRIER_DB.filter((c) => c.country === countryCode);
  let best: CarrierRange | null = null;
  for (const c of candidates) {
    if (subscriber.startsWith(c.prefix)) {
      if (!best || c.prefix.length > best.prefix.length) best = c;
    }
  }
  return best?.carrier ?? null;
}

function validateLength(subscriber: string, country: CountryInfo): boolean {
  const allLengths = [...new Set([...country.mobileLength, ...country.landlineLength])];
  return allLengths.includes(subscriber.length);
}

function formatLocal(subscriber: string, country: CountryInfo): string {
  // Simple grouping based on country patterns
  if (country.code === "US" || country.code === "CA") {
    if (subscriber.length === 10) {
      return `(${subscriber.slice(0, 3)}) ${subscriber.slice(3, 6)}-${subscriber.slice(6)}`;
    }
  }
  if (country.code === "FR") {
    if (subscriber.length === 9) {
      return `0${subscriber.slice(0, 1)} ${subscriber.slice(1, 3)} ${subscriber.slice(3, 5)} ${subscriber.slice(5, 7)} ${subscriber.slice(7)}`;
    }
  }
  if (country.code === "GB") {
    if (subscriber.length === 10) {
      return `0${subscriber.slice(0, 4)} ${subscriber.slice(4)}`;
    }
  }
  // Generic: prefix with 0 and group by 2-3
  const withZero = "0" + subscriber;
  return withZero.replace(/(\d{2,3})(?=\d)/g, "$1 ").trim();
}

function formatInternational(e164: string, country: CountryInfo): string {
  const subscriber = getSubscriberDigits(e164, country);
  if (country.code === "US" || country.code === "CA") {
    if (subscriber.length === 10) {
      return `${country.prefix} (${subscriber.slice(0, 3)}) ${subscriber.slice(3, 6)}-${subscriber.slice(6)}`;
    }
  }
  // Generic
  return `${country.prefix} ${subscriber.replace(/(\d{2,3})(?=\d)/g, "$1 ").trim()}`;
}

export interface ValidationResult {
  input: string;
  valid: boolean;
  e164: string | null;
  country_code: string | null;
  country_name: string | null;
  country_prefix: string | null;
  carrier: string | null;
  line_type: string | null;
  local_format: string | null;
  international_format: string | null;
  error?: string;
}

export function validatePhone(raw: string): ValidationResult {
  const base: ValidationResult = {
    input: raw,
    valid: false,
    e164: null,
    country_code: null,
    country_name: null,
    country_prefix: null,
    carrier: null,
    line_type: null,
    local_format: null,
    international_format: null,
  };

  if (!raw || typeof raw !== "string") {
    return { ...base, error: "Missing or invalid phone parameter" };
  }

  const cleaned = cleanNumber(raw.trim());

  // Must contain only digits and optional leading +
  if (!/^\+?\d{4,20}$/.test(cleaned)) {
    return { ...base, error: "Phone number contains invalid characters or is too short/long" };
  }

  // Ensure we have a + prefix for country detection
  let withPlus = cleaned.startsWith("+") ? cleaned : "+" + cleaned;

  const country = detectCountry(withPlus);
  if (!country) {
    return { ...base, error: "Could not detect country from phone prefix" };
  }

  const subscriber = getSubscriberDigits(withPlus, country);

  if (!validateLength(subscriber, country)) {
    return {
      ...base,
      country_code: country.code,
      country_name: country.name,
      country_prefix: country.prefix,
      error: `Invalid length for ${country.name}: got ${subscriber.length} digits, expected ${[...new Set([...country.mobileLength, ...country.landlineLength])].join(" or ")}`,
    };
  }

  const e164 = country.prefix + subscriber;
  const lineType = detectLineType(subscriber, country);
  const carrier = detectCarrier(subscriber, country.code);

  return {
    input: raw,
    valid: true,
    e164,
    country_code: country.code,
    country_name: country.name,
    country_prefix: country.prefix,
    carrier: carrier ?? (lineType === "toll_free" ? "Toll-Free" : "Unknown"),
    line_type: lineType,
    local_format: formatLocal(subscriber, country),
    international_format: formatInternational(e164, country),
  };
}

// ─── Hono routes ────────────────────────────────────────────────────────────

export function registerRoutes(app: Hono) {
  // GET /api/validate?phone=+33612345678
  app.get("/api/validate", (c) => {
    const phone = c.req.query("phone");
    if (!phone) {
      return c.json({ error: "Missing required query parameter: phone" }, 400);
    }
    const result = validatePhone(phone);
    return c.json(result, result.valid ? 200 : 422);
  });

  // POST /api/validate/batch — body: { phones: ["+33...", "+1..."] }
  app.post("/api/validate/batch", async (c) => {
    let body: { phones?: string[] };
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    if (!body.phones || !Array.isArray(body.phones)) {
      return c.json({ error: "Missing required field: phones (array)" }, 400);
    }

    if (body.phones.length > 50) {
      return c.json({ error: "Maximum 50 numbers per batch request" }, 400);
    }

    if (body.phones.length === 0) {
      return c.json({ error: "phones array cannot be empty" }, 400);
    }

    const results = body.phones.map((phone) => validatePhone(String(phone)));
    const validCount = results.filter((r) => r.valid).length;

    return c.json({
      total: results.length,
      valid: validCount,
      invalid: results.length - validCount,
      results,
    });
  });
}
