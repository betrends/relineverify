"use client";

import { createContext, useContext, useState } from "react";

export type SearchableCountry = { id: string; name: string; code: string };
export type SearchableService = { id: string; name: string };

type SearchContextValue = {
  query: string;
  setQuery: (q: string) => void;
  countries: SearchableCountry[];
  setCountries: (c: SearchableCountry[]) => void;
  services: SearchableService[];
  setServices: (s: SearchableService[]) => void;
};

const SearchContext = createContext<SearchContextValue>({
  query: "",
  setQuery: () => {},
  countries: [],
  setCountries: () => {},
  services: [],
  setServices: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState<SearchableCountry[]>([]);
  const [services, setServices] = useState<SearchableService[]>([]);

  return (
    <SearchContext.Provider value={{ query, setQuery, countries, setCountries, services, setServices }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
