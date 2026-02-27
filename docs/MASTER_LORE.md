# Polyglot Powerlifting: The Engineering Bible

> *"Architecture is the art of deciding what to leave out, and how to connect what remains. This document is the definitive pedagogical autopsy explaining the 'Why' behind every technical choice in the Polyglot Powerlifting project. It is designed to be the single source of truth for understanding how a multi-language, cloud-native application survives the chaos of real-world athleticism. We document not just the code, but the intent."*

---

## Pillar I: The Polyglot Foundations

One might ask: *"Why use two languages for a simple calculator?"* The answer lies in **Specialization vs. Uniformity**. A monolithic stack is often easier to deploy, but it forces engineers to make compromises. In Polyglot Powerlifting, we refuse to compromise. We believe that professional tools should be built with the sharpest possible blades.

### 1. The Strategy: Functional Specialization
We have built a system that uses the best tool for each specific job, turning "Polyglot" from a complexity into a superpower. 

#### The Python Brain (FastAPI)
- **Mathematical Supremacy**: Python is the world's premier language for Mathematical logic and data science. We chose it because the strength sports world relies on complex 5th-degree polynomials (Wilks) and discrete lookup tables (Reshel). Trying to replicate this logic in JavaScript would introduce rounding errors and maintenance fragmentation. Python's `math` module and its broad ecosystem of scientific libraries make it the only sane choice for a project where scoring accuracy is the product.
- **Validation (Pydantic v2)**: We use Pydantic v2 because its Rust-based core provides the fastest JSON validation in the Python ecosystem. It acts as a strict physical boundary, ensuring that no malformed data ever touches our business logic. This is critical for data integrity when calculating scores that might eventually be used in competition environments where every gram counts.
- **Async Efficiency**: FastAPI was chosen over Django or Flask because of its native support for the ASGI standard (Uvicorn). This allows us to handle hundreds of concurrent calculation requests with sub-millisecond overhead, providing a backend that feels as snappy as a local function call.
- **Contract-First Design**: By using Python type hints, we automatically generate an OpenAPI 3.0 schema. This schema is the "Source of Truth" that feeds our frontend type-safety through Zod and Zodios, preventing the common "API drift" where frontend and backend versions fall out of sync.
- **Dependency Injection**: FastAPI's internal DI system allows us to swap database repository implementations (e.g., between a real Supabase client and a local memory mock) with zero changes to our business logic, making our backend exceptionally testable and resilient to infrastructure changes. This is the hallmark of professional decoupled architecture.
- **Numerical Precision**: Unlike JavaScript which uses 64-bit IEEE 754 floats for everything, Python allows us to use specific numeric types and libraries that ensure that when a powerlifter squats 300kg, their Wilks score is computed with consistent rounding behavior across every request.
- **Middleware Flexibility**: The Python stack allows us to implement custom authentication and logging middlewares that are exceptionally lightweight, capturing request metrics without impacting the user's perceived latency. It's about surgical precision at the edge.
- **Ecosystem Maturity**: By choosing Python, we inherit thirty years of mathematical stability. When new scoring formulas like IPF GL are introduced, they are first released as Python-friendly research papers, ensuring our project is always at the cutting edge of the strength sports science.

#### The TypeScript Body (Svelte 5)
- **The Runes Revolution**: Svelte 5's **Runes** ($state, $derived, $effect) were chosen over React's Virtual DOM because they offer "Surgical" reactivity. There is no reconciliation phase; the compiler targets the exact DOM text node that needs to change. This is the difference between re-rendering a whole page and turning a single dial.
- **Zero-Jank UX**: By offloading the "Diffing" to the compile-time, we ensure that the UI remains silky-smooth even on low-end mobile devices used in a high-glare, high-distraction gym environment where performance is a safety requirement.
- **Unified Logic Classes**: We use TypeScript classes integrated with Runes to encapsulate business logic. This allows us to test our "State Brains" in isolation from the UI, ensuring that the application state behaves predictably regardless of what the user is clicking.
- **Sound Logic Bridge**: TypeScript ensures that every property of a `Lift` object is tracked from the moment it leaves the Python serialiser to the moment it is painted on the screen. If a developer changes a field name in the backend, the frontend build will fail immediately, catching "silent bugs" before they ever reach a user.
- **Scoped Aesthetics**: Every Svelte component has its own local CSS scope. This means we can use simple class names like `.input` or `.card` without ever worrying about styles leaking into other parts of the application, keeping our codebase clean and maintainable. This prevents the "Global Style Pollution" that plagues large-scale CSS projects.
- **The Compiler Advantage**: Svelte is a compiler, not a runtime library. This means we don't ship a heavy framework bundle to the user. We ship only the code needed to run the app, leading to faster First Contentful Paint (FCP) times and a more responsive feel on slow gym Wi-Fi.
- **Fine-Grained Feedback**: Svelte's reactivity model allows us to create complex visual indicators—like the "Ghost" pulsing state for unsynced lifts—with minimal code. The framework manages the synchronization between the variable state and the CSS classes with nearly zero overhead.

