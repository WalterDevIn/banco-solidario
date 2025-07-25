import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, DollarSign, Percent, Calendar, Users } from "lucide-react";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        fundBalance: "16000000",
        memberInterestRate: "0.08",
        externalInterestRate: "0.12",
        maxLoanAmount: "2000000",
        minLoanAmount: "500000",
        meetingDay: "saturday",
        meetingWeek: "second",
        adminName: "Administrador",
        fundName: "Banco Solidario"
    });

    const handleSave = () => {
        localStorage.setItem('bancoSolidario_settings', JSON.stringify(settings));
        alert('Configuración guardada exitosamente');
    };

    const handleChange = (field: string, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Settings className="w-8 h-8" />
                <div>
                    <h1 className="text-2xl font-bold">Configuraciones</h1>
                    <p className="text-muted-foreground">Ajusta los parámetros del sistema</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            Configuración Financiera
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="fundBalance">Balance del Fondo</Label>
                            <Input
                                id="fundBalance"
                                type="number"
                                value={settings.fundBalance}
                                onChange={(e) => handleChange('fundBalance', e.target.value)}
                                placeholder="16000000"
                            />
                        </div>
                        <div>
                            <Label htmlFor="maxLoanAmount">Monto Máximo de Préstamo</Label>
                            <Input
                                id="maxLoanAmount"
                                type="number"
                                value={settings.maxLoanAmount}
                                onChange={(e) => handleChange('maxLoanAmount', e.target.value)}
                                placeholder="2000000"
                            />
                        </div>
                        <div>
                            <Label htmlFor="minLoanAmount">Monto Mínimo de Préstamo</Label>
                            <Input
                                id="minLoanAmount"
                                type="number"
                                value={settings.minLoanAmount}
                                onChange={(e) => handleChange('minLoanAmount', e.target.value)}
                                placeholder="500000"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Percent className="w-5 h-5" />
                            Tasas de Interés
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="memberRate">Tasa para Miembros (mensual)</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="memberRate"
                                    type="number"
                                    step="0.01"
                                    value={(Number(settings.memberInterestRate) * 100).toString()}
                                    onChange={(e) => handleChange('memberInterestRate', (Number(e.target.value) / 100).toString())}
                                    placeholder="8"
                                />
                                <span className="text-sm text-muted-foreground">%</span>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="externalRate">Tasa para Externos (mensual)</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="externalRate"
                                    type="number"
                                    step="0.01"
                                    value={(Number(settings.externalInterestRate) * 100).toString()}
                                    onChange={(e) => handleChange('externalInterestRate', (Number(e.target.value) / 100).toString())}
                                    placeholder="12"
                                />
                                <span className="text-sm text-muted-foreground">%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Configuración de Reuniones
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="meetingWeek">Semana de Reunión</Label>
                            <select 
                                id="meetingWeek"
                                className="w-full p-2 border rounded"
                                value={settings.meetingWeek}
                                onChange={(e) => handleChange('meetingWeek', e.target.value)}
                            >
                                <option value="first">Primera semana</option>
                                <option value="second">Segunda semana</option>
                                <option value="third">Tercera semana</option>
                                <option value="fourth">Cuarta semana</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="meetingDay">Día de Reunión</Label>
                            <select 
                                id="meetingDay"
                                className="w-full p-2 border rounded"
                                value={settings.meetingDay}
                                onChange={(e) => handleChange('meetingDay', e.target.value)}
                            >
                                <option value="monday">Lunes</option>
                                <option value="tuesday">Martes</option>
                                <option value="wednesday">Miércoles</option>
                                <option value="thursday">Jueves</option>
                                <option value="friday">Viernes</option>
                                <option value="saturday">Sábado</option>
                                <option value="sunday">Domingo</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Información General
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="fundName">Nombre del Fondo</Label>
                            <Input
                                id="fundName"
                                value={settings.fundName}
                                onChange={(e) => handleChange('fundName', e.target.value)}
                                placeholder="Banco Solidario"
                            />
                        </div>
                        <div>
                            <Label htmlFor="adminName">Nombre del Administrador</Label>
                            <Input
                                id="adminName"
                                value={settings.adminName}
                                onChange={(e) => handleChange('adminName', e.target.value)}
                                placeholder="Administrador"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Guardar Configuración
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información del Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Versión del Sistema</p>
                            <p className="font-semibold">1.0.0</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Última Actualización</p>
                            <p className="font-semibold">Julio 2025</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Tipo de Base de Datos</p>
                            <p className="font-semibold">PostgreSQL</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Estado del Sistema</p>
                            <p className="font-semibold text-green-600">Operativo</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}