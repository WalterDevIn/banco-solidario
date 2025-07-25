import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, DollarSign } from "lucide-react";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import type { LoanWithMember, Payment } from "@shared/schema";

export default function LoanDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: loan, isLoading } = useQuery<LoanWithMember>({
    queryKey: ["/api/loans", id],
    queryFn: () => apiRequest("GET", `/api/loans/${id}`).then(res => res.json()),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const liquidateMutation = useMutation({
    mutationFn: (amount?: number) =>
      apiRequest("POST", `/api/loans/${id}/liquidate`, amount ? { amount } : {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      setLocation("/loans");
    },
  });

  const printMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/loans/${id}/print`),
    onSuccess: async (res) => {
      const data = await res.json();
      console.log("Documento generado:", data);
      alert("Documento listo para imprimir");
    },
  });

  if (isLoading) return <div className="p-6">Cargando...</div>;
  if (!loan) return <div className="p-6">Préstamo no encontrado</div>;

  const monthlyInterest = Number(loan.remainingBalance) * Number(loan.interestRate);
  const payments: Payment[] = loan.payments || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setLocation("/loans")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Préstamos
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Préstamo #{loan.id}</h1>
            <p className="text-muted-foreground">{loan.member.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => printMutation.mutate()}
            disabled={printMutation.isPending}
          >
            <Download className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          {loan.status === "active" && (
            <Button
              onClick={() => liquidateMutation.mutate()}
              disabled={liquidateMutation.isPending}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Liquidar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Préstamo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Monto Original</p>
              <p className="text-lg font-semibold">{formatCurrency(loan.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo Pendiente</p>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(loan.remainingBalance)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge className={getStatusBadgeClass(loan.status)}>
                {loan.status === "active" ? "Activo" : "Liquidado"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
              <p>{formatDate(loan.startDate)}</p>
            </div>
            {loan.liquidatedAt && (
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Liquidación</p>
                <p>{formatDate(loan.liquidatedAt)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Términos de Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Cuota Mensual</p>
              <p className="text-lg font-semibold">{formatCurrency(loan.monthlyPayment)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tasa de Interés Mensual</p>
              <p className="text-lg font-semibold">
                {(Number(loan.interestRate) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Plazo</p>
              <p>{loan.termMonths} meses</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Interés Mensual Actual</p>
              <p className="text-lg font-semibold text-orange-600">
                {formatCurrency(monthlyInterest)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Miembro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="font-semibold">{loan.member.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo</p>
              <Badge variant={loan.member.memberType === "member" ? "default" : "secondary"}>
                {loan.member.memberType === "member" ? "Miembro" : "Externo"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p>{loan.member.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{loan.member.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center p-3 border rounded"
                >
                  <div>
                    <p className="font-medium">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-muted-foreground">
                      Capital: {formatCurrency(payment.principalAmount)} | Interés:{" "}
                      {formatCurrency(payment.interestAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatDate(payment.paymentDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
