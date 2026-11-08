import React, { useState } from 'react';
import { 
  Car, 
  Fuel, 
  DollarSign, 
  Calendar, 
  User, 
  ShieldCheck, 
  TrendingUp, 
  Plus, 
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function UberFleetManager({ uberData, setUberData }) {
  const [showTripModal, setShowTripModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  // Form states
  const [tripStart, setTripStart] = useState('');
  const [tripEnd, setTripEnd] = useState('');
  const [tripPurpose, setTripPurpose] = useState('');

  const [logWeek, setLogWeek] = useState(`Semana ${Math.floor(Math.random() * 10) + 45}`);
  const [logEarnings, setLogEarnings] = useState('');
  const [logGas, setLogGas] = useState('');
  const [logDriverPayout, setLogDriverPayout] = useState('');

  // Cálculos financieros
  const totalCostTarget = uberData.monthlyCarLease + uberData.driverBaseSalary;
  const netEarnings = uberData.currentMonthRevenue - uberData.currentMonthGas;
  const coveragePercentage = Math.min(100, Math.round((netEarnings / totalCostTarget) * 100));

  const handleAddTrip = (e) => {
    e.preventDefault();
    if (!tripStart || !tripEnd || !tripPurpose) return;

    const newTrip = {
      id: `trip-${Date.now()}`,
      startDate: tripStart,
      endDate: tripEnd,
      purpose: tripPurpose,
      status: 'Confirmado'
    };

    setUberData(prev => ({
      ...prev,
      upcomingPersonalTrips: [...prev.upcomingPersonalTrips, newTrip]
    }));

    setTripStart('');
    setTripEnd('');
    setTripPurpose('');
    setShowTripModal(false);
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    const earningsNum = parseFloat(logEarnings) || 0;
    const gasNum = parseFloat(logGas) || 0;
    const driverNum = parseFloat(logDriverPayout) || 0;
    const carShare = 2875; // Cuarta parte de la renta mensual

    const newLog = {
      week: logWeek,
      uberEarnings: earningsNum,
      gas: gasNum,
      carShare: carShare,
      driverPayout: driverNum,
      status: 'Completado'
    };

    setUberData(prev => ({
      ...prev,
      currentMonthRevenue: prev.currentMonthRevenue + earningsNum,
      currentMonthGas: prev.currentMonthGas + gasNum,
      weeklyLogs: [newLog, ...prev.weeklyLogs]
    }));

    setLogEarnings('');
    setLogGas('');
    setLogDriverPayout('');
    setShowLogModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Encabezado y Datos del Auto */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">
              <Car className="w-3.5 h-3.5" />
              <span>Logística & Movilidad Mérida</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Unidad Vehicular Autofinanciable
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              El vehículo garantiza transporte ejecutivo personal en tus viajes a Mérida y genera ingresos activos en Uber para pagar la mensualidad de la renta del auto y el sueldo de Carlos Medina (chofer).
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1 self-start md:self-auto min-w-[240px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ficha de la Unidad</span>
            <div className="font-bold text-white text-base">{uberData.carModel}</div>
            <div className="text-xs text-blue-400 font-mono">Placas: {uberData.plate}</div>
            <div className="text-xs text-slate-300 pt-1 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Operador: {uberData.driverName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores Financieros / Estado de Autofinanciamiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Ingreso Bruto Uber (Mes)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            ${uberData.currentMonthRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-500">MXN</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Combustible registrado: -${uberData.currentMonthGas.toLocaleString()} MXN
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Metas Mensuales Fijas</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-semibold text-slate-700 space-y-1">
            <div className="flex justify-between">
              <span>Renta Mensual del Auto:</span>
              <strong className="text-slate-900">${uberData.monthlyCarLease.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span>Sueldo Chofer (Carlos):</span>
              <strong className="text-slate-900">${uberData.driverBaseSalary.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between border-t pt-1 text-xs text-slate-500">
              <span>Total Requerido:</span>
              <strong>${totalCostTarget.toLocaleString()} MXN</strong>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Autosuficiencia Financiera</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {coveragePercentage}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${coveragePercentage}%` }}
            />
          </div>
          <span className="text-[11px] font-bold block mt-2 text-slate-500">
            {coveragePercentage > 0 
              ? '✓ La unidad cubre su propio costo y genera liquidez.' 
              : '⚡ Unidad lista para arrancar operaciones y registrar primer turno.'}
          </span>
        </div>

      </div>

      {/* Calendario de Viajes Personales a Mérida vs Turnos Uber */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Agenda de Viajes Personales a Mérida</span>
            </h2>
            <p className="text-xs text-slate-500">
              Días bloqueados para tu transporte exclusivo (en estas fechas la unidad no hace Uber).
            </p>
          </div>

          <button
            onClick={() => setShowTripModal(true)}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Programar Viaje a Mérida</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {uberData.upcomingPersonalTrips.map(trip => (
            <div key={trip.id} className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  🚗 TRANSPORTE EXCLUSIVO TITULAR
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {trip.status}
                </span>
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {trip.purpose}
              </div>
              <div className="text-xs text-slate-600 flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Desde: <strong>{trip.startDate}</strong> hasta: <strong>{trip.endDate}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bitácora Semanal de Ingresos Uber y Chofer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Bitácora de Cortes Semanales Uber
            </h2>
            <p className="text-xs text-slate-500">
              Desglose de ingresos en plataforma, gasolina, fondo del auto y pago a Carlos.
            </p>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Corte Semanal</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          {uberData.weeklyLogs && uberData.weeklyLogs.length > 0 ? (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b">
                  <th className="py-3 px-3">Periodo</th>
                  <th className="py-3 px-3">Ingreso Bruto</th>
                  <th className="py-3 px-3">Gasolina</th>
                  <th className="py-3 px-3">Cuota Auto</th>
                  <th className="py-3 px-3">Sueldo Carlos</th>
                  <th className="py-3 px-3">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {uberData.weeklyLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-bold text-slate-900">{log.week}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">+${log.uberEarnings.toLocaleString()}</td>
                    <td className="py-3 px-3 text-red-600">-${log.gas.toLocaleString()}</td>
                    <td className="py-3 px-3 text-slate-700">${log.carShare.toLocaleString()}</td>
                    <td className="py-3 px-3 font-bold text-blue-700">${log.driverPayout.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        log.status === 'Completado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span className="text-2xl block mb-1">🚗</span>
              <p className="font-bold text-slate-700 text-xs sm:text-sm">Unidad lista para iniciar primer turno</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Aún no hay cortes semanales registrados. Presiona "+ Registrar Corte Semanal" para ingresar el primero.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Programar Viaje a Mérida */}
      {showTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Bloquear Auto para Viaje Personal a Mérida
            </h3>
            <form onSubmit={handleAddTrip} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Motivo / Propósito de la Visita
                </label>
                <input
                  type="text"
                  required
                  value={tripPurpose}
                  onChange={e => setTripPurpose(e.target.value)}
                  placeholder="Ej. Revisión obra Motul y menú Cocina Mérida"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    required
                    value={tripStart}
                    onChange={e => setTripStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    required
                    value={tripEnd}
                    onChange={e => setTripEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowTripModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Confirmar Bloqueo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Registrar Corte Semanal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Registrar Corte Semanal Uber
            </h3>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Semana / Periodo
                </label>
                <input
                  type="text"
                  required
                  value={logWeek}
                  onChange={e => setLogWeek(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                    Ingreso Uber ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={logEarnings}
                    onChange={e => setLogEarnings(e.target.value)}
                    placeholder="7500"
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                    Gasolina ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={logGas}
                    onChange={e => setLogGas(e.target.value)}
                    placeholder="1500"
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-red-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                    Pago Chofer ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={logDriverPayout}
                    onChange={e => setLogDriverPayout(e.target.value)}
                    placeholder="3000"
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  Guardar Corte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
