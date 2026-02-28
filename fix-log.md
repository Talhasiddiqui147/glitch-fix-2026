# Fix Log – Glitch-O-Meter 2026

## 1. Build Layer Issues
- Fixed corrupted tsconfig.json (invalid JSON values).
- Restored missing export in next.config.ts.
- Repaired PostCSS configuration.
- Fixed Tailwind configuration errors.
- Installed missing autoprefixer dependency.

## 2. Frontend Issues
- Rebuilt corrupted layout.tsx.
- Reconstructed broken page.tsx.
- Cleaned invalid globals.css.
- Restored Tailwind styling pipeline.

## 3. AI Flow Issues
- Fixed malformed Zod schemas.
- Rebuilt broken Wikipedia search logic.
- Corrected module resolution errors.
- Replaced unstable REST endpoint with MediaWiki API.
- Ensured structured output: { answer, sources }.

## 4. API Layer Issues
- Created working /api/ask endpoint.
- Fixed module import path errors.
- Connected frontend to backend properly.
- Added error handling.

## 5. Optimization Improvements
- Implemented search-first Wikipedia matching.
- Guaranteed at least one source link.
- Added loading state on frontend.
- Improved user experience. 

---

## Root Cause Analysis

### 1. Build Layer Failure
- Corrupted tsconfig.json (invalid JSON values).
- Broken next.config export.
- Missing autoprefixer dependency.
- Invalid PostCSS configuration.

Impact: Application could not compile.

Resolution:
- Restored valid TypeScript config.
- Repaired Next.js configuration.
- Installed missing dependency.
- Rebuilt CSS pipeline.

---

### 2. AI Flow Failure
- Malformed Zod schema definition.
- Incorrect output structure.
- Missing title field in response contract.

Impact: Runtime errors and invalid API responses.

Resolution:
- Rebuilt schema with strict contract.
- Ensured consistent structured output.
- Added fallback handling.

---

### 3. Wikipedia API Logic Failure
- Original implementation relied on exact title matching.
- REST endpoint failed for natural queries.

Impact: Frequently returned empty results.

Resolution:
- Implemented search-first MediaWiki API pipeline.
- Selected best match.
- Fetched extract + thumbnail.
- Guaranteed deterministic answer and source link.