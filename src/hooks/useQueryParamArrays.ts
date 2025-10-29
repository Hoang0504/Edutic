import { useRouter } from "next/router";
import { useMemo } from "react";

function useQueryParamArrays(): Record<string, string[]> {
  const router = useRouter();

  return useMemo(() => {
    if (!router.isReady) return {};

    const result: Record<string, string[]> = {};

    Object.entries(router.query).forEach(([key, value]) => {
      if (typeof value === "undefined") {
        result[key] = [];
      } else if (Array.isArray(value)) {
        result[key] = value;
      } else {
        result[key] = [value];
      }
    });

    return result;
  }, [router.query, router.isReady]);
}

export default useQueryParamArrays;
