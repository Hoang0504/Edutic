"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type DictionaryContextType = {
  showDictionary: boolean;
  toggleDictionary: () => void;
};

const DictionaryContext = createContext<DictionaryContextType | undefined>(
  undefined
);

export const DictionaryProvider = ({ children }: { children: ReactNode }) => {
  const [showDictionary, setShowDictionary] = useState(false);
  const toggleDictionary = () => setShowDictionary((prev) => !prev);

  return (
    <DictionaryContext.Provider value={{ showDictionary, toggleDictionary }}>
      {children}
    </DictionaryContext.Provider>
  );
};

export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (context === undefined) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
};
