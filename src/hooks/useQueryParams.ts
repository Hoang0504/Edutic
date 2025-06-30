import { useSearchParams } from "next/navigation";

function useQueryParams(): Record<string, string> {
  const searchParams = useSearchParams();

  const entries = searchParams ? Array.from(searchParams.entries()) : [];

  const query: Record<string, string> = {};
  entries.forEach(([key, value]) => {
    query[key] = value;
  });

  return query;
}

export default useQueryParams;
