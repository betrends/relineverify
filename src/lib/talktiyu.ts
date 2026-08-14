/**
 * Thin server-side client for the Talktiyu Reseller API.
 * Docs: https://www.talktiyu.com/reseller/docs
 *
 * Every request is authenticated with our reseller API key. This module
 * must never be imported from client components — the API key stays on
 * the server, proxied through our own /api routes.
 */

const BASE_URL = process.env.TALKTIYU_BASE_URL || "https://www.talktiyu.com";

export class TalktiyuError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "TalktiyuError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const apiKey = process.env.TALKTIYU_API_KEY;
  if (!apiKey) throw new Error("TALKTIYU_API_KEY is not set");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json || json.status === "0") {
    const message = json?.error || `Talktiyu request failed (${res.status})`;
    throw new TalktiyuError(message, res.status);
  }

  return json as T;
}

export type TalktiyuBalance = {
  status: string;
  balance: number;
  currency: string;
};

export type TalktiyuCountry = { id: string; name: string; code: string };

export type TalktiyuService = {
  id: string;
  name: string;
  price: number;
  available: number;
};

export type TalktiyuOrder = {
  order_id: string;
  number: string;
  service: string;
  country: string;
  cost: number;
  balance: number;
};

export type TalktiyuOrderStatus = {
  order_id: string;
  number: string;
  sms: string | null;
  order_status: "pending" | "received" | "cancelled" | "expired";
  cost: number;
};

export function getBalance() {
  return request<{ status: string; balance: number; currency: string }>(
    "/api/reseller/balance"
  ).then((r) => r);
}

// Talktiyu's catalog endpoints (countries/services) can take 5-30s to
// respond and rarely change minute to minute, so we cache successful
// responses to keep the buy flow fast on repeat loads.
const CATALOG_CACHE_TTL_MS = 30 * 60 * 1000;
const catalogCache = new Map<string, { data: unknown; expires: number }>();

async function cachedCatalog<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = catalogCache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data as T;
  const data = await load();
  catalogCache.set(key, { data, expires: Date.now() + CATALOG_CACHE_TTL_MS });
  return data;
}

export function getCountries(server: string) {
  return cachedCatalog(`countries:${server}`, () =>
    request<{ status: string; data: TalktiyuCountry[] }>(
      `/api/reseller/countries?server=${encodeURIComponent(server)}`
    ).then((r) => r.data)
  );
}

// Cached variants for the public SEO landing pages (services/[slug],
// countries/[slug]) — those pages don't need second-by-second accuracy
// the way the live buy flow does, and critically can't rely on the
// in-memory cachedCatalog() above surviving between requests, since each
// serverless invocation may be a fresh, empty-cache instance. Using
// Next's `next: { revalidate }` fetch option instead stores the result in
// Vercel's persistent Data Cache, which *does* survive across
// invocations — so only the very first request after a deploy (or after
// the revalidate window lapses) pays the slow upstream cost.
async function requestCached<T>(path: string): Promise<T> {
  const apiKey = process.env.TALKTIYU_API_KEY;
  if (!apiKey) throw new Error("TALKTIYU_API_KEY is not set");

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    next: { revalidate: 3600 },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.status === "0") {
    const message = json?.error || `Talktiyu request failed (${res.status})`;
    throw new TalktiyuError(message, res.status);
  }
  return json as T;
}

export function getCountriesCached(server: string) {
  return requestCached<{ status: string; data: TalktiyuCountry[] }>(
    `/api/reseller/countries?server=${encodeURIComponent(server)}`
  ).then((r) => r.data);
}

export function getServicesCached(server: string, country: string) {
  return requestCached<{ status: string; data: TalktiyuService[] }>(
    `/api/reseller/services?server=${encodeURIComponent(server)}&country=${encodeURIComponent(country)}`
  ).then((r) => r.data);
}

export function getServices(server: string, country: string) {
  return cachedCatalog(`services:${server}:${country}`, () =>
    request<{ status: string; data: TalktiyuService[] }>(
      `/api/reseller/services?server=${encodeURIComponent(
        server
      )}&country=${encodeURIComponent(country)}`
    ).then((r) => r.data)
  );
}

export function createOrder(params: {
  server: string;
  service: string;
  country: string;
  service_name?: string;
  country_name?: string;
}) {
  return request<{ status: string; data: TalktiyuOrder }>(
    "/api/reseller/order",
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  ).then((r) => r.data);
}

export function getOrderStatus(orderId: string) {
  return request<{ status: string; data: TalktiyuOrderStatus }>(
    `/api/reseller/order/status?order_id=${encodeURIComponent(orderId)}`
  ).then((r) => r.data);
}

export function cancelOrder(orderId: string) {
  return request<{
    status: string;
    data: { order_id: string; order_status: string; refunded: number; message: string };
  }>("/api/reseller/order/cancel", {
    method: "POST",
    body: JSON.stringify({ order_id: orderId }),
  }).then((r) => r.data);
}

export const AVAILABLE_SERVERS = [
  "server-1",
  "server-2",
  "server-3",
  "server-4",
  "server-5",
  "server-6",
  "server-7",
  "server-8",
  "server-9",
];
