import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, TrendingUp } from "lucide-react";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";

export default function MemberDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: member, isLoading } = useQuery({
    queryKey: ['/api/members', id],
    enabled: !!id
  });

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!member) {
    return <div className="p-6">Miembro no encontrado</div>;
  }

  const loans = member.loans || [];
  const activeLoans = loans.filter((loan: any) => loan.status === 'active');
  const completedLoans = loans.filter((loan: any) => loan.status === 'liquidated');

  const totalActiveAmount = activeLoans.reduce((sum: number, loan: any) => sum + Number(loan.remainingBalance), 0);
  const totalBorrowed = loans.reduce((sum: number, loan: any) => sum + Number(loan.amount), 0);
  const creditLimit = 2000000;
  const availableCredit = creditLimit - totalActiveAmount;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setLocation('/members')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Miembros
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{member.name}</h1>
            <p className="text-muted-foreground">
              {member.memberType === 'member' ? 'Miembro' : 'Externo'} - {member.status}
            </p>
          </div>
        </div>
        <Badge className={getStatusBadgeClass(member.status, 'member')}>
          {member.status === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Préstamos Activos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans.length}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalActiveAmount)} pendiente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prestado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBorrowed)}</div>
            <p className="text-xs text-muted-foreground">
              Histórico
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crédito Disponible</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(availableCredit)}</div>
            <p className="text-xs text-muted-foreground">
              Límite: {formatCurrency(creditLimit)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Préstamos Completados</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedLoans.length}</div>
            <p className="text-xs text-muted-foreground">
              Liquidados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nombre Completo</p>
              <p className="font-semibold">{member.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p>{member.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{member.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dirección</p>
              <p>{member.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Miembro</p>
              <Badge variant={member.memberType === 'member' ? 'default' : 'secondary'}>
                {member.memberType === 'member' ? 'Miembro (8%)' : 'Externo (12%)'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Miembro desde</p>
              <p>{formatDate(member.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Límites de Crédito</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Límite Total</p>
              <p className="text-lg font-semibold">{formatCurrency(creditLimit)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monto Mínimo por Préstamo</p>
              <p className="text-lg font-semibold">{formatCurrency(500000)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Utilizado Actualmente</p>
              <p className="text-lg font-semibold text-red-600">{formatCurrency(totalActiveAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disponible</p>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(availableCredit)}</p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(totalActiveAmount / creditLimit) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {((totalActiveAmount / creditLimit) * 100).toFixed(1)}% utilizado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {activeLoans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Préstamos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeLoans.map((loan: any) => (
                <div key={loan.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">Préstamo #{loan.id}</p>
                    <p className="text-sm text-muted-foreground">
                      Monto: {formatCurrency(loan.amount)} | 
                      Pendiente: {formatCurrency(loan.remainingBalance)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Cuota mensual: {formatCurrency(loan.monthlyPayment)} | 
                      {loan.termMonths} meses
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusBadgeClass(loan.status)}>
                      {loan.status === 'active' ? 'Activo' : 'Liquidado'}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(loan.startDate)}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setLocation(`/loans/${loan.id}`)}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {completedLoans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Préstamos Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedLoans.map((loan: any) => (
                <div key={loan.id} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                  <div>
                    <p className="font-semibold">Préstamo #{loan.id}</p>
                    <p className="text-sm text-muted-foreground">
                      Monto: {formatCurrency(loan.amount)} | 
                      {loan.termMonths} meses
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Liquidado</Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(loan.liquidatedAt || loan.startDate)}
                    </p>
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
