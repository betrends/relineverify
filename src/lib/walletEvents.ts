const WALLET_REFRESH_EVENT = "reline:wallet-refresh";

export function refreshWallet() {
  window.dispatchEvent(new Event(WALLET_REFRESH_EVENT));
}

export function onWalletRefresh(handler: () => void) {
  window.addEventListener(WALLET_REFRESH_EVENT, handler);
  return () => window.removeEventListener(WALLET_REFRESH_EVENT, handler);
}

const PREFILL_TOPUP_EVENT = "reline:prefill-topup";

export function prefillTopupAmount(amount: number) {
  window.dispatchEvent(new CustomEvent(PREFILL_TOPUP_EVENT, { detail: amount }));
}

export function onPrefillTopupAmount(handler: (amount: number) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<number>).detail);
  window.addEventListener(PREFILL_TOPUP_EVENT, listener);
  return () => window.removeEventListener(PREFILL_TOPUP_EVENT, listener);
}
