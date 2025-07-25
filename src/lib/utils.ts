import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount).replace('BOB', '$');
}

export function formatDate(date?: Date | string): string {
  if (!date) return "—";

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return "Fecha inválida";
  }

  return dateObj.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyRate = annualRate;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
}

export function getStatusBadgeClass(status: string, type: 'loan' | 'member' = 'loan'): string {
  if (type === 'loan') {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'liquidated':
        return 'status-liquidated';
      case 'overdue':
        return 'status-overdue';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  } else {
    switch (status) {
      case 'member':
        return 'status-member';
      case 'external':
        return 'status-external';
      case 'inactive':
        return 'status-inactive';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export function getStatusLabel(status: string, type: 'loan' | 'member' = 'loan'): string {
  if (type === 'loan') {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'liquidated':
        return 'Liquidado';
      case 'overdue':
        return 'Vencido';
      default:
        return status;
    }
  } else {
    switch (status) {
      case 'member':
        return 'Miembro';
      case 'external':
        return 'Externo';
      case 'inactive':
        return 'Inactivo';
      default:
        return status;
    }
  }
}