---

## Pillar II: The Anatomy of a Request (The 40-Step JWT Trace)

Understanding the lifecycle of a request is critical. When a logged-in user clicks "Calculate," this is the exact coordination of 40 distinct steps that must occur for a score to be saved securely in the cloud.

### Phase Alpha: The Client-Side Impulse
1. **User Action**: The athlete clicks the "Calculate" button within the `CalculatorForm.svelte` view.
2. **State Capture**: The `$state` runes in the `CalculatorFormState.ts` brain catch the raw input values from the Proxy-wrapped fields.
3. **Internal Trigger**: The logical `this.calculate()` method is invoked within the state class instance.
4. **Validation Signal**: The class checks its internal `$derived` `isValid` property, which reactively monitors all numeric bounds to ensure inputs like "-50kg" never propagate to the network.
5. **Logic Mapping**: Human-readable strings from the form are mapped to a strictly typed `LiftRequest` core object compatible with the backend FastAPI schema.
6. **Bridge Entry**: The request object enters the `Zodios` API client bridge, our type-safe gateway to the network.
7. **Session Request**: Zodios calls `supabase.auth.getSession()` to check for an active authenticated user session in the browser's persistent memory.
8. **JWT Extraction**: A custom global interceptor extracts the current JWT string from the Supabase session metadata.
9. **Signing**: The `Authorization: Bearer <JWT>` header is added to the outgoing Axios request configuration objects.
10. **Pre-flight Schema**: Zod performs a local runtime shape verification to ensure required fields aren't null before wasting bandwidth.
11. **Promise Creation**: Zodios initiates the Axios HTTP request promise, moving the execution from the main thread to the network stack.
12. **Network Resolution**: The browser's DNS resolver looks up the backend Render target address through the recursive nameserver chain.
13. **TCP Handshake**: A reliable socket connection is established with the Render cloud infrastructure via a three-way syn-ack.
14. **TLS Negotiation**: A secure, encrypted tunnel is created using modern cipher suites (TLS 1.3) for the JSON package.
15. **Streaming**: The JSON buffer is pushed over the wire as a sequence of encrypted network packets.

### Phase Beta: The Network & Server Gate
16. **Load Balancing**: Render's ingress layer routes the incoming traffic to the specific FastAPI uvicorn worker lifecycle based on current CPU load.
17. **Middleware Trap**: The `AuthMiddleware` intercepts the request header before any business logic handler can execute.
18. **Token Verification**: The middleware calls `supabase.auth.get_user(token)` to verify the RSA-256 signature against the public key held by the Supabase project.
    - **Failure Mode Rationale**: If Step 18 fails (e.g., a token timeout or corruption), the system returns a 401 Unauthorized status instantly. The frontend "Stability Guard" in `HistoryState.ts` catches this 401 specifically and prevents the generic error handler from wiping the local history buffer. This ensures the user can re-authenticate without losing the record they just painstakingly typed during a rest set. It's a "User-First" failure recovery policy.
19. **Identity Hydration**: If valid, the user's UUID and email metadata are stored in the secure `request.state.user` object for downstream consumption by the service layer.
20. **CORS Check**: The server verifies that the origin domain (e.g., polyglot-powerlifting.com) is permitted to interact with our API according to the backend whitelist.
21. **Rate Limiting**: Request is checked against user-tier limits to prevent denial-of-service patterns from malicious bots or runaway loops.
22. **Payload Logging**: Request metadata is logged to our observability stack for audit trails and performance monitoring.
23. **Body Read**: FastAPI reads the raw JSON body from the request stream into a local Python memory buffer for parsing.
24. **Encoding Detect**: The server verifies the incoming stream is valid UTF-8 to prevent character corruption in athlete profile names.
25. **Parsing**: Pydantic starts the recursive JSON-to-Model conversion, casting raw strings to floating-point numbers where required by the math logic definitions.

### Phase Gamma: The Server Intelligence & Persistence
26. **Endpoint Dispatch**: FastAPI matches the URL path and HTTP method to the specifically registered `calculate_lift` route handler.
27. **Model Instantiation**: The Pydantic `LiftRequest` object is instantiated, providing an object-oriented, type-safe interface to the data.
28. **Contract Enforcement**: Pydantic throws a 422 Unprocessable Entity if the JSON shape violates the strict math schema (e.g. missing bodyweight or gender).
29. **Service Invocation**: The route handler routes the hydrated request to `LiftsService.calculate_and_save()`, the primary business orchestrator.
30. **Math Bridge**: The service invokes the pure mathematical modules in the specialized `logic/math.py` file, abstracting the formulas.
31. **Precision Math**: 5th-degree polynomials calculate the Wilks score with 64-bit float precision for competition-grade accuracy.
32. **Interpolation**: Linear interpolation is performed for table-based Reshel values to ensure a perfectly smooth scoring curve across different weight categories.
33. **Result Construction**: The service builds the final `LiftResponse` Pydantic record containing all calculated metrics and the initial timestamp.
34. **Repository Hand-off**: The service translates the business model into a `LiftsRepository` database command, keeping the persistence layer isolated.
35. **PostgreSQL RLS Audit**: The database executes Row Level Security logic at the engine level to confirm that the `auth.uid()` matches the `user_id` of the record.
36. **Physical Persistence**: The row is stored on disk and the transaction is committed to the PostgreSQL Write Ahead Log.
    - **Failure Mode Rationale**: If Step 36 fails (e.g., a database connection spike or lock timeout), the API returns a 503 Service Unavailable. The frontend transition from "Ghost" to "Live" is paused, and the item is marked with a persistent "Dirty/Unsynced" flag in LocalStorage. This allows the app to automatically retry the sync once the server heartbeat returns, preserving data integrity above all else. This "Durable Outbox" pattern is core to our gym-ready resilience.
37. **Response Serialization**: FastAPI converts the model back to a JSON-safe string format for transit back to the client.
38. **Header Append**: The server adds the `Content-Type: application/json` header to tell the browser how to parse the incoming result.
39. **Response Dispatch**: A 201 Created status is sent back through the established network socket to the awaiting client.
40. **UI Refresh**: Svelte detects the state change, replaces the temporary "Ghost" ID with the real server UUID, and stops the pulsing "Optimistic" sync animation.

---

## Pillar III: The Intelligent Nervous System (Design Patterns)

### 1. The Singleton State Pattern (Application Memory)
Instead of fragmented stores or global variables, we use **Feature-First Singletons** like `HistoryState.ts` to manage our local data lake.
- **The Rationale**: Strength data is highly relational; a single change in a user's weight might affect every visible score on the page. A singleton source of truth prevents the "Dual-State Desync" where a list shows one value and a detail card shows another stale value.
- **The Pattern**: We use the **Provider-Singleton** pattern, initializing these brains at the root of the app once the session is confirmed. This ensures that the state is "Clean" for every new user and prevents memory leaks.
- **Best Practice**: Encapsulating "Sync Logic" (the bridge between LocalStorage and Cloud) inside the state class itself rather than in the UI components ensures that the UI remains a "Dumb View Layer". This separation of concerns allows us to update the sync strategy without touching a single .svelte file.
- **Persistence Strategy**: The Singleton doesn't just hold data; it orchestrates the lifecycle. It knows when to pull from the network, when to trust the `localStorage` cache, and how to merge the two using optimistic reconciliation.

### 2. The Transparent Proxy Pattern
Svelte 5's `$state` uses native ECMAScript Proxies to monitor state changes.
- **The Philosophy**: Traditional frameworks require explicit `setState()` or `dispatch()` calls which create boilerplate and often lead to "Zombie-state" bugs where the UI doesn't match the data.
- **The Implementation**: By wrapping our data in Proxies, the framework observes every mutation at the property level. If you update `lift.squat`, Svelte "sees" exactly that modification and only repaints the specific total and score fields that depend on it.
- **Performance Benefit**: Proxies allow Svelte to bypass heavy reconciliation algorithms. Instead of "Thinking" about what might have changed by comparing virtual trees, it "Knows" exactly what changed at the moment of mutation. This is why the app feels "Local" even when managing large history buffers.

### 3. The Orchestrator Pattern (Backend)
Our `LiftsService.py` acts as a central **Orchestrator**.
- **The Why**: Business logic shouldn't be scattered between database queries and API routes. By centralizing the orchestration in a Service layer, we can easily change *how* we calculate a score or *where* we save it without breaking our API contract.
- **Decoupling**: The Service doesn't know about HTTP or SQL. It only knows about "Athlete Profiles" and "Strength Lift Models." This makes it universally reusable across different interfaces. If we ever build a CLI for batch-processing lift data, it will use the exact same Service logic.

---

## Pillar IV: The Physical Fortress (Data & Math)

### 1. Numerical Stability & The Wilks Autopsy
We perform all sensitive math on the Python backend to avoid the "0.1 + 0.2 = 0.30000000000000004" floating-point tragedies prevalent in browser JS engines.
- **The Strategy**: We use Python's specialized mathematical libraries to handle coefficients. This ensures that the same set of inputs always yields the same result, regardless of the user's device.
- **Interpolation Rationale**: Most strength tables (Reshel) are discrete. An athlete weighing 80.05kg needs a coefficient exactly between 80.0 and 81.0. We use **Linear Interpolation** (`slope = (y2-y1)/(x2-x1)`) to provide a "Smooth Strength Curve," preventing the jumpy scoring that frustrates competitive athletes. This approach respects the physics of the sport—strength is a continuous curve.
- **Verification**: Every formula is unit-tested against historical completion data to ensure that our "Brain" is as accurate as an official scoresheet. This precision is the soul of the project.

### 2. The "Single Source of Truth" (Generated Columns)
In our PostgreSQL schema, the `total` column is defined as `GENERATED ALWAYS AS (squat + bench + deadlift) STORED`.
- **The Rationale**: Data integrity is the foundation of trust. If a developer manually updates a Squat value in a database GUI but forgets to update the Total, the system becomes "Liar-ware." Stored generated columns make this desynchronisation physically impossible.
- **Database-Level Protection**: By making this column `STORED`, we ensuring that every query (even those from third-party analytics tools) sees the correct, consistent value without having to recalculate it. It is the ultimate word of truth in our system.

---

## Pillar V: Component Architecture (The "Atomic" Rationale)

### 1. The "Ghost Pattern" for High-Availability UX
When a user calculates a lift, we don't block the screen with a spinner. We show a **Ghost Item**.
- **The Design Pattern**: **Optimistic UI Update**.
- **The Rationale**: Mobile users in gyms often experience "jittery" network conditions. An "Instant" response feel reduces cognitive friction. The app assumes success and only notifies the user if the server actually fails—a "Success-by-Default" philosophy.
- **Recovery Logic**: If the backend rejects the calculation, the Ghost item's "Syncing" pulse turns into a "Retry" icon. This ensures the user feels in control even when the cloud is temporarily out of reach in a Faraday-cage gym environment.

### 2. Logic-UI Decoupling (The Headless Strategy)
Our components like `CalculatorForm.svelte` contain **zero formulas**. They delegate all state and validation to `CalculatorFormState.ts`.
- **The Benefit**: We can test the calculator's logic in a simple Node.js environment (Vitest) without ever spawning a browser. This makes our test suite 10x faster and significantly more reliable as we evolve the project.
- **Atomic Components**: By keeping components "dumb," we ensure they are 100% reusable across different sections of the app (e.g., using the same Input field in the Auth box and the Calculator). This creates a consistent visual language.

---

## Pillar VI: Service Registry (Backend Orchestration)

