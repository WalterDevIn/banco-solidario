import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Printer, Calendar, RefreshCw } from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MeetingDetailModal from "@/components/modals/meeting-detail-modal";
import type { Meeting } from "@shared/schema";

export default function Meetings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: meetings, isLoading } = useQuery({
    queryKey: ["/api/meetings"],
  });

  const { data: nextMeetingDate } = useQuery({
    queryKey: ["/api/meetings/next-date"],
  });

  const generateMeetingMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/meetings/auto-generate");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetings"] });
      toast({
        title: "Reunión generada",
        description: "Se ha generado automáticamente la próxima reunión",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo generar la reunión automática",
        variant: "destructive",
      });
    }
  });

  const createManualMeetingMutation = useMutation({
    mutationFn: async (date: Date) => {
      return await apiRequest("POST", "/api/meetings", {
        date: date.toISOString(),
        totalCollected: 0,
        totalLent: 0, 
        totalInterest: 0,
        summary: "Reunión creada manualmente"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetings"] });
      toast({
        title: "Reunión creada",
        description: "Se ha creado la reunión exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la reunión",
        variant: "destructive",
      });
    }
  });

  const filteredMeetings = meetings?.filter((meeting: Meeting) =>
    meeting.id.toString().includes(searchTerm) ||
    formatDate(meeting.date).includes(searchTerm) ||
    (meeting.summary && meeting.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const getNextSecondSaturday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const firstSaturday = new Date(firstDay);
    firstSaturday.setDate(1 + (6 - firstDay.getDay()) % 7);

    const secondSaturday = new Date(firstSaturday);
    secondSaturday.setDate(firstSaturday.getDate() + 7);

    if (secondSaturday < now) {
      const nextMonth = new Date(year, month + 1, 1);
      const nextFirstSaturday = new Date(nextMonth);
      nextFirstSaturday.setDate(1 + (6 - nextMonth.getDay()) % 7);
      const nextSecondSaturday = new Date(nextFirstSaturday);
      nextSecondSaturday.setDate(nextFirstSaturday.getDate() + 7);
      return nextSecondSaturday;
    }

    return secondSaturday;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
      </div>
    );
  }

  const nextAutoDate = getNextSecondSaturday();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Reuniones</h2>
          <p className="text-gray-600">Gestión de reuniones mensuales del segundo sábado</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => generateMeetingMutation.mutate()}
            disabled={generateMeetingMutation.isPending}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generar Automática
          </Button>
          <Button
            onClick={() => createManualMeetingMutation.mutate(new Date())}
            disabled={createManualMeetingMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Reunión
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próxima Reunión Automática
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatDate(nextAutoDate)}
              </p>
              <p className="text-sm text-muted-foreground">
                Segundo sábado del mes
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {Math.ceil((nextAutoDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días restantes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total de Reuniones</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-2xl font-bold">{meetings?.length || 0}</p>
              <p className="text-sm text-muted-foreground">
                Reuniones realizadas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Última Reunión</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {meetings && meetings.length > 0 ? (
                <>
                  <p className="text-lg font-bold">
                    {formatDate(meetings[0].date)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total recaudado: {formatCurrency(meetings[0].totalCollected)}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">No hay reuniones</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Historial de Reuniones ({filteredMeetings.length})</CardTitle>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar reuniones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMeetings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reuniones</h3>
              <p className="mt-1 text-sm text-gray-500">
                {meetings?.length === 0 
                  ? "Comienza creando tu primera reunión."
                  : "No se encontraron reuniones con los filtros aplicados."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total Recaudado</TableHead>
                    <TableHead>Total Prestado</TableHead>
                    <TableHead>Intereses</TableHead>
                    <TableHead>Resumen</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeetings.map((meeting: Meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">#{meeting.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatDate(meeting.date)}</p>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(meeting.createdAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(meeting.totalCollected)}
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {formatCurrency(meeting.totalLent)}
                      </TableCell>
                      <TableCell className="font-medium text-orange-600">
                        {formatCurrency(meeting.totalInterest)}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-700 max-w-xs truncate">
                          {meeting.summary || "Sin resumen"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMeetingId(meeting.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              console.log('Imprimiendo reunión:', meeting);
                              toast({
                                title: "Documento generado",
                                description: "El reporte de la reunión está listo para imprimir",
                              });
                            }}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <MeetingDetailModal
        meetingId={selectedMeetingId}
        open={selectedMeetingId !== null}
        onOpenChange={(open) => !open && setSelectedMeetingId(null)}
      />
    </div>
  );
}
