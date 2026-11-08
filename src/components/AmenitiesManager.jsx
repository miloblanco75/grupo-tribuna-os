import React, { useState } from 'react';
import { 
  Building2, 
  Film, 
  ShoppingBag, 
  Scissors, 
  Pill, 
  UtensilsCrossed, 
  Zap, 
  DollarSign, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  X, 
  Layers, 
  FileText,
  BadgePercent,
  TrendingUp,
  MapPin,
  HeartHandshake,
  Store
} from 'lucide-react';

export default function AmenitiesManager({ 
  amenities, 
  setAmenities, 
  projects 
}) {
  const [filterProject, setFilterProject] = useState('Todos');
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table'
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [selectedAmenityForPay, setSelectedAmenityForPay] = useState(null);
  const [payReceiptNote, setPayReceiptNote] = useState('');

  // Form states para nuevo local / amenidad
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || 'prj-motul');
  const [formSpaceCode, setFormSpaceCode] = useState('Local D-1');
  const [formCategory, setFormCategory] = useState('Farmacia');
  const [formTitle, setFormTitle] = useState('');
  const [formTenantName, setFormTenantName] = useState('');
  const [formTenantContact, setFormTenantContact] = useState('');
  const [formAreaSqm, setFormAreaSqm] = useState(45);
  const [formRentalModel, setFormRentalModel] = useState('Renta Fija Mensual');
  const [formMonthlyRent, setFormMonthlyRent] = useState('');
  const [formRevSharePct, setFormRevSharePct] = useState(20);
  const [formStatus, setFormStatus] = useState('En Negociacion');
  const [formNotes, setFormNotes] = useState('');
  const [formSocialImpact, setFormSocialImpact] = useState('');

  // Cálculos Financieros Globales de Amenidades
  const totalSpaces = amenities.length;
  const occupiedSpaces = amenities.filter(a => a.status === 'Operando' || a.status === 'Contrato Firmado').length;
  const inNegotiationSpaces = amenities.filter(a => a.status === 'En Negociacion' || a.status === 'En Adecuacion').length;
  const availableSpaces = amenities.filter(a => a.status === 'Disponible').length;
  const occupancyRate = totalSpaces > 0 ? Math.round((occupiedSpaces / totalSpaces) * 100) : 0;

  // Ingreso total mensual por rentas fijas y estimadas
  const totalMonthlyRentalIncome = amenities.reduce((acc, a) => acc + (a.monthlyRent || 0), 0);
  const totalSqmManaged = amenities.reduce((acc, a) => acc + (a.areaSqm || 0), 0);

  // Cinepolis stats
  const cinepolisSpaces = amenities.filter(a => a.category === 'Cinépolis Mini-Sala');

  // Filtrado de Amenidades
  const filteredAmenities = amenities.filter(amenity => {
    if (filterProject !== 'Todos' && amenity.projectId !== filterProject) return false;
    if (filterCategory !== 'Todos' && amenity.category !== filterCategory) return false;
    if (filterStatus !== 'Todos' && amenity.status !== filterStatus) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const match = (
        amenity.title.toLowerCase() + 
        amenity.tenantName.toLowerCase() + 
        amenity.spaceCode.toLowerCase() + 
        amenity.category.toLowerCase() +
        amenity.projectName.toLowerCase() +
        (amenity.notes || '').toLowerCase()
      );
      if (!match.includes(q)) return false;
    }
    return true;
  });

  // Cambiar estatus de pago o cobrar renta
  const handleRegisterRentPayment = () => {
    if (!selectedAmenityForPay) return;
    setAmenities(prev => prev.map(a => {
      if (a.id !== selectedAmenityForPay.id) return a;
      return {
        ...a,
        paymentStatus: 'Al Día',
        lastPaymentDate: new Date().toISOString().split('T')[0],
        notes: payReceiptNote.trim() ? `${a.notes} | Pago recibido: ${payReceiptNote.trim()}` : a.notes
      };
    }));
    setSelectedAmenityForPay(null);
    setPayReceiptNote('');
  };

  // Crear nuevo espacio / local
  const handleCreateAmenity = (e) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === formProjectId);
    const newAmenity = {
      id: `am-${Date.now()}`,
      projectId: formProjectId,
      projectName: proj ? proj.name : 'Electrolinera Villacorp',
      state: proj?.location.includes('Chihuahua') ? 'Chihuahua' : proj?.location.includes('Cancún') ? 'Quintana Roo' : 'Yucatán',
      spaceCode: formSpaceCode,
      category: formCategory,
      title: formTitle || `${formCategory} ${formSpaceCode}`,
      tenantName: formTenantName || 'Inquilino por Asignar',
      tenantContact: formTenantContact || 'Contacto Comercial',
      areaSqm: parseFloat(formAreaSqm) || 40,
      rentalModel: formRentalModel,
      monthlyRent: parseFloat(formMonthlyRent) || 15000,
      revenueSharePct: formRentalModel.includes('Revenue') ? parseFloat(formRevSharePct) || 20 : null,
      contractStart: new Date().toISOString().split('T')[0],
      contractEnd: '2029-12-31',
      status: formStatus,
      paymentStatus: 'Por Facturar',
      notes: formNotes,
      socialImpact: formSocialImpact
    };

    setAmenities(prev => [newAmenity, ...prev]);
    setShowAddModal(false);
    setFormTitle('');
    setFormTenantName('');
    setFormTenantContact('');
    setFormMonthlyRent('');
    setFormNotes('');
    setFormSocialImpact('');
  };

  // Generar reporte de rentas para WhatsApp
  const handleCopyRentReport = () => {
    let text = `*🏪 VILLACORP - REPORTE DE AMENIDADES & RENTAS DE LOCALES*\n`;
    text += `_Gestión de Locales Satélite en Electrolineras_\n`;
    text += `*Flujo Mensual de Rentas:* $${totalMonthlyRentalIncome.toLocaleString()} MXN / mes\n`;
    text += `*Ocupación Comercial:* ${occupancyRate}% (${occupiedSpaces}/${totalSpaces} espacios ocupados o firmados)\n`;
    text += `*Espacios en Negociación:* ${inNegotiationSpaces} | *Disponibles:* ${availableSpaces}\n`;
    text += `*Superficie Comercial Total:* ${totalSqmManaged} m²\n\n`;

    text += `*🎬 ALIANZA CINÉPOLIS (MINI-SALAS COMUNITARIAS):*\n`;
    cinepolisSpaces.forEach(c => {
      text += `• *${c.projectName}* (${c.spaceCode}): ${c.title}\n`;
      text += `  Estatus: ${c.status} | Modelo: ${c.rentalModel} | Proyección mensual: $${c.monthlyRent.toLocaleString()} MXN\n`;
      text += `  Impacto: ${c.socialImpact}\n\n`;
    });

    text += `*RESUMEN POR LOCALES Y GIROS:*\n`;
    amenities.forEach(a => {
      const statusIcon = a.status === 'Operando' ? '🟢' : a.status === 'Contrato Firmado' ? '🔵' : a.status === 'En Adecuacion' ? '🟡' : a.status === 'En Negociacion' ? '🟣' : '⚪';
      text += `${statusIcon} *${a.spaceCode}* - ${a.category}: ${a.title} ($${a.monthlyRent.toLocaleString()} MXN) - ${a.tenantName} (${a.projectName})\n`;
    });

    text += `\n_Villacorp Management OS - Expansión Comercial y Ocupación._`;
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  // Helper iconos de categoría
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Cinépolis Mini-Sala':
        return { icon: <Film className="w-4 h-4 text-amber-500" />, badge: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'Farmacia':
        return { icon: <Pill className="w-4 h-4 text-emerald-600" />, badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'Barbería':
        return { icon: <Scissors className="w-4 h-4 text-blue-600" />, badge: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'Abarrotes & Minisuper':
        return { icon: <ShoppingBag className="w-4 h-4 text-orange-600" />, badge: 'bg-orange-100 text-orange-900 border-orange-300' };
      case 'Restaurante / Gourmet':
        return { icon: <UtensilsCrossed className="w-4 h-4 text-pink-600" />, badge: 'bg-pink-100 text-pink-900 border-pink-300' };
      case 'Cargadores EV':
        return { icon: <Zap className="w-4 h-4 text-teal-600" />, badge: 'bg-teal-100 text-teal-900 border-teal-300' };
      default:
        return { icon: <Store className="w-4 h-4 text-slate-600" />, badge: 'bg-slate-100 text-slate-900 border-slate-300' };
    }
  };

  // Helper estatus colores
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Operando':
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: '🟢', label: 'Operando & Cobrando' };
      case 'Contrato Firmado':
        return { bg: 'bg-blue-100 text-blue-800 border-blue-300', icon: '🔵', label: 'Contrato Firmado' };
      case 'En Adecuacion':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-300', icon: '🟡', label: 'En Adecuación / Obra' };
      case 'En Negociacion':
        return { bg: 'bg-purple-100 text-purple-800 border-purple-300', icon: '🟣', label: 'En Negociación' };
      case 'Disponible':
      default:
        return { bg: 'bg-slate-100 text-slate-700 border-slate-300', icon: '⚪', label: 'Local Disponible' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER PRINCIPAL */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/60 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black text-sm">
              🏪
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              Tenant Mix & Rentas de Locales
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Gestor de Amenidades & Rentas Comerciales
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Control de locales satélite en cada electrolinera: <strong>Mini-Salas Cinépolis Comunitarias</strong>, <strong>Farmacias</strong>, <strong>Barberías</strong>, <strong>Minisuper</strong> y <strong>Restaurantes</strong> (como el concepto Rosa & Blanco de Motul). Maximiza el flujo de rentas y el tiempo de permanencia durante la recarga de autos.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-900/40 transition-transform active:scale-95 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Local / Amenidad</span>
          </button>

          <button
            onClick={handleCopyRentReport}
            className={`font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 ${
              copiedReport 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
            title="Copiar reporte completo de rentas y Cinépolis para WhatsApp"
          >
            {copiedReport ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedReport ? '¡Reporte Copiado!' : 'Reporte WhatsApp'}</span>
          </button>
        </div>
      </div>

      {/* METRICAS FINANCIERAS DE ALTO IMPACTO */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Flujo Mensual por Rentas */}
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-4 rounded-2xl shadow-md border border-emerald-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Flujo Rentas Mes</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ${totalMonthlyRentalIncome.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-200 font-semibold mt-1">
            MXN facturado / proyectado
          </div>
        </div>

        {/* Ocupación Comercial */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ocupación</span>
            <span className="w-3 h-3 rounded-full bg-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{occupancyRate}%</div>
          <div className="text-[10px] text-blue-700 font-semibold mt-1">
            {occupiedSpaces} de {totalSpaces} espacios colocados
          </div>
        </div>

        {/* En Negociación / Adecuación */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">En Negociación</span>
            <span className="w-3 h-3 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{inNegotiationSpaces}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">
            Pláticas o adecuación física
          </div>
        </div>

        {/* Locales Disponibles */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Disponibles</span>
            <span className="w-3 h-3 rounded-full bg-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-900">{availableSpaces}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">
            Listos para recibir marcas
          </div>
        </div>

        {/* Superficie Comercial */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Superficie Total</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalSqmManaged} <span className="text-sm font-normal text-slate-400">m²</span></div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">
            Área rentable en electrolineras
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* SECCIÓN ESPECIAL DESTACADA: ALIANZA CINÉPOLIS COMUNITARIO */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-300 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-black text-sm">
                🎬
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                Alianza Estratégica: Mini-Salas Cinépolis Comunitarias
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Cine de Primer Nivel en Comunidades Alejadas
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Villacorp gestiona ante <strong>Cinépolis México</strong> la instalación de mini-salas de cine (35 a 55 butacas con proyección láser digital y audio envolvente) dentro de las electrolineras. Esto permite a los habitantes de comunidades como <strong>Motul</strong> y comisarías periféricas disfrutar la experiencia Cinépolis de estreno sin tener que trasladarse 1 a 2 horas a las grandes capitales, generando además flujo constante de dulcería, taquilla y comensales para el restaurante gourmet y los abarrotes.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between space-y-2 min-w-[240px]">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mini-Salas en Gestión</div>
            <div className="text-2xl font-black text-amber-600">{cinepolisSpaces.length} salas proyectadas</div>
            <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span>• Motul (40 butacas):</span>
                <strong className="text-purple-700">En Negociación</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>• Mérida Periférico:</span>
                <strong className="text-purple-700">En Negociación</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>• Campeche Puerto:</span>
                <strong className="text-slate-600">Prospección</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS Y CONTROL DE VISTA */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Toggle de Vistas */}
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
            <span>Tarjetas de Locales ({filteredAmenities.length})</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'table' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Matriz de Rentas & Cobros</span>
          </button>
        </div>

        {/* Filtros Dropdowns y Buscador */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Sucursal / Hub */}
          <select
            value={filterProject}
            onChange={e => setFilterProject(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="Todos">📍 Todas las Electrolineras</option>
            <option value="prj-motul">🌸 Electrolinera Motul</option>
            <option value="prj-electrolineras">⚡ Hub Periférico Mérida / Red</option>
          </select>

          {/* Categoría / Giro */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="Todos">🛍️ Todos los Giros</option>
            <option value="Cinépolis Mini-Sala">🎬 Cinépolis Mini-Salas</option>
            <option value="Farmacia">💊 Farmacias</option>
            <option value="Barbería">💈 Barberías</option>
            <option value="Abarrotes & Minisuper">🏪 Abarrotes & Minisuper</option>
            <option value="Restaurante / Gourmet">🍽️ Restaurantes / Gourmet</option>
            <option value="Cargadores EV">⚡ Cargadores EV</option>
          </select>

          {/* Estatus */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="Todos">🚦 Todos los Estatus</option>
            <option value="Operando">🟢 Operando & Cobrando</option>
            <option value="Contrato Firmado">🔵 Contrato Firmado</option>
            <option value="En Adecuacion">🟡 En Adecuación</option>
            <option value="En Negociacion">🟣 En Negociación</option>
            <option value="Disponible">⚪ Local Disponible</option>
          </select>

          {/* Buscador */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar Cinépolis, Motul, farmacia..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {(filterProject !== 'Todos' || filterCategory !== 'Todos' || filterStatus !== 'Todos' || searchTerm !== '') && (
            <button
              onClick={() => {
                setFilterProject('Todos');
                setFilterCategory('Todos');
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
      {/* VISTA 1: TARJETAS DE LOCALES (TENANT CARDS)               */}
      {/* ========================================================= */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAmenities.map(amenity => {
            const catCfg = getCategoryIcon(amenity.category);
            const statusCfg = getStatusBadge(amenity.status);
            const isCinepolis = amenity.category === 'Cinépolis Mini-Sala';

            return (
              <div
                key={amenity.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 ${
                  isCinepolis 
                    ? 'border-amber-300 ring-2 ring-amber-100 bg-amber-50/20' 
                    : amenity.category === 'Restaurante / Gourmet'
                      ? 'border-pink-200 bg-pink-50/15'
                      : 'border-slate-200'
                }`}
              >
                <div>
                  
                  {/* Encabezado: Código de Local y Giro */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded-md">
                        {amenity.spaceCode}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center space-x-1 ${catCfg.badge}`}>
                        {catCfg.icon}
                        <span>{amenity.category}</span>
                      </span>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusCfg.bg}`}>
                      {statusCfg.icon} {amenity.status}
                    </span>
                  </div>

                  {/* Nombre y Estación */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      📍 {amenity.projectName} ({amenity.state})
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {amenity.title}
                    </h4>
                  </div>

                  {/* Inquilino y Datos del Contrato */}
                  <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Inquilino / Marca:</span>
                      <span className="font-bold text-slate-800 text-right truncate max-w-[160px]" title={amenity.tenantName}>
                        {amenity.tenantName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Superficie:</span>
                      <span className="font-semibold text-slate-700">{amenity.areaSqm} m²</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Modelo de Cobro:</span>
                      <span className="font-semibold text-slate-800">{amenity.rentalModel}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                      <span className="font-bold text-slate-700">Renta Mensual:</span>
                      <span className="font-black text-slate-900 text-sm">
                        ${amenity.monthlyRent.toLocaleString()} MXN
                      </span>
                    </div>

                    {amenity.revenueSharePct && (
                      <div className="flex items-center justify-between text-[10px] text-amber-800 bg-amber-100/70 p-1.5 rounded-lg font-bold">
                        <span>Taquilla & Dulcería Cinépolis:</span>
                        <span>{amenity.revenueSharePct}% para Villacorp</span>
                      </div>
                    )}
                  </div>

                  {/* Impacto Comunitario / Notas */}
                  {amenity.socialImpact && (
                    <div className="mt-2.5 p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-[11px] leading-relaxed">
                      <strong>🎯 Impacto Social:</strong> {amenity.socialImpact}
                    </div>
                  )}

                  {amenity.notes && (
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed italic">
                      "{amenity.notes}"
                    </p>
                  )}

                </div>

                {/* Pie de Ficha: Estado de Pago y Botón de Cobro */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Estatus de Pago:</span>
                    <span className={`text-xs font-black ${amenity.paymentStatus === 'Al Día' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {amenity.paymentStatus === 'Al Día' ? '✓ Al Día (Noviembre)' : '⏳ Pendiente de Cobro'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAmenityForPay(amenity);
                      setPayReceiptNote('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
                  >
                    Registrar Cobro
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* VISTA 2: MATRIZ DE RENTAS & COBROS (P&L INMOBILIARIO)    */}
      {/* ========================================================= */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Matriz de Arrendamientos Comerciales por Estación
              </h3>
              <p className="text-xs text-slate-500">
                Control de contratos, m², renta pactada y corte de caja mensual de cada amenidad.
              </p>
            </div>
            <div className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl">
              Flujo Total: ${totalMonthlyRentalIncome.toLocaleString()} MXN/mes
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4">Local</th>
                  <th className="py-3 px-3">Estación / Hub</th>
                  <th className="py-3 px-3">Giro / Concepto</th>
                  <th className="py-3 px-3">Inquilino / Marca</th>
                  <th className="py-3 px-3 text-center">m²</th>
                  <th className="py-3 px-3 text-right">Renta Mensual</th>
                  <th className="py-3 px-3 text-center">Estatus</th>
                  <th className="py-3 px-3 text-center">Pago Mes</th>
                  <th className="py-3 px-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAmenities.map(item => {
                  const statusCfg = getStatusBadge(item.status);
                  const catCfg = getCategoryIcon(item.category);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {item.spaceCode}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {item.projectName}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md font-bold text-[10px] border ${catCfg.badge}`}>
                          {catCfg.icon}
                          <span>{item.category}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {item.tenantName}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-600">
                        {item.areaSqm} m²
                      </td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">
                        ${item.monthlyRent.toLocaleString()} MXN
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusCfg.bg}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        <span className={`text-[11px] ${item.paymentStatus === 'Al Día' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {item.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedAmenityForPay(item);
                            setPayReceiptNote('');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px]"
                        >
                          Cobrar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AGREGAR NUEVO LOCAL / AMENIDAD                     */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div className="flex items-center space-x-3">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  🏪
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Agregar Local Comercial / Amenidad</h3>
                  <p className="text-xs text-slate-500">Expansión del Tenant Mix en Electrolineras</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAmenity} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Electrolinera / Hub</label>
                  <select
                    value={formProjectId}
                    onChange={e => setFormProjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-slate-50"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Código de Espacio</label>
                  <input
                    type="text"
                    required
                    value={formSpaceCode}
                    onChange={e => setFormSpaceCode(e.target.value)}
                    placeholder="Ej. Local A-3, Sala Cine-2..."
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Giro de Amenidad</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                  >
                    <option value="Cinépolis Mini-Sala">🎬 Cinépolis Mini-Sala</option>
                    <option value="Farmacia">💊 Farmacia</option>
                    <option value="Barbería">💈 Barbería & Grooming</option>
                    <option value="Abarrotes & Minisuper">🏪 Abarrotes & Minisuper</option>
                    <option value="Restaurante / Gourmet">🍽️ Restaurante / Gourmet</option>
                    <option value="Cargadores EV">⚡ Cargadores EV</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Estatus del Espacio</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                  >
                    <option value="En Negociacion">🟣 En Negociación</option>
                    <option value="Contrato Firmado">🔵 Contrato Firmado</option>
                    <option value="En Adecuacion">🟡 En Adecuación / Obra</option>
                    <option value="Operando">🟢 Operando & Cobrando</option>
                    <option value="Disponible">⚪ Local Disponible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Título Descriptivo del Local</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="Ej. Farmacia 24H con Consultorio, Mini-Sala Cinépolis..."
                  className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Inquilino / Nombre de la Marca</label>
                  <input
                    type="text"
                    required
                    value={formTenantName}
                    onChange={e => setFormTenantName(e.target.value)}
                    placeholder="Ej. Cinépolis México, Farmacias Similares..."
                    className="w-full px-3 py-2 rounded-xl border text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Contacto del Arrendatario</label>
                  <input
                    type="text"
                    value={formTenantContact}
                    onChange={e => setFormTenantContact(e.target.value)}
                    placeholder="Ej. Lic. Fernando Ortiz (+52 55...)"
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Superficie (m²)</label>
                  <input
                    type="number"
                    required
                    value={formAreaSqm}
                    onChange={e => setFormAreaSqm(e.target.value)}
                    placeholder="45"
                    className="w-full px-3 py-2 rounded-xl border text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Modelo de Cobro</label>
                  <select
                    value={formRentalModel}
                    onChange={e => setFormRentalModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-semibold"
                  >
                    <option value="Renta Fija Mensual">Renta Fija Mensual</option>
                    <option value="Revenue Share (% Taquilla & Dulcería)">Revenue Share (%)</option>
                    <option value="Operación Propia (Utilidad Neta)">Operación Propia</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Renta Mensual ($ MXN)</label>
                  <input
                    type="number"
                    required
                    value={formMonthlyRent}
                    onChange={e => setFormMonthlyRent(e.target.value)}
                    placeholder="18000"
                    className="w-full px-3 py-2 rounded-xl border text-xs font-black text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Impacto Comunitario / Social</label>
                <input
                  type="text"
                  value={formSocialImpact}
                  onChange={e => setFormSocialImpact(e.target.value)}
                  placeholder="Ej. Entretenimiento para 15,000 habitantes de Motul sin cine..."
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Notas Técnicas / Acuerdos</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Periodo de gracia, especificaciones eléctricas, ductería..."
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
                  Guardar Local
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REGISTRAR COBRO DE RENTA                           */}
      {/* ========================================================= */}
      {selectedAmenityForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Registrar Cobro de Renta Mensual
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              {selectedAmenityForPay.title} · <strong className="text-slate-800">{selectedAmenityForPay.spaceCode}</strong>
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border mb-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Inquilino:</span>
                <span className="font-bold text-slate-900">{selectedAmenityForPay.tenantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monto Mensual:</span>
                <span className="font-black text-emerald-700 text-sm">${selectedAmenityForPay.monthlyRent.toLocaleString()} MXN</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Nota de Recibo / Folio Transferencia</label>
              <textarea
                rows={2}
                value={payReceiptNote}
                onChange={e => setPayReceiptNote(e.target.value)}
                placeholder="Ej. Transferencia BBVA recibida, corte noviembre al día..."
                className="w-full p-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-slate-900 mb-4"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedAmenityForPay(null)}
                className="px-4 py-2 rounded-xl text-slate-600 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleRegisterRentPayment}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                Confirmar Cobro
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
