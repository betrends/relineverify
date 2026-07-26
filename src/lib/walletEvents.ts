const WALLET_REFRESH_EVENT = "reline:wallet-refresh";

export function refreshWallet() {
  window.dispatchEvent(new Event(WALLET_REFRESH_EVENT));
}

export function onWalletRefresh(handler: () => void) {
  window.addEventListener(WALLET_REFRESH_EVENT, handler);
  return () => window.removeEventListener(WALLET_REFRESH_EVENT, handler);
}
