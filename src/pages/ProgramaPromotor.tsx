import { useState, useEffect } from "react";
import { ArrowLeft, Share2, Copy, Users, DollarSign, TrendingUp, Gift, CreditCard, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface ReferralData {
  isActivated: boolean;
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  paymentInfo: {
    method: string;
    bankAccount?: string;
    paypalEmail?: string;
    cryptoWallet?: string;
  };
}

interface PayoutRequest {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  requestDate: string;
  method: string;
}

interface ProgramaPromotorProps {
  onBack: () => void;
}

export const ProgramaPromotor = ({ onBack }: ProgramaPromotorProps) => {
  const [referralData, setReferralData] = useState<ReferralData>({
    isActivated: false,
    referralCode: '',
    totalReferrals: 0,
    totalEarnings: 0,
    pendingPayouts: 0,
    completedPayouts: 0,
    paymentInfo: {
      method: ''
    }
  });

  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [copied, setCopied] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const savedData = localStorage.getItem('programa-promotor');
    const savedPayouts = localStorage.getItem('programa-promotor-payouts');
    
    if (savedData) {
      setReferralData(JSON.parse(savedData));
    }
    
    if (savedPayouts) {
      setPayoutRequests(JSON.parse(savedPayouts));
    }
  }, []);

  const saveData = (data: ReferralData) => {
    localStorage.setItem('programa-promotor', JSON.stringify(data));
    setReferralData(data);
  };

  const savePayouts = (payouts: PayoutRequest[]) => {
    localStorage.setItem('programa-promotor-payouts', JSON.stringify(payouts));
    setPayoutRequests(payouts);
  };

  const generateReferralCode = () => {
    const user = JSON.parse(localStorage.getItem('patripoly_user') || '{}');
    const userName = user.name || 'Usuario';
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${userName.replace(/\s+/g, '').substring(0, 6).toUpperCase()}${randomSuffix}`;
  };

  const activateProgram = () => {
    const newCode = generateReferralCode();
    const updatedData = {
      ...referralData,
      isActivated: true,
      referralCode: newCode
    };
    saveData(updatedData);
    
    toast({
      title: "¡Programa Activado!",
      description: "Tu código de referido ha sido generado. ¡Comienza a invitar amigos!"
    });
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(`https://patripoly.com/ref/${referralData.referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "¡Copiado!",
        description: "El enlace de referido ha sido copiado al portapapeles"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace",
        variant: "destructive"
      });
    }
  };

  const updatePaymentInfo = (field: string, value: string) => {
    const updatedData = {
      ...referralData,
      paymentInfo: {
        ...referralData.paymentInfo,
        [field]: value
      }
    };
    saveData(updatedData);
  };

  const requestPayout = () => {
    if (payoutAmount < 50) {
      toast({
        title: "Monto mínimo",
        description: "El monto mínimo para solicitar un pago es $50",
        variant: "destructive"
      });
      return;
    }

    if (payoutAmount > (referralData.totalEarnings - referralData.pendingPayouts)) {
      toast({
        title: "Fondos insuficientes",
        description: "No tienes suficientes fondos disponibles",
        variant: "destructive"
      });
      return;
    }

    if (!referralData.paymentInfo.method) {
      toast({
        title: "Información de pago requerida",
        description: "Configura tu método de pago antes de solicitar un retiro",
        variant: "destructive"
      });
      return;
    }

    const newPayout: PayoutRequest = {
      id: Date.now().toString(),
      amount: payoutAmount,
      status: 'pending',
      requestDate: new Date().toISOString(),
      method: referralData.paymentInfo.method
    };

    const updatedPayouts = [...payoutRequests, newPayout];
    const updatedData = {
      ...referralData,
      pendingPayouts: referralData.pendingPayouts + payoutAmount
    };

    savePayouts(updatedPayouts);
    saveData(updatedData);
    setPayoutAmount(0);

    toast({
      title: "Solicitud enviada",
      description: "Tu solicitud de pago será procesada en 3-5 días hábiles"
    });
  };

  const availableBalance = referralData.totalEarnings - referralData.pendingPayouts - referralData.completedPayouts;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobado';
      case 'completed': return 'Completado';
      case 'rejected': return 'Rechazado';
      default: return status;
    }
  };

  if (!referralData.isActivated) {
    return (
      <div className="min-h-screen bg-gradient-primary p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Programa Promotor</h1>
              <p className="text-white/80">Gana dinero invitando amigos a Patripoly</p>
            </div>
          </div>

          {/* Activation Screen */}
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8 space-y-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Gift className="h-12 w-12 text-white" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">
                    ¡Únete al Programa de Referidos!
                  </h2>
                  <p className="text-white/80 leading-relaxed">
                    Gana <span className="font-bold text-yellow-300">$25 por cada amigo</span> que 
                    se registre y complete su primera configuración financiera en Patripoly.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="text-2xl mb-2">💰</div>
                    <div className="text-white font-medium">$25 por referido</div>
                    <div className="text-white/70">Comisión garantizada</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="text-2xl mb-2">🚀</div>
                    <div className="text-white font-medium">Pago rápido</div>
                    <div className="text-white/70">3-5 días hábiles</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="text-white font-medium">Sin límites</div>
                    <div className="text-white/70">Referencias ilimitadas</div>
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <h3 className="text-lg font-semibold text-white">¿Cómo funciona?</h3>
                  <ol className="space-y-2 text-white/80">
                    <li className="flex items-start gap-3">
                      <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                      <span>Activa tu código de referido personal</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                      <span>Comparte tu enlace con amigos y familiares</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                      <span>Gana $25 cuando se registren y configuren su patrimonio</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                      <span>Solicita tus pagos cuando alcances el mínimo de $50</span>
                    </li>
                  </ol>
                </div>

                <Button 
                  onClick={activateProgram}
                  className="w-full bg-white text-primary hover:bg-white/90 text-lg py-6"
                >
                  <Gift className="h-5 w-5 mr-2" />
                  Activar Programa Promotor
                </Button>

                <p className="text-xs text-white/60">
                  Al activar el programa, aceptas los términos y condiciones del programa de referidos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Programa Promotor</h1>
            <p className="text-white/80">Panel de control de referidos</p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:text-primary">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="referral" className="data-[state=active]:bg-white data-[state=active]:text-primary">
              Mi Código
            </TabsTrigger>
            <TabsTrigger value="payouts" className="data-[state=active]:bg-white data-[state=active]:text-primary">
              Pagos
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-primary">
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Referidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{referralData.totalReferrals}</div>
                  <p className="text-xs text-white/70">Usuarios registrados</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Ganancias Totales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ${referralData.totalEarnings.toLocaleString('es-MX')}
                  </div>
                  <p className="text-xs text-white/70">Comisiones acumuladas</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Disponible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ${availableBalance.toLocaleString('es-MX')}
                  </div>
                  <p className="text-xs text-white/70">Para retirar</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Pagos Realizados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ${referralData.completedPayouts.toLocaleString('es-MX')}
                  </div>
                  <p className="text-xs text-white/70">Ya cobrados</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Actividad Reciente</CardTitle>
                <CardDescription className="text-white/70">
                  Últimos movimientos en tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payoutRequests.length === 0 ? (
                    <div className="text-center py-8 text-white/70">
                      No hay actividad reciente
                    </div>
                  ) : (
                    payoutRequests.slice(0, 5).map((payout) => (
                      <div key={payout.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(payout.status)}`}></div>
                          <div>
                            <div className="text-white font-medium">
                              Solicitud de pago - ${payout.amount}
                            </div>
                            <div className="text-white/70 text-sm">
                              {new Date(payout.requestDate).toLocaleDateString('es-ES')}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {getStatusText(payout.status)}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referral Code Tab */}
          <TabsContent value="referral" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Tu Código de Referido
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Comparte este enlace para ganar $25 por cada registro
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="bg-white/5 p-6 rounded-lg border border-white/20">
                      <div className="text-sm text-white/70 mb-2">Tu código:</div>
                      <div className="text-2xl font-mono font-bold text-white mb-4">
                        {referralData.referralCode}
                      </div>
                      <div className="text-sm text-white/70 mb-4">Enlace completo:</div>
                      <div className="bg-white/10 p-3 rounded border text-white text-sm break-all">
                        https://patripoly.com/ref/{referralData.referralCode}
                      </div>
                    </div>

                    <Button 
                      onClick={copyReferralCode}
                      className="w-full bg-white text-primary hover:bg-white/90"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          ¡Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar Enlace
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Formas de compartir:</h3>
                    <div className="grid gap-3">
                      <Button variant="outline" className="justify-start bg-white/5 border-white/20 text-white hover:bg-white/10">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Compartir en WhatsApp
                      </Button>
                      <Button variant="outline" className="justify-start bg-white/5 border-white/20 text-white hover:bg-white/10">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Compartir en Facebook
                      </Button>
                      <Button variant="outline" className="justify-start bg-white/5 border-white/20 text-white hover:bg-white/10">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Enviar por email
                      </Button>
                    </div>
                  </div>

                  <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg">
                    <div className="text-yellow-200 font-medium mb-2">💡 Tip para más referidos:</div>
                    <p className="text-yellow-100 text-sm">
                      Comparte tu experiencia personal con Patripoly y cómo te ha ayudado 
                      a mejorar tus finanzas. Las recomendaciones genuinas convierten mejor.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payouts Tab */}
          <TabsContent value="payouts" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Request Payout */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Solicitar Pago</CardTitle>
                  <CardDescription className="text-white/70">
                    Mínimo $50 - Procesamiento 3-5 días hábiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="text-sm text-white/70">Saldo disponible:</div>
                    <div className="text-2xl font-bold text-white">
                      ${availableBalance.toLocaleString('es-MX')}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="payout-amount" className="text-white">Cantidad a retirar</Label>
                    <Input
                      id="payout-amount"
                      type="number"
                      placeholder="50"
                      min="50"
                      max={availableBalance}
                      value={payoutAmount || ""}
                      onChange={(e) => setPayoutAmount(parseFloat(e.target.value) || 0)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <Button 
                    onClick={requestPayout}
                    className="w-full bg-white text-primary hover:bg-white/90"
                    disabled={availableBalance < 50}
                  >
                    Solicitar Pago
                  </Button>

                  {availableBalance < 50 && (
                    <p className="text-yellow-300 text-sm text-center">
                      Necesitas al menos $50 para solicitar un pago
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Payout History */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Historial de Pagos</CardTitle>
                  <CardDescription className="text-white/70">
                    Todas tus solicitudes de pago
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {payoutRequests.length === 0 ? (
                    <div className="text-center py-8 text-white/70">
                      No has solicitado pagos aún
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {payoutRequests
                        .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
                        .map((payout) => (
                          <div key={payout.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="text-white font-medium">
                                  ${payout.amount.toLocaleString('es-MX')}
                                </div>
                                <div className="text-white/70 text-sm">
                                  {new Date(payout.requestDate).toLocaleDateString('es-ES')}
                                </div>
                              </div>
                              <Badge variant="secondary" className={`${getStatusColor(payout.status)} text-white`}>
                                {getStatusText(payout.status)}
                              </Badge>
                            </div>
                            <div className="text-white/60 text-xs">
                              Método: {payout.method}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Información de Pago</CardTitle>
                  <CardDescription className="text-white/70">
                    Configura cómo quieres recibir tus pagos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="payment-method" className="text-white">Método de pago</Label>
                    <Select 
                      value={referralData.paymentInfo.method} 
                      onValueChange={(value) => updatePaymentInfo('method', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Selecciona un método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Transferencia bancaria</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="crypto">Criptomonedas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {referralData.paymentInfo.method === 'bank' && (
                    <div>
                      <Label htmlFor="bank-account" className="text-white">Número de cuenta</Label>
                      <Input
                        id="bank-account"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        value={referralData.paymentInfo.bankAccount || ''}
                        onChange={(e) => updatePaymentInfo('bankAccount', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  )}

                  {referralData.paymentInfo.method === 'paypal' && (
                    <div>
                      <Label htmlFor="paypal-email" className="text-white">Email de PayPal</Label>
                      <Input
                        id="paypal-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={referralData.paymentInfo.paypalEmail || ''}
                        onChange={(e) => updatePaymentInfo('paypalEmail', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  )}

                  {referralData.paymentInfo.method === 'crypto' && (
                    <div>
                      <Label htmlFor="crypto-wallet" className="text-white">Dirección de wallet</Label>
                      <Input
                        id="crypto-wallet"
                        placeholder="Dirección de tu wallet de criptomonedas"
                        value={referralData.paymentInfo.cryptoWallet || ''}
                        onChange={(e) => updatePaymentInfo('cryptoWallet', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  )}

                  <div className="bg-blue-500/20 border border-blue-500/50 p-4 rounded-lg">
                    <div className="text-blue-200 font-medium mb-2">🔒 Información segura</div>
                    <p className="text-blue-100 text-sm">
                      Tu información de pago está protegida y solo se usa para procesar 
                      tus solicitudes de retiro.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};