import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useLoanMutations(toast: (opts: any) => void) {
  const queryClient = useQueryClient();

  const liquidateLoan = useMutation({
    mutationFn: (loanId: number) => apiRequest(`/api/loans/${loanId}/liquidate`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans/with-members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      toast({ title: "Préstamo liquidado", description: "Se liquidó correctamente." });
    },
    onError: () => toast({ title: "Error", description: "No se pudo liquidar el préstamo", variant: "destructive" }),
  });

  const deleteLoan = useMutation({
    mutationFn: (loanId: number) => apiRequest(`/api/loans/${loanId}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans/with-members"] });
      toast({ title: "Préstamo eliminado", description: "Se eliminó correctamente." });
    },
    onError: () => toast({ title: "Error", description: "No se pudo eliminar el préstamo", variant: "destructive" }),
  });

  const printLoan = useMutation({
    mutationFn: (loanId: number) => apiRequest(`/api/loans/${loanId}/print`),
    onSuccess: () => toast({ title: "Documento generado", description: "Está listo para imprimir" }),
    onError: () => toast({ title: "Error", description: "No se pudo generar el documento", variant: "destructive" }),
  });

  return {
    liquidateLoan: (id: number) => liquidateLoan.mutate(id),
    deleteLoan: (id: number) => deleteLoan.mutate(id),
    printLoan: (id: number) => printLoan.mutate(id),
  };
}
