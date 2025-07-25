import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Member } from "@shared/schema";

interface NewLoanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewLoanModal({ open, onOpenChange }: NewLoanModalProps) {
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const { toast } = useToast();

  const { data: members } = useQuery({
    queryKey: ["/api/members"],
  });

  const createLoanMutation = useMutation({
    mutationFn: async (data: { memberId: number; amount: number; termMonths: number }) => {
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create loan");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans/with-members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Éxito",
        description: "Préstamo creado correctamente",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error al crear el préstamo",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setMemberId("");
    setAmount("");
    setTermMonths("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memberId || !amount || !termMonths) {
      toast({
        title: "Error",
        description: "Todos los campos son requeridos",
        variant: "destructive",
      });
      return;
    }

    createLoanMutation.mutate({
      memberId: parseInt(memberId),
      amount: parseFloat(amount),
      termMonths: parseInt(termMonths),
    });
  };

  const selectedMember = members?.find((m: Member) => m.id.toString() === memberId);
  const loanAmount = parseFloat(amount) || 0;
  const term = parseInt(termMonths) || 0;
  
  let preview = null;
  if (selectedMember && loanAmount && term) {
    const rate = selectedMember.memberType === 'member' ? 0.08 : 0.12;
    const monthlyRate = rate;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    const totalPayment = monthlyPayment * term;
    
    preview = {
      amount: loanAmount,
      rate: rate * 100,
      monthlyPayment,
      totalPayment,
    };
  }

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Nuevo Préstamo
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Integrante
            </Label>
            <Select value={memberId} onValueChange={setMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar integrante" />
              </SelectTrigger>
              <SelectContent>
                {members?.map((member: Member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.name} ({member.memberType === 'member' ? 'Miembro' : 'Externo'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Monto
            </Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500000"
              required
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Plazo
            </Label>
            <Select value={termMonths} onValueChange={setTermMonths}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar plazo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 meses</SelectItem>
                <SelectItem value="12">12 meses</SelectItem>
                <SelectItem value="24">24 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {preview && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Resumen del Préstamo</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monto:</span>
                    <span className="font-medium">{formatCurrency(preview.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasa de interés:</span>
                    <span className="font-medium">{preview.rate.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cuota mensual:</span>
                    <span className="font-medium">{formatCurrency(preview.monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total a pagar:</span>
                    <span className="font-medium">{formatCurrency(preview.totalPayment)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-primary"
              disabled={createLoanMutation.isPending}
            >
              {createLoanMutation.isPending ? "Creando..." : "Crear Préstamo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
