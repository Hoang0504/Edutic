"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type MenuKey =
  | "dashboard"
  | "users"
  | "exams"
  | "exams_2"
  | "import-exam"
  | "flashcard"
  | "listenningTranscript";

interface SelectedMenuContextProps {
  selectedMenu: MenuKey;
  handleMenuSelect: (menuKey: string) => void;
}

const SelectedMenuContext = createContext<SelectedMenuContextProps | undefined>(
  undefined
);

export const SelectedMenuProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMenu, setSelectedMenu] = useState<MenuKey>("dashboard");

  const handleMenuSelect = (menuKey: string) => {
    const validKeys: MenuKey[] = [
      "dashboard",
      "users",
      "exams",
      "exams_2",
      "import-exam",
      "flashcard",
      "listenningTranscript",
    ];
    if (validKeys.includes(menuKey as MenuKey)) {
      setSelectedMenu(menuKey as MenuKey);
    }
  };

  return (
    <SelectedMenuContext.Provider value={{ selectedMenu, handleMenuSelect }}>
      {children}
    </SelectedMenuContext.Provider>
  );
};

export const useSelectedMenu = () => {
  const ctx = useContext(SelectedMenuContext);
  if (!ctx) {
    throw new Error("useSelectedMenu must be used within SelectedMenuProvider");
  }
  return ctx;
};
