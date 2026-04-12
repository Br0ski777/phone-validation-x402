import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "phone-validation",
  slug: "phone-validation",
  description: "Validate phone numbers worldwide. Returns carrier, line type, country, E.164 format.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/validate",
      price: "$0.003",
      description: "Validate a phone number and get carrier/type/country info",
      toolName: "phone_validate_number",
      toolDescription:
        "Use this when you need to validate a phone number and get carrier info. Returns: valid/invalid, E.164 format, country code, country name, carrier name, line type (mobile/landline/voip/toll-free), local format, international format. Do NOT use for SMS sending. Ideal for CRM data cleaning, lead validation, fraud detection.",
      inputSchema: {
        type: "object",
        properties: {
          phone: {
            type: "string",
            description: "Phone number to validate (e.g. +33612345678, +14155552671, 0033612345678)",
          },
        },
        required: ["phone"],
      },
    },
    {
      method: "POST",
      path: "/api/validate/batch",
      price: "$0.025",
      description: "Validate up to 50 phone numbers in a single batch request",
      toolName: "phone_validate_batch",
      toolDescription:
        "Use this when you need to validate multiple phone numbers at once (up to 50). Returns validation results for each number: valid/invalid, E.164 format, country, carrier, line type. Ideal for bulk CRM cleaning, importing contact lists, deduplication pipelines. Do NOT use for single numbers — use phone_validate_number instead.",
      inputSchema: {
        type: "object",
        properties: {
          phones: {
            type: "array",
            items: { type: "string" },
            description: "Array of phone numbers to validate (max 50)",
          },
        },
        required: ["phones"],
      },
    },
  ],
};
