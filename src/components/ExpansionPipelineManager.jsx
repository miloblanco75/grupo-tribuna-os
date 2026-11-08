import React, { useState } from 'react';
import { 
  Rocket, 
  MapPin, 
  Zap, 
  Building2, 
  Film, 
  ShoppingBag, 
  Pill, 
  Scissors, 
  UtensilsCrossed, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ChevronRight, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Check, 
  Copy, 
  Search, 
  Filter, 
  Layers, 
  FileCheck2, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  X,
  ListTodo,
  Info
} from 'lucide-react';
import { EXPANSION_PLAYBOOK_TEMPLATE } from '../data/initialData';

export default function ExpansionPipelineManager({ 
  pipeline, 
  setPipeline, 
  onAddNewStationToProjects 
}) {
  const [filterState, setFilterState] = useState('Todos');
  const [filterPhase, setFilterPhase] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'table'
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [selectedStationForPlaybook, setSelectedStationForPlaybook] = useState(null);

  // Form states para Lanzar Nueva Electrolinera
  const [formName, setFormName] = useState('');
  const [formState, setFormState] = useState('Yucatán');
  const [formMunicipality, setFormMunicipality] = useState('Valladolid');
  const [formLandAreaSqm, setFormLandAreaSqm] = useState(2500);
  const [formMonthlyLandRent, setFormMonthlyLandRent] = useState(15000);
  const [formCapex, setFormCapex] = useState(2100000);
  const [formRevenue, setFormRevenue] = useState(300000);
  const [formEvChargers, setFormEvChargers] = useState(4);
  const [formEvPowerKW, setFormEvPowerKW] = useState(600);
  const [formHasCinepolis, setFormHasCinepolis] = useState(true);
  const [formHasPharmacy, setFormHasPharmacy] = useState(true);
  const [formHasBarber, setFormHasBarber] = useState(true);
  const [formHasMinisuper, setFormHasMinisuper] = useState(true);
  const [formHasRestaurant, setFormHasRestaurant] = useState(false);
  const [formTargetDate, setFormTargetDate] = useState('2027-06-30');
  const [formLead, setFormLead] = useState('Arq. Brenda Salgado');
  const [formNotes, setFormNotes] = useState('');

  // Fases maestras del Embudo
  const phases = [
    { index: 1, name: 'Fase 1: Terreno & Arrendamiento', short: 'Terreno', color: 'blue' },
    { index: 2, name: 'Fase 2: Factibilidad CFE & Permisos', short: 'CFE / Permisos', color: 'amber' },
    { index: 3, name: 'Fase 3: Obra Civil & Arquitectura', short: 'Obra Civil', color: 'purple' },
    { index: 4, name: 'Fase 4: Equipamiento & Alianzas', short: 'Equipamiento', color: 'indigo' },
    { index: 5, name: 'Fase 5: Apertura & Operación', short: 'Apertura', color: 'emerald' }
  ];

  // Cálculos Globales del Pipeline
  const totalStations = pipeline.length;
  const totalCapex = pipeline.reduce((acc, s) => acc + (s.estimatedCapex || 0), 0);
  const totalEvPower = pipeline.reduce((acc, s) => acc + (s.evPowerKW || 0), 0);
  const totalMonthlyProjectedRev = pipeline.reduce((acc, s) => acc + (s.expectedMonthlyRevenue || 0), 0);
  const stationsWithCinepolis = pipeline.filter(s => s.hasCinepolis).length;

  // Filtrado de Estaciones
  const filteredStations = pipeline.filter(station => {
    if (filterState !== 'Todos' && station.state !== filterState) return false;
    if (filterPhase !== 'Todos' && station.phase !== filterPhase) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const match = (
        station.name.toLowerCase() + 
        station.code.toLowerCase() + 
        station.state.toLowerCase() + 
        station.municipality.toLowerCase() +
        station.phase.toLowerCase() +
        (station.notes || '').toLowerCase()
      );
      if (!match.includes(q)) return false;
    }
    return true;
  });

  // Mover estación de fase
  const handleMovePhase = (stationId, direction) => {
    setPipeline(prev => prev.map(station => {
      if (station.id !== stationId) return station;
      let newIndex = station.phaseIndex + direction;
      if (newIndex < 1) newIndex = 1;
      if (newIndex > 5) newIndex = 5;

      const targetPhase = phases.find(p => p.index === newIndex);
      const newProgress = Math.min(100, Math.round(((newIndex - 1) * 20) + 15));

      return {
        ...station,
        phaseIndex: newIndex,
        phase: targetPhase ? targetPhase.name : station.phase,
        progress: newIndex === 5 ? 100 : newProgress
      };
    }));
  };

  // Lanzar nueva estación con Playbook Maestro
  const handleLaunchStation = (e) => {
    e.preventDefault();
    const stateCodes = {
      'Yucatán': 'YUC',
      'Quintana Roo': 'QROO',
      'Campeche': 'CAM',
      'Chihuahua': 'CHIH',
      'Nuevo León': 'MTY',
      'Jalisco': 'GDL'
    };
    const codePrefix = stateCodes[formState] || 'EV';
    const newCode = `EV-${codePrefix}-${Date.now().toString().slice(-2)}`;

    const amenitiesList = [];
    if (formHasCinepolis) amenitiesList.push('Cinépolis Mini-Sala');
    if (formHasPharmacy) amenitiesList.push('Farmacia');
    if (formHasBarber) amenitiesList.push('Barbería');
    if (formHasMinisuper) amenitiesList.push('Abarrotes & Minisuper');
    if (formHasRestaurant) amenitiesList.push('Restaurante Gourmet');

    const newStation = {
      id: `pipe-${Date.now()}`,
      code: newCode,
      name: formName || `Hub Electrolinera ${formMunicipality}`,
      state: formState,
      municipality: formMunicipality,
      phase: 'Fase 1: Terreno & Arrendamiento',
      phaseIndex: 1,
      progress: 10,
      landAreaSqm: parseFloat(formLandAreaSqm) || 2500,
      monthlyLandRent: parseFloat(formMonthlyLandRent) || 15000,
      estimatedCapex: parseFloat(formCapex) || 2000000,
      expectedMonthlyRevenue: parseFloat(formRevenue) || 300000,
      lead: formLead,
      evChargersCount: parseInt(formEvChargers) || 4,
      evPowerKW: parseInt(formEvPowerKW) || 600,
      hasCinepolis: formHasCinepolis,
      cinepolisStatus: formHasCinepolis ? 'En Prospección (Alianza)' : 'No incluido',
      amenitiesIncluded: amenitiesList,
      targetOpeningDate: formTargetDate,
      notes: formNotes || `Lanzamiento con Playbook Maestro de 25 pasos obligatorios. Terreno en ${formMunicipality}, ${formState}.`
    };

    setPipeline(prev => [...prev, newStation]);

    // Integrar automáticamente al sistema principal de proyectos
    if (onAddNewStationToProjects) {
      onAddNewStationToProjects(newStation);
    }

    setShowLaunchModal(false);
    setFormName('');
    setFormNotes('');
  };

  // Copiar reporte para WhatsApp
  const handleCopyPipelineReport = () => {
    let text = `*🚀 GRUPO TRIBUNA - PIPELINE DE EXPANSIÓN NACIONAL DE ELECTROLINERAS*\n`;
    text += `_Control y Crecimiento Ordenado en Múltiples Estados de la República_\n`;
    text += `*Estaciones en Pipeline:* ${totalStations} hubs en desarrollo\n`;
    text += `*Inversión CAPEX Total:* $${totalCapex.toLocaleString()} MXN\n`;
    text += `*Potencia de Carga en Despliegue:* ${totalEvPower.toLocaleString()} kW\n`;
    text += `*Facturación Mensual Proyectada:* $${totalMonthlyProjectedRev.toLocaleString()} MXN/mes\n`;
    text += `*Mini-Salas Cinépolis Comunitarias:* ${stationsWithCinepolis} salas programadas\n\n`;

    phases.forEach(ph => {
      const inPhase = pipeline.filter(s => s.phaseIndex === ph.index);
      text += `*${ph.name.toUpperCase()} (${inPhase.length}):*\n`;
      if (inPhase.length === 0) {
        text += `  _(Sin estaciones en esta fase)_\n`;
      } else {
        inPhase.forEach(st => {
          text += `• *${st.name}* [${st.code}] - 📍 ${st.municipality}, ${st.state}\n`;
          text += `  Avance: ${st.progress}% | CAPEX: $${st.estimatedCapex.toLocaleString()} MXN | Apertura Meta: ${st.targetOpeningDate}\n`;
          text += `  Amenidades: ${st.amenitiesIncluded.join(', ')}\n`;
        });
      }
      text += `\n`;
    });

    text += `_Generado automáticamente desde Villacorp Management OS._`;
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER PRINCIPAL */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/60 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-500 text-white font-black text-sm">
              🚀
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-400/20">
              Expansión Nacional Estandarizada
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Pipeline de Expansión & Playbook de Aperturas
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Embudo corporativo para crecer con orden en múltiples estados de México. Desde el arrendamiento del predio y los trámites de <strong>Media Tensión CFE</strong>, hasta la habilitación de la <strong>Mini-Sala Cinépolis comunitaria</strong> y el corte de listón.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <button
            onClick={() => setShowLaunchModal(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-900/40 transition-transform active:scale-95 flex items-center space-x-2"
          >
            <Rocket className="w-4 h-4" />
            <span>Lanzar Nueva Electrolinera</span>
          </button>

          <button
            onClick={handleCopyPipelineReport}
            className={`font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 ${
              copiedReport 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
            title="Copiar resumen del pipeline para WhatsApp del dueño"
          >
            {copiedReport ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedReport ? '¡Pipeline Copiado!' : 'Reporte WhatsApp'}</span>
          </button>
        </div>
      </div>

      {/* METRICAS EJECUTIVAS DEL PIPELINE */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Estaciones en Desarrollo */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hubs en Pipeline</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalStations}</div>
          <div className="text-[10px] text-blue-700 font-semibold mt-1">
            En 5 estados del país
          </div>
        </div>

        {/* Inversión CAPEX Total */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">CAPEX en Desarrollo</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            ${(totalCapex / 1000000).toFixed(1)}M <span className="text-xs font-normal text-slate-400">MXN</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">
            Inversión en obra, CFE y locales
          </div>
        </div>

        {/* Potencia Total Instalada */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Potencia Eléctrica</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalEvPower} <span className="text-xs font-normal text-slate-400">kW</span></div>
          <div className="text-[10px] text-amber-800 font-semibold mt-1">
            Cargadores rápidos DC en red
          </div>
        </div>

        {/* Mini-Salas Cinépolis */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Mini-Salas Cinépolis</span>
            <Film className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-900">{stationsWithCinepolis} <span className="text-xs font-normal text-slate-400">salas</span></div>
          <div className="text-[10px] text-purple-700 font-semibold mt-1">
            En comunidades y corredores
          </div>
        </div>

        {/* Facturación Mensual Proyectada */}
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-900 to-blue-950 text-white p-4 rounded-2xl shadow-md border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">Ventas Proyectadas</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            ${(totalMonthlyProjectedRev / 1000000).toFixed(2)}M
          </div>
          <div className="text-[10px] text-blue-200 font-semibold mt-1">
            MXN/mes (Recargas + Rentas)
          </div>
        </div>

      </div>

      {/* BARRA DE FILTROS Y CONTROL DE VISTA */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Toggle de Vistas */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'kanban' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Embudo Kanban por Fases</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'table' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5 text-blue-600" />
            <span>Lista Ejecutiva & CAPEX</span>
          </button>
        </div>

        {/* Filtros Dropdowns y Buscador */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Estado de la República */}
          <select
            value={filterState}
            onChange={e => setFilterState(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="Todos">🗺️ Todos los Estados</option>
            <option value="Yucatán">Yucatán (Motul / Mérida)</option>
            <option value="Quintana Roo">Quintana Roo (Cancún)</option>
            <option value="Campeche">Campeche (Puerto)</option>
            <option value="Chihuahua">Chihuahua (Juárez / Tierras)</option>
            <option value="Nuevo León">Nuevo León (Monterrey)</option>
          </select>

          {/* Fase */}
          <select
            value={filterPhase}
            onChange={e => setFilterPhase(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="Todos">🚦 Todas las Fases</option>
            {phases.map(p => (
              <option key={p.index} value={p.name}>{p.name}</option>
            ))}
          </select>

          {/* Buscador */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar Motul, Cinépolis, Monterrey..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {(filterState !== 'Todos' || filterPhase !== 'Todos' || searchTerm !== '') && (
            <button
              onClick={() => {
                setFilterState('Todos');
                setFilterPhase('Todos');
                setSearchTerm('');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1.5 rounded-lg hover:bg-rose-50"
            >
              Limpiar
            </button>
          )}

        </div>
      </div>

      {/* ========================================================= */}
      {/* VISTA 1: EMBUDO KANBAN DE 5 FASES DE DESARROLLO           */}
      {/* ========================================================= */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 overflow-x-auto pb-4">
          {phases.map(phase => {
            const stationsInPhase = filteredStations.filter(s => s.phaseIndex === phase.index);

            return (
              <div 
                key={phase.index}
                className="bg-slate-100/80 rounded-2xl p-3 border border-slate-200 flex flex-col justify-between min-w-[260px] space-y-3"
              >
                <div>
                  
                  {/* Encabezado de Columna */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Fase {phase.index}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-xs truncate max-w-[170px]" title={phase.name}>
                        {phase.short}
                      </h3>
                    </div>
                    <span className="bg-white text-slate-800 font-black text-xs px-2 py-0.5 rounded-full border shadow-2xs">
                      {stationsInPhase.length}
                    </span>
                  </div>

                  {/* Tarjetas de Estaciones en esta Fase */}
                  <div className="space-y-3">
                    {stationsInPhase.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-[11px] text-slate-400">
                        Sin estaciones en esta fase
                      </div>
                    ) : (
                      stationsInPhase.map(station => (
                        <div
                          key={station.id}
                          className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs hover:shadow-md transition-all space-y-3"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <span className="text-[9px] font-mono font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded">
                                {station.code}
                              </span>
                              <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                📍 {station.state}
                              </span>
                            </div>

                            <h4 className="font-black text-slate-900 text-xs leading-snug line-clamp-2">
                              {station.name}
                            </h4>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {station.municipality} · {station.landAreaSqm} m²
                            </span>
                          </div>

                          {/* Avance y Barra */}
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1">
                              <span>Avance Fase</span>
                              <span className="font-black text-slate-800">{station.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${station.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Amenidades Chips */}
                          <div className="flex flex-wrap gap-1">
                            {station.hasCinepolis && (
                              <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-200 flex items-center space-x-0.5">
                                <Film className="w-2.5 h-2.5" />
                                <span>Cinépolis</span>
                              </span>
                            )}
                            <span className="text-[9px] font-bold bg-teal-100 text-teal-900 px-1.5 py-0.2 rounded border border-teal-200 flex items-center space-x-0.5">
                              <Zap className="w-2.5 h-2.5" />
                              <span>{station.evChargersCount} EVs ({station.evPowerKW}kW)</span>
                            </span>
                          </div>

                          {/* CAPEX y Fecha Meta */}
                          <div className="bg-slate-50 p-2 rounded-lg text-[10px] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">CAPEX Est.:</span>
                              <span className="font-bold text-slate-800">${(station.estimatedCapex / 1000).toFixed(0)}k MXN</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Meta Apertura:</span>
                              <span className="font-semibold text-slate-700">{station.targetOpeningDate}</span>
                            </div>
                          </div>

                          {/* Acciones de Fase y Playbook */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                            <button
                              onClick={() => setSelectedStationForPlaybook(station)}
                              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-0.5"
                            >
                              <FileCheck2 className="w-3 h-3" />
                              <span>Playbook</span>
                            </button>

                            <div className="flex items-center space-x-1">
                              {phase.index > 1 && (
                                <button
                                  onClick={() => handleMovePhase(station.id, -1)}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                  title="Retroceder a fase anterior"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                              )}
                              {phase.index < 5 && (
                                <button
                                  onClick={() => handleMovePhase(station.id, 1)}
                                  className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 font-bold"
                                  title="Avanzar a siguiente fase"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      ))
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* VISTA 2: LISTA EJECUTIVA & CAPEX                         */}
      {/* ========================================================= */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Resumen Ejecutivo del Pipeline de Nuevas Electrolineras
              </h3>
              <p className="text-xs text-slate-500">
                Inversión de capital, capacidad eléctrica y cronograma de apertura por estado.
              </p>
            </div>
            <div className="text-xs font-black text-slate-900 bg-slate-200 px-3 py-1 rounded-xl">
              CAPEX Total: ${(totalCapex / 1000000).toFixed(1)}M MXN
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4">Estación / Hub</th>
                  <th className="py-3 px-3">Estado / Plaza</th>
                  <th className="py-3 px-3">Fase Actual</th>
                  <th className="py-3 px-3 text-center">Avance</th>
                  <th className="py-3 px-3 text-right">CAPEX Estimado</th>
                  <th className="py-3 px-3 text-center">Cargadores EV</th>
                  <th className="py-3 px-3 text-center">Cinépolis</th>
                  <th className="py-3 px-3 text-center">Meta Apertura</th>
                  <th className="py-3 px-3 text-center">Playbook</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStations.map(station => (
                  <tr key={station.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900">{station.name}</div>
                      <span className="text-[10px] font-mono text-slate-400">{station.code}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      📍 {station.municipality}, {station.state}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full border border-blue-200">
                        {station.phase}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-black text-slate-900">
                      {station.progress}%
                    </td>
                    <td className="py-3 px-3 text-right font-black text-emerald-700">
                      ${station.estimatedCapex.toLocaleString()} MXN
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-teal-800">
                      {station.evChargersCount} ({station.evPowerKW} kW)
                    </td>
                    <td className="py-3 px-3 text-center">
                      {station.hasCinepolis ? (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                          🎬 Sí
                        </span>
                      ) : (
                        <span className="text-slate-300 font-mono">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {station.targetOpeningDate}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setSelectedStationForPlaybook(station)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px]"
                      >
                        Ver Pasos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: LANZAR NUEVA ELECTROLINERA (PLAYBOOK AUTOMÁTICO)  */}
      {/* ========================================================= */}
      {showLaunchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div className="flex items-center space-x-3">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-800 font-black text-sm">
                  🚀
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Lanzar Nueva Electrolinera</h3>
                  <p className="text-xs text-slate-500">Playbook Maestro de Replicación para Nuevos Estados</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLaunchModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLaunchStation} className="space-y-4">
              
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Nombre de la Nueva Estación / Hub</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Ej. Hub Valladolid Pueblo Mágico, Hub Delicias..."
                  className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Estado de la República</label>
                  <select
                    value={formState}
                    onChange={e => setFormState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-slate-50"
                  >
                    <option value="Yucatán">Yucatán</option>
                    <option value="Quintana Roo">Quintana Roo</option>
                    <option value="Campeche">Campeche</option>
                    <option value="Chihuahua">Chihuahua</option>
                    <option value="Nuevo León">Nuevo León</option>
                    <option value="Jalisco">Jalisco</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Municipio / Ciudad</label>
                  <input
                    type="text"
                    required
                    value={formMunicipality}
                    onChange={e => setFormMunicipality(e.target.value)}
                    placeholder="Ej. Valladolid, Playa del Carmen..."
                    className="w-full px-3 py-2 rounded-xl border text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Superficie Terreno (m²)</label>
                  <input
                    type="number"
                    value={formLandAreaSqm}
                    onChange={e => setFormLandAreaSqm(e.target.value)}
                    placeholder="2500"
                    className="w-full px-3 py-2 rounded-xl border text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Renta Terreno ($/mes)</label>
                  <input
                    type="number"
                    value={formMonthlyLandRent}
                    onChange={e => setFormMonthlyLandRent(e.target.value)}
                    placeholder="15000"
                    className="w-full px-3 py-2 rounded-xl border text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">CAPEX Estimado ($)</label>
                  <input
                    type="number"
                    value={formCapex}
                    onChange={e => setFormCapex(e.target.value)}
                    placeholder="2100000"
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Cargadores EV</label>
                  <input
                    type="number"
                    value={formEvChargers}
                    onChange={e => setFormEvChargers(e.target.value)}
                    placeholder="4"
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Potencia Total (kW)</label>
                  <input
                    type="number"
                    value={formEvPowerKW}
                    onChange={e => setFormEvPowerKW(e.target.value)}
                    placeholder="600"
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Meta Apertura</label>
                  <input
                    type="date"
                    value={formTargetDate}
                    onChange={e => setFormTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>
              </div>

              {/* Selección de Amenidades Incluidas */}
              <div className="bg-slate-50 p-3 rounded-2xl border space-y-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Amenidades & Locales a Incorporar:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center space-x-2 bg-white p-2 rounded-xl border cursor-pointer hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={formHasCinepolis}
                      onChange={e => setFormHasCinepolis(e.target.checked)}
                      className="rounded text-amber-500"
                    />
                    <span className="font-bold text-slate-800">🎬 Mini-Sala Cinépolis</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-white p-2 rounded-xl border cursor-pointer hover:border-emerald-400">
                    <input
                      type="checkbox"
                      checked={formHasPharmacy}
                      onChange={e => setFormHasPharmacy(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span className="font-bold text-slate-800">💊 Farmacia</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-white p-2 rounded-xl border cursor-pointer hover:border-blue-400">
                    <input
                      type="checkbox"
                      checked={formHasBarber}
                      onChange={e => setFormHasBarber(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="font-bold text-slate-800">💈 Barbería</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-white p-2 rounded-xl border cursor-pointer hover:border-orange-400">
                    <input
                      type="checkbox"
                      checked={formHasMinisuper}
                      onChange={e => setFormHasMinisuper(e.target.checked)}
                      className="rounded text-orange-600"
                    />
                    <span className="font-bold text-slate-800">🏪 Minisuper</span>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 text-blue-950 text-xs flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  <strong>Playbook Automático:</strong> Al guardar, se clonará la plantilla maestra de <strong>25 tareas obligatorias</strong> divididas en sus 5 fases para garantizar que ningún trámite ante CFE, CRE o municipio se olvide.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowLaunchModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Lanzar Estación con Playbook
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VER PLAYBOOK MAESTRO DE LA ESTACIÓN                */}
      {/* ========================================================= */}
      {selectedStationForPlaybook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b mb-4">
                <div className="flex items-center space-x-3">
                  <span className="p-2 rounded-xl bg-purple-100 text-purple-800 font-black">
                    📋
                  </span>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Playbook Maestro de Replicación ({selectedStationForPlaybook.name})
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedStationForPlaybook.code} · Fase Actual: <strong>{selectedStationForPlaybook.phase}</strong>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStationForPlaybook(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[55vh] pr-1">
                {phases.map(ph => (
                  <div key={ph.index} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-600 bg-slate-100 p-2 rounded-xl">
                      <span>{ph.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        selectedStationForPlaybook.phaseIndex >= ph.index ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {selectedStationForPlaybook.phaseIndex > ph.index ? '✓ Concluida' : selectedStationForPlaybook.phaseIndex === ph.index ? '⚡ En Proceso' : 'Pendiente'}
                      </span>
                    </div>

                    <div className="space-y-1.5 pl-2">
                      {EXPANSION_PLAYBOOK_TEMPLATE.filter(t => t.phaseIndex === ph.index).map((task, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs p-1.5 rounded-lg hover:bg-slate-50">
                          <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                            selectedStationForPlaybook.phaseIndex > ph.index ? 'text-emerald-600' : 'text-slate-300'
                          }`} />
                          <div className="flex-1">
                            <span className="text-slate-800 leading-snug">{task.text}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Responsable: <strong>{task.lead}</strong> · {task.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t mt-4 flex justify-end">
              <button
                onClick={() => setSelectedStationForPlaybook(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Cerrar Playbook
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
