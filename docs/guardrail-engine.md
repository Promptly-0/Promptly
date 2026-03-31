# The Guardrail Engine

Because AI can be unpredictable, security is Promptly's primary focus. We include a mandatory, built-in **Guardrail Engine** that protects user capital from any algorithmic mistakes or "hallucinations."

### Hard Budget Caps
The AI cannot exceed the dollar amount you assigned to its session. For example, if you allocate $100 for a 2-hour burst, it is mathematically impossible for the API to process a withdrawal exceeding $100.

### Safe Asset Only
The AI is technologically restricted from trading unverified, low-liquidity, or "meme" assets. Promptly ensures your agent only interacts with audited, high-tier digital assets (e.g., BTC, ETH, and USDC).

### The Circuit Breaker
Promptly constantly monitors the AI's performance. If the value of the active portfolio drops by a user-defined threshold (e.g., 5%), the system instantly pulls the plug, freezes the allocated funds, and returns them to safety.
