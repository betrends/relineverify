const SELECT_COUNTRY_EVENT = "reline:select-country";
const SELECT_SERVICE_EVENT = "reline:select-service";

export function selectCountry(countryId: string) {
  window.dispatchEvent(new CustomEvent(SELECT_COUNTRY_EVENT, { detail: countryId }));
}

export function onSelectCountry(handler: (countryId: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(SELECT_COUNTRY_EVENT, listener);
  return () => window.removeEventListener(SELECT_COUNTRY_EVENT, listener);
}

export function selectService(serviceId: string) {
  window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: serviceId }));
}

export function onSelectService(handler: (serviceId: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(SELECT_SERVICE_EVENT, listener);
  return () => window.removeEventListener(SELECT_SERVICE_EVENT, listener);
}
