import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Landmark, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  ChevronRight, 
  Calendar, 
  DollarSign, 
  User, 
  MapPin, 
  Check, 
  Copy, 
  Layers, 
  X,
  FileCheck2,
  TrendingUp,
  Zap,
  Flame,
  Info
} from 'lucide-react';

export default function PermitsManager({ 
  permits, 
  setPermits, 
  projects, 
  collaborators 
}) {
  const [filterLevel, setFilterLevel] = useState('Todos'); // 'Todos', 'Federal', 'Estatal', 'Municipal'
  const [filterState, setFilterState] = useState('Todos'); // 'Todos', 'Yucatán', 'Quintana Roo', 'Campeche', 'Chihuahua'
  const [filterStatus, setFilterStatus] = useState('Todos'); // 'Todos', 'Aprobado', 'En Revision', 'Observaciones', 'Pendiente'
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' (fichas semafóricas), 'matrix' (matriz de expansión)
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [selectedPermitForNotes, setSelectedPermitForNotes] = useState(null);
  const [quickNoteText, setQuickNoteText] = useState('');

  // Form states para nuevo permiso
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || 'prj-motul');
  const [formLevel, setFormLevel] = useState('Federal');
  const [formAgency, setFormAgency] = useState('CFE Distribución');
  const [formTitle, setFormTitle] = useState('');
  const [formState, setFormState] = useState('Yucatán');
  const [formStatus, setFormStatus] = useState('En Revision');
  const [formFolio, setFormFolio] = useState('');
  const [formLead, setFormLead] = useState(collaborators[4]?.name || 'Lic. Mariana Pech');
  const [formSubmissionDate, setFormSubmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [formResolutionDate, setFormResolutionDate] = useState('');
  const [formCostMXN, setFormCostMXN] = useState('');
  const [formRiskNotes, setFormRiskNotes] = useState('');
  const [formDocName, setFormDocName] = useState('');

  // Cálculos del Semáforo Global
  const totalPermits = permits.length;
  const approvedPermits = permits.filter(p => p.status === 'Aprobado').length;
  const inReviewPermits = permits.filter(p => p.status === 'En Revision').length;
  const warningPermits = permits.filter(p => p.status === 'Observaciones').length;
  const pendingPermits = permits.filter(p => p.status === 'Pendiente').length;
  const approvalRate = totalPermits > 0 ? Math.round((approvedPermits / totalPermits) * 100) : 0;
  const totalFeesInvested = permits.reduce((acc, p) => acc + (p.costMXN || 0), 0);

  // Filtrado de permisos
  const filteredPermits = permits.filter(permit => {
    if (filterLevel !== 'Todos' && permit.level !== filterLevel) return false;
    if (filterState !== 'Todos' && permit.state !== filterState) return false;
    if (filterStatus !== 'Todos' && permit.status !== filterStatus) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchText = (
        permit.title.toLowerCase() + 
        permit.agency.toLowerCase() + 
        permit.folio.toLowerCase() + 
        permit.projectName.toLowerCase() +
        permit.state.toLowerCase() +
        (permit.riskNotes || '').toLowerCase()
      );
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  // Cambio rápido de estatus
  const handleUpdateStatus = (permitId, newStatus) => {
    setPermits(prev => prev.map(p => {
      if (p.id !== permitId) return p;
      return {
        ...p,
        status: newStatus,
        resolutionDate: newStatus === 'Aprobado' ? (p.resolutionDate || new Date().toISOString().split('T')[0]) : p.resolutionDate
      };
    }));
  };

  // Guardar nuevo permiso
  const handleCreatePermit = (e) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === formProjectId);
    const newPermit = {
      id: `pm-${Date.now()}`,
      projectId: formProjectId,
      projectName: proj ? proj.name : 'Villacorp Estación',
      state: formState,
      level: formLevel,
      agency: formAgency,
      title: formTitle,
      status: formStatus,
      folio: formFolio || `EXP-${formLevel.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      lead: formLead,
      submissionDate: formSubmissionDate,
      resolutionDate: formResolutionDate || null,
      costMXN: parseFloat(formCostMXN) || 0,
      riskNotes: formRiskNotes,
      documentName: formDocName || `Expediente_${formTitle.replace(/ /g, '_').slice(0, 20)}.pdf`
    };

    setPermits(prev => [newPermit, ...prev]);
    setShowAddModal(false);
    setFormTitle('');
    setFormFolio('');
    setFormCostMXN('');
    setFormRiskNotes('');
    setFormDocName('');
  };

  // Guardar nota rápida en bitácora
  const handleSaveQuickNote = () => {
    if (!selectedPermitForNotes || !quickNoteText.trim()) return;
    const noteStamp = `[${new Date().toLocaleDateString('es-MX')}]: ${quickNoteText.trim()}`;
    setPermits(prev => prev.map(p => {
      if (p.id !== selectedPermitForNotes.id) return p;
      return {
        ...p,
        riskNotes: p.riskNotes ? `${noteStamp} | ${p.riskNotes}` : noteStamp
      };
    }));
    setSelectedPermitForNotes(null);
    setQuickNoteText('');
  };

  // Generar reporte gubernamental para WhatsApp
  const handleCopyPermitsWhatsApp = () => {
    let text = `*🚦 VILLACORP - SEMÁFORO DE PERMISOLOGÍA MULTIGOBIERNO*\n`;
    text += `_Gobernanza CFE, CRE, Dependencias Estatales y Municipios_\n`;
    text += `*Avance Aprobatorio:* ${approvalRate}% (${approvedPermits}/${totalPermits} trámites)\n`;
    text += `🟢 Aprobados: ${approvedPermits} | 🟡 En Trámite: ${inReviewPermits} | 🔴 Con Observaciones: ${warningPermits}\n`;
    text += `💰 Inversión en Derechos y Peritajes: $${totalFeesInvested.toLocaleString()} MXN\n\n`;

    if (warningPermits > 0) {
      text += `*⚠️ ATENCIONES URGENTES (SEMÁFORO ROJO):*\n`;
      permits.filter(p => p.status === 'Observaciones').forEach(p => {
        text += `• *${p.projectName} (${p.state})* - ${p.agency}\n`;
        text += `  Trámite: ${p.title} (Folio: ${p.folio})\n`;
        text += `  Detalle: ${p.riskNotes}\n`;
      });
      text += `\n`;
    }

    text += `*RESUMEN POR ESTADO Y PROYECTO:*\n`;
    const states = ['Yucatán', 'Quintana Roo', 'Campeche', 'Chihuahua'];
    states.forEach(st => {
      const stPermits = permits.filter(p => p.state === st);
      if (stPermits.length > 0) {
        text += `📍 *Estado de ${st}:*\n`;
        stPermits.forEach(p => {
          const icon = p.status === 'Aprobado' ? '🟢' : p.status === 'En Revision' ? '🟡' : p.status === 'Observaciones' ? '🔴' : '⚪';
          text += `  ${icon} [${p.level}] ${p.title} (${p.agency}) - Folio: ${p.folio}\n`;
        });
        text += `\n`;
      }
    });

    text += `_Control y gobernanza de expansión Villacorp OS._`;
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  // Helper de semáforo colores
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Aprobado':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          icon: '🟢',
          label: 'Aprobado / Emitido'
        };
      case 'En Revision':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          icon: '🟡',
          label: 'En Revisión Técnica'
        };
      case 'Observaciones':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
          dot: 'bg-rose-500',
          icon: '🔴',
          label: 'Con Observaciones (Urgente)'
        };
      case 'Pendiente':
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-400',
          icon: '⚪',
          label: 'Pendiente de Ingreso'
        };
    }
  };

  // Helper nivel de gobierno
  const getLevelBadge = (level) => {
    switch (level) {
      case 'Federal':
        return { bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🏛️' };
      case 'Estatal':
        return { bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🏢' };
      case 'Municipal':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: '🏘️' };
      default:
        return { bg: 'bg-slate-100 text-slate-800 border-slate-200', icon: '📋' };
    }
  };

  // Proyectos agrupados para la vista de Matriz Comparativa
  const matrixProjects = [
    {
      id: 'mat-motul',
      name: 'Electrolinera & Gourmet Motul',
      state: 'Yucatán',
      code: 'EV-MOT',
      color: 'pink',
      cfe: permits.find(p => p.projectId === 'prj-motul' && p.agency.includes('CFE')),
      cre: permits.find(p => p.projectId === 'prj-motul' && p.agency.includes('CRE')),
      mia: permits.find(p => p.projectId === 'prj-motul' && p.agency.includes('SEDUMA')),
      pc: permits.find(p => p.projectId === 'prj-motul' && (p.agency.includes('Protección') || p.agency.includes('Bomberos'))),
      usoSuelo: permits.find(p => p.projectId === 'prj-motul' && p.title.includes('Uso de Suelo')),
      construccion: permits.find(p => p.projectId === 'prj-motul' && p.title.includes('Construcción')),
      licencia: permits.find(p => p.projectId === 'prj-motul' && p.title.includes('Funcionamiento'))
    },
    {
      id: 'mat-merida',
      name: 'Hub Periférico Mérida (Cinépolis)',
      state: 'Yucatán',
      code: 'EV-MER',
      color: 'emerald',
      cfe: permits.find(p => p.id === 'pm-mer-01'),
      cre: permits.find(p => p.id === 'pm-mer-02'),
      mia: permits.find(p => p.id === 'pm-mer-03'),
      pc: null,
      usoSuelo: permits.find(p => p.id === 'pm-mer-04'),
      construccion: null,
      licencia: null
    },
    {
      id: 'mat-cancun',
      name: 'Hub Cancún - Riviera Maya',
      state: 'Quintana Roo',
      code: 'EV-CUN',
      color: 'blue',
      cfe: permits.find(p => p.id === 'pm-cun-01'),
      cre: null,
      mia: permits.find(p => p.id === 'pm-cun-02'),
      pc: permits.find(p => p.title.includes('Salidas de Emergencia') || p.title.includes('Protección Civil')),
      usoSuelo: permits.find(p => p.title.includes('Factibilidad de Uso de Suelo Carretero')),
      construccion: permits.find(p => p.id === 'pm-cun-03'),
      licencia: null
    },
    {
      id: 'mat-campeche',
      name: 'Hub Campeche Puerto',
      state: 'Campeche',
      code: 'EV-CAM',
      color: 'amber',
      cfe: permits.find(p => p.id === 'pm-cam-01'),
      cre: null,
      mia: permits.find(p => p.id === 'pm-cam-02'),
      pc: null,
      usoSuelo: null,
      construccion: permits.find(p => p.id === 'pm-cam-03'),
      licencia: null
    },
    {
      id: 'mat-chihuahua',
      name: 'Tierras Chihuahua (Regularización 10+ Años)',
      state: 'Chihuahua',
      code: 'TR-CHIH',
      color: 'slate',
      cfe: null,
      cre: permits.find(p => p.id === 'pm-chi-01'), // RAN
      mia: permits.find(p => p.id === 'pm-chi-02'), // Juicio civil
      pc: null,
      usoSuelo: permits.find(p => p.id === 'pm-chi-03'), // Catastro
      construccion: null,
      licencia: null
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER PRINCIPAL DEL MÓDULO */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/60 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black text-sm">
              🚦
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              Gobernanza Multigobierno Nacional
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Semáforo de Permisología & Expansión
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Control centralizado de trámites regulatorios ante <strong>CFE (Media Tensión)</strong>, <strong>CRE</strong>, dependencias ambientales estatales (SEDUMA/SEMA/SEMABICCE) y municipios en todos los estados donde Villacorp construye y opera.
          </p>
        </div>

        {/* Botones de Acción Rápida */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-900/40 transition-transform active:scale-95 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nuevo Permiso</span>
          </button>

          <button
            onClick={handleCopyPermitsWhatsApp}
            className={`font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 ${
              copiedReport 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
            title="Copiar reporte completo para WhatsApp del dueño"
          >
            {copiedReport ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedReport ? '¡Semáforo Copiado!' : 'Reporte WhatsApp'}</span>
          </button>
        </div>
      </div>

      {/* METRICAS DEL SEMÁFORO GLOBAL */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Aprobados */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'Aprobado' ? 'Todos' : 'Aprobado')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'Aprobado' 
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400 shadow-md' 
              : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Aprobados</span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{approvedPermits}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1">
            {approvalRate}% del total resuelto
          </div>
        </div>

        {/* En Revisión */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'En Revision' ? 'Todos' : 'En Revision')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'En Revision' 
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400 shadow-md' 
              : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">En Revisión</span>
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{inReviewPermits}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">
            En mesas técnicas de gobierno
          </div>
        </div>

        {/* Alerta Roja / Observaciones */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'Observaciones' ? 'Todos' : 'Observaciones')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'Observaciones' 
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400 shadow-md' 
              : warningPermits > 0 
                ? 'bg-rose-50/40 border-rose-300 hover:border-rose-400 shadow-xs' 
                : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center space-x-1">
              <span>Observaciones</span>
              {warningPermits > 0 && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 inline" />}
            </span>
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping shadow-sm" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700">{warningPermits}</div>
          <div className="text-[10px] text-rose-700 font-bold mt-1">
            {warningPermits > 0 ? '⚠️ Requiere gestión urgente' : 'Sin atoros'}
          </div>
        </div>

        {/* Pendientes */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'Pendiente' ? 'Todos' : 'Pendiente')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'Pendiente' 
              ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400 shadow-md' 
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pendientes</span>
            <span className="w-3 h-3 rounded-full bg-slate-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800">{pendingPermits}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">
            Por radicar en ventanilla
          </div>
        </div>

        {/* Inversión en Derechos y Peritajes */}
        <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Inversión Derechos</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            ${totalFeesInvested.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">
            MXN en pagos oficiales y DRO
          </div>
        </div>

      </div>

      {/* BARRA DE FILTROS Y CONTROL DE VISTA */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Toggle de Vistas: Fichas vs Matriz */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'cards' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fichas Semafóricas ({filteredPermits.length})</span>
          </button>

          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'matrix' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Matriz Expansión Sucursales</span>
          </button>
        </div>

        {/* Filtros Dropdowns y Buscador */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Nivel de Gobierno */}
          <select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="Todos">🏛️ Todos los Niveles</option>
            <option value="Federal">Federal (CFE / CRE / RAN)</option>
            <option value="Estatal">Estatal (SEDUMA / PROCIVY)</option>
            <option value="Municipal">Municipal (Uso Suelo / Obras)</option>
          </select>

          {/* Estado de la República */}
          <select
            value={filterState}
            onChange={e => setFilterState(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="Todos">🗺️ Todos los Estados</option>
            <option value="Yucatán">Yucatán (Motul / Mérida / Spa)</option>
            <option value="Quintana Roo">Quintana Roo (Cancún)</option>
            <option value="Campeche">Campeche (Puerto)</option>
            <option value="Chihuahua">Chihuahua (Tierras)</option>
          </select>

          {/* Semáforo Estatus */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="Todos">🚦 Todos los Estatus</option>
            <option value="Aprobado">🟢 Solo Aprobados</option>
            <option value="En Revision">🟡 Solo En Revisión</option>
            <option value="Observaciones">🔴 Con Observaciones (Urgente)</option>
            <option value="Pendiente">⚪ Solo Pendientes</option>
          </select>

          {/* Buscador */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar folio, CFE, Motul..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {(filterLevel !== 'Todos' || filterState !== 'Todos' || filterStatus !== 'Todos' || searchTerm !== '') && (
            <button
              onClick={() => {
                setFilterLevel('Todos');
                setFilterState('Todos');
                setFilterStatus('Todos');
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
      {/* VISTA 1: FICHAS SEMAFÓRICAS DETALLADAS                   */}
      {/* ========================================================= */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPermits.map(permit => {
            const statusConfig = getStatusBadge(permit.status);
            const levelConfig = getLevelBadge(permit.level);
            const isWarning = permit.status === 'Observaciones';

            return (
              <div 
                key={permit.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 ${
                  isWarning 
                    ? 'border-rose-400 ring-1 ring-rose-200 bg-rose-50/20' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  
                  {/* Encabezado de la Ficha */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${levelConfig.bg}`}>
                        {levelConfig.icon} {permit.level}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        📍 {permit.state}
                      </span>
                    </div>

                    {/* Selector Rápido de Semáforo */}
                    <div className="relative">
                      <select
                        value={permit.status}
                        onChange={e => handleUpdateStatus(permit.id, e.target.value)}
                        className={`text-[11px] font-black rounded-lg px-2 py-1 border cursor-pointer focus:ring-2 focus:ring-slate-900 ${statusConfig.bg}`}
                      >
                        <option value="Aprobado">🟢 Aprobado</option>
                        <option value="En Revision">🟡 En Revisión</option>
                        <option value="Observaciones">🔴 Observación</option>
                        <option value="Pendiente">⚪ Pendiente</option>
                      </select>
                    </div>
                  </div>

                  {/* Proyecto & Título del Trámite */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                      {permit.projectName}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {permit.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold flex items-center space-x-1">
                      <Landmark className="w-3.5 h-3.5 text-slate-400 inline" />
                      <span>{permit.agency}</span>
                    </p>
                  </div>

                  {/* Folio Oficial & Datos Clave */}
                  <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Folio Oficial:</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {permit.folio}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Ingreso:</span>
                      <span className="font-semibold text-slate-700">{permit.submissionDate}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        {permit.status === 'Aprobado' ? 'Resolución Favorable:' : 'Resolución Estimada:'}
                      </span>
                      <span className={`font-bold ${permit.status === 'Aprobado' ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {permit.resolutionDate || 'Por programar'}
                      </span>
                    </div>

                    {permit.costMXN > 0 && (
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400">Derechos Pagados:</span>
                        <span className="font-bold text-slate-800">${permit.costMXN.toLocaleString()} MXN</span>
                      </div>
                    )}
                  </div>

                  {/* Alerta de Observaciones / Notas de Bitácora */}
                  {permit.riskNotes && (
                    <div className={`mt-3 p-2.5 rounded-xl text-xs leading-relaxed ${
                      isWarning 
                        ? 'bg-rose-100/70 border border-rose-300 text-rose-950 font-medium' 
                        : 'bg-amber-50/60 border border-amber-200 text-amber-950'
                    }`}>
                      <div className="flex items-start space-x-1.5">
                        <Info className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isWarning ? 'text-rose-600' : 'text-amber-600'}`} />
                        <span className="text-[11px]">{permit.riskNotes}</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Pie de la Ficha: Responsable y Acciones */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-[11px] truncate max-w-[120px]" title={permit.lead}>
                      {permit.lead}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setSelectedPermitForNotes(permit);
                        setQuickNoteText('');
                      }}
                      className="px-2 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-[11px] transition-colors"
                      title="Agregar nota técnica a la bitácora"
                    >
                      + Bitácora
                    </button>

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Visualizando expediente oficial: ${permit.documentName || 'Resolutivo_Oficial.pdf'}`);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1"
                      title={`Expediente: ${permit.documentName}`}
                    >
                      <FileCheck2 className="w-4 h-4" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* VISTA 2: MATRIZ DE EXPANSIÓN POR SUCURSALES (GOBERNANZA) */}
      {/* ========================================================= */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <span>Matriz Semafórica de Expansión Nacional</span>
                <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                  Vista Dueño / Inversionista
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluación integral de viabilidad jurídica y avance permisorio en cada plaza antes de autorizar obra o corte de listón.
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1 text-emerald-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Aprobado</span>
              </span>
              <span className="flex items-center space-x-1 text-amber-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>En Trámite</span>
              </span>
              <span className="flex items-center space-x-1 text-rose-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Observación</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-3.5 px-4 min-w-[200px]">Sucursal & Plaza</th>
                  <th className="py-3.5 px-3 min-w-[130px] text-center">1. Media Tensión CFE</th>
                  <th className="py-3.5 px-3 min-w-[130px] text-center">2. Registro CRE</th>
                  <th className="py-3.5 px-3 min-w-[130px] text-center">3. Impacto Amb. (MIA)</th>
                  <th className="py-3.5 px-3 min-w-[130px] text-center">4. Protección Civil</th>
                  <th className="py-3.5 px-3 min-w-[130px] text-center">5. Uso de Suelo</th>
                  <th className="py-3.5 px-3 min-w-[130px] text-center">6. Lic. Construcción</th>
                  <th className="py-3.5 px-3 min-w-[130px] text-center">7. Lic. Funcionamiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixProjects.map(proj => {
                  const renderCell = (item) => {
                    if (!item) {
                      return (
                        <div className="py-3 px-2 text-center text-slate-300 font-mono text-xs">
                          —
                        </div>
                      );
                    }
                    const cfg = getStatusBadge(item.status);
                    return (
                      <div className="py-3 px-2 text-center">
                        <span 
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-black border ${cfg.bg}`}
                          title={`${item.title} (${item.folio})`}
                        >
                          <span>{cfg.icon}</span>
                          <span className="hidden sm:inline">{item.status}</span>
                        </span>
                        <span className="block text-[9px] text-slate-400 font-mono mt-0.5 truncate max-w-[110px] mx-auto">
                          {item.folio}
                        </span>
                      </div>
                    );
                  };

                  return (
                    <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 text-xs">{proj.name}</div>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                          <span className="font-mono bg-slate-100 px-1 rounded">{proj.code}</span>
                          <span>📍 {proj.state}</span>
                        </div>
                      </td>
                      <td>{renderCell(proj.cfe)}</td>
                      <td>{renderCell(proj.cre)}</td>
                      <td>{renderCell(proj.mia)}</td>
                      <td>{renderCell(proj.pc)}</td>
                      <td>{renderCell(proj.usoSuelo)}</td>
                      <td>{renderCell(proj.construccion)}</td>
                      <td>{renderCell(proj.licencia)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REGISTRAR NUEVO PERMISO / TRÁMITE                  */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div className="flex items-center space-x-3">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  🚦
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Registrar Trámite Gubernamental</h3>
                  <p className="text-xs text-slate-500">Expansión de Electrolineras y Negocios en la República</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePermit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Proyecto / Sucursal</label>
                  <select
                    value={formProjectId}
                    onChange={e => {
                      setFormProjectId(e.target.value);
                      const proj = projects.find(p => p.id === e.target.value);
                      if (proj) {
                        if (proj.location.includes('Chihuahua')) setFormState('Chihuahua');
                        else if (proj.location.includes('Cancún') || proj.location.includes('Quintana Roo')) setFormState('Quintana Roo');
                        else if (proj.location.includes('Campeche')) setFormState('Campeche');
                        else setFormState('Yucatán');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-slate-50"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                    ))}
                  </select>
                </div>

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Nivel de Gobierno</label>
                  <select
                    value={formLevel}
                    onChange={e => setFormLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                  >
                    <option value="Federal">Federal (CFE / CRE / RAN / ASEA)</option>
                    <option value="Estatal">Estatal (MIA / PROCIVY / Vialidad)</option>
                    <option value="Municipal">Municipal (Uso de Suelo / Obras / Bomberos)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Semáforo Inicial</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-black"
                  >
                    <option value="En Revision">🟡 En Revisión Técnica</option>
                    <option value="Aprobado">🟢 Aprobado / Emitido</option>
                    <option value="Observaciones">🔴 Con Observaciones (Urgente)</option>
                    <option value="Pendiente">⚪ Pendiente de Ingreso</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Dependencia Oficial</label>
                <input
                  type="text"
                  required
                  value={formAgency}
                  onChange={e => setFormAgency(e.target.value)}
                  placeholder="Ej. CFE Distribución, CRE, H. Ayuntamiento..."
                  className="w-full px-3 py-2 rounded-xl border text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Nombre del Trámite / Permiso</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="Ej. Factibilidad Media Tensión 34.5 kV, Licencia de Construcción..."
                  className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Folio / Número de Expediente</label>
                  <input
                    type="text"
                    required
                    value={formFolio}
                    onChange={e => setFormFolio(e.target.value)}
                    placeholder="CFE-PEN-2026-091..."
                    className="w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Responsable Interno</label>
                  <select
                    value={formLead}
                    onChange={e => setFormLead(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-semibold"
                  >
                    {collaborators.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Fecha de Ingreso</label>
                  <input
                    type="date"
                    required
                    value={formSubmissionDate}
                    onChange={e => setFormSubmissionDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Resolución Estimada</label>
                  <input
                    type="date"
                    value={formResolutionDate}
                    onChange={e => setFormResolutionDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Derechos Oficiales ($)</label>
                  <input
                    type="number"
                    value={formCostMXN}
                    onChange={e => setFormCostMXN(e.target.value)}
                    placeholder="25000"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Notas Técnicas / Observaciones</label>
                <textarea
                  rows={2}
                  value={formRiskNotes}
                  onChange={e => setFormRiskNotes(e.target.value)}
                  placeholder="Detalles de inspección, condicionantes o requerimientos pendientes..."
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Nombre de Expediente Digital</label>
                <input
                  type="text"
                  value={formDocName}
                  onChange={e => setFormDocName(e.target.value)}
                  placeholder="Acuse_Ingreso_Ventanilla.pdf"
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  Guardar Trámite
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AGREGAR NOTA RÁPIDA A BITÁCORA                      */}
      {/* ========================================================= */}
      {selectedPermitForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Agregar Nota a Bitácora Gubernamental
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              {selectedPermitForNotes.title} · <strong className="text-slate-700">{selectedPermitForNotes.folio}</strong>
            </p>

            <textarea
              rows={3}
              value={quickNoteText}
              onChange={e => setQuickNoteText(e.target.value)}
              placeholder="Ej. Se entregó contestación a CFE en ventanilla; visita técnica el jueves..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900 mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedPermitForNotes(null)}
                className="px-4 py-2 rounded-xl text-slate-600 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveQuickNote}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Guardar en Bitácora
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
