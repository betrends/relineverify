"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import WalletCard from "./WalletCard";
import BuyNumberForm from "./BuyNumberForm";
import OrderCard, { Order } from "./OrderCard";
import Reveal from "./motion/Reveal";
import StatsStrip from "./StatsStrip";
import EmptyState from "./EmptyState";
import { useSearch } from "./dashboard/SearchProvider";

export default function DashboardClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { query } = useSearch();

  useEffect(() => {
    fetch("/api/orders", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, []);

  function handleBought(order: Order) {
    setOrders((prev) => [order, ...prev]);
  }

  function handleOrderChange(updated: Order) {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  const q = query.trim().toLowerCase();
  const filtered = q
    ? orders.filter(
        (o) =>
          o.number.toLowerCase().includes(q) ||
          o.serviceName.toLowerCase().includes(q) ||
          o.countryName.toLowerCase().includes(q)
      )
    : orders;
  const active = filtered.filter((o) => o.status === "pending");
  const history = filtered.filter((o) => o.status !== "pending");

  return (
    <div className="space-y-8">
      <StatsStrip orders={orders} />

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <Reveal>
            <WalletCard />
          </Reveal>
          <Reveal delay={0.1}>
            <BuyNumberForm onBought={handleBought} />
          </Reveal>
        </div>

        <div className="space-y-8">
          <section id="active-orders">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">Active Orders</h2>
              <a href="#history" className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-300">
                View all
              </a>
            </div>
            {loading ? (
              <p className="mt-4 text-sm text-slate-500">Loading…</p>
            ) : active.length === 0 ? (
              <EmptyState
                icon={<InboxIcon />}
                title="No active orders"
                description="Buy a number on the left to watch a code land here in real time."
              />
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {active.map((order) => (
                    <OrderCard key={order.id} order={order} onChange={handleOrderChange} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          <section id="history">
            <h2 className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">History</h2>
            {history.length === 0 ? (
              <EmptyState
                icon={<HistoryIcon />}
                title="Nothing here yet"
                description="Completed, cancelled, and expired orders will show up here."
              />
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {history.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function InboxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 11l2.2-6.2A1 1 0 0 1 6.15 4h7.7a1 1 0 0 1 .95.68L17 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M3 11h4.2a1 1 0 0 1 .9.55l.5 1a1 1 0 0 0 .9.55h2.6a1 1 0 0 0 .9-.55l.5-1a1 1 0 0 1 .9-.55H17v3.5A1.5 1.5 0 0 1 15.5 16h-11A1.5 1.5 0 0 1 3 14.5V11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.5v3.7l2.8 1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
