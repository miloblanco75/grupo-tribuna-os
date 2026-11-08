import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Zap, 
  Film, 
  Utensils, 
  Car, 
  Sparkles, 
  Landmark, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  Receipt,
  Layers,
  FolderOpen
} from 'lucide-react';

export default function DashboardOverview({ 
  projects, 
  uberData, 
  permits = [],
  amenities = [],
  pipeline = [],
  onSelectProject, 
  onOpenReportModal,
  setCurrentTab 
}) {
  const totalTasks = projects.reduce((acc, p) => acc + p.checklists.length, 0);
  const completedTasks = projects.reduce((acc, p) => acc + p.checklists.filter(c => c.completed).length, 0);
  const globalProgress = Math.round((completedTasks / totalTasks) * 100);

  // Filtro de trámites por nivel de gobierno en Electrolineras
  const evProject = projects.find(p => p.id === 'prj-electrolineras');
  const federalTasks = evProject?.checklists.filter(c => c.category === 'Gobierno Federal') || [];
  const stateTasks = evProject?.checklists.filter(c => c.category === 'Gobierno Estatal') || [];
  const municipalTasks = evProject?.checklists.filter(c => c.category === 'Gobierno Municipal') || [];

  const motulProject = projects.find(p => p.id === 'prj-motul');

  return (
    <div className="space-y-6">
      
      {/* Banner de Bienvenida y Acción Rápida */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-semibold border border-red-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consorcio Empresarial Grupo Tribuna</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Control Integral de Negocios, Logística & Proyectos
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Supervisión de la <strong>División Envíos Chignahuapan (Esferas Navideñas & Castores)</strong>, la <strong>Electrolinera & Gourmet Rosa de Motul</strong>, tierras en Chihuahua, red de estaciones con Cinépolis, cocina económica de menús rendidores a $110 y catálogo de exportación a Europa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentTab('chignahuapan')}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black px-4 py-3 rounded-xl shadow-lg transition-transform active:scale-95 text-xs sm:text-sm flex items-center space-x-2"
            >
              <span>🎄 Envíos Chignahuapan</span>
            </button>
            <button
              onClick={onOpenReportModal}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-lg transition-transform active:scale-95 text-xs sm:text-sm flex items-center space-x-2"
            >
              <span>📄 Reporte</span>
            </button>
            <button
              onClick={() => setCurrentTab('pipeline')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-colors flex items-center space-x-1.5"
            >
              <span>🚀 Pipeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* TARJETA DESTACADA: DIVISIÓN ENVÍOS CHIGNAHUAPAN & ALIANZA CASTORES */}
      <div 
        onClick={() => setCurrentTab('chignahuapan')}
        className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 rounded-2xl p-6 text-white shadow-xl shadow-red-950/30 cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden group border border-red-800/40"
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 text-9xl font-black pointer-events-none">
          📦
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                🎄 NUEVA DIVISIÓN · CHIGNAHUAPAN, PUEBLA
              </span>
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                Alianza Oficial Castores (22% OFF)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Logística de Esferas Navideñas: Acopio, Embalaje Frágil & Fletes Nacionales
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Bodega Hub en Chignahuapan con capacidad para 1,800 cajas. Recolección en talleres de artesanos, embalaje de alta amortiguación, conexión troncal a terminal Castores Puebla y dispersión en todo México.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl text-center border border-white/20">
              <span className="text-[10px] text-amber-300 uppercase font-bold block">Bodega Chignahuapan</span>
              <span className="text-sm font-black text-white">485 Cajas Acopiadas</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* TARJETA DESTACADA: ELECTROLINERA & GOURMET MOTUL */}
      {motulProject && (
        <div 
          onClick={() => {
            onSelectProject('prj-motul');
            setCurrentTab('projects');
          }}
          className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl shadow-pink-500/15 cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden group"
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 text-9xl font-black pointer-events-none">
            EV
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="bg-white text-pink-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  🌸 PROYECTO INSIGNIA MOTUL
                </span>
                <span className="text-pink-100 text-xs font-semibold">
                  Avance: {motulProject.progress}%
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Electrolinera & Negocio Gourmet (Rosa & Blanco Instagrameable)
              </h2>
              <p className="text-pink-100 text-xs sm:text-sm leading-relaxed">
                Estación de recarga para autos eléctricos + local gastronómico (Sushi fresco o Tortas estilo La María Elena de Mérida). Con expediente de planos arquitectónicos y licencia municipal de Motul.
              </p>
            </div>

            <div className="flex items-center space-x-3 self-start md:self-auto">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/30">
                <span className="text-[10px] text-pink-100 uppercase font-bold block">Expediente</span>
                <span className="text-sm font-black">{motulProject.documents?.length || 4} Planos y Permisos</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white text-pink-600 flex items-center justify-center font-bold shadow-md group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner Tenant Mix & Cinépolis en Dashboard */}
      <div 
        onClick={() => setCurrentTab('amenities')}
        className="bg-gradient-to-r from-amber-50 via-white to-amber-50/40 border border-amber-300 rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-xs">
            🎬
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                Amenidades & Tenant Mix
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {amenities.length} locales en 4 hubs
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">
              Alianza Cinépolis Comunitario, Farmacias, Barberías & Minisuper
            </h3>
            <p className="text-xs text-slate-600">
              Flujo mensual proyectado de <strong>${amenities.reduce((acc, a) => acc + (a.monthlyRent || 0), 0).toLocaleString()} MXN/mes</strong> en rentas satélite.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 self-end sm:self-auto group-hover:translate-x-1 transition-transform">
          <span>Ver locales & rentas</span>
          <ChevronRight className="w-4 h-4 text-amber-600" />
        </div>
      </div>

      {/* Banner Catálogo de Exportación a Europa */}
      <div 
        onClick={() => setCurrentTab('export')}
        className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-700/50 rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md border border-indigo-400/40">
            🇪🇺
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-800/80 px-2 py-0.5 rounded-md border border-indigo-500/30">
                Villacorp Trade · Oferta Exportable
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                71 Muestras · TLCUEM EUR.1 Arancel 0%
              </span>
            </div>
            <h3 className="font-extrabold text-white text-sm mt-0.5">
              Catálogo de Productos para Europa & Directorio de Productores
            </h3>
            <p className="text-xs text-indigo-200/80">
              Mieles Don Cuco (Chignahuapan), Dulces Casa Esmeralda, Cacao Maya La Itzalana, Salsas La Anita y Esferas de Vidrio. Con teléfonos, direcciones y WhatsApp directo.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300 self-end sm:self-auto group-hover:translate-x-1 transition-transform">
          <span>Explorar catálogo UE</span>
          <ChevronRight className="w-4 h-4 text-indigo-400" />
        </div>
      </div>

      {/* Tarjetas de Métricas de Alto Impacto */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Avance Global</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{globalProgress}%</div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${globalProgress}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">{completedTasks} de {totalTasks} hitos completados</span>
        </div>

        <div 
          onClick={() => setCurrentTab('payroll')}
          className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Nómina del Personal</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            6 <span className="text-xs font-normal text-slate-500">colaboradores</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 inline text-emerald-600" />
            <span>Sueldos y comprobantes al día</span>
          </p>
        </div>

        <div 
          onClick={() => setCurrentTab('permits')}
          className="bg-white p-5 rounded-2xl border border-purple-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800">Semáforo Permisos</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {permits.length || 20} <span className="text-xs font-normal text-slate-500">trámites nacionales</span>
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-bold">
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              🟢 {permits.filter(p => p.status === 'Aprobado').length || 11}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
              🟡 {permits.filter(p => p.status === 'En Revision').length || 6}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
              🔴 {permits.filter(p => p.status === 'Observaciones').length || 2}
            </span>
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab('uber')}
          className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Unidad Uber Mérida</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ${uberData.currentMonthRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-500">MXN</span>
          </div>
          <p className="text-[11px] font-semibold mt-2 flex items-center space-x-1 text-slate-500">
            <CheckCircle2 className="w-3 h-3 inline text-blue-500" />
            <span>{uberData.currentMonthRevenue > 0 ? 'Paga renta de auto y chofer' : 'Lista para arrancar primer turno'}</span>
          </p>
        </div>

      </div>

      {/* Grid de Proyectos Villacorp */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Todos los Proyectos & Unidades de Negocio
          </h2>
          <span className="text-xs text-slate-500">Haz clic en cualquier proyecto para ver tareas y subir planos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const completedCount = project.checklists.filter(c => c.completed).length;
            const progress = Math.round((completedCount / project.checklists.length) * 100);

            let iconBadge = '🏗️';
            let cardAccent = 'hover:border-emerald-400';
            if (project.id === 'prj-motul') {
              iconBadge = '🌸';
              cardAccent = 'border-pink-300 hover:border-pink-500 bg-pink-50/20';
            }
            if (project.id === 'prj-chihuahua') iconBadge = '⚖️';
            if (project.id === 'prj-electrolineras') iconBadge = '⚡';
            if (project.id === 'prj-chicxulub') iconBadge = '🧖‍♀️';
            if (project.id === 'prj-cocina') iconBadge = '🍲';
            if (project.id === 'prj-uber') iconBadge = '🚗';

            return (
              <div
                key={project.id}
                onClick={() => {
                  onSelectProject(project.id);
                  setCurrentTab('projects');
                }}
                className={`bg-white rounded-2xl border p-5 cursor-pointer shadow-sm hover:shadow-md transition-all ${cardAccent} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                        {iconBadge}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {project.code}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                          {project.name}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {progress}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Target & Bottom Line Mini Pill */}
                  <div className="flex items-center justify-between text-[11px] bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 mb-3">
                    <span className="text-slate-500 font-medium">
                      🎯 Target: <strong className="text-slate-800">${(project.targetRevenue || 0).toLocaleString()}</strong>
                    </span>
                    <span className="text-amber-700 font-medium">
                      ⚖️ Min: <strong>${(project.breakEvenRevenue || 0).toLocaleString()}</strong>
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>{project.documents?.length || 0} planos/docs</span>
                  </div>
                  <div className="flex items-center space-x-1 font-semibold text-emerald-600">
                    <span>Ver expediente</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