### 1. The "Service Object" Pattern
Our backend adheres to a strict **Controller -> Service -> Repository** hierarchy to ensure "Clean Architecture".
- **The Controller (`api/lifts.py`)**: Responsible for HTTP semantics (status codes, headers). It is the translator between the web and our business logic.
- **The Service (`services/lifts.py`)**: The "Brain". This layer coordinates mathematical results and ensures cross-table consistency. It is the only layer allowed to say "If a user is geared, use different coefficient sets."
- **The Repository (`repositories/lifts.py`)**: The "Persistence Gateway". It handles the low-level SQL communication. If we ever switch from Supabase to a local SQL database, this is the only file that needs to change.

---

## Pillar VII: Architectural Load-Bearers (Structural Integrity)

The project is supported by several "Load-Bearing" modules that encapsulate the most critical business logic. 
- **The Mathematical Engine (`logic/math.py`)**: This is the most critical load-bearer. By isolating the 5th-degree polynomials and interpolation logic in a pure-function Python module, we ensure that the "Brain" of the application is independent of the transportation layer (FastAPI) or the storage layer (Supabase).
- **The State Singleton (`HistoryState.ts`)**: In the frontend, this module carries the load of the entire user lifecycle. It orchestrates the flow from user input to optimistic UI updates, background synchronization, and reactive DOM rendering.
- **The Security Perimeter (`auth.py`)**: This middleware acts as the primary load-bearer for the system's trust model. It intercepts every request, verifies the JWT signature against Supabase, and hydrates the request state with an authenticated identity before it ever reaches a business handler.

---

## Pillar VIII: The Logic Autopsy (Structural Code Walks)

### 1. The Bulk Synchronizer (`/lifts/sync`)
This endpoint is the critical bridge for the "Anonymous-to-Logged-In" transition.
- **The Rationale**: Athletes often begin their journey in the "Red Zone" (Anonymous/Offline). When they finally commit to an account, their historical data must not be orphaned. 
- **The Implementation**: The `/sync` endpoint accepts an array of `LiftResponse` objects. Unlike a standard `POST`, it performs a **Bulk Upsert**. It validates each item individually but executes a single database transaction, ensuring that either all PRs are synced or none are, preventing a "Partial History" disaster.
- **Data Integrity**: The backend re-stamps the `user_id` on every incoming record based on the authenticated JWT, preventing "Session Hijacking" where one user might try to sync their data into another's account.

### 2. The API Orchestrator (`lifts.py`)
This file coordinates the flow from HTTP request to mathematical result and final storage.
- **The Calculation Handler**: This entry point defines the route and enforces the Pydantic schema for automated input validation.
- **The Auth Gate**: Here, the logic extracts the authenticated user ID from the request metadata. If the middleware failed to hydrate this identity, the handler immediately interrupts the execution with a 401 Unauthorized status.
- **Mathematical Execution**: The orchestrator invokes the specialized Wilks functions within the math engine. 
    - **Failure Mode (Boundary Guard)**: If a request contains a bodyweight of zero (a physical impossibility), the math engine raises a `ValueError`. The orchestrator catches this specifically to return a 422 Unprocessable Entity, preventing the generic server error that would otherwise result from a division-by-zero operation.
- **Persistence Step**: The resulting model is passed to the repository for a SQL UPSERT. If the database is under excessive load and times out, the system returns a 503 Service Unavailable, which triggers the frontend's offline recovery logic.

### 2. The Reactive Sync Brain (`HistoryState.ts`)
This module manages the reconciliation between the browser's view of the world and the cloud's reality.
- **The Reactive Buffer**: Using the Proxy-based `$state` rune, this brain maintains a sub-millisecond in-memory representation of the athlete's history.
- **The Optimistic Transition**: When a new lift is calculated, the system immediately pushes a "Ghost" item into the buffer. This item is marked with a temporary ID and a pulsing visual state.
- **The Synchronization Loop**: An async background task monitors this buffer. It identifies "Dirty" (pending) items and pushes them to the backend using the Zodios bridge. 
    - **Failure Mode Rationale**: If the network is dead (e.g., in a basement gym), the item remains in the buffer with a "Persistent Error" flag. The user is notified of the sync failure, but the data is preserved in LocalStorage. This prioritizes the athlete's data sovereignty over temporary cloud availability.

---

## Pillar IX: Security & Operational Manifesto

