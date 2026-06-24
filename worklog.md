---
Task ID: razorpay-fix-2026-06-24
Agent: main
Task: Fix "Failed to create payment order" — implement complete production-ready Razorpay flow with /api/create-order + /api/verify-payment endpoints, surface real backend errors.

Work Log:
- Diagnosed root cause via dev.log: Razorpay API rejected receipts >40 chars. Old code generated `rcpt_${Date.now()}_${email}` which exceeded the 40-char limit for any email longer than ~5 chars.
- Rewrote `/api/payment/create-order/route.ts`:
  * Receipt now uses user-specified prefix `uploadiq_pro_` + short base36 timestamp + 4-char random suffix (~21 chars total, well under 40)
  * Multi-layer env var loader (process.env → .secrets/youtube.env → .env.local → .env) with quote-stripping
  * `describeError()` helper extracts the real Razorpay error description (`error.code — error.description`)
  * Comprehensive structured console logging with request IDs (`co_<ts>_<rand>`)
  * Validates env vars presence BEFORE calling Razorpay SDK (returns clear 500 with actionable message)
  * Persists order row to `PaymentOrder` table (non-fatal on DB failure)
  * Returns `{ orderId, amount, currency, keyId, receipt, isLive }`
- Rewrote `/api/payment/verify/route.ts`:
  * Signature verification using HMAC-SHA256 + `crypto.timingSafeEqual` (constant-time, length check first)
  * Returns clear 400 on missing fields, missing signature, invalid signature
  * Marks PaymentOrder as paid, upserts User (plan=pro, analysesLimit=-1), creates Subscription row
  * 1-month subscription end date
  * Structured logging with request IDs (`vp_<ts>_<rand>`)
- Created alias routes `/api/create-order/route.ts` and `/api/verify-payment/route.ts` re-exporting POST (with separate `runtime = "nodejs"` export, since Next.js doesn't allow re-exporting `runtime`)
- Refactored `payment-modal.tsx`:
  * Switched fetch URLs from `/api/payment/create-order` → `/api/create-order` and `/api/payment/verify` → `/api/verify-payment` (matches user spec exactly)
  * Removed generic "Failed to create payment order" — now surfaces `orderData.error` (the exact backend message) as the error banner
  * Added JSON parse safety (falls back to HTTP status message if body isn't JSON)
  * Now surfaces Razorpay payment.failed reason + code in the error banner (e.g., "Payment failed [BAD_REQUEST_ERROR]: ...")
  * Added console.error logging on every failure path
  * Falls back to `NEXT_PUBLIC_RAZORPAY_KEY_ID` if server didn't return `keyId` (backward-compat)
  * Verify-payment failure now includes the Razorpay payment ID in the error so user can contact support
- Tested all 6 scenarios with curl: short email ✓, long email (the original bug) ✓, legacy path ✓, missing email ✓, bad signature ✓, missing payment ID ✓

Stage Summary:
- Root cause: receipt exceeded Razorpay's 40-char limit.
- User will now see the EXACT Razorpay error (e.g., "Razorpay: BAD_REQUEST_ERROR — receipt: the length must be no more than 40.") instead of the generic "Failed to create payment order" — but with the fix, that error should no longer occur at all.
- Production-ready: signature verification uses crypto.timingSafeEqual, env vars loaded from 4-layer fallback, structured request-ID logging on every code path.
- Database storage: Prisma/SQLite (`PaymentOrder`, `User`, `Subscription` tables) — equivalent to Supabase storage, just local SQLite. If user wants real Supabase, swap `src/lib/db.ts` to a Supabase client (env vars `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` not currently configured).
- Endpoints: `/api/create-order` (canonical, matches user spec) + `/api/payment/create-order` (legacy, kept for backward compat).
- UI unchanged — same modal, same flow, just better error surfacing.
