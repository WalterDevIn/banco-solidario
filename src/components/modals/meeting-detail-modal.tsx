import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, X, ArrowDown, ArrowUp, Percent, TrendingUp } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { MeetingWithDetails } from "@shared/schema";

interface MeetingDetailModalProps {
  meetingId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MeetingDetailModal({ meetingId, open, onOpenChange }: MeetingDetailModalProps) {
  const { data: meeting, isLoading } = useQuery({
    queryKey: ["/api/meetings", meetingId],
    enabled: !!meetingId,
  });

  if (!meetingId) return null;

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const meetingData = meeting as MeetingWithDetails;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Reunión del {meetingData?.date ? formatDate(meetingData.date) : "sin fecha"}
            </DialogTitle>
            <div className="flex space-x-2">
              <Button className="btn-primary no-print">
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="no-print"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {meetingData && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gray-50">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Resumen Financiero</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saldo total:</span>
                      <span className="font-medium text-gray-800">$16,000,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total recaudado:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(meetingData.totalCollected)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total prestado:</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(meetingData.totalLent)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Intereses generados:</span>
                      <span className="font-medium text-purple-600">
                        {formatCurrency(meetingData.totalInterest)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Flujo de Actividades</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 text-green-600 p-2 rounded-full">
                        <ArrowDown className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Pagos recibidos</p>
                        <p className="text-xs text-gray-500">
                          {meetingData.payments?.length || 0} transacciones
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <ArrowUp className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Préstamos otorgados</p>
                        <p className="text-xs text-gray-500">
                          {meetingData.newLoans?.length || 0} nuevos préstamos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                        <Percent className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Intereses calculados</p>
                        <p className="text-xs text-gray-500">Préstamos activos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Movimientos Detallados</h4>
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  {meetingData.payments && meetingData.payments.length > 0 ? (
                    <div className="space-y-4">
                      <h5 className="font-medium text-gray-800">Pagos Recibidos</h5>
                      {meetingData.payments.map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div>
                            <p className="font-medium">{payment.member.name}</p>
                            <p className="text-sm text-gray-500">Préstamo #{payment.loan.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(payment.amount)}</p>
                            <p className="text-sm text-gray-500">
                              Principal: {formatCurrency(payment.principalAmount)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No hay movimientos registrados para esta reunión</p>
                      <p className="text-sm mt-2">Los pagos y préstamos aparecerán aquí cuando se procesen</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {meetingData.summary && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Resumen de la Reunión</h4>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-gray-700">{meetingData.summary}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
