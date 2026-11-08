import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Clock, 
  User, 
  Calendar, 
  Tag, 
  Sparkles, 
  Building, 
  Landmark, 
  ShieldAlert, 
  Filter, 
  Search,
  Check,
  FileText,
  Upload,
  Download,
  FolderOpen,
  Image,
  Layers,
  ChevronRight,
  Target,
  Scale,
  TrendingUp
} from 'lucide-react';

export default function ProjectsManager({ 
  projects, 
  selectedProjectId, 
  onSelectProject, 
  onToggleTask, 
  onAddTask,
  onReassignTask,
  onAddDocument,
  collaborators 
}) {
  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const [currentView, setCurrentView] = useState('tasks'); // 'tasks' o 'documents'
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [filterAssignee, setFilterAssignee] = useState('Todos');

  // Modal para agregar tarea
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('General');
  const [newTaskAssignee, setNewTaskAssignee] = useState(collaborators[0]?.name || '');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Modal para subir planos / permisos / avances
  const [showDocModal, setShowDocModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Plano');
  const [docUploader, setDocUploader] = useState(collaborators[0]?.name || 'Dirección General');

  const categories = ['Todas', ...new Set(activeProject.checklists.map(c => c.category))];

  // Filtro combinado: por categoría y por responsable
  const filteredTasks = activeProject.checklists.filter(task => {
    const matchCategory = filterCategory === 'Todas' || task.category === filterCategory;
    const matchAssignee = filterAssignee === 'Todos' || task.assignedTo === filterAssignee || task.completedBy === filterAssignee;
    return matchCategory && matchAssignee;
  });

  const completedCount = activeProject.checklists.filter(c => c.completed).length;
  const progressPct = Math.round((completedCount / activeProject.checklists.length) * 100);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    onAddTask(activeProject.id, {
      id: `chk-custom-${Date.now()}`,
      text: newTaskText.trim(),
      category: newTaskCategory,
      completed: false,
      assignedTo: newTaskAssignee,
      dueDate: newTaskDueDate || '2026-11-30'
    });

    setNewTaskText('');
    setShowAddModal(false);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocName(e.target.files[0].name);
    }
  };

  const handleCreateDocument = (e) => {
    e.preventDefault();
    if (!docName.trim()) return;

    onAddDocument(activeProject.id, {
      id: `doc-${Date.now()}`,
      name: docName.trim(),
      type: docType,
      uploadedBy: docUploader,
      date: new Date().toISOString().split('T')[0],
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      url: '#'
    });

    setDocName('');
    setShowDocModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Selector de Proyectos con Destacado Especial para Motul */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto scrollbar-none">
        <div className="flex space-x-2 min-w-max">
          {projects.map(proj => {
            const isSelected = proj.id === activeProject.id;
            const isMotul = proj.id === 'prj-motul';

            return (
              <button
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj.id);
                  setFilterCategory('Todas');
                  setFilterAssignee('Todos');
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
                  isSelected 
                    ? isMotul 
                      ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/25' 
                      : 'bg-slate-900 text-white shadow-md'
                    : isMotul 
                      ? 'bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{proj.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isSelected 
                    ? 'bg-white text-slate-900' 
                    : isMotul 
                      ? 'bg-pink-200 text-pink-900' 
                      : 'bg-slate-300 text-slate-800'
                }`}>
                  {Math.round((proj.checklists.filter(c => c.completed).length / proj.checklists.length) * 100)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cabecera del Proyecto Seleccionado */}
      <div className={`rounded-2xl border p-6 shadow-sm space-y-4 ${
        activeProject.id === 'prj-motul' 
          ? 'bg-gradient-to-b from-white to-pink-50/40 border-pink-200' 
          : 'bg-white border-slate-200'
      }`}>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md ${
                activeProject.id === 'prj-motul' ? 'bg-pink-100 text-pink-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {activeProject.code}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                📍 {activeProject.location}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                👤 Líder: <strong>{activeProject.lead}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              {activeProject.name}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {activeProject.description}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-slate-200 flex items-center space-x-4 self-start md:self-auto min-w-[200px]">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avance de Proyecto</span>
              <div className="text-2xl font-black text-slate-900">{progressPct}%</div>
              <span className="text-xs text-slate-500">{completedCount} de {activeProject.checklists.length} completadas</span>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm ${
              activeProject.id === 'prj-motul' ? 'bg-pink-100 text-pink-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {progressPct}%
            </div>
          </div>
        </div>

        {/* Ficha Especial si es Motul */}
        {activeProject.id === 'prj-motul' && (
          <div className="bg-gradient-to-r from-pink-100/80 via-white to-pink-50 border border-pink-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📸</span>
              <div>
                <h4 className="text-xs font-black text-pink-900 uppercase tracking-wider">Concepto Gourmet Instagrameable: Motul</h4>
                <p className="text-xs text-pink-800">
                  Paleta <strong>Rosa Pastel & Blanco Marfil</strong> con luminarias aesthetic para fotos. Menú en evaluación: <strong>Sushi fresco</strong> o <strong>Tortas estilo La María Elena (Mérida)</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-pink-400 border-2 border-white shadow" title="Rosa Fachada" />
              <span className="w-6 h-6 rounded-full bg-pink-200 border-2 border-white shadow" title="Rosa Interiores" />
              <span className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 shadow" title="Blanco Marfil" />
            </div>
          </div>
        )}

        {/* Metas Financieras: Target & Bottom Line del Proyecto */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Target className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Mensual</span>
              <span className="text-sm font-black text-slate-900">${(activeProject.targetRevenue || 0).toLocaleString()} MXN</span>
              {activeProject.targetUnitKPI && (
                <span className="text-[10px] text-emerald-700 block line-clamp-1 font-semibold">{activeProject.targetUnitKPI}</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
            <span className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <Scale className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bottom Line (Break-Even)</span>
              <span className="text-sm font-black text-amber-800">${(activeProject.breakEvenRevenue || 0).toLocaleString()} MXN</span>
              {activeProject.breakEvenUnitKPI && (
                <span className="text-[10px] text-amber-700 block line-clamp-1 font-semibold">{activeProject.breakEvenUnitKPI}</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
            <span className="p-2 rounded-lg bg-purple-100 text-purple-800">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Utilidad Meta ({activeProject.targetMarginPct || 35}%)</span>
              <span className="text-sm font-black text-purple-900">${(activeProject.targetNetProfit || 0).toLocaleString()} MXN</span>
              <span className="text-[10px] text-slate-500 block">Renta base: ${(activeProject.monthlyRent || 0).toLocaleString()} MXN/mes</span>
            </div>
          </div>
        </div>

        {/* Botones de Vista: Tareas vs Expediente Digital (Planos y Permisos) */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('tasks')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                currentView === 'tasks'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tareas & Checklists ({activeProject.checklists.length})</span>
            </button>
            <button
              onClick={() => setCurrentView('documents')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                currentView === 'documents'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Planos, Permisos & Avances ({activeProject.documents?.length || 0})</span>
            </button>
          </div>

          {currentView === 'tasks' ? (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Tarea</span>
            </button>
          ) : (
            <button
              onClick={() => setShowDocModal(true)}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-md transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Plano / Permiso</span>
            </button>
          )}
        </div>

      </div>

      {/* VISTA 1: TAREAS Y CHECKLISTS CON ASIGNACIÓN DE RESPONSABLE */}
      {currentView === 'tasks' && (
        <div className="space-y-4">
          
          {/* Barra de Filtros: Por Categoría y por Responsable */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Categoría:</span>
              </span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    filterCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Filtro por Responsable */}
            <div className="flex items-center space-x-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-600">Responsable:</span>
              <select
                value={filterAssignee}
                onChange={e => setFilterAssignee(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Todos">Todos los responsables</option>
                {collaborators.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de Tareas */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                No hay tareas con los filtros seleccionados.
              </div>
            ) : (
              filteredTasks.map(task => {
                const isDone = task.completed;
                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      isDone 
                        ? 'border-emerald-200 bg-emerald-50/20' 
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5 flex-1">
                      <button 
                        onClick={() => onToggleTask(activeProject.id, task.id)}
                        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                          isDone 
                            ? 'bg-emerald-600 text-white shadow-sm' 
                            : 'border-2 border-slate-300 hover:border-slate-400 bg-white'
                        }`}
                      >
                        {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="space-y-1 flex-1">
                        <p className={`text-sm sm:text-base font-semibold leading-relaxed ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}>
                          {task.text}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium text-[11px]">
                            {task.category}
                          </span>

                          {task.dueDate && (
                            <span className="flex items-center space-x-1 text-slate-500 text-[11px]">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>Vence: {task.dueDate}</span>
                            </span>
                          )}

                          {isDone && task.completedAt && (
                            <span className="text-emerald-700 font-medium text-[11px]">
                              ✓ Realizado el {task.completedAt}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selector Directo para Asignar / Reasignar Responsable */}
                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <select
                          value={task.assignedTo || ''}
                          onChange={(e) => onReassignTask(activeProject.id, task.id, e.target.value)}
                          className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option value="">Sin asignar</option>
                          {collaborators.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isDone 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isDone ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* VISTA 2: EXPEDIENTE DIGITAL (PLANOS, PERMISOS & AVANCES) */}
      {currentView === 'documents' && (
        <div className="space-y-4">
          
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Expediente Digital de {activeProject.name}
              </h3>
              <p className="text-xs text-slate-500">
                Planos arquitectónicos, permisos CFE/CRE/Municipio, licencias y memorias de cálculo.
              </p>
            </div>

            <button
              onClick={() => setShowDocModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Nuevo Documento / Plano</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(activeProject.documents || []).map(doc => (
              <div key={doc.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      {doc.type === 'Plano' ? <Layers className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {doc.type}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                    {doc.name}
                  </h4>

                  <div className="text-[11px] text-slate-500 space-y-1 mt-2">
                    <div>Subido por: <strong>{doc.uploadedBy}</strong></div>
                    <div>Fecha: {doc.date} · {doc.size}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verificado</span>
                  </span>

                  <button 
                    onClick={() => alert(`Visualizando documento: ${doc.name}`)}
                    className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <span>Abrir Archivo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Modal para Crear Tarea */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Agregar Requerimiento a {activeProject.name}
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Descripción del Requerimiento / Tarea
                </label>
                <textarea
                  required
                  rows={3}
                  value={newTaskText}
                  onChange={e => setNewTaskText(e.target.value)}
                  placeholder="Ej. Realizar pruebas de menú con tortas María Elena..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Categoría
                  </label>
                  <select
                    value={newTaskCategory}
                    onChange={e => setNewTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Gobierno Federal">Gobierno Federal (CFE / CRE)</option>
                    <option value="Gobierno Estatal">Gobierno Estatal (MIA / Prot. Civil)</option>
                    <option value="Gobierno Municipal">Gobierno Municipal (Uso de Suelo)</option>
                    <option value="Terrenos">Terrenos & Arrendamiento</option>
                    <option value="Diseño">Diseño Rosa & Blanco</option>
                    <option value="Alianzas">Alianzas (Cinépolis)</option>
                    <option value="Gastronomía">Gastronomía</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Responsable Asignado
                  </label>
                  <select
                    value={newTaskAssignee}
                    onChange={e => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {collaborators.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Fecha Límite
                </label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={e => setNewTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Subir Planos / Permisos */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Subir Archivo al Expediente de {activeProject.name}
            </h3>

            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Tipo de Documento
                </label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                >
                  <option value="Plano">Plano Arquitectónico / Eléctrico</option>
                  <option value="Permiso">Permiso de Gobierno (CFE, CRE, Municipal)</option>
                  <option value="Diseño">Render 3D / Diseño Visual (Rosa & Blanco)</option>
                  <option value="Contrato">Contrato de Arrendamiento</option>
                  <option value="Avance">Foto / Bitácora de Avance de Obra</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Seleccionar Archivo (PDF, DWG, JPG, PNG)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 font-medium block">
                    {docName ? docName : 'Haz clic para seleccionar archivo desde tu dispositivo'}
                  </span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Nombre / Título del Archivo
                </label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  placeholder="Ej. Plano_Fachada_Rosa_Motul_Aprobado.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Responsable que Sube
                </label>
                <select
                  value={docUploader}
                  onChange={e => setDocUploader(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                >
                  {collaborators.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="Dirección General">Dirección General</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Guardar en Expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
