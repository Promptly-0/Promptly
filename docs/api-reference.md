# API Reference

The Promptly Terminal API enables your AI agents to seamlessly interact with the Tempo L1 blockchain, purchase market data, and instantiate secure trading sessions.

## Endpoints

### 1. `POST /api/sessions/create`
Initializes a new Pre-Approved Spending Session.
* **Body**: `{"budgetCap": 500.00, "durationMs": 43200000, "currency": "USDC"}`
* **Response**: Returns a temporary session token with the Guardrail Engine active.

### 2. `POST /api/market-data/purchase`
Autonomously fetch ad-hoc external market data.
* **Body**: `{"dataURI": "premium-feed-id", "sessionToken": "<TOKEN>"}`
* **Response**: Charges a microscopic routing fee dynamically and returns the raw data instantly for the agent.

> **Note:** The full OpenAPI (Swagger) spec will be available upon the public release of Phase 1.
