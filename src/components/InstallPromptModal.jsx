import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share, PlusSquare, X, Check, Sparkles } from 'lucide-react';

export default function InstallPromptModal({ forceOpen = false, onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Detectar si ya está instalada / corriendo en modo standalone (App)
    const isInStandaloneMode = () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://')
      );
    };

    if (isInStandaloneMode()) {
      setIsStandalone(true);
      return;
    }

    // 2. Detectar si el usuario está en iOS (iPhone / iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 3. Capturar el evento de instalación nativa en Android / Chrome
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Si es la primera vez o no ha sido rechazado recientemente
      const dismissed = localStorage.getItem('tribuna_pwa_dismissed_v1');
      if (!dismissed) {
        setIsOpen(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Si es iOS y nunca se ha mostrado, mostrarlo después de 2 segundos en la primera visita
    if (isIosDevice) {
      const dismissed = localStorage.getItem('tribuna_pwa_dismissed_v1');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1800);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Si se fuerza abrir desde el Header
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  // Manejar instalación nativa en Android/Chrome
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsOpen(false);
      localStorage.setItem('tribuna_pwa_dismissed_v1', 'installed');
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('tribuna_pwa_dismissed_v1', 'dismissed');
    if (onClose) onClose();
  };

  // Si ya está instalada y no se forzó apertura, no mostrar
  if (isStandalone && !forceOpen) return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300">
      
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 transform transition-all animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95">
        
        {/* Cabecera con Ícono Oficial de la App */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <img 
                src="/pwa-icon-192.svg" 
                alt="Grupo Tribuna Ícono" 
                className="w-14 h-14 rounded-2xl shadow-lg border border-red-500/30 object-cover"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                APP
              </span>
            </div>
            <div>
              <div className="inline-flex items-center space-x-1 text-red-600 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instalar en tu Celular</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                Grupo Tribuna OS
              </h3>
              <p className="text-[11px] text-slate-500">
                Logística, Envíos & Catálogo Chignahuapan
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Beneficios de Instalar la App */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
            <span><strong>Acceso directo:</strong> Ícono en tu pantalla de inicio junto a tus apps.</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
            <span><strong>Pantalla completa:</strong> Sin barras estorbosas del navegador.</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
            <span><strong>Cámara rápida:</strong> Para catalogar esferas al vuelo en talleres.</span>
          </div>
        </div>

        {/* INSTRUCCIONES ESPECÍFICAS SEGÚN EL DISPOSITIVO */}
        {isIOS ? (
          /* Instrucciones para iPhone / iPad en Safari */
          <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 space-y-3 text-xs">
            <div className="font-bold text-red-950 flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-red-600" />
              <span>Cómo instalar en tu iPhone (Safari):</span>
            </div>

            <ol className="space-y-2.5 text-slate-700 font-medium">
              <li className="flex items-center space-x-2.5">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span>
                  Toca el botón <strong>Compartir</strong> en la barra inferior de Safari (el cuadrito con la flecha <Share className="w-3.5 h-3.5 inline text-blue-600 mb-0.5" />).
                </span>
              </li>

              <li className="flex items-center space-x-2.5">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <span>
                  Baja en el menú y toca <strong>"Agregar a pantalla de inicio"</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-slate-700 mb-0.5" />).
                </span>
              </li>

              <li className="flex items-center space-x-2.5">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <span>
                  Toca <strong>"Agregar"</strong> arriba a la derecha. ¡Listo! Ya tendrás el ícono en tu teléfono.
                </span>
              </li>
            </ol>
          </div>
        ) : (
          /* Botón Nativo para Android / Chrome */
          <div className="space-y-3">
            {deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black py-3.5 px-4 rounded-2xl shadow-xl transition-all transform active:scale-95 text-sm flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Instalar Ícono en mi Celular</span>
              </button>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">Para agregarla a tu pantalla principal:</p>
                <p>Toca los <strong>tres puntos (⋮)</strong> en la esquina de tu navegador y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.</p>
              </div>
            )}
          </div>
        )}

        {/* Botón de descartar */}
        <div className="pt-1">
          <button
            onClick={handleDismiss}
            className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-700 py-1 transition-colors"
          >
            Continuar en el navegador por ahora
          </button>
        </div>

      </div>

    </div>
  );
}
