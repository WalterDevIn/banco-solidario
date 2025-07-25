import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign } from "lucide-react";
import type { LoanWithMember } from "@shared/schema";
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import LoanRow from "./loanRow";

interface LoanTableProps {
  loans: LoanWithMember[];
  isLoading: boolean;
  toast: (opts: any) => void;
}

export default function LoanTable({ loans, isLoading, toast }: LoanTableProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Préstamos ({loans.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loans.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay préstamos</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando tu primer préstamo o ajusta los filtros.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Miembro</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Saldo Pendiente</TableHead>
                  <TableHead>Cuota Mensual</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <LoanRow key={loan.id} loan={loan} toast={toast} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
