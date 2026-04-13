import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "phone-validation",
  slug: "phone-validation",
  description: "Validate phone numbers worldwide -- carrier, line type, country, E.164 format. Single and batch (50) modes.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/validate",
      price: "$0.003",
      description: "Validate a phone number and get carrier/type/country info",
      toolName: "phone_validate_number",
      toolDescription:
        `Use this when you need to validate a phone number and get carrier info. Returns structured validation data in JSON.

Returns: 1. valid (boolean) 2. e164 format string 3. countryCode and countryName 4. carrier name 5. lineType (mobile/landline/voip/toll-free) 6. localFormat and internationalFormat.

Example output: {"valid":true,"e164":"+33612345678","countryCode":"FR","countryName":"France","carrier":"Orange","lineType":"mobile","localFormat":"06 12 34 56 78","internationalFormat":"+33 6 12 34 56 78"}

Use this BEFORE sending SMS or calling a number, FOR CRM data cleaning, lead validation, fraud detection, and KYC phone verification.

Do NOT use for SMS capability check -- use sms_validate_number instead. Do NOT use for email validation -- use email_verify_address instead. Do NOT use for person data -- use person_enrich_from_email instead.`,
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
      outputSchema: {
          "type": "object",
          "properties": {
            "phone": {
              "type": "string",
              "description": "Input phone number"
            },
            "e164": {
              "type": "string",
              "description": "E.164 formatted number"
            },
            "valid": {
              "type": "boolean",
              "description": "Whether number is valid"
            },
            "country": {
              "type": "object",
              "properties": {
                "code": {
                  "type": "string"
                },
                "name": {
                  "type": "string"
                },
                "dialCode": {
                  "type": "string"
                }
              }
            },
            "numberType": {
              "type": "string",
              "description": "Number type (mobile/landline)"
            },
            "smsCapable": {
              "type": "boolean",
              "description": "Whether SMS-capable"
            },
            "nationalNumber": {
              "type": "string",
              "description": "National number format"
            }
          },
          "required": [
            "phone",
            "e164",
            "valid"
          ]
        },
    },
    {
      method: "POST",
      path: "/api/validate/batch",
      price: "$0.025",
      description: "Validate up to 50 phone numbers in a single batch request",
      toolName: "phone_validate_batch",
      toolDescription:
        `Use this when you need to validate multiple phone numbers at once (up to 50). Returns an array of validation results in JSON.

Returns per number: 1. valid (boolean) 2. e164 format 3. countryCode and countryName 4. carrier name 5. lineType (mobile/landline/voip/toll-free).

Example output: {"results":[{"phone":"+14155551234","valid":true,"e164":"+14155551234","countryCode":"US","carrier":"T-Mobile","lineType":"mobile"},{"phone":"invalid","valid":false}],"total":2,"validCount":1}

Use this FOR bulk CRM cleaning, importing contact lists, deduplication pipelines, and batch lead validation.

Do NOT use for single numbers -- use phone_validate_number instead. Do NOT use for SMS capability -- use sms_validate_number instead.`,
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
      outputSchema: {
          "type": "object",
          "properties": {
            "total": {
              "type": "number",
              "description": "Total numbers validated"
            },
            "valid": {
              "type": "number",
              "description": "Count of valid numbers"
            },
            "invalid": {
              "type": "number",
              "description": "Count of invalid numbers"
            },
            "results": {
              "type": "array",
              "items": {
                "type": "object"
              }
            }
          },
          "required": [
            "total",
            "valid",
            "invalid",
            "results"
          ]
        },
    },
  ],
};
