import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import "./loan-filters.css";

interface LoanFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export default function LoanFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
}: LoanFiltersProps) {
  return (
    <div className="loan-filters">
      <div className="loan-filters-row">
        <div className="search-wrapper">
          <Search />
          <Input
            placeholder="Buscar por nombre o ID del préstamo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="status-select">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="liquidated">Liquidados</SelectItem>
            <SelectItem value="overdue">Vencidos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
