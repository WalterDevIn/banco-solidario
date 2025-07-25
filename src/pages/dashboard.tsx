import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, UserPlus, Wallet, HandHeart, TrendingUp, ChevronRight, DollarSign } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useState } from "react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import NewLoanModal from "@/components/modals/new-loan-modal";
import AddMemberModal from "@/components/modals/add-member-modal";
import type { Activity } from "@shared/schema";

export default function Dashboard() {
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["/api/dashboard/summary"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  if (summaryLoading || activitiesLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'member_added':
        return <UserPlus className="w-4 h-4" />;
      case 'loan_created':
        return <Plus className="w-4 h-4" />;
      case 'loan_liquidated':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <ChevronRight className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'member_added':
        return 'bg-green-100 text-green-600';
      case 'loan_created':
        return 'bg-blue-100 text-blue-600';
      case 'loan_liquidated':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Hoy por ti, mañana por ti</h2>
        <p className="text-gray-600">Gestiona los préstamos de tu comunidad</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Button
          onClick={() => setShowNewLoanModal(true)}
          className="btn-primary p-6 h-auto flex-col space-y-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          <Plus className="w-8 h-8" />
          <span className="text-lg font-semibold">Nuevo préstamo</span>
        </Button>
        
        <Button
          className="btn-secondary p-6 h-auto flex-col space-y-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          <CheckCircle className="w-8 h-8" />
          <span className="text-lg font-semibold">Liquidar préstamo</span>
        </Button>
        
        <Button
          onClick={() => setShowAddMemberModal(true)}
          className="btn-accent p-6 h-auto flex-col space-y-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          <UserPlus className="w-8 h-8" />
          <span className="text-lg font-semibold">Agendar persona</span>
        </Button>
      </div>

      {/* Recent Activity */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Historial Reciente
            </CardTitle>
            <Link href="/history">
              <Button variant="link" className="text-primary hover:text-primary/80 font-medium">
                Ver todo
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities?.map((activity: Activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
            
            {(!activities || activities.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No hay actividades recientes</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fund Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Saldo Total</h4>
              <Wallet className="text-primary w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-primary">
              {summary ? formatCurrency(summary.totalBalance) : "$0"}
            </p>
            <p className="text-sm text-gray-500 mt-2">Actualizado hoy</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Préstamos Activos</h4>
              <HandHeart className="text-green-600 w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {summary?.activeLoans || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {summary ? formatCurrency(summary.totalLent) : "$0"} prestados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Intereses del Mes</h4>
              <TrendingUp className="text-blue-600 w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {summary ? formatCurrency(summary.monthlyInterest) : "$0"}
            </p>
            <p className="text-sm text-gray-500 mt-2">Intereses calculados</p>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <NewLoanModal
        open={showNewLoanModal}
        onOpenChange={setShowNewLoanModal}
      />
      
      <AddMemberModal
        open={showAddMemberModal}
        onOpenChange={setShowAddMemberModal}
      />
    </div>
  );
}
