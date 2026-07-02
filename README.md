# Phone Number Validation API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://phone-validation.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Validate phone numbers worldwide -- carrier, line type, country, E.164 format. Single and batch (50) modes. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "phone-validation": {
      "url": "https://phone-validation.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl "https://phone-validation.api.klymax402.com/api/validate?phone=..."
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `phone_validate_number` | GET | `/api/validate` | $0.003 | Validate a phone number and get carrier/type/country info |
| `phone_validate_batch` | POST | `/api/validate/batch` | $0.025 | Validate up to 50 phone numbers in a single batch request |

### `phone_validate_number`

Use this when you need to validate a phone number and get carrier info. Returns structured validation data in JSON.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `phone` | string | yes | Phone number to validate (e.g. +33612345678, +14155552671, 0033612345678) |

Example response:

```json
{"valid":true,"e164":"+33612345678","countryCode":"FR","countryName":"France","carrier":"Orange","lineType":"mobile","localFormat":"06 12 34 56 78","internationalFormat":"+33 6 12 34 56 78"}
```

**When to use**: sending SMS or calling a number, FOR CRM data cleaning, lead validation, fraud detection, and KYC phone verification.

**Not for**: SMS capability check (use `sms_validate_number`), email validation (use `email_verify_address`), person data (use `person_enrich_from_email`).

### `phone_validate_batch`

Use this when you need to validate multiple phone numbers at once (up to 50). Returns an array of validation results in JSON.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `phones` | array | yes | Array of phone numbers to validate (max 50) |

Example response:

```json
{"results":[{"phone":"+14155551234","valid":true,"e164":"+14155551234","countryCode":"US","carrier":"T-Mobile","lineType":"mobile"},{"phone":"invalid","valid":false}],"total":2,"validCount":1}
```

**When to use**: bulk CRM cleaning, importing contact lists, deduplication pipelines, and batch lead validation.

**Not for**: single numbers (use `phone_validate_number`), SMS capability (use `sms_validate_number`).

## Example agent prompts

- "Validate a phone number and get carrier info"
- "Validate multiple phone numbers at once (up to 50)"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
