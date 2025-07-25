import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { History, Search, Download, Filter } from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

export default function HistoryPage() {
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities"],
    queryFn: () => fetch("/api/activities?limit=100").then((res) => res.json()),
  });

  const { data: allPayments } = useQuery({
    queryKey: ["/api/payments"],
  });

  const { data: allMeetings } = useQuery({
    queryKey: ["/api/meetings"],
  });

  const { data: allLoans } = useQuery({
    queryKey: ["/api/loans/with-members"],
  });

  if (isLoading) {
    return <div className="p-6">Cargando historial...</div>;
  }

  const filteredActivities =
    activities?.filter((activity: any) => {
      const matchesSearch = activity.description
        .toLowerCase()
        .includes(filter.toLowerCase());
      const matchesType = typeFilter === "all" || activity.type === typeFilter;
      return matchesSearch && matchesType;
    }) || [];

  const exportHistory = () => {
    const data = {
      activities: filteredActivities,
      payments: allPayments,
      meetings: allMeetings,
      loans: allLoans,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `banco-solidario-historial-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "loan_created":
        return "💰";
      case "loan_liquidated":
        return "✅";
      case "payment_made":
        return "💳";
      case "member_added":
        return "👤";
      case "meeting_created":
        return "📅";
      default:
        return "📋";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "loan_created":
        return "bg-blue-100 text-blue-800";
      case "loan_liquidated":
        return "bg-green-100 text-green-800";
      case "payment_made":
        return "bg-orange-100 text-orange-800";
      case "member_added":
        return "bg-purple-100 text-purple-800";
      case "meeting_created":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <History className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Historial de Actividades</h1>
            <p className="text-muted-foreground">
              Registro completo de todas las operaciones
            </p>
          </div>
        </div>
        <Button onClick={exportHistory} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Historial
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar en el historial..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Todos los tipos</option>
              <option value="loan_created">Préstamos creados</option>
              <option value="loan_liquidated">Préstamos liquidados</option>
              <option value="payment_made">Pagos realizados</option>
              <option value="member_added">Miembros agregados</option>
              <option value="meeting_created">Reuniones creadas</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Actividades
                </p>
                <p className="text-2xl font-bold">{activities?.length || 0}</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Préstamos Creados
                </p>
                <p className="text-2xl font-bold">
                  {activities?.filter((a: any) => a.type === "loan_created")
                    .length || 0}
                </p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Préstamos Liquidados
                </p>
                <p className="text-2xl font-bold">
                  {activities?.filter((a: any) => a.type === "loan_liquidated")
                    .length || 0}
                </p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Miembros Agregados
                </p>
                <p className="text-2xl font-bold">
                  {activities?.filter((a: any) => a.type === "member_added")
                    .length || 0}
                </p>
              </div>
              <div className="text-2xl">👤</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividades Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No se encontraron actividades con los filtros aplicados
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="text-2xl">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActivityColor(activity.type)}>
                        {activity.type.replace("_", " ").toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDateTime(activity.createdAt)}
                      </span>
                    </div>
                    <p className="font-medium">{activity.description}</p>
                    {activity.entityType && activity.entityId && (
                      <p className="text-sm text-muted-foreground">
                        {activity.entityType} #{activity.entityId}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {allPayments && allPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">{allPayments.length}</p>
                <p className="text-sm text-muted-foreground">Total de Pagos</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    allPayments.reduce(
                      (sum: number, p: any) => sum + Number(p.amount),
                      0,
                    ),
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  Monto Total Pagado
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    allPayments.reduce(
                      (sum: number, p: any) => sum + Number(p.interestAmount),
                      0,
                    ),
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Total Intereses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
