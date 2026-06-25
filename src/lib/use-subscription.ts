"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePaymentStore, type SubscriptionInfo } from "@/lib/payment-store";
import { getOrCreateAnonymousId } from "@/lib/anonymous";

interface UseSubscriptionResult {
  /** The current subscription info (null while loading). */
  subscription: SubscriptionInfo | null;
  /** True until the first load completes. */
  loading: boolean;
  /** Error message if the last refresh failed. */
  error: string | null;
  /** Convenience: is the user on the Pro plan? */
  isPro: boolean;
  /** Convenience: is the user anonymous (no email)? */
  isAnonymous: boolean;
  /** Remaining analyses in the rolling weekly window (Infinity for Pro). */
  remaining: number;
  /** Force a fresh fetch from /api/subscription. */
  refresh: () => Promise<SubscriptionInfo | null>;
}

export function useSubscription(): UseSubscriptionResult {
  const { userEmail, subscription, setSubscription } = usePaymentStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedForRef = useRef<string | null>(null);

  const refresh = useCallback(async (): Promise<SubscriptionInfo | null> => {
    let email = userEmail || "";
    // Read from localStorage as a fallback (the payment modal persists email there).
    if (!email && typeof window !== "undefined") {
      try {
        email = window.localStorage.getItem("videoiq:userEmail") || "";
      } catch {
        /* ignore */
      }
    }

    const anonId = getOrCreateAnonymousId();
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    if (anonId) params.set("anonymousId", anonId);

    try {
      const res = await fetch(`/api/subscription?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`);
      }
      const data = (await res.json()) as SubscriptionInfo & {
        anonymous?: boolean;
        weeklyResetAt?: string | null;
      };
      // Normalize: ensure `anonymous` is set on the info object so the rest of
      // the app can read it.
      const info: SubscriptionInfo = {
        plan: data.plan,
        analysesUsed: data.analysesUsed,
        analysesLimit: data.analysesLimit,
        subscription: data.subscription ?? null,
      } as SubscriptionInfo & { anonymous?: boolean };
      (info as any).anonymous = data.anonymous ?? !email;
      (info as any).weeklyResetAt = data.weeklyResetAt ?? null;

      setSubscription(info);
      setError(null);
      return info;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[useSubscription] refresh failed:", msg);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userEmail, setSubscription]);

  useEffect(() => {
    const cacheKey = userEmail || "__anonymous__";
    if (fetchedForRef.current === cacheKey) return;
    fetchedForRef.current = cacheKey;
    refresh();
  }, [userEmail, refresh]);

  const isPro = subscription?.plan === "pro";
  const isAnonymous = (subscription as any)?.anonymous === true || (!userEmail && !subscription?.subscription);
  const limit = subscription?.analysesLimit;
  const remaining =
    isPro || limit === "unlimited"
      ? Infinity
      : typeof limit === "number"
        ? Math.max(0, limit - (subscription?.analysesUsed ?? 0))
        : 0;

  return {
    subscription,
    loading,
    error,
    isPro,
    isAnonymous,
    remaining,
    refresh,
  };
}
