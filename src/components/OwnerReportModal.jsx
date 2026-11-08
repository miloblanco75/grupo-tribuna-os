import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Printer, 
  Share2, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Car, 
  FileCheck,
  TrendingUp,
  Receipt
} from 'lucide-react';

export default function OwnerReportModal({ 
  isOpen, 
  onClose, 
  projects, 
  uberData,
  salesReports = [],
  expenses = [],
  payroll = [],
  permits = [],
  amenities = [],
  pipeline = []
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalTasks = projects.reduce((acc, p) => acc + p.checklists.length, 0);
  const completedTasks = projects.reduce((acc, p) => acc + p.checklists.filter(c => c.completed).length, 0);
  const globalProgress = Math.round((completedTasks / totalTasks) * 100);

  const totalSales = salesReports.reduce((acc, s) => acc + s.salesAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalPayroll = payroll.filter(p => p.status === 'Pagado').reduce((acc, p) => acc + p.amount, 0);

  const approvedPermitsCount = permits.filter(p => p.status === 'Aprobado').length;
  const warningPermitsCount = permits.filter(p => p.status === 'Observaciones').length;

  const totalMonthlyRents = amenities.reduce((acc, a) => acc + (a.monthlyRent || 0), 0);
  const occupiedAmenitiesCount = amenities.filter(a => a.status === 'Operando' || a.status === 'Contrato Firmado').length;

  const totalCapex = pipeline.reduce((acc, s) => acc + (s.estimatedCapex || 0), 0);

  // Formato de texto para WhatsApp
  const generateWhatsAppText = () => {
    let report = `*🏛️ GRUPO TRIBUNA - INFORME EJECUTIVO DE AVANCES & UTILIDADES*\n`;
    report += `_Fecha: ${new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}_\n`;
    report += `*Avance Global:* ${globalProgress}% (${completedTasks}/${totalTasks} tareas cumplidas)\n`;
    report += `*Corte Financiero:* Ventas registradas por $${totalSales.toLocaleString()} MXN | Compras cotejadas: $${totalExpenses.toLocaleString()} MXN\n`;
    if (pipeline.length > 0) {
      report += `*Pipeline Expansión:* ${pipeline.length} hubs en 5 estados | CAPEX: $${totalCapex.toLocaleString()} MXN\n`;
    }
    if (permits.length > 0) {
      report += `*Semáforo Permisología (CFE/CRE/Gobiernos):* 🟢 ${approvedPermitsCount} aprobados | 🟡 ${permits.length - approvedPermitsCount - warningPermitsCount} en trámite | 🔴 ${warningPermitsCount} con observaciones\n`;
    }
    if (amenities.length > 0) {
      report += `*Amenidades & Locales Comerciales (Tenant Mix):* $${totalMonthlyRents.toLocaleString()} MXN/mes en rentas | ${occupiedAmenitiesCount}/${amenities.length} locales colocados. Mini-salas Cinépolis comunitarias en gestión.\n\n`;
    } else {
      report += `\n`;
    }

    report += `*🎄 DIVISIÓN ENVÍOS CHIGNAHUAPAN (Esferas Navideñas & Alianza Castores)*\n`;
    report += `• Bodega Hub de Acopio en Chignahuapan (capacidad 1,800 cajas de esferas artesanales).\n`;
    report += `• Alianza estratégica con Grupo Castores (descuento del 22% sobre tarifas generales y monedero prepago).\n`;
    report += `• Modelo de ingresos: Tarifa de recolección local a talleres artesanos + tarifa de embalaje frágil con protección de burbuja/panal + flete troncal Chignahuapan-Puebla + margen de utilidad sobre la guía nacional Castores.\n\n`;

    report += `*1. 🌸 ELECTROLINERA & GOURMET MOTUL (Rosa & Blanco)*\n`;
    const motPrj = projects.find(p => p.id === 'prj-motul');
    if (motPrj) {
      report += `• Terreno arrendado y expediente de planos arquitectónicos v2 con fachada Rosa & Blanco subido.\n`;
      report += `• Negocio gastronómico: Pruebas de carta (Sushi vs Tortas tipo María Elena de Mérida). Trámite en Ayuntamiento de Motul en curso.\n`;
      report += `• Metas: Target $${(motPrj.targetRevenue || 220000).toLocaleString()} MXN (${motPrj.targetUnitKPI || '120 cargas + 1,200 consumos'}) | Bottom Line (Break-Even): $${(motPrj.breakEvenRevenue || 85000).toLocaleString()} MXN | Utilidad Neta: $${(motPrj.targetNetProfit || 78000).toLocaleString()} MXN\n\n`;
    }

    report += `*2. 🍲 COCINA ECONÓMICA MÉRIDA (Estrategia $110 Rendidor)*\n`;
    const cocPrj = projects.find(p => p.id === 'prj-cocina');
    if (cocPrj) {
      report += `• Estrategia comercial: Competimos y ganamos contra el precio de $140 de la competencia ofreciendo órdenes a $110, súper rendidoras donde con complementos (arroz, frijol colado, tortillas calientes y salsas) comen varias personas.\n`;
      report += `• Enfoque en comida deliciosa y con el estándar de higiene y limpieza más alto de la zona.\n`;
      report += `• Metas: Target $${(cocPrj.targetRevenue || 176000).toLocaleString()} MXN (${cocPrj.targetUnitKPI || '60 órdenes/día a $110'}) | Bottom Line (Break-Even): $${(cocPrj.breakEvenRevenue || 68000).toLocaleString()} MXN | Utilidad Neta: $${(cocPrj.targetNetProfit || 64000).toLocaleString()} MXN\n`;
      report += `• Control de caja: Envío diario de notas finales de venta para cotejo automático de utilidades netas.\n\n`;
    }

    report += `*3. ⚖️ TIERRAS CHIHUAHUA (Posesión > 10 años)*\n`;
    const chiPrj = projects.find(p => p.id === 'prj-chihuahua');
    if (chiPrj) {
      report += `• Levantamiento topográfico geodesico y testimoniales notariales concluidas y en expediente digital. Por radicarse el juicio de prescripción positiva en juzgado civil.\n`;
      report += `• Metas: Target Avalúo $${(chiPrj.targetRevenue || 3800000).toLocaleString()} MXN | Costo Proceso: $${(chiPrj.breakEvenRevenue || 380000).toLocaleString()} MXN | Plusvalía Neta: $${(chiPrj.targetNetProfit || 3420000).toLocaleString()} MXN\n\n`;
    }

    report += `*4. ⚡ RED DE ELECTROLINERAS & AMENIDADES (Cinépolis)*\n`;
    const evPrj = projects.find(p => p.id === 'prj-electrolineras');
    if (evPrj) {
      report += `• En gestión de gobierno ante CFE (Media Tensión), CRE (Federal), MIA (Estatal) y licencias municipales.\n`;
      report += `• Alianzas comerciales: Barbería, farmacia, abarrotes y avanzando en la gestión con Cinépolis para mini-salas comunitarias.\n`;
      report += `• Metas: Target $${(evPrj.targetRevenue || 1400000).toLocaleString()} MXN | Bottom Line: $${(evPrj.breakEvenRevenue || 580000).toLocaleString()} MXN | Utilidad Neta: $${(evPrj.targetNetProfit || 380000).toLocaleString()} MXN\n\n`;
    }

    report += `*5. 🧖‍♀️ SPA CHICXULUB PUERTO*\n`;
    const chxPrj = projects.find(p => p.id === 'prj-chicxulub');
    if (chxPrj) {
      report += `• Áreas húmedas al 100%. Campaña bilingüe lista para el turismo canadiense de fin de año e integrando paquetes familiares para meridanos en Semana Santa y Verano.\n`;
      report += `• Metas: Target $${(chxPrj.targetRevenue || 160000).toLocaleString()} MXN (${chxPrj.targetUnitKPI || '130 paquetes'}) | Bottom Line: $${(chxPrj.breakEvenRevenue || 55000).toLocaleString()} MXN | Utilidad Neta: $${(chxPrj.targetNetProfit || 65000).toLocaleString()} MXN\n\n`;
    }

    report += `*6. 🚗 FLOTA & UBER MÉRIDA*\n`;
    if (uberData) {
      report += `• Unidad activa (${uberData.carModel}). Ingresos acumulados: $${uberData.currentMonthRevenue.toLocaleString()} MXN (punto de inicio de operación).\n`;
      report += `• Metas: Target $45,000 MXN ($1,500/día) | Bottom Line: $33,000 MXN (cubre renta auto + chofer Carlos) | Utilidad Neta: $8,500 MXN + traslados del titular garantizados.\n\n`;
    }

    report += `*7. 🇪🇺 CATÁLOGO DE EXPORTACIÓN A EUROPA (TLCUEM - Arancel 0%)*\n`;
    report += `• 71 muestras fotográficas catalogadas con fichas técnicas y códigos arancelarios para la UE (España, Alemania, Francia, Italia, Países Bajos).\n`;
    report += `• Líneas de producto: Mieles y propóleo Don Cuco (Chignahuapan), confitería fina Casa Esmeralda, cacao artesanal maya La Itzalana, salsas habaneras La Anita, dulces de coco Campeche y esferas artesanales de vidrio soplado.\n`;
    report += `• Directorio de productores directos con números telefónicos, domicilios y enlaces directos de WhatsApp para cotización de contenedores y pallets.\n\n`;

    report += `_Generado automáticamente desde Villacorp Management OS._`;
    return report;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateWhatsAppText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              📊
            </div>
            <div>
              <h2 className="text-lg font-bold">Reporte Ejecutivo</h2>
              <p className="text-xs text-slate-400">Resumen integral de avances, obras, cotejo de ventas y utilidades</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Métricas Ejecutivas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Avance Global</span>
              <div className="text-2xl font-black text-emerald-600">{globalProgress}%</div>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ventas Registradas</span>
              <div className="text-2xl font-black text-slate-800">${totalSales.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Insumos Cotejados</span>
              <div className="text-2xl font-black text-rose-600">${totalExpenses.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Unidad Uber</span>
              <div className="text-2xl font-black text-blue-600">Autosuficiente</div>
            </div>
          </div>

          {/* Semáforo de Permisología Multigobierno */}
          {permits.length > 0 && (
            <div className="bg-slate-900 text-white rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">🚦</span>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Gobernanza & Permisos Nacionales (CFE / CRE / Municipios)
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {approvedPermitsCount} de {permits.length} trámites aprobados ({Math.round((approvedPermitsCount / permits.length) * 100)}%)
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-bold">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  🟢 {approvedPermitsCount} Aprobados
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  🟡 {permits.length - approvedPermitsCount - warningPermitsCount} En Trámite
                </span>
                {warningPermitsCount > 0 && (
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                    🔴 {warningPermitsCount} Observación
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Banner Tenant Mix & Cinépolis */}
          {amenities.length > 0 && (
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-50/50 to-white border border-amber-300 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">🎬</span>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
                    Tenant Mix & Mini-Salas Cinépolis Comunitarias
                  </h4>
                  <p className="text-[11px] text-slate-700">
                    ${totalMonthlyRents.toLocaleString()} MXN/mes en rentas · {occupiedAmenitiesCount} de {amenities.length} espacios colocados
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold bg-amber-200 text-amber-950 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                Cinépolis Motul / Mérida en Alianza
              </span>
            </div>
          )}

          {/* Destacado Estrategia Cocina Mérida */}
          <div className="border border-emerald-300 bg-emerald-50/60 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-emerald-950 text-sm">
                🍲 Cocina Mérida: Estrategia de Precio $110 vs $140 Competencia
              </span>
              <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                Rentable por Volumen
              </span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Diseñado para ganar el mercado masivo: Paquetes abundantes a <strong>$110</strong> (la competencia cobra \$140) donde con complementos caseros comen varias personas, con la máxima limpieza en cocina y cotejo diario de notas finales de venta.
            </p>
          </div>

          {/* Destacado Catálogo de Exportación a Europa */}
          <div className="border border-indigo-300 bg-indigo-50/70 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-indigo-950 text-sm flex items-center gap-1.5">
                <span>🇪🇺</span>
                <span>Catálogo de Exportación a Europa · Villacorp Trade</span>
              </span>
              <span className="text-xs font-bold bg-indigo-200 text-indigo-950 px-2 py-0.5 rounded-full">
                TLCUEM Arancel 0%
              </span>
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed">
              71 muestras fotográficas analizadas con fichas técnicas y directorio de productores con teléfonos directos y WhatsApp (Mieles Don Cuco, Jamoncillos Casa Esmeralda, Cacao Maya La Itzalana, Salsas La Anita y Esferas Navideñas). Dossier listo para cotizaciones en Euros (€) hacia España, Alemania, Francia e Italia.
            </p>
          </div>

          {/* Desglose por Proyecto */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
              Desglose Estratégico por Proyecto
            </h3>

            {projects.map((project) => {
              const comp = project.checklists.filter(c => c.completed).length;
              const total = project.checklists.length;
              const pct = Math.round((comp / total) * 100);

              return (
                <div key={project.id} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{project.name}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {project.location}
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {pct}% completado
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-purple-50/50 border border-purple-100 p-2.5 rounded-xl text-xs mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Mensual</span>
                      <span className="font-black text-slate-900">${(project.targetRevenue || 0).toLocaleString()} MXN</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bottom Line (Break-Even)</span>
                      <span className="font-extrabold text-amber-700">${(project.breakEvenRevenue || 0).toLocaleString()} MXN</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Utilidad Meta ({project.targetMarginPct || 35}%)</span>
                      <span className="font-black text-emerald-700">${(project.targetNetProfit || 0).toLocaleString()} MXN</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg text-slate-600">
                    <span>Responsable: <strong>{project.lead}</strong></span>
                    <span>Documentos/Planos en bóveda: <strong>{project.documents?.length || 0}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Formato listo para copiar y enviar al dueño por WhatsApp.
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado para WhatsApp!' : 'Copiar para WhatsApp'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl font-semibold text-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
