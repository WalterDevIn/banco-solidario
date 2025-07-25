import { useState } from "react";
import { useLoansQuery } from "@/components/loans/loanQueries";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LoanFilters from "@/components/loans/loanFilters";
import LoanTable from "@/components/loans/loanTable";
import NewLoanModal from "@/components/modals/new-loan-modal";
import "./loans.css";

export default function Loans() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showNewLoanModal, setShowNewLoanModal] = useState(false);
    const { toast } = useToast();
    const { data: loans = [], isLoading } = useLoansQuery();

        
    const filteredLoans = loans?.filter((loan) => {
        const matchesSearch = loan.member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    loan.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === "all" || !statusFilter || loan.status === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

    return (
        <div className="loans-page">

            <div className="loans-header">
                <div>
                    <h2 className="loans-title">Préstamos</h2>
                    <p className="loans-subtitle">Gestión de préstamos activos y liquidados</p>
                </div>
                <Button onClick={() => setShowNewLoanModal(true)} className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Nuevo Préstamo
                </Button>
            </div>

            <LoanFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            <LoanTable
                loans={filteredLoans}
                isLoading={isLoading}
                toast={toast}
            />

            <NewLoanModal open={showNewLoanModal} onOpenChange={setShowNewLoanModal} />

        </div>
    );
}
