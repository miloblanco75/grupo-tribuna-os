import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Bell, 
  Sparkles, 
  AlertTriangle, 
  ChefHat, 
  Zap, 
  Scale, 
  Car,
  Filter
} from 'lucide-react';

export default function MessagingCenter({ messages, onSendMessage, collaborators, activeEmployee }) {
  const [selectedChannel, setSelectedChannel] = useState('Todos');
  const [messageText, setMessageText] = useState('');
  const [targetChannel, setTargetChannel] = useState('Cocina Mérida (Menús Rendidores $110)');
  const [priority, setPriority] = useState('Normal');

  const channels = [
    'Todos',
    'General Grupo Tribuna',
    '🎄 Envíos Chignahuapan & Castores',
    'Cocina Mérida (Menús Rendidores $110)',
    'Electrolineras & Cinépolis',
    'Tierras Chihuahua',
    'Spa Chicxulub',
    'Logística & Distribución Nacional'
  ];

  const filteredMessages = messages.filter(m => {
    if (selectedChannel === 'Todos') return true;
    return m.channel === selectedChannel;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const senderName = activeEmployee ? activeEmployee.name : 'Dirección General';
    const senderAvatar = activeEmployee ? activeEmployee.avatar : '👔';

    onSendMessage({
      id: `msg-${Date.now()}`,
      channel: targetChannel,
      sender: senderName,
      avatar: senderAvatar,
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: priority
    });

    setMessageText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Encabezado */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Centro de Comunicación & Avisos Grupales
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Transmite instrucciones directas, seguimiento operativo y alertas a los equipos en tiempo real.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl self-start md:self-auto">
          <span className="text-slate-500">Publicando como:</span>
          <span className="font-bold text-slate-900 flex items-center space-x-1">
            <span>{activeEmployee ? activeEmployee.avatar : '👔'}</span>
            <span>{activeEmployee ? activeEmployee.name : 'Dirección General'}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Canales y Formulario de Envío (Columna Izquierda en Desktop) */}
        <div className="space-y-6">
          
          {/* Selector de Canales */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-2">
              Canales de Proyecto
            </span>
            <div className="space-y-1">
              {channels.map(channel => (
                <button
                  key={channel}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-between ${
                    selectedChannel === channel
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="truncate">{channel}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    selectedChannel === channel ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {channel === 'Todos' 
                      ? messages.length 
                      : messages.filter(m => m.channel === channel).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Formulario de Redacción de Mensaje */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Send className="w-4 h-4 text-emerald-600" />
              <span>Redactar Instrucción / Mensaje</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Canal Destino
                </label>
                <select
                  value={targetChannel}
                  onChange={e => setTargetChannel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {channels.filter(c => c !== 'Todos').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Nivel de Prioridad
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPriority('Normal')}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                      priority === 'Normal'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('Alta')}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                      priority === 'Alta'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🚨 Urgente
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Mensaje / Asignación
                </label>
                <textarea
                  required
                  rows={4}
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Ej. Don Aurelio, recuerde mandar la nota final de venta de hoy y verificar la higiene en las órdenes de $110..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center space-x-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Publicar en el Canal</span>
              </button>
            </form>
          </div>

        </div>

        {/* Feed de Conversaciones & Avisos (Columna Derecha) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Feed de Mensajes: <strong className="text-slate-800">{selectedChannel}</strong>
            </span>
            <span className="text-xs text-slate-400">
              {filteredMessages.length} mensajes en total
            </span>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              No hay mensajes en este canal todavía.
            </div>
          ) : (
            filteredMessages.map(msg => (
              <div 
                key={msg.id} 
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-sm space-y-2 transition-all ${
                  msg.priority === 'Alta' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-base">
                      {msg.avatar}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{msg.sender}</span>
                      <span className="text-[10px] text-slate-400 block">{msg.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                      {msg.channel}
                    </span>
                    {msg.priority === 'Alta' && (
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-black px-2 py-0.5 rounded-full">
                        URGENTE
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-10 whitespace-pre-wrap font-medium">
                  {msg.text}
                </p>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
