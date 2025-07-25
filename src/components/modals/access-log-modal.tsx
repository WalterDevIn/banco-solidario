import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AccessLog {
  method: string;
  path: string;
  timestamp: string;
  status: number;
  success: boolean;
}

interface AccessLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AccessLogModal({ open, onOpenChange }: AccessLogModalProps) {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch("/api/logs")
        .then((res) => res.json())
        .then((data) => {
          setLogs(data);
          setLoading(false);
        });
    }
  }, [open]);

  const filteredLogs = logs.filter(
    (log) =>
      log.path.toLowerCase().includes(search.toLowerCase()) ||
      log.method.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Registros de Acceso
          </DialogTitle>
        </DialogHeader>

        <div className="my-2">
          <Input
            type="text"
            placeholder="Filtrar por método o ruta (ej: POST, /api/loans)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-gray-600 mt-4">Cargando...</p>
        ) : (
          <div className="overflow-auto max-h-[60vh] border rounded mt-2">
            <table className="w-full text-sm table-auto">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 border">Método</th>
                  <th className="p-2 border">Ruta</th>
                  <th className="p-2 border">Hora</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Éxito</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, i) => (
                  <tr
                    key={i}
                    className={log.success ? "bg-green-50" : "bg-red-50"}
                  >
                    <td className="p-2 border">{log.method}</td>
                    <td className="p-2 border">{log.path}</td>
                    <td className="p-2 border">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-2 border">{log.status}</td>
                    <td className="p-2 border">{log.success ? "Sí" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <p className="text-center text-gray-500 py-4">Sin resultados</p>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
