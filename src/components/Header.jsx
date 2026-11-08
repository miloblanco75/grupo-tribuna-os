import React from 'react';
import { 
  Building2, 
  UserCheck, 
  FileText, 
  Bell, 
  ShieldCheck, 
  Car, 
  MessageSquare,
  Sparkles,
  LogOut,
  DollarSign,
  Receipt
} from 'lucide-react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  activeEmployee, 
  setActiveEmployee, 
  onOpenReportModal,
  pendingTasksCount,
  onOpenMotul,
  onOpenInstallModal
}) {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-md shadow-red-900/40 font-black text-xl tracking-wider text-white">
              GT
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">GRUPO TRIBUNA</span>
                <span className="text-xs bg-red-500/20 text-red-300 font-semibold px-2 py-0.5 rounded-full border border-red-500/30">
                  Logística & Business OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Envíos Esferas Chignahuapan (Castores) · Electrolineras · Motul Rosa & Blanco · Inversiones
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Install PWA App Button */}
            <button
              onClick={onOpenInstallModal}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-xs sm:text-sm border border-red-400/40 animate-pulse"
              title="Instalar ícono en pantalla de inicio de tu celular"
            >
              <span>📲</span>
              <span className="hidden sm:inline">Instalar App</span>
              <span className="sm:hidden">App</span>
            </button>
            
            {/* Acceso Directo a Motul */}
            <button
              onClick={onOpenMotul}
              className="hidden lg:flex items-center space-x-1.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold px-3 py-2 rounded-xl shadow-md text-xs transition-transform active:scale-95 border border-pink-400/40"
              title="Abrir directamente Electrolinera & Gourmet Rosa Motul"
            >
              <span>🌸</span>
              <span>Motul Rosa & Blanco</span>
            </button>

            {/* Quick Report Button */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-md transition-all transform active:scale-95 text-xs sm:text-sm"
              title="Generar reporte ejecutivo de avances"
            >
              <FileText className="w-4 h-4" />
              <span>Reporte</span>
            </button>

            {/* Employee Portal Switch */}
            {activeEmployee ? (
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2">
                <span className="text-base mr-2">{activeEmployee.avatar}</span>
                <div className="text-left mr-2 hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight">{activeEmployee.name}</div>
                  <div className="text-[10px] text-emerald-400">{activeEmployee.role}</div>
                </div>
                <button
                  onClick={() => setActiveEmployee(null)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                  title="Cerrar sesión de colaborador"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab('portal')}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all border ${
                  currentTab === 'portal'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Portal Colaborador (PIN)</span>
                <span className="sm:hidden">Entrar PIN</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800/80 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              currentTab === 'dashboard'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>📊 Dashboard General</span>
          </button>

          <button
            onClick={() => setCurrentTab('chignahuapan')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              currentTab === 'chignahuapan'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-black shadow-md shadow-red-900/40 border border-red-500'
                : 'bg-red-950/40 text-amber-300 hover:text-white hover:bg-red-900/40 border border-red-800/40 font-bold'
            }`}
          >
            <span>🎄 Envíos Chignahuapan</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              Castores
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('projects')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              currentTab === 'projects'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🏗️ Proyectos & Checklists</span>
            {pendingTasksCount > 0 && (
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingTasksCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('export')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              currentTab === 'export'
                ? 'bg-indigo-500/30 text-indigo-200 font-bold border border-indigo-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🇪🇺 Catálogo Europa</span>
            <span className="bg-indigo-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              Export
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              currentTab === 'pipeline'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🚀 Pipeline Expansión</span>
            <span className="bg-blue-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              Nacional
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('permits')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              currentTab === 'permits'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Permisología Multigobierno</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              CFE/CRE
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('amenities')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              currentTab === 'amenities'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🏪 Amenidades & Cinépolis</span>
            <span className="bg-purple-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              Rentas
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('payroll')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              currentTab === 'payroll'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nómina & Insumos</span>
          </button>

          <button
            onClick={() => setCurrentTab('uber')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              currentTab === 'uber'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-blue-400" />
            <span>Vehículo / Uber Mérida</span>
          </button>

          <button
            onClick={() => setCurrentTab('messages')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              currentTab === 'messages'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Mensajes & Avisos</span>
          </button>

          <button
            onClick={() => setCurrentTab('portal')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              currentTab === 'portal'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Asignaciones con PIN</span>
          </button>
        </div>
      </div>
    </header>
  );
}
