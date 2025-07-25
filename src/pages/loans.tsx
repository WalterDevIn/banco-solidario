import { useState } from "react";
import { useLoansQuery } from "@/components/loans/loanQueries";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LoanFilters from "@/components/loans/loanFilters";
import LoanTable from "@/components/loans/loanTable";
import NewLoanModal from "@/components/modals/new-loan-modal";

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
        <div className="space-y-6 p-6">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Préstamos</h2>
                    <p className="text-gray-600">Gestión de préstamos activos y liquidados</p>
                </div>
                <Button onClick={() => setShowNewLoanModal(true)} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
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
