import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addDays, addWeeks, addMonths, format } from "date-fns";

interface AdvanceDateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDate: Date;
  onDateAdvance: (newDate: Date) => void;
}

type IntervalType = "days" | "weeks" | "months";

export default function AdvanceDateModal({
  open,
  onOpenChange,
  currentDate,
  onDateAdvance,
}: AdvanceDateModalProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<number>(1);
  const [intervalType, setIntervalType] = useState<IntervalType>("days");

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setAmount(1);
    setIntervalType("days");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount < 1) {
      toast({
        title: "Error",
        description: "La cantidad debe ser al menos 1",
        variant: "destructive",
      });
      return;
    }

    let newDate: Date;

    switch (intervalType) {
      case "days":
        newDate = addDays(currentDate, amount);
        break;
      case "weeks":
        newDate = addWeeks(currentDate, amount);
        break;
      case "months":
        newDate = addMonths(currentDate, amount);
        break;
    }

    onDateAdvance(newDate);

    toast({
      title: "Fecha actualizada",
      description: `Nueva fecha: ${format(newDate, "dd/MM/yyyy")}`,
    });

    onOpenChange(false);
  };

  const previewDate = () => {
    switch (intervalType) {
      case "days":
        return addDays(currentDate, amount);
      case "weeks":
        return addWeeks(currentDate, amount);
      case "months":
        return addMonths(currentDate, amount);
      default:
        return currentDate;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Avanzar Fecha del Sistema
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-gray-700 mb-2">
          Fecha actual:{" "}
          <span className="font-medium">
            {format(currentDate, "dd/MM/yyyy")}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad
            </Label>
            <Input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              placeholder="Ej: 3"
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de intervalo
            </Label>
            <Select
              value={intervalType}
              onValueChange={(v) => setIntervalType(v as IntervalType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar intervalo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Día(s)</SelectItem>
                <SelectItem value="weeks">Semana(s)</SelectItem>
                <SelectItem value="months">Mes(es)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground italic">
            Nueva fecha estimada:{" "}
            <span className="font-medium text-gray-800">
              {format(previewDate(), "dd/MM/yyyy")}
            </span>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 btn-primary">
              Aplicar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
