import React, { useState } from 'react';
import { 
  DollarSign, 
  Receipt, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Filter, 
  User, 
  Building, 
  Download, 
  CreditCard,
  Calendar,
  AlertCircle,
  Eye,
  Check,
  TrendingUp,
  Scale,
  Sparkles,
  ShoppingBag,
  Store,
  Target,
  Settings2,
  ArrowUpRight,
  PieChart
} from 'lucide-react';

export default function PayrollAndExpensesManager({ 
  payroll, 
  setPayroll, 
  expenses, 
  setExpenses, 
  salesReports = [],
  setSalesReports,
  collaborators, 
  projects,
  onUpdateProjectFinancials
}) {
  const [activeSubTab, setActiveSubTab] = useState('profits'); // 'profits' (cotejo), 'sales' (notas venta), 'payroll', 'expenses'
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [filterProject, setFilterProject] = useState('Todos');

  // Form states Calibración Target & Bottom Line
  const [targetProjId, setTargetProjId] = useState('prj-cocina');
  const [inputTargetRevenue, setInputTargetRevenue] = useState(176000);
  const [inputBreakEvenRevenue, setInputBreakEvenRevenue] = useState(68000);
  const [inputTargetNetProfit, setInputTargetNetProfit] = useState(64000);
  const [inputTargetMarginPct, setInputTargetMarginPct] = useState(36);
  const [inputTargetUnitKPI, setInputTargetUnitKPI] = useState('');
  const [inputBreakEvenUnitKPI, setInputBreakEvenUnitKPI] = useState('');

  // Form states Nómina
  const [payCollabId, setPayCollabId] = useState(collaborators[0]?.id || '');
  const [payPeriod, setPayPeriod] = useState('1ra Quincena Noviembre 2026');
  const [payAmount, setPayAmount] = useState(collaborators[0]?.baseSalaryQuincenal || 7000);
  const [payNotes, setPayNotes] = useState('');
  const [payReceiptFileName, setPayReceiptFileName] = useState('');

  // Form states Gastos / Insumos
  const [expProjectId, setExpProjectId] = useState(projects[0]?.id || '');
  const [expCategory, setExpCategory] = useState('Insumos Alimentos Frescos');
  const [expConcept, setExpConcept] = useState('');
  const [expSupplier, setExpSupplier] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expPaidBy, setExpPaidBy] = useState(collaborators[0]?.name || '');
  const [expReceiptFileName, setExpReceiptFileName] = useState('');

  // Form states Notas de Venta
  const [saleProjectId, setSaleProjectId] = useState('prj-cocina');
  const [saleAmount, setSaleAmount] = useState('');
  const [saleOrdersCount, setSaleOrdersCount] = useState('');
  const [salePeriod, setSalePeriod] = useState('Corte de hoy');
  const [saleSubmittedBy, setSaleSubmittedBy] = useState(collaborators[0]?.name || 'Don Aurelio Méndez');
  const [saleNoteFile, setSaleNoteFile] = useState('');
  const [saleNotes, setSaleNotes] = useState('');

  // Cálculos globales
  const totalSales = salesReports.reduce((acc, s) => acc + s.salesAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalPayrollPaid = payroll.filter(p => p.status === 'Pagado').reduce((acc, p) => acc + p.amount, 0);
  const totalRents = projects.reduce((acc, p) => acc + (p.monthlyRent || 0), 0);

  // Funciones para subir comprobantes
  const handlePayrollFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPayReceiptFileName(e.target.files[0].name);
    }
  };

  const handleExpenseFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setExpReceiptFileName(e.target.files[0].name);
    }
  };

  const handleSaleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSaleNoteFile(e.target.files[0].name);
    }
  };

  const handleCreatePayrollPayment = (e) => {
    e.preventDefault();
    const collab = collaborators.find(c => c.id === payCollabId);

    const newPayment = {
      id: `pay-${Date.now()}`,
      collaboratorId: payCollabId,
      collaboratorName: collab ? collab.name : 'Colaborador',
      period: payPeriod,
      amount: parseFloat(payAmount) || 0,
      status: 'Pagado',
      paymentDate: new Date().toISOString().split('T')[0],
      receiptFile: payReceiptFileName || `Comprobante_Pago_${collab?.name.replace(/ /g, '_')}_${payPeriod.replace(/ /g, '_')}.pdf`,
      notes: payNotes || 'Dispersión autorizada de nómina'
    };

    setPayroll(prev => [newPayment, ...prev]);
    setShowPayrollModal(false);
    setPayNotes('');
    setPayReceiptFileName('');
  };

  const handleCreateExpense = (e) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === expProjectId);

    const newExpense = {
      id: `exp-${Date.now()}`,
      projectId: expProjectId,
      projectName: proj ? proj.name : 'Villacorp',
      category: expCategory,
      concept: expConcept,
      supplier: expSupplier,
      amount: parseFloat(expAmount) || 0,
      date: new Date().toISOString().split('T')[0],
      receiptFile: expReceiptFileName || `Factura_Comprobante_${Date.now()}.pdf`,
      paidBy: expPaidBy,
      status: 'Aprobado'
    };

    setExpenses(prev => [newExpense, ...prev]);
    setShowExpenseModal(false);
    setExpConcept('');
    setExpSupplier('');
    setExpAmount('');
    setExpReceiptFileName('');
  };

  const handleCreateSalesReport = (e) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === saleProjectId);

    const newSale = {
      id: `sale-${Date.now()}`,
      projectId: saleProjectId,
      projectName: proj ? proj.name : 'Negocio Villacorp',
      date: new Date().toISOString().split('T')[0],
      salesAmount: parseFloat(saleAmount) || 0,
      ordersCount: parseInt(saleOrdersCount) || 0,
      noteFile: saleNoteFile || `Nota_Final_Venta_${Date.now()}.pdf`,
      submittedBy: saleSubmittedBy,
      period: salePeriod,
      notes: saleNotes || 'Corte de ventas verificado'
    };

    setSalesReports(prev => [newSale, ...prev]);
    setShowSaleModal(false);
    setSaleAmount('');
    setSaleOrdersCount('');
    setSaleNoteFile('');
    setSaleNotes('');
  };

  const handleOpenTargetModal = (proj) => {
    const selected = proj || projects[0];
    setTargetProjId(selected.id);
    setInputTargetRevenue(selected.targetRevenue || 150000);
    setInputBreakEvenRevenue(selected.breakEvenRevenue || 60000);
    setInputTargetNetProfit(selected.targetNetProfit || 50000);
    setInputTargetMarginPct(selected.targetMarginPct || 35);
    setInputTargetUnitKPI(selected.targetUnitKPI || '');
    setInputBreakEvenUnitKPI(selected.breakEvenUnitKPI || '');
    setShowTargetModal(true);
  };

  const handleSelectTargetProject = (projId) => {
    setTargetProjId(projId);
    const selected = projects.find(p => p.id === projId);
    if (selected) {
      setInputTargetRevenue(selected.targetRevenue || 150000);
      setInputBreakEvenRevenue(selected.breakEvenRevenue || 60000);
      setInputTargetNetProfit(selected.targetNetProfit || 50000);
      setInputTargetMarginPct(selected.targetMarginPct || 35);
      setInputTargetUnitKPI(selected.targetUnitKPI || '');
      setInputBreakEvenUnitKPI(selected.breakEvenUnitKPI || '');
    }
  };

  const handleSaveTargets = (e) => {
    e.preventDefault();
    if (onUpdateProjectFinancials) {
      onUpdateProjectFinancials(targetProjId, {
        targetRevenue: parseFloat(inputTargetRevenue) || 0,
        breakEvenRevenue: parseFloat(inputBreakEvenRevenue) || 0,
        targetNetProfit: parseFloat(inputTargetNetProfit) || 0,
        targetMarginPct: parseFloat(inputTargetMarginPct) || 0,
        targetUnitKPI: inputTargetUnitKPI,
        breakEvenUnitKPI: inputBreakEvenUnitKPI
      });
    }
    setShowTargetModal(false);
  };

  // Cálculo de P&L (Estado de Resultados) por negocio
  const businessPnL = projects.map(proj => {
    const projSales = salesReports.filter(s => s.projectId === proj.id).reduce((acc, s) => acc + s.salesAmount, 0);
    const projExpenses = expenses.filter(e => e.projectId === proj.id).reduce((acc, e) => acc + e.amount, 0);
    const rent = proj.monthlyRent || 0;
    
    // Nómina estimada de los colaboradores asignados a este departamento
    let projPayroll = 0;
    if (proj.id === 'prj-cocina') projPayroll = 14000; // Don Aurelio ($14k mensual)
    if (proj.id === 'prj-uber') projPayroll = 12000; // Carlos ($12k mensual)
    if (proj.id === 'prj-motul') projPayroll = 12500; // Obra y operación inicial
    if (proj.id === 'prj-chicxulub') projPayroll = 15000; // Sofia y terapeutas
    if (proj.id === 'prj-chihuahua') projPayroll = 22000; // Honorarios legales

    const totalCosts = projExpenses + rent + projPayroll;
    const netProfit = projSales - totalCosts;
    const marginPct = projSales > 0 ? Math.round((netProfit / projSales) * 100) : 0;

    const targetRev = proj.targetRevenue || 100000;
    const breakEven = proj.breakEvenRevenue || 50000;
    const targetProfit = proj.targetNetProfit || 30000;
    const targetProgressPct = targetRev > 0 ? Math.min(100, Math.round((projSales / targetRev) * 100)) : 0;
    const breakEvenProgressPct = breakEven > 0 ? Math.min(100, Math.round((projSales / breakEven) * 100)) : 0;

    let targetStatus = 'Fase Arranque';
    if (projSales >= targetRev) {
      targetStatus = 'Target Cumplido';
    } else if (projSales >= breakEven) {
      targetStatus = 'Punto Equilibrio Superado';
    } else if (projSales > 0) {
      targetStatus = 'Cubriendo Costos';
    }

    return {
      ...proj,
      sales: projSales,
      expenses: projExpenses,
      rent: rent,
      payroll: projPayroll,
      totalCosts: totalCosts,
      netProfit: netProfit,
      marginPct: marginPct,
      targetRev: targetRev,
      breakEven: breakEven,
      targetProfit: targetProfit,
      targetProgressPct: targetProgressPct,
      breakEvenProgressPct: breakEvenProgressPct,
      targetStatus: targetStatus
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Header del Módulo Financiero */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
            <Scale className="w-3.5 h-3.5" />
            <span>Tesorería & Rentabilidad Villacorp</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Cotejo de Utilidades, Notas de Venta & Nómina
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Cada negocio envía sus <strong>Notas Finales de Venta</strong> para cotejarlas en tiempo real contra compras de insumos, renta de inmuebles y nómina, determinando la utilidad neta exacta de cada frente.
          </p>
        </div>

        {/* Selector de Sub-pestañas */}
        <div className="bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 flex flex-wrap gap-1 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('profits')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'profits'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Cotejo de Utilidades (P&L)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('sales')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'sales'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Notas de Venta ({salesReports.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('payroll')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'payroll'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Nómina</span>
          </button>
          <button
            onClick={() => setActiveSubTab('expenses')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'expenses'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Insumos</span>
          </button>
        </div>
      </div>

      {/* VISTA 1: COTEJO DE UTILIDADES (P&L / BALANZA EN VIVO) */}
      {activeSubTab === 'profits' && (
        <div className="space-y-6">
          
          {/* Tarjeta Estratégica: Cocina Mérida $110 vs Competencia $140 */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                ⚡ ESTRATEGIA COMERCIAL: COCINA MÉRIDA
              </span>
              <h2 className="text-xl sm:text-2xl font-black">
                Nuestra Orden Rendidora a $110 vs $140 de la Competencia
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                Vencemos a la competencia con precio más bajo (\$110 vs \$140), porciones rendidoras donde <strong>con complementos (arroz, frijol colado, tortillas a mano) comen varias personas</strong>, y con los estándares más limpios e higiénicos de la zona.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[200px]">
              <span className="text-[11px] text-emerald-200 block font-bold">Ahorro del cliente</span>
              <div className="text-3xl font-black text-amber-300">-$30 MXN</div>
              <span className="text-xs text-white mt-1 block">Ganancia por volumen y rotación diaria</span>
            </div>
          </div>

          {/* Resumen Global Consolidado */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                (+) Ventas Registradas
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                ${totalSales.toLocaleString()} <span className="text-xs font-normal text-slate-500">MXN</span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">Por notas de venta finales</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                (-) Compras de Insumos
              </span>
              <div className="text-2xl sm:text-3xl font-black text-rose-600">
                ${totalExpenses.toLocaleString()} <span className="text-xs font-normal text-slate-500">MXN</span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">Facturas y tickets comprobados</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                (-) Rentas & Nóminas
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600">
                ${(totalRents + totalPayrollPaid).toLocaleString()} <span className="text-xs font-normal text-slate-500">MXN</span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">Locales, terrenos, auto y personal</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Acción Rápida
                </span>
                <span className="text-xs text-slate-600">¿Llegó el corte de hoy?</span>
              </div>
              <button
                onClick={() => setShowSaleModal(true)}
                className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Nota de Venta</span>
              </button>
            </div>
          </div>

          {/* SECCIÓN TARGET & BOTTOM LINE POR NEGOCIO */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
                    <Target className="w-5 h-5" />
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Target & Bottom Line por Unidad de Negocio
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Metas mensuales de facturación (Target) y umbrales mínimos indispensables para no tener pérdidas (Bottom Line / Break-Even).
                </p>
              </div>

              <button
                onClick={() => handleOpenTargetModal(projects[0])}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-transform active:scale-95 flex items-center space-x-2 self-start sm:self-auto"
              >
                <Settings2 className="w-4 h-4 text-purple-400" />
                <span>Calibrar Metas Financieras</span>
              </button>
            </div>

            {/* Grid de Tarjetas de Target & Bottom Line */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businessPnL.map(item => {
                const targetPct = item.targetRev > 0 ? Math.min(100, Math.round((item.sales / item.targetRev) * 100)) : 0;
                const breakEvenPct = item.breakEven > 0 ? Math.min(100, Math.round((item.sales / item.breakEven) * 100)) : 0;

                return (
                  <div key={item.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:bg-white hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                            {item.code}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm mt-1 leading-snug line-clamp-1">
                            {item.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleOpenTargetModal(item)}
                          className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Ajustar Target & Bottom Line"
                        >
                          <Settings2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2.5 pt-2">
                        {/* Target de Ventas */}
                        <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-500 flex items-center space-x-1">
                              <Target className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Target Mensual:</span>
                            </span>
                            <span className="font-black text-slate-900">${item.targetRev.toLocaleString()} MXN</span>
                          </div>
                          {item.targetUnitKPI && (
                            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                              🎯 Meta: {item.targetUnitKPI}
                            </span>
                          )}
                        </div>

                        {/* Bottom Line (Break-Even) */}
                        <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-500 flex items-center space-x-1">
                              <Scale className="w-3.5 h-3.5 text-amber-600" />
                              <span>Bottom Line (Break-Even):</span>
                            </span>
                            <span className="font-extrabold text-amber-700">${item.breakEven.toLocaleString()} MXN</span>
                          </div>
                          {item.breakEvenUnitKPI && (
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              ⚠️ Mínimo: {item.breakEvenUnitKPI}
                            </span>
                          )}
                        </div>

                        {/* Utilidad Neta Proyectada */}
                        <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-500">Utilidad Neta Meta:</span>
                            <span className="font-black text-emerald-600">${item.targetProfit.toLocaleString()} MXN</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Margen neto estimado: <strong>{item.targetMarginPct}%</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progreso hacia el Target */}
                    <div className="border-t border-slate-200/60 pt-3">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-slate-500 text-[11px]">Ventas: <strong>${item.sales.toLocaleString()}</strong></span>
                        <span className="font-black text-purple-700 text-[11px]">{targetPct}% del Target</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            targetPct >= 100 
                              ? 'bg-emerald-500' 
                              : item.sales >= item.breakEven 
                                ? 'bg-amber-500' 
                                : 'bg-purple-600'
                          }`}
                          style={{ width: `${Math.max(5, targetPct)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                        <span>$0</span>
                        <span>Break-Even: ${item.breakEven.toLocaleString()}</span>
                        <span>Target: ${item.targetRev.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabla de Cotejo Financiero Detallado por Negocio */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Balanza de Cotejo: Ventas vs Insumos, Rentas, Nómina & Targets
                </h2>
                <p className="text-xs text-slate-500">
                  Cálculo automático de la utilidad neta contrastada con el punto de equilibrio y target
                </p>
              </div>

              <button
                onClick={() => setShowSaleModal(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Subir Nota Final de Venta</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b">
                    <th className="py-3 px-3">Unidad de Negocio</th>
                    <th className="py-3 px-3">Target Mensual</th>
                    <th className="py-3 px-3">Break-Even</th>
                    <th className="py-3 px-3">(+) Ventas Notas</th>
                    <th className="py-3 px-3">(-) Costos Totales</th>
                    <th className="py-3 px-3">(=) Utilidad Neta</th>
                    <th className="py-3 px-3">Cumplimiento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {businessPnL.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{item.name}</span>
                        <span className="text-[10px] text-slate-500">{item.location}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        ${item.targetRev.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-medium text-amber-700">
                        ${item.breakEven.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-black text-emerald-700">
                        ${item.sales.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-rose-600 font-medium">
                        -${item.totalCosts.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-black text-sm">
                        <span className={item.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                          ${item.netProfit.toLocaleString()} MXN
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.sales >= item.targetRev
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.sales >= item.breakEven
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.targetStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* VISTA 2: NOTAS FINALES DE VENTA ENVIADAS */}
      {activeSubTab === 'sales' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Historial de Notas Finales de Venta Enviadas
                </h2>
                <p className="text-xs text-slate-500">
                  Cortes diarios enviados por los cocineros, choferes y encargados con ticket o corte Z
                </p>
              </div>

              <button
                onClick={() => setShowSaleModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Nota de Venta</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b">
                    <th className="py-3 px-3">Negocio</th>
                    <th className="py-3 px-3">Fecha / Periodo</th>
                    <th className="py-3 px-3">Ventas ($ MXN)</th>
                    <th className="py-3 px-3">Órdenes / Clientes</th>
                    <th className="py-3 px-3">Comprobante de Venta</th>
                    <th className="py-3 px-3">Enviado por</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesReports.map(sale => (
                    <tr key={sale.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {sale.projectName}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <div>{sale.date}</div>
                        <span className="text-[10px] text-slate-400 font-semibold">{sale.period}</span>
                      </td>
                      <td className="py-3 px-3 font-black text-emerald-700 text-base">
                        ${sale.salesAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {sale.ordersCount} órdenes
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5 text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 w-fit">
                          <Receipt className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px]">{sale.noteFile}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {sale.submittedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 3: NÓMINA DEL PERSONAL */}
      {activeSubTab === 'payroll' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Nómina Dispersada
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                ${totalPayrollPaid.toLocaleString()} <span className="text-xs font-normal text-slate-500">MXN</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Colaboradores Activos
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {collaborators.length}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Registrar Dispersión</span>
                <span className="text-xs text-slate-500">Sube comprobante bancario</span>
              </div>
              <button
                onClick={() => setShowPayrollModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-xs"
              >
                Pagar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Historial de Dispersiones de Nómina
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b">
                    <th className="py-3 px-3">Colaborador</th>
                    <th className="py-3 px-3">Periodo</th>
                    <th className="py-3 px-3">Monto</th>
                    <th className="py-3 px-3">Comprobante Bancario</th>
                    <th className="py-3 px-3">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payroll.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-bold text-slate-900">{item.collaboratorName}</td>
                      <td className="py-3 px-3 text-slate-600">{item.period}</td>
                      <td className="py-3 px-3 font-extrabold text-slate-900">${item.amount.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        {item.receiptFile ? (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                            {item.receiptFile}
                          </span>
                        ) : <span className="text-amber-600">Pendiente</span>}
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[11px] font-bold">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 4: COMPRAS DE INSUMOS */}
      {activeSubTab === 'expenses' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Comprobantes de Compra de Insumos & Facturas
                </h2>
                <p className="text-xs text-slate-500">
                  Carne fresca, verduras al mayoreo, pintura rosa, refacciones y notarías
                </p>
              </div>

              <button
                onClick={() => setShowExpenseModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Subir Comprobante de Compra</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b">
                    <th className="py-3 px-3">Proyecto</th>
                    <th className="py-3 px-3">Concepto</th>
                    <th className="py-3 px-3">Proveedor</th>
                    <th className="py-3 px-3">Monto</th>
                    <th className="py-3 px-3">Fecha</th>
                    <th className="py-3 px-3">Comprobante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-bold text-slate-900">{item.projectName}</td>
                      <td className="py-3 px-3 text-slate-800 font-medium max-w-xs">{item.concept}</td>
                      <td className="py-3 px-3 text-slate-600">{item.supplier}</td>
                      <td className="py-3 px-3 font-extrabold text-slate-900">${item.amount.toLocaleString()}</td>
                      <td className="py-3 px-3 text-slate-500">{item.date}</td>
                      <td className="py-3 px-3 text-blue-700 font-semibold">{item.receiptFile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR NOTA FINAL DE VENTA */}
      {showSaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Registrar Nota Final de Venta del Negocio
            </h3>

            <form onSubmit={handleCreateSalesReport} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Negocio / Frente
                </label>
                <select
                  value={saleProjectId}
                  onChange={e => setSaleProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="prj-cocina">🍲 Cocina Económica Mérida (Órdenes $110)</option>
                  <option value="prj-motul">🌸 Electrolinera & Gourmet Motul</option>
                  <option value="prj-chicxulub">🧖‍♀️ Spa Chicxulub Puerto</option>
                  <option value="prj-uber">🚗 Unidad Uber Mérida</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Ventas Totales ($ MXN)
                  </label>
                  <input
                    type="number"
                    required
                    value={saleAmount}
                    onChange={e => setSaleAmount(e.target.value)}
                    placeholder="5500"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Órdenes / Clientes Atendidos
                  </label>
                  <input
                    type="number"
                    required
                    value={saleOrdersCount}
                    onChange={e => setSaleOrdersCount(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Periodo / Turno
                </label>
                <input
                  type="text"
                  required
                  value={salePeriod}
                  onChange={e => setSalePeriod(e.target.value)}
                  placeholder="Ej. Corte turno vespertino 27 de Octubre"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Adjuntar Foto de la Nota Final de Venta / Corte Z
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 font-medium block">
                    {saleNoteFile ? saleNoteFile : 'Tomar foto o subir comprobante (PDF, JPG, PNG)'}
                  </span>
                  <input
                    type="file"
                    onChange={handleSaleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Notas del Turno
                </label>
                <input
                  type="text"
                  value={saleNotes}
                  onChange={e => setSaleNotes(e.target.value)}
                  placeholder="Ej. Se vendieron todos los paquetes rendidores con tortillas calientes"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowSaleModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  Guardar y Cotejar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PAGO NÓMINA */}
      {showPayrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Registrar Pago de Nómina
            </h3>
            <form onSubmit={handleCreatePayrollPayment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Colaborador</label>
                <select
                  value={payCollabId}
                  onChange={e => {
                    setPayCollabId(e.target.value);
                    const sel = collaborators.find(c => c.id === e.target.value);
                    if (sel) setPayAmount(sel.baseSalaryQuincenal);
                  }}
                  className="w-full px-3 py-2 rounded-xl border text-sm font-semibold"
                >
                  {collaborators.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - ${c.baseSalaryQuincenal?.toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Periodo</label>
                  <input
                    type="text"
                    required
                    value={payPeriod}
                    onChange={e => setPayPeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Monto ($)</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={e => setPayAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-sm font-bold text-emerald-700"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Comprobante Bancario</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 text-center relative cursor-pointer">
                  <span className="text-xs text-slate-600 block">{payReceiptFileName || 'Seleccionar archivo (PDF, JPG)'}</span>
                  <input type="file" onChange={handlePayrollFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setShowPayrollModal(false)} className="px-4 py-2 rounded-xl text-slate-600 text-xs">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL COMPRA INSUMOS */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Subir Comprobante de Compra de Insumos</h3>
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Proyecto</label>
                <select
                  value={expProjectId}
                  onChange={e => setExpProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm font-semibold"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Concepto</label>
                  <input
                    type="text"
                    required
                    value={expConcept}
                    onChange={e => setExpConcept(e.target.value)}
                    placeholder="Carne fresca, verduras..."
                    className="w-full px-3 py-2 rounded-xl border text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Monto ($)</label>
                  <input
                    type="number"
                    required
                    value={expAmount}
                    onChange={e => setExpAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-sm font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Proveedor</label>
                <input
                  type="text"
                  required
                  value={expSupplier}
                  onChange={e => setExpSupplier(e.target.value)}
                  placeholder="Distribuidora Mérida..."
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Comprobante / Ticket</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 text-center relative cursor-pointer">
                  <span className="text-xs text-slate-600 block">{expReceiptFileName || 'Seleccionar comprobante'}</span>
                  <input type="file" onChange={handleExpenseFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="px-4 py-2 rounded-xl text-slate-600 text-xs">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CALIBRACIÓN DE TARGET & BOTTOM LINE */}
      {showTargetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 mb-4 pb-3 border-b">
              <span className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
                <Target className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-900">Calibración de Target & Bottom Line</h3>
                <p className="text-xs text-slate-500">Configura metas de facturación y punto de equilibrio financiero</p>
              </div>
            </div>

            <form onSubmit={handleSaveTargets} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Unidad de Negocio / Proyecto
                </label>
                <select
                  value={targetProjId}
                  onChange={e => handleSelectTargetProject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200">
                  <label className="text-xs font-black text-emerald-900 uppercase tracking-wider block mb-1 flex items-center space-x-1">
                    <Target className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Target Mensual ($ MXN)</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={inputTargetRevenue}
                    onChange={e => setInputTargetRevenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-sm font-black text-slate-900 bg-white"
                    placeholder="176000"
                  />
                  <span className="text-[10px] text-emerald-800 mt-1 block font-medium">Meta aspiracional de venta</span>
                </div>

                <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200">
                  <label className="text-xs font-black text-amber-900 uppercase tracking-wider block mb-1 flex items-center space-x-1">
                    <Scale className="w-3.5 h-3.5 text-amber-600" />
                    <span>Bottom Line / Break-Even ($)</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={inputBreakEvenRevenue}
                    onChange={e => setInputBreakEvenRevenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 text-sm font-black text-slate-900 bg-white"
                    placeholder="68000"
                  />
                  <span className="text-[10px] text-amber-800 mt-1 block font-medium">Mínimo para no perder dinero</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Utilidad Neta Esperada ($ MXN)
                  </label>
                  <input
                    type="number"
                    value={inputTargetNetProfit}
                    onChange={e => setInputTargetNetProfit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
                    placeholder="64000"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Margen Neto Objetivo (%)
                  </label>
                  <input
                    type="number"
                    value={inputTargetMarginPct}
                    onChange={e => setInputTargetMarginPct(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
                    placeholder="36"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  KPI Operativo de Meta (Target)
                </label>
                <input
                  type="text"
                  value={inputTargetUnitKPI}
                  onChange={e => setInputTargetUnitKPI(e.target.value)}
                  placeholder="Ej. 60 órdenes diarias a $110 c/u"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  KPI Operativo de Punto de Equilibrio (Bottom Line)
                </label>
                <input
                  type="text"
                  value={inputBreakEvenUnitKPI}
                  onChange={e => setInputBreakEvenUnitKPI(e.target.value)}
                  placeholder="Ej. 24 órdenes diarias para costear nómina y renta"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowTargetModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
                >
                  Guardar Metas de Negocio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
