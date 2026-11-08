import React, { useState } from 'react';
import { 
  UserCheck, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Send, 
  LogOut, 
  AlertCircle, 
  KeyRound, 
  ChefHat, 
  Car, 
  Building, 
  Scale, 
  Sparkles,
  Check,
  Receipt,
  Upload,
  DollarSign
} from 'lucide-react';

export default function EmployeePortal({ 
  collaborators, 
  projects, 
  activeEmployee, 
  setActiveEmployee, 
  onToggleTask,
  onSendMessage,
  onAddSalesReport 
}) {
  const [selectedCollabId, setSelectedCollabId] = useState(collaborators[0]?.id || '');
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [reportNote, setReportNote] = useState('');
  const [selectedTaskForNote, setSelectedTaskForNote] = useState(null);
  const [successNotice, setSuccessNotice] = useState('');

  // Estados para reporte de ventas desde el portal
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [dailySalesAmount, setDailySalesAmount] = useState('');
  const [dailyOrdersCount, setDailyOrdersCount] = useState('');
  const [dailySaleFile, setDailySaleFile] = useState('');
  const [dailySaleNotes, setDailySaleNotes] = useState('');

  // Manejo de Login con PIN
  const handleLogin = (e) => {
    e?.preventDefault();
    setErrorMsg('');

    const targetEmployee = collaborators.find(c => c.id === selectedCollabId);
    if (!targetEmployee) {
      setErrorMsg('Selecciona un colaborador');
      return;
    }

    if (pinInput === targetEmployee.pin) {
      setActiveEmployee(targetEmployee);
      setPinInput('');
      setErrorMsg('');
    } else {
      setErrorMsg('PIN de acceso incorrecto. Inténtalo de nuevo.');
    }
  };

  const handleQuickPin = (num) => {
    if (pinInput.length < 4) {
      setPinInput(prev => prev + num);
    }
  };

  const handleClearPin = () => {
    setPinInput('');
  };

  // Si no hay colaborador activo, mostrar pantalla de inicio de sesión
  if (!activeEmployee) {
    return (
      <div className="max-w-md mx-auto my-6 sm:my-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl">
          
          <div className="text-center space-y-2 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <KeyRound className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Acceso de Colaborador</h2>
            <p className="text-xs text-slate-500">
              Ingresa con tu Nombre y tu PIN de 4 dígitos para consultar asignaciones y mandar notas de venta.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Selecciona tu Nombre / Cargo
              </label>
              <select
                value={selectedCollabId}
                onChange={e => setSelectedCollabId(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 font-semibold text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {collaborators.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.avatar} {c.name} — {c.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Ingresa tu PIN de 4 dígitos
              </label>
              <div className="flex justify-center items-center space-x-3 mb-3">
                {[0, 1, 2, 3].map(index => (
                  <div
                    key={index}
                    className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-black transition-all ${
                      pinInput.length > index
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 scale-105'
                        : 'border-slate-300 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {pinInput.length > index ? '●' : ''}
                  </div>
                ))}
              </div>

              {/* Teclado numérico táctil móvil */}
              <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleQuickPin(num.toString())}
                    className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-lg active:scale-95 transition-transform"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClearPin}
                  className="h-12 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs active:scale-95 transition-transform"
                >
                  Borrar
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPin('0')}
                  className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-lg active:scale-95 transition-transform"
                >
                  0
                </button>
                <button
                  type="submit"
                  className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs active:scale-95 transition-transform shadow-md"
                >
                  Entrar
                </button>
              </div>
            </div>
          </form>

          {/* Directorio de PINs */}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <details className="text-xs text-slate-500">
              <summary className="cursor-pointer font-bold text-emerald-700 hover:underline">
                🔑 Ver lista de PINs asignados (Directorio)
              </summary>
              <div className="mt-2 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {collaborators.map(c => (
                  <div key={c.id} className="flex justify-between items-center text-[11px]">
                    <span className="font-medium text-slate-700">{c.avatar} {c.name} ({c.role}):</span>
                    <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-emerald-700">
                      PIN: {c.pin}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </div>

        </div>
      </div>
    );
  }

  // Tareas asignadas al colaborador activo
  const myTasks = [];
  projects.forEach(project => {
    project.checklists.forEach(task => {
      if (task.assignedTo === activeEmployee.name || task.completedBy === activeEmployee.name) {
        myTasks.push({
          ...task,
          projectId: project.id,
          projectName: project.name
        });
      }
    });
  });

  const pendingTasks = myTasks.filter(t => !t.completed);
  const completedTasks = myTasks.filter(t => t.completed);

  const handleReportProgress = (e) => {
    e.preventDefault();
    if (!reportNote.trim() || !selectedTaskForNote) return;

    onSendMessage({
      id: `msg-${Date.now()}`,
      channel: selectedTaskForNote.projectName.includes('Cocina') ? 'Cocina Mérida (Menús Rendidores $110)' : 'General Grupo Tribuna',
      sender: activeEmployee.name,
      avatar: activeEmployee.avatar,
      text: `[REPORTE DE AVANCE - ${selectedTaskForNote.text}]: ${reportNote.trim()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: 'Alta'
    });

    setSuccessNotice(`Reporte enviado con éxito a Dirección General.`);
    setReportNote('');
    setSelectedTaskForNote(null);
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleSubmitDailySale = (e) => {
    e.preventDefault();
    if (!dailySalesAmount) return;

    let projId = 'prj-cocina';
    let projName = 'Cocina Económica Mérida';
    if (activeEmployee.id === 'col-2') {
      projId = 'prj-uber';
      projName = 'Control de Unidad & Uber Mérida';
    } else if (activeEmployee.id === 'col-6') {
      projId = 'prj-chicxulub';
      projName = 'Spa Holístico Chicxulub Puerto';
    }

    if (onAddSalesReport) {
      onAddSalesReport({
        id: `sale-${Date.now()}`,
        projectId: projId,
        projectName: projName,
        date: new Date().toISOString().split('T')[0],
        salesAmount: parseFloat(dailySalesAmount) || 0,
        ordersCount: parseInt(dailyOrdersCount) || 1,
        noteFile: dailySaleFile || `Nota_Corte_${activeEmployee.name.replace(/ /g, '_')}_${Date.now()}.jpg`,
        submittedBy: activeEmployee.name,
        period: 'Corte de Turno',
        notes: dailySaleNotes || 'Nota de venta final del turno enviada por empleado'
      });
    }

    onSendMessage({
      id: `msg-${Date.now()}`,
      channel: activeEmployee.id === 'col-1' ? 'Cocina Mérida (Menús Rendidores $110)' : 'General Villacorp',
      sender: activeEmployee.name,
      avatar: activeEmployee.avatar,
      text: `📢 [NOTA FINAL DE VENTA ENVIADA]: Se registraron ventas por $${parseFloat(dailySalesAmount).toLocaleString()} MXN (${dailyOrdersCount || '0'} órdenes). Comprobante adjuntado para cotejo de utilidades.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: 'Alta'
    });

    setSuccessNotice(`¡Nota Final de Venta enviada exitosamente para cotejo de utilidades!`);
    setDailySalesAmount('');
    setDailyOrdersCount('');
    setDailySaleFile('');
    setDailySaleNotes('');
    setShowSaleForm(false);
    setTimeout(() => setSuccessNotice(''), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Tarjeta de Perfil del Colaborador */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl">
            {activeEmployee.avatar}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                SESIÓN ACTIVA
              </span>
              <span className="text-xs text-slate-400">{activeEmployee.department}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1">{activeEmployee.name}</h1>
            <p className="text-xs text-emerald-400 font-semibold">{activeEmployee.role}</p>
          </div>
        </div>

        <button
          onClick={() => setActiveEmployee(null)}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {successNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-sm">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* BOTÓN / SECCIÓN PARA MANDAR NOTA FINAL DE VENTA DEL DÍA */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-5 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-black bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            🧾 CORTE DE CAJA DIARIO
          </span>
          <h2 className="text-lg font-black">
            Mandar Nota Final de Venta del Turno
          </h2>
          <p className="text-emerald-100 text-xs max-w-lg">
            Sube el total de ventas de hoy y la foto del ticket/corte Z para que Dirección General coteje las utilidades contra compras y renta.
          </p>
        </div>

        <button
          onClick={() => setShowSaleForm(!showSaleForm)}
          className="bg-slate-950 hover:bg-slate-900 text-white font-black px-5 py-3 rounded-2xl text-xs shadow-md transition-transform active:scale-95 flex items-center space-x-2 self-start sm:self-auto"
        >
          <Receipt className="w-4 h-4 text-emerald-400" />
          <span>{showSaleForm ? 'Cerrar Formulario' : 'Mandar Nota de Venta'}</span>
        </button>
      </div>

      {/* Formulario Desplegable para Enviar Nota de Venta */}
      {showSaleForm && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-base font-bold text-slate-900">
              Registrar Nota Final de Venta de Hoy
            </h3>
            <p className="text-xs text-slate-500">
              Ingresa los datos del turno para cotejar utilidades netas
            </p>
          </div>

          <form onSubmit={handleSubmitDailySale} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Monto Total Vendido ($ MXN)
                </label>
                <input
                  type="number"
                  required
                  value={dailySalesAmount}
                  onChange={e => setDailySalesAmount(e.target.value)}
                  placeholder="Ej. 5500"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Total de Órdenes / Paquetes Servidos
                </label>
                <input
                  type="number"
                  required
                  value={dailyOrdersCount}
                  onChange={e => setDailyOrdersCount(e.target.value)}
                  placeholder="Ej. 50 órdenes a $110"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Tomar Foto o Subir Nota de Venta / Ticket
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-600 font-medium block">
                  {dailySaleFile ? dailySaleFile : 'Tomar foto con el celular o seleccionar archivo'}
                </span>
                <input
                  type="file"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setDailySaleFile(e.target.files[0].name);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Comentarios del Turno / Aceptación del Menú
              </label>
              <input
                type="text"
                value={dailySaleNotes}
                onChange={e => setDailySaleNotes(e.target.value)}
                placeholder="Ej. Aceptación del paquete de $110 al 100%, la gente pide extra salsa casera..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSaleForm(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
              >
                <Receipt className="w-4 h-4" />
                <span>Enviar Nota a Dirección</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tareas Pendientes del Colaborador */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
            <span>📋 Tus Asignaciones de Dirección</span>
          </h2>
          <span className="text-xs text-slate-400">Marca cuando esté lista</span>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500 space-y-2">
            <span className="text-3xl">🎉</span>
            <p className="font-bold text-sm text-slate-800">¡Excelente trabajo! No tienes tareas pendientes por ahora.</p>
            <p className="text-xs text-slate-400">Dirección General te notificará en cuanto se agregue una nueva encomienda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map(task => (
              <div 
                key={task.id} 
                className="border-2 border-slate-200 hover:border-emerald-400 rounded-2xl p-4 sm:p-5 transition-all bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                      {task.projectName}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {task.text}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 pt-1">
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span>Entrega límite: <strong className="text-slate-700">{task.dueDate}</strong></span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleTask(task.projectId, task.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-transform active:scale-95 flex-shrink-0"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Marcar Hecho</span>
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedTaskForNote(task)}
                    className="text-emerald-700 font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>💬 Escribir reporte / nota de avance a Dirección</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para Enviar Nota a Dirección */}
      {selectedTaskForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Reportar Avance a Dirección General
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Sobre la tarea: <strong>{selectedTaskForNote.text}</strong>
            </p>

            <form onSubmit={handleReportProgress} className="space-y-4">
              <textarea
                required
                rows={4}
                value={reportNote}
                onChange={e => setReportNote(e.target.value)}
                placeholder="Ej. Las pruebas del menú rendidor de $110 con complementos abundantes salieron impecables..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForNote(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar a Dirección</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Historial de Tareas Completadas */}
      {completedTasks.length > 0 && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tareas Cumplidas Recientemente
          </h3>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-600 line-through font-medium">{task.text}</span>
                </div>
                <span className="text-emerald-700 font-bold text-[11px]">Listo</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
