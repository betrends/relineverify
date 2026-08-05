"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import WalletCard from "./WalletCard";
import BuyNumberForm from "./BuyNumberForm";
import OrderCard, { Order } from "./OrderCard";
import EmailGenerateForm from "./EmailGenerateForm";
import EmailCard, { GeneratedEmail } from "./EmailCard";
import Reveal from "./motion/Reveal";
import StatsStrip from "./StatsStrip";
import EmptyState from "./EmptyState";
import { useSearch } from "./dashboard/SearchProvider";

export default function DashboardClient() {
  const t = useTranslations("dashboard.home");
  const [orders, setOrders] = useState<Order[]>([]);
  const [emails, setEmails] = useState<GeneratedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const { query } = useSearch();

  useEffect(() => {
    fetch("/api/orders", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((d) => setOrders(d.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
    fetch("/api/email-otp", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { emails: [] }))
      .then((d) => setEmails(d.emails || []))
      .catch(() => setEmails([]));
  }, []);

  function handleBought(order: Order) {
    setOrders((prev) => [order, ...prev]);
  }

  function handleOrderChange(updated: Order) {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  function handleGenerated(email: GeneratedEmail) {
    setEmails((prev) => [email, ...prev]);
  }

  function handleEmailChange(updated: GeneratedEmail) {
    setEmails((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
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

  const filteredEmails = q ? emails.filter((e) => e.address.toLowerCase().includes(q)) : emails;
  const activeEmails = filteredEmails.filter((e) => e.status === "pending");
  const emailHistory = filteredEmails.filter((e) => e.status !== "pending");

  const combinedHistory: (
    | { kind: "order"; id: string; createdAt: string; data: Order }
    | { kind: "email"; id: string; createdAt: string; data: GeneratedEmail }
  )[] = [
    ...history.map((o) => ({ kind: "order" as const, id: o.id, createdAt: o.createdAt, data: o })),
    ...emailHistory.map((e) => ({ kind: "email" as const, id: e.id, createdAt: e.createdAt, data: e })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-8">
      <StatsStrip orders={orders} emails={emails} />

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <Reveal>
            <BuyNumberForm onBought={handleBought} />
          </Reveal>
          <Reveal delay={0.05}>
            <EmailGenerateForm onGenerated={handleGenerated} />
          </Reveal>
        </div>

        <div className="space-y-8">
          <Reveal delay={0.1}>
            <WalletCard />
          </Reveal>

          <section id="active-orders">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">{t("activeNumbers")}</h2>
              <a href="#history" className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-300">
                {t("viewAll")}
              </a>
            </div>
            {loading ? (
              <p className="mt-4 text-sm text-slate-500">{t("loading")}</p>
            ) : active.length === 0 ? (
              <EmptyState
                icon={<InboxIcon />}
                title={t("noActiveNumbersTitle")}
                description={t("noActiveNumbersDesc")}
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

          <section id="generated-emails">
            <h2 className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">{t("activeEmails")}</h2>
            {activeEmails.length === 0 ? (
              <EmptyState
                icon={<MailIcon />}
                title={t("noActiveEmailsTitle")}
                description={t("noActiveEmailsDesc")}
              />
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {activeEmails.map((email) => (
                    <EmailCard key={email.id} email={email} onChange={handleEmailChange} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          <section id="history">
            <h2 className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">{t("history")}</h2>
            {combinedHistory.length === 0 ? (
              <EmptyState
                icon={<HistoryIcon />}
                title={t("noHistoryTitle")}
                description={t("noHistoryDesc")}
              />
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {combinedHistory.map((item) =>
                    item.kind === "order" ? (
                      <OrderCard key={`order-${item.id}`} order={item.data} />
                    ) : (
                      <EmailCard key={`email-${item.id}`} email={item.data} onChange={handleEmailChange} />
                    )
                  )}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
