import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { LoanWithMember } from "@shared/schema";

export function useLoansQuery() {
  return useQuery<LoanWithMember[], Error>({
    queryKey: ["/api/loans/with-members"],
    queryFn: () =>
      apiRequest("GET", "/api/loans/with-members").then(res => res.json()),
    staleTime: 0,
    refetchOnMount: "always",
  });
}