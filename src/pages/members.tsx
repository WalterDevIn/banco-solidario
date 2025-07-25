import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Eye, Plus, Edit } from "lucide-react";
import { formatDate, getStatusBadgeClass, getStatusLabel } from "@/lib/utils";
import { useState } from "react";
import AddMemberModal from "@/components/modals/add-member-modal";
import type { Member } from "@shared/schema";

export default function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const { data: members, isLoading } = useQuery({
    queryKey: ["/api/members"],
  });

  const filteredMembers = members?.filter((member: Member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      !statusFilter ||
      member.memberType === statusFilter ||
      member.status === statusFilter;    
    return matchesSearch && matchesStatus;
  }) || [];

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Integrantes</h2>
        <Button
          onClick={() => setShowAddMemberModal(true)}
          className="btn-primary"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Agregar Integrante
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Registro de Integrantes
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="member">Miembros</SelectItem>
                  <SelectItem value="external">Externos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar integrantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Préstamos</TableHead>
                  <TableHead>Último Movimiento</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member: Member) => (
                  <TableRow key={member.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadgeClass(member.memberType, 'member')} px-2 py-1 text-xs font-medium rounded-full`}>
                        {getStatusLabel(member.memberType, 'member')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">Ver préstamos</span>
                    </TableCell>
                    <TableCell>{formatDate(member.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Nuevo préstamo" className="text-green-600">
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Editar">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredMembers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No se encontraron integrantes</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddMemberModal
        open={showAddMemberModal}
        onOpenChange={setShowAddMemberModal}
      />
    </div>
  );
}
