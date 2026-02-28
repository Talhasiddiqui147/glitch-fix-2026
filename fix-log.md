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