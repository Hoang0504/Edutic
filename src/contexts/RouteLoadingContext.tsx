"use client";

import { ReactNode, createContext, useContext, useState } from "react";

type RouteLoadingContextType = {
  [route: string]: boolean;
};

const RouteLoadingContext = createContext<{
  routeLoading: RouteLoadingContextType;
  setRouteLoading: (route: string, value: boolean) => void;
}>({
  routeLoading: {},
  setRouteLoading: () => {},
});

export const RouteLoadingProvider = ({ children }: { children: ReactNode }) => {
  const [routeLoading, setRouteLoadingState] =
    useState<RouteLoadingContextType>({});
  const setRouteLoading = (route: string, value: boolean) => {
    setRouteLoadingState((prev) => ({ ...prev, [route]: value }));
  };

  return (
    <RouteLoadingContext.Provider value={{ routeLoading, setRouteLoading }}>
      {children}
    </RouteLoadingContext.Provider>
  );
};

export const useRouteLoading = () => useContext(RouteLoadingContext);