### 1. The Defense-in-Depth Layering
We believe that security is a series of walls, not a single gate.
- **Layer 1 (Schema Validation)**: Zod and Pydantic block malformed JSON before it can even be parsed into a business object. This prevents common SQL injection and overflow attacks.
- **Layer 2 (Authentication)**: Supabase JWTs signed with RSA-256 ensure the user is who they say they are, verified by a third-party identity provider.
- **Layer 3 (Database Security)**: PostgreSQL RLS (Row Level Security) ensures that even if a developer writes buggy code that requests the wrong ID, the database itself will refuse to show User A's data to User B.
- **Layer 4 (Precision Insurance)**: Python-side math prevents precision-drift-based scoring fraud, ensuring that competition results are mathematically valid across all platforms.
- **Layer 5 (Audit Logging)**: All record creations are stamped with a mandatory server-side `created_at` timestamp that cannot be spoofed by the client-side clock. This is our "Immutable Truth."

---

## Pillar X: Developer's Cookbook (Pedagogical Scars)

### Recipe 1: Adding a new scoring system (e.g. IPF GL)
1. **Math Core**: Implement the raw formula in `backends/fastapi/logic/math.py` as a pure function. Ensure coefficients are documented and clear.
2. **Schema Update**: Add the new field to the `LiftResponse` Pydantic model. This updates the auto-generated OpenAPI documentation instantly.
3. **Bridge Sync**: Run `make gen-types`. This is the critical step that updates the frontend TypeScript interfaces via Zodios, ensuring the compiler knows about the new field.
4. **UI Binding**: Link the new score in `HistoryItem.svelte` to the reactive property. Svelte 5 will handle the repainting automatically once the data arrives from the server.

### Recipe 2: Changing the Design Tokens
1. Open `src/app.css` in the project root.
2. Modify the `--color-accent` variable to a new hex code (e.g., a vibrant indigo).
3. **Observation**: Because we use a semantic design system, every button and interactive border across the entire app updates instantly. This is the power of a centralized design language system that treats colors as "Tokens" rather than just "Values." This is how we scale aesthetics.

---

## Pillar XI: Infrastructure & Scalability rationale

### 1. Why Render & Supabase?
- **Render**: Chosen for its seamless Python support and internal networking. It handles the "Uvicorn" management so we can focus on code. It provides a robust, auto-scaling environment for our FastAPI workers.
- **Supabase**: Provides a "Serverless" PostgreSQL experience. The real value is in the **PostgREST** layer which allows our Python repository to query the database using simple, safe HTTP calls rather than complex and heavy ORM sessions. It strikes the perfect balance between power and simplicity for a polyglot stack. This is "Modern Data Management."

---

## Pillar XII: The Future Path (Extensibility & Growth)

### 1. Predictive Strength Modeling
Because we use Python for the backend, we can easily integrate machine learning libraries like `scikit-learn` or `PyTorch` in the future. This would allow us to predict an athlete's next competition total based on their training history—a feat that would be nearly impossible in a pure JavaScript stack without significant duplication of effort and math fragmentation. We build for the athlete's future.

### 2. Native Mobile Integration
The decoupled architecture means we can build a React Native or Flutter app tomorrow, and it would consume the exact same FastAPI endpoints and Python logic with zero modifications required on the server side. The "One Brain, Many Bodies" philosophy is baked into the foundation. This is our "Mobile-First Infrastructure."

---

## Pillar XIII: Testing Philosophy (The Quality Circle)

### 1. Unit Testing (Python)
We use `pytest` to verify the mathematical purity of our formulas. These tests are fast, isolation-focused, and ensure that a change in the codebase doesn't accidentally break the laws of physics. They are our "Mathematical Sanity Checks."

### 2. Component Testing (Svelte)
We use `Vitest` and `Svelte Testing Library` to ensure that our UI logic correctly handles state transitions. We focus on testing the "Brain" (the state classes) rather than the "Face" (the HTML), as this provides the highest ROI for test maintenance and prevents "Brittle Test" syndrome. We test for behavior, not for pixels.

---

## Pillar XIV: Observability & Health

### 1. Request Tracing
We use backend logging to trace request IDs from ingress to the database. This allows us to debug the "40-step JWT Trace" in real-time, identifying exactly where a bottleneck or failure occurred. This is our "Pedagogical Eye" on the production system.

