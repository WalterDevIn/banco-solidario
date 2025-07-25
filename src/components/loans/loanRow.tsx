import { LoanWithMember } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Eye, Printer, CheckCircle, Trash2 } from "lucide-react";
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useLoanMutations } from "./loanMutations";

export default function LoanRow({
  loan,
  toast,
}: {
  loan: LoanWithMember;
  toast: (opts: any) => void;
}) {
  const { liquidateLoan, deleteLoan, printLoan } = useLoanMutations(toast);

  return (
    <tr className="border-b border-gray-200">
      <td className="py-3 px-2 font-medium">#{loan.id}</td>

      <td className="py-3 px-2">
        <div>
          <p className="font-medium">{loan.member.name}</p>
          <p className="text-sm text-gray-500">
            {loan.member.memberType === "member" ? "Miembro" : "Externo"}
          </p>
        </div>
      </td>

      <td className="py-3 px-2">{formatCurrency(loan.amount)}</td>

      <td className="py-3 px-2 font-medium text-red-600">
        {formatCurrency(loan.remainingBalance)}
      </td>

      <td className="py-3 px-2">{formatCurrency(loan.monthlyPayment)}</td>

      <td className="py-3 px-2">
        <Badge className={getStatusBadgeClass(loan.status)}>
          {getStatusLabel(loan.status)}
        </Badge>
      </td>

      <td className="py-3 px-2">{formatDate(loan.startDate)}</td>

      <td className="py-3 px-2">
        <div className="flex gap-2">
          <Link href={`/loans/${loan.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => printLoan(loan.id)}
          >
            <Printer className="w-4 h-4" />
          </Button>

          {loan.status === "active" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => liquidateLoan(loan.id)}
              className="text-green-600 hover:text-green-700"
              title="Liquidar"
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteLoan(loan.id)}
              className="text-red-600 hover:text-red-700"
              title="Eliminar préstamo"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
