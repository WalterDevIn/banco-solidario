import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddMemberModal({ open, onOpenChange }: AddMemberModalProps) {
  const [name, setName] = useState("");
  const [memberType, setMemberType] = useState("");
  const { toast } = useToast();

  const createMemberMutation = useMutation({
    mutationFn: async (data: { name: string; memberType: string; status: string }) => {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create member");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Éxito",
        description: "Integrante agregado correctamente",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error al agregar el integrante",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setName("");
    setMemberType("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !memberType) {
      toast({
        title: "Error",
        description: "Todos los campos son requeridos",
        variant: "destructive",
      });
      return;
    }

    createMemberMutation.mutate({
      name,
      memberType,
      status: "active",
    });
  };

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
            Agregar Integrante
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              required
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </Label>
            <Select value={memberType} onValueChange={setMemberType}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Miembro (8% interés mensual)</SelectItem>
                <SelectItem value="external">Externo (12% interés mensual)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Se asignará automáticamente el siguiente ID disponible
                </span>
              </div>
            </CardContent>
          </Card>
          
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
              disabled={createMemberMutation.isPending}
            >
              {createMemberMutation.isPending ? "Agregando..." : "Agregar Integrante"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
