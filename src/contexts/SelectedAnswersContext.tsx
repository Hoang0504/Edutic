"use client";

import { ReactNode, createContext, useContext, useState } from "react";

type SelectedAnswersType = {
  [key: number]: string;
};

const SelectedAnswersContext = createContext<{
  selectedAnswers: SelectedAnswersType;
  setSelectedAnswers: (prev: any) => void;
}>({
  selectedAnswers: {},
  setSelectedAnswers: () => {},
});

export const SelectedAnswersProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswersType>(
    {}
  );

  return (
    <SelectedAnswersContext.Provider
      value={{ selectedAnswers, setSelectedAnswers }}
    >
      {children}
    </SelectedAnswersContext.Provider>
  );
};

export const useSelectedAnswers = () => useContext(SelectedAnswersContext);