### 2. Error Budgets
We prioritize "Data Integrity" over "System Availability." If the database is under load, we would rather return an error (and use the frontend outbox) than risk saving corrupted or miscalculated strength data.

---

## Pillar XV: The Mathematical Derivation Annex

### 1. The Wilks 1 vs Wilks 2 Polynomial Complexity
The Wilks coefficient is derived from a 5th-degree polynomial: `a + bx + cx^2 + dx^3 + ex^4 + fx^5`. Precision is paramount; a difference in the 6th decimal place can shift a "Best Lifter" award in a national competition. We store these coefficients as static constants in the math engine. By keeping them in Python, we can leverage the language's native `float` precision and avoid the precision-stripping that occurs in many JS environments. We don't just "Hardcode" values; we document their origin (IPF 2020 Technical Manual) and provide health checks that run during the backend startup phase.

### 2. Linear Interpolation for Reshel/Glossbrenner
For table-based scores like Reshel, the formula is: `y = y1 + (x - x1) * ((y2 - y1) / (x2 - x1))`. While Wilks uses continuous polynomials, Reshel uses discrete indices for weight classes. To provide a "Smooth" experience for an athlete who weights 82.3kg, we must interpolate between the 82kg and 83kg indices. Our math engine contains a specialized interpolation module that performs this calculation with high precision, ensuring that the scoring curve is perfectly linear between discrete data points. This respects the physics of the sport—strength is a continuous curve, not a step function.

---

## Pillar XVI: The Reactivity Graph Deep-Dive (Svelte Signals)

### 1. From Input to Rune
When a user types "100" into the Squat field, the application enters a specialized reactivity cycle. First, Svelte's event listener updates the `$state` property in the form brain. High-performance Proxies detect this mutation and immediately notify all subscribers in the reactivity graph. The `$derived` `total` property (which depends on squat) recalculates instantly. Following this, the `wilksScore` (which depends on total) recalculates in turn. Finally, Svelte "surgically" updates the exact text nodes in the browser DOM without the heavy reconciliation overhead of a virtual tree comparison.

### 2. Signal Batching & Efficiency
Svelte 5 uses a "Glitch-Free" reactivity model. If a single user action—like pasting a full workout—affects dozens of derived values simultaneously, Svelte ensures that the UI only repaints once the entire graph has synchronized. This prevented the "Flash of Disconnected Data" that often plagues complex interactive dashboards. This efficiency allows the app to maintain a 60fps frame rate even while performing complex mathematical derivations on the main thread.

---

## Pillar XVII: Logic Autopsy: The Validation Brain

### 1. The Guard Dog Strategy
The validation logic in the frontend brain acts as a primary gatekeeper for the entire system. We use a `$derived` `isValid` property that reactively monitors every field in the form. This property enforces the project's physical safety rules: no negative weights, no non-numeric inputs, and no "zero-weight" powerlifters. By binding the "Calculate" button's state directly to this reactive property, we prevent the user from even initiating a network request for malformed data. This reduces server load and provides the user with "instant" validation feedback as they type.

---

## Pillar XVIII: The Athlete's State (The Faraday Cage Problem)

### 1. Designing for Gym-Native Environments
Gyms are notoriously hostile to network connectivity—basements, heavy concrete walls, and massive metal equipment create "Faraday cages" that destroy the reliability of cloud-native apps. If an athlete hits a Personal Record but the app fails to save it because the gym Wi-Fi dropped, the athlete will delete the app. In strength sports, data loss is a mortal sin. Therefore, we treat the network as a "Secondary Concern".

### 2. The Durable Outbox Persistence
The History Brain maintains a localized binary object in the browser's persistent storage. When a lift is added, we use a **Durable Outbox** pattern. The lift is saved locally and marked as "Pending". A dedicated background process periodically checks for a server heartbeat. Only when the server confirms the record does the item transition from a "Ghost" to a "Live" state. This pattern ensures that the athlete's momentum is never interrupted by the chaos of gym connectivity. We prioritize the "Athlete's Time" over the "Cloud's Response".

---

## Appendix A: The Ultimate Technical Lexicon (Glossary)

