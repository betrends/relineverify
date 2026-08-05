"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import MotionButton from "./motion/MotionButton";
import AnimatedError from "./motion/AnimatedError";
import Combobox from "./Combobox";
import HoverLift from "./motion/HoverLift";
import { refreshWallet, prefillTopupAmount } from "@/lib/walletEvents";
import { onSelectCountry, onSelectService } from "@/lib/buySelectionEvents";
import { useSearch } from "./dashboard/SearchProvider";
import { countryCodeToFlag } from "@/lib/countryFlag";
import ServiceIcon from "./ServiceIcon";

type Country = { id: string; name: string; code: string };
type Service = { id: string; name: string; price: number; available: number };

const CATALOG_TIMEOUT_MS = 35000;

async function fetchCatalog(url: string, timeoutMessage: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CATALOG_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error(timeoutMessage);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export default function BuyNumberForm({ onBought }: { onBought: (order: any) => void }) {
  const t = useTranslations("dashboard.buyNumber");
  const [servers, setServers] = useState<string[]>([]);
  const [server, setServer] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [service, setService] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCountries: setSearchCountries, setServices: setSearchServices } = useSearch();

  useEffect(() => {
    setSearchCountries(countries.map((c) => ({ id: c.id, name: c.name, code: c.code })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries]);

  useEffect(() => {
    setSearchServices(services.map((s) => ({ id: s.id, name: s.name })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services]);

  useEffect(() => {
    const offCountry = onSelectCountry((countryId) => {
      if (countries.some((c) => c.id === countryId)) setCountry(countryId);
    });
    const offService = onSelectService((serviceId) => {
      if (services.some((s) => s.id === serviceId)) setService(serviceId);
    });
    return () => {
      offCountry();
      offService();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries, services]);

  useEffect(() => {
    fetch("/api/talktiyu/servers")
      .then((r) => r.json())
      .then((d) => {
        setServers(d.servers || []);
        if (d.servers?.length) setServer(d.servers[0]);
      });
  }, []);

  function loadCountries() {
    if (!server) return;
    setError(null);
    setLoadingCountries(true);
    fetchCatalog(`/api/talktiyu/countries?server=${encodeURIComponent(server)}`, t("timeoutError"))
      .then((d) => {
        const sorted = [...(d.countries || [])].sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(sorted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingCountries(false));
  }

  function loadServices() {
    if (!server || !country) return;
    setError(null);
    setLoadingServices(true);
    fetchCatalog(
      `/api/talktiyu/services?server=${encodeURIComponent(server)}&country=${encodeURIComponent(
        country
      )}`,
      t("timeoutError")
    )
      .then((d) => setServices(d.services || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingServices(false));
  }

  useEffect(() => {
    if (!server) return;
    setCountries([]);
    setCountry("");
    setServices([]);
    setService("");
    loadCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server]);

  useEffect(() => {
    if (!server || !country) return;
    setServices([]);
    setService("");
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server, country]);

  const selectedService = services.find((s) => s.id === service);
  const selectedCountry = countries.find((c) => c.id === country);

  async function buy() {
    if (!server || !country || !service || !selectedCountry) return;
    setError(null);
    setBuying(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          server,
          country,
          countryName: selectedCountry.name,
          service,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (typeof json.needed === "number") {
          prefillTopupAmount(json.needed);
          document.getElementById("topup")?.scrollIntoView({ behavior: "smooth", block: "start" });
          setError(t("insufficientFunds", { amount: json.needed.toLocaleString() }));
        } else {
          setError(json.error || t("errorGeneric"));
        }
        return;
      }
      onBought(json.order);
      refreshWallet();
      setService("");
    } finally {
      setBuying(false);
    }
  }

  return (
    <HoverLift id="buy" className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
      <h2 className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">{t("title")}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("subtitle")}</p>

      <div className="mt-5 space-y-4">
        <Field label={t("server")}>
          <select
            value={server}
            onChange={(e) => setServer(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus-ring focus:border-violet-500 dark:border-ink-700 dark:bg-ink-950 dark:text-paper-100"
          >
            {servers.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t("country")}>
          <Combobox
            value={country}
            onChange={setCountry}
            options={countries.map((c) => ({
              id: c.id,
              label: c.name,
              icon: (
                <span className="text-base leading-none" aria-hidden>
                  {countryCodeToFlag(c.code)}
                </span>
              ),
            }))}
            placeholder={t("selectCountry")}
            searchPlaceholder={t("searchCountries")}
            loading={loadingCountries}
            disabled={loadingCountries || !countries.length}
          />
          {loadingCountries && (
            <p className="mt-1.5 text-xs text-slate-400">{t("fetchingCountries")}</p>
          )}
        </Field>

        <Field label={t("service")}>
          <Combobox
            value={service}
            onChange={setService}
            options={services.map((s) => ({
              id: s.id,
              label: s.name,
              sublabel: s.available < 1 ? t("outOfStock") : `₦${s.price.toLocaleString()}`,
              disabled: s.available < 1,
              icon: <ServiceIcon name={s.name} className="h-5 w-5" />,
            }))}
            placeholder={!country ? t("selectCountryFirst") : t("selectService")}
            searchPlaceholder={t("searchServices")}
            loading={loadingServices}
            disabled={loadingServices || !services.length}
          />
          {loadingServices && (
            <p className="mt-1.5 text-xs text-slate-400">{t("fetchingServices")}</p>
          )}
        </Field>
      </div>

      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-ink-950"
          >
            <span className="text-sm text-slate-500 dark:text-slate-400">{t("price")}</span>
            <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-mint-400">
              ₦{selectedService.price.toLocaleString()}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3 flex items-center gap-3">
        <AnimatedError message={error} />
        {error && (
          <button
            type="button"
            onClick={country ? loadServices : loadCountries}
            className="shrink-0 text-sm text-violet-600 underline-offset-2 hover:underline focus-ring dark:text-violet-300"
          >
            {t("retry")}
          </button>
        )}
      </div>

      <MotionButton
        onClick={buy}
        disabled={buying || !service}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 focus-ring"
      >
        {buying ? t("buying") : t("buy")}
        {!buying && <ArrowRightIcon />}
      </MotionButton>
    </HoverLift>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-slate-500 dark:text-slate-400">{label}</label>
      {children}
    </div>
  );
}