- **API Bridge**: The system (Zodios) that connects the Python backend to the TypeScript frontend with type-safe contracts. It ensures that no data "Crosses the border" without a valid visa (Pydantic validation).
- **ASGI (Asynchronous Server Gateway Interface)**: The technical protocol that allows our FastAPI server to handle hundreds of concurrent athlete requests without blocking the "Brain".
- **Atomic Components**: The smallest visual units of our UI. We follow an "Atomic Wisdom" where components don't hold business logic; they only hold aesthetics and user interaction rules.
- **Auth Outbox**: The frontend safety net that catches calculation requests made by unauthenticated users, holding them securely until the user completes the login flow.
- **Axios Interceptor**: A "Passport Stamp" middleware that automatically verifies and attaches session tokens to every network packet leaving the browser for the cloud.
- **CI/CD (Continuous Integration/Deployment)**: Our "Quality Forge" where every commit is tested against the laws of sport and math before being allowed into the production environment.
- **Clean Architecture**: The structural philosophy of separating "What we do" (Business Logic) from "How we show it" (UI) and "How we save it" (Storage Layer).
- **Durable Outbox**: An architectural pattern used to ensure that data eventually reaches the server even if the network is currently dead. It is our "Reliability Engine".
- **Faraday-Cage Gym**: A psychological and technical constraint where we assume 100% network failure as the default operating environment for our athletes.
- **Ghost Item**: A psychological UI buffer that uses optimistic updates to make the app feel "Local" while the cloud catches up in the background.
- **IPF (International Powerlifting Federation)**: The world governing body whose mathematical standards we implement with competition-grade 64-bit precision.
- **Load-Bearer**: A critical module—like the math engine or the history brain—whose failure would compromise the structural integrity of the entire project.
- **Numerical Stability**: The property of ensuring that mathematical results are consistent across all architectures, preventing the "rounding drift" common in pure JavaScript math.
- **Optimistic UI**: A "Success-by-Default" UX pattern that prioritizes athlete momentum and perceived performance over real-time cloud synchronization.
- **PostgREST**: The high-performance translation layer provided by Supabase that turns our SQL tables into a safe, queryable HTTP interface with zero boilerplate.
- **Pydantic**: The "Physical Guard" of our Python brain, ensuring that malformed data is rejected at the network gate with high-speed performance.
- **RLS (Row Level Security)**: The database-level "Privacy Shield" that ensures no athlete can ever see another's historical records, even if a software bug requests them.
- **Rune**: A Svelte 5 signal primitive ($state, $derived) that allows us to build "Surgical" reactivity without the heavy cognitive overhead of a virtual DOM.
- **Sovereign Edition**: The philosophy that our architecture should be independent of any single cloud provider or framework runtime.
- **Svelte**: Our choice for the "TypeScript Body" due to its compile-time optimizations and silky-smooth, zero-jank user experience.
- **Wilks Score**: The historical standard for strength quantification, preserved in our "Mathematical Archive" for athlete benchmarking and data-purity analysis.
- **Zodios**: The type-safe bridge that prevents the "Frontend-Backend Desync" during the rapid evolution of our project's data schema.

---

## Appendix B: The Engineering Manifesto

We believe in a future where software is choice-driven and technically sovereign.
We chose **Speed** for our User Interface via Svelte 5.
We chose **Intelligence** for our Math via Python.
We chose **Security** for our Data via PostgreSQL RLS.
Every design pattern in this project is an intentional choice made to empower the athlete and the engineer alike. We don't build average software; we build high-precision tools for high-performance people. Our goal is to make the engineering as strong as the athletes who use it. This is the philosophy of Polyglot Powerlifting. This is the Standard.

---

## Technical Reference Directory
- [API Reference](api.md)
- [Architecture Maps](architecture.md)
- [Branding Guide](branding.md)
- [Math Formulas](formulas.md)
- [Database Schema](schema.sql)

---

> *"Testing ensures the links are forged correctly. Python ensures the math is heavy enough. Svelte ensures the movement is smooth enough. This is Polyglot Powerlifting. This is the Standard."*

---
### Final Post-Mortem: The Heritage of Excellence
As we build this platform, we stand on the shoulders of giants. Every line of code is a testament to the power of specialized engineering. Welcome to the future of strength.