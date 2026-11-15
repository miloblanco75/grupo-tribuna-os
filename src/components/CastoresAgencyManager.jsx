import React, { useState, useMemo, useEffect } from 'react';
import { 
  Store, 
  Package, 
  Truck, 
  Phone, 
  MapPin, 
  UserCheck, 
  Sparkles, 
  Award, 
  QrCode, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Search, 
  Plus, 
  Filter, 
  ArrowRight, 
  ShieldCheck, 
  DollarSign, 
  Layers, 
  Receipt, 
  CreditCard, 
  AlertCircle, 
  Gift, 
  ExternalLink, 
  FileText, 
  X, 
  ChevronRight,
  TrendingUp,
  Boxes,
  HelpCircle
} from 'lucide-react';

import {
  CASTORES_ALLIANCE_INFO,
  CHIGNAHUAPAN_HUB_INFO,
  PACKAGING_CATALOG,
  INITIAL_ARTISANS,
  INITIAL_ORDERS,
  POPULAR_DESTINATIONS,
  TIERS_CONFIG,
  AGENCY_REWARDS_CATALOG
} from '../data/chignahuapanData';

export default function CastoresAgencyManager({ onNavigateToCatalog, onNavigateToOrders }) {
  // 1. Estados principales con persistencia en localStorage
  const [merchants, setMerchants] = useState(() => {
    const saved = localStorage.getItem('tribuna_chignahuapan_artisans_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ARTISANS;
  });

  const [agencyOrders, setAgencyOrders] = useState(() => {
    const saved = localStorage.getItem('tribuna_chignahuapan_orders_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ORDERS;
  });

  // Guardar en localStorage cuando haya cambios
  useEffect(() => {
    localStorage.setItem('tribuna_chignahuapan_artisans_v1', JSON.stringify(merchants));
  }, [merchants]);

  useEffect(() => {
    localStorage.setItem('tribuna_chignahuapan_orders_v1', JSON.stringify(agencyOrders));
  }, [agencyOrders]);

  // Pestaña activa del sistema de la agencia:
  // 'counter' (Mostrador / Recepción)
  // 'merchant-portal' (Portal del Productor / Auto-registro / Avances)
  // 'affiliates' (Directorio & Padrón de Negocios)
  // 'rewards' (Puntos & Canje 5%)
  // 'manifest' (Manifiesto de Carga Salida 18:30)
  const [activeSubTab, setActiveSubTab] = useState('counter');

  // Subpestaña dentro del Portal del Negocio:
  // 'my-dashboard' | 'register' | 'promo-pass'
  const [portalTab, setPortalTab] = useState('my-dashboard');
  const [selectedMerchantForPortalId, setSelectedMerchantForPortalId] = useState(merchants[0]?.id || '');

  // Modales
  const [isNewMerchantModalOpen, setIsNewMerchantModalOpen] = useState(false);
  const [selectedMerchantDetail, setSelectedMerchantDetail] = useState(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [rewardToRedeem, setRewardToRedeem] = useState(null);

  // Filtros de búsqueda en directorio
  const [merchantSearchTerm, setMerchantSearchTerm] = useState('');
  const [merchantTierFilter, setMerchantTierFilter] = useState('ALL');

  // =========================================================================
  // ESTADOS DEL MOSTRADOR / RECEPCIÓN DE ENVÍOS EN BODEGA
  // =========================================================================
  const [counterMerchantId, setCounterMerchantId] = useState(merchants[0]?.id || '');
  const [counterBuyerName, setCounterBuyerName] = useState('');
  const [counterBuyerPhone, setCounterBuyerPhone] = useState('');
  const [counterDestinationCity, setCounterDestinationCity] = useState(POPULAR_DESTINATIONS[0].city);
  const [counterDestinationAddress, setCounterDestinationAddress] = useState('');
  const [counterDeliveryType, setCounterDeliveryType] = useState('Domicilio'); // 'Domicilio' | 'Ocurre Oficina Castores'
  const [counterItemsDescription, setCounterItemsDescription] = useState('Esferas artesanales de cristal soplado decoradas y empacadas');
  const [counterBoxesCount, setCounterBoxesCount] = useState(3);
  const [counterPackagingId, setCounterPackagingId] = useState('pack-premium');
  const [counterDeclaredValue, setCounterDeclaredValue] = useState(2500);

  // =========================================================================
  // ESTADOS DEL FORMULARIO DE AUTO-REGISTRO DE PRODUCTORES / COMERCIOS
  // =========================================================================
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regContactName, setRegContactName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regProductsDescription, setRegProductsDescription] = useState('');
  const [regNotes, setRegNotes] = useState('');

  // Generador de siguiente número de cliente: CAS-CHIG-XXX
  const generateNextClientNumber = () => {
    const existingNums = merchants
      .map(m => {
        if (!m.clientNumber) return 0;
        const match = m.clientNumber.match(/CAS-CHIG-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
    return `CAS-CHIG-${String(maxNum + 1).padStart(3, '0')}`;
  };

  // =========================================================================
  // CÁLCULO DE COTIZACIÓN DE MOSTRADOR & PUNTOS (5%)
  // =========================================================================
  const counterPricing = useMemo(() => {
    const dest = POPULAR_DESTINATIONS.find(d => d.city === counterDestinationCity) || POPULAR_DESTINATIONS[0];
    const pack = PACKAGING_CATALOG.find(p => p.id === counterPackagingId) || PACKAGING_CATALOG[0];
    const selectedMerchant = merchants.find(m => m.id === counterMerchantId);

    // Tarifa base Castores estimada según distancia y número de cajas
    const baseTariff = dest.avgDays === 1 ? 480 : dest.avgDays === 2 ? 620 : 850;
    const castoresListPrice = Math.round(baseTariff * (1 + (counterBoxesCount - 1) * 0.45));
    const castoresDiscount = Math.round(castoresListPrice * (CASTORES_ALLIANCE_INFO.discountPercentage / 100));
    const castoresNetCost = castoresListPrice - castoresDiscount;

    // Margen Tribuna y Servicios de Valor Agregado
    const tribunaMargin = Math.round(castoresListPrice * 0.25);
    const packagingCost = pack.costToCustomer * counterBoxesCount;
    const shuttleCost = CHIGNAHUAPAN_HUB_INFO.shuttleTransferFeeStandard * counterBoxesCount; // Conexión Chignahuapan -> Puebla

    const totalToCustomer = (castoresListPrice + packagingCost + shuttleCost);

    // PUNTOS LEALTAD PARA EL PRODUCTOR AFILIADO (5% a 7% según su Tier)
    let pointsPct = 5;
    if (selectedMerchant) {
      if (selectedMerchant.tier === 'Diamante') pointsPct = 7;
      else if (selectedMerchant.tier === 'Oro') pointsPct = 6;
      else if (selectedMerchant.tier === 'Plata') pointsPct = 5.5;
    }
    const pointsEarned = Math.round((totalToCustomer * pointsPct) / 100);

    return {
      dest,
      pack,
      selectedMerchant,
      castoresListPrice,
      castoresDiscount,
      castoresNetCost,
      tribunaMargin,
      packagingCost,
      shuttleCost,
      totalToCustomer,
      pointsPct,
      pointsEarned
    };
  }, [counterDestinationCity, counterPackagingId, counterBoxesCount, counterMerchantId, merchants]);

  // =========================================================================
  // REGISTRAR ENVÍO EN MOSTRADOR DE LA AGENCIA
  // =========================================================================
  const handleProcessCounterDropOff = (e) => {
    e.preventDefault();

    if (!counterBuyerName.trim()) {
      alert('Por favor ingresa el nombre del comprador o turista.');
      return;
    }

    const nextOrderNum = agencyOrders.length + 101;
    const newFolio = `GT-CHIG-2026-${nextOrderNum}`;
    const generatedGuide = `${Math.floor(6830000 + Math.random() * 9999)}-PUE`;
    const today = new Date().toISOString().split('T')[0];

    const selectedMerchant = merchants.find(m => m.id === counterMerchantId);

    const newOrder = {
      id: newFolio,
      castoresGuideNumber: generatedGuide,
      date: today,
      artisanId: selectedMerchant?.id || 'direct-client',
      artisanBusiness: selectedMerchant?.businessName || 'Recepción Mostrador / Sin Afiliado',
      clientNumber: selectedMerchant?.clientNumber || 'MOSTRADOR-DIRECTO',
      buyerName: counterBuyerName.trim(),
      buyerPhone: counterBuyerPhone.trim() || 'No proporcionado',
      destinationCity: counterDestinationCity,
      destinationAddress: counterDestinationAddress.trim() || `Ocurre Oficina Castores ${counterDestinationCity}`,
      deliveryType: counterDeliveryType,
      itemsSummary: `${counterBoxesCount} Cajas (${counterItemsDescription})`,
      boxesCount: Number(counterBoxesCount),
      totalWeightKg: Number(counterBoxesCount) * 6,
      volumetricWeightKg: Number(counterBoxesCount) * 10,
      packagingTypeId: counterPackagingId,
      packagingName: counterPricing.pack.name,
      requiresTribunaShuttleToPuebla: true,
      shuttleFee: counterPricing.shuttleCost,
      castoresListPrice: counterPricing.castoresListPrice,
      castoresDiscountPct: CASTORES_ALLIANCE_INFO.discountPercentage,
      castoresNetCostToTribuna: counterPricing.castoresNetCost,
      tribunaMarginOnCastores: counterPricing.tribunaMargin,
      packagingCostCharged: counterPricing.packagingCost,
      totalChargedToCustomer: counterPricing.totalToCustomer,
      pointsAwardedToMerchant: counterPricing.pointsEarned,
      status: 'Recibido en Bodega Hub Chignahuapan',
      castoresStatus: 'Resguardado en bodega · Programado para salida troncal 18:30 hrs',
      estimatedDeliveryDate: counterPricing.dest.avgDays === 1 ? 'Mañana' : `En ${counterPricing.dest.avgDays} días hábiles`,
      fragilityWarrantyActive: true,
      notes: `Recepción en mostrador de agencia Castores. Productor aliado: ${selectedMerchant?.businessName || 'N/A'}`
    };

    // Actualizar pedidos
    setAgencyOrders(prev => [newOrder, ...prev]);

    // Acreditar servicio y puntos al comerciante/productor si está afiliado
    if (selectedMerchant) {
      setMerchants(prev => prev.map(m => {
        if (m.id !== selectedMerchant.id) return m;
        const newCount = (m.servicesCount || 0) + 1;
        const newBoxes = (m.totalBoxesShipped || 0) + Number(counterBoxesCount);
        const newVolume = (m.totalVolumeMXN || 0) + counterPricing.totalToCustomer;
        const newEarned = (m.pointsEarned || 0) + counterPricing.pointsEarned;
        const newBal = (m.pointsBalance || 0) + counterPricing.pointsEarned;

        // Evaluar ascenso de Tier
        let newTier = m.tier || 'Bronce';
        if (newCount >= 50) newTier = 'Diamante';
        else if (newCount >= 25) newTier = 'Oro';
        else if (newCount >= 10) newTier = 'Plata';

        return {
          ...m,
          servicesCount: newCount,
          totalOrdersSent: newCount,
          totalBoxesShipped: newBoxes,
          totalVolumeMXN: newVolume,
          pointsEarned: newEarned,
          pointsBalance: newBal,
          tier: newTier
        };
      }));
    }

    setSelectedReceiptOrder(newOrder);

    // Resetear formulario para siguiente cliente
    setCounterBuyerName('');
    setCounterBuyerPhone('');
    setCounterDestinationAddress('');
    setCounterBoxesCount(2);

    alert(`🎉 ¡Envío ${newFolio} recibido en bodega con éxito!\nGuía Castores: ${generatedGuide}\nSe acreditaron +${counterPricing.pointsEarned} Puntos Castores a ${selectedMerchant?.businessName || 'Mostrador'}.`);
  };

  // =========================================================================
  // AUTO-REGISTRO / AFILIACIÓN DE NUEVO COMERCIO / PRODUCTOR
  // =========================================================================
  const handleRegisterNewMerchant = (e) => {
    e.preventDefault();

    if (!regBusinessName.trim()) {
      alert('Por favor ingresa el nombre de tu negocio o taller.');
      return;
    }
    if (!regPhone.trim()) {
      alert('Por favor ingresa un teléfono o WhatsApp de contacto.');
      return;
    }

    const nextClientNum = generateNextClientNumber();
    const newId = `art-${Date.now()}`;
    const cleanPhone = regPhone.replace(/[^0-9]/g, '');

    const newMerchantObj = {
      id: newId,
      clientNumber: nextClientNum,
      businessName: regBusinessName.trim(),
      contactName: regContactName.trim() || regBusinessName.trim(),
      artisanName: regContactName.trim() || regBusinessName.trim(),
      phone: regPhone.trim(),
      whatsapp: cleanPhone.slice(-10),
      workshopAddress: regAddress.trim() || 'Chignahuapan Centro, Pue.',
      productsDescription: regProductsDescription.trim() || 'Esferas navideñas de cristal soplado y artesanías de temporada',
      specialty: regProductsDescription.trim() || 'Artesanía local',
      rating: 5.0,
      yearsInBusiness: 1,
      negotiatedPickupFee: 60.00,
      servicesCount: 0,
      totalOrdersSent: 0,
      totalBoxesShipped: 0,
      totalVolumeMXN: 0,
      pointsEarned: 50, // Bono de bienvenida
      pointsRedeemed: 0,
      pointsBalance: 50,
      tier: 'Bronce',
      activePendingPickups: 0,
      registeredAt: new Date().toISOString().split('T')[0],
      notes: regNotes.trim() || 'Inscripción directa en la Agencia Castores Chignahuapan.'
    };

    setMerchants(prev => [newMerchantObj, ...prev]);
    setSelectedMerchantForPortalId(newId);
    setCounterMerchantId(newId);

    // Limpiar formulario
    setRegBusinessName('');
    setRegContactName('');
    setRegPhone('');
    setRegAddress('');
    setRegProductsDescription('');
    setRegNotes('');
    setIsNewMerchantModalOpen(false);

    alert(`🌟 ¡Bienvenido a la Red Castores Chignahuapan!\nTu Número de Cliente Oficial es: ${nextClientNum}\n¡Te hemos regalado 50 Puntos de Bienvenida para canjear en la agencia!`);
    setPortalTab('my-dashboard');
    setActiveSubTab('merchant-portal');
  };

  // =========================================================================
  // CANJEAR PUNTOS DE UN COMERCIO POR RECOMPENSAS
  // =========================================================================
  const handleRedeemReward = (merchantId, reward) => {
    const merchant = merchants.find(m => m.id === merchantId);
    if (!merchant) return;

    if (merchant.pointsBalance < reward.pointsCost) {
      alert(`⚠️ Puntos insuficientes.\n${merchant.businessName} tiene ${merchant.pointsBalance} pts disponibles y la recompensa requiere ${reward.pointsCost} pts.`);
      return;
    }

    if (confirm(`¿Confirmas el canje de "${reward.title}" por ${reward.pointsCost} puntos para ${merchant.businessName}?`)) {
      setMerchants(prev => prev.map(m => {
        if (m.id !== merchantId) return m;
        return {
          ...m,
          pointsRedeemed: (m.pointsRedeemed || 0) + reward.pointsCost,
          pointsBalance: (m.pointsBalance || 0) - reward.pointsCost
        };
      }));

      setIsRedeemModalOpen(false);
      alert(`🎁 ¡Canje procesado exitosamente!\nSe entregó: ${reward.title}\nNuevo saldo de ${merchant.businessName}: ${merchant.pointsBalance - reward.pointsCost} puntos.`);
    }
  };

  // Filtrado de comercios para la tabla/directorio
  const filteredMerchants = useMemo(() => {
    return merchants.filter(m => {
      const q = merchantSearchTerm.toLowerCase();
      const matchQuery = (
        (m.businessName && m.businessName.toLowerCase().includes(q)) ||
        (m.clientNumber && m.clientNumber.toLowerCase().includes(q)) ||
        (m.contactName && m.contactName.toLowerCase().includes(q)) ||
        (m.phone && m.phone.toLowerCase().includes(q)) ||
        (m.productsDescription && m.productsDescription.toLowerCase().includes(q))
      );
      if (!matchQuery) return false;

      if (merchantTierFilter !== 'ALL') {
        return m.tier?.toUpperCase() === merchantTierFilter.toUpperCase();
      }
      return true;
    });
  }, [merchants, merchantSearchTerm, merchantTierFilter]);

  // Comercio actualmente seleccionado en el Portal del Negocio
  const activePortalMerchant = useMemo(() => {
    return merchants.find(m => m.id === selectedMerchantForPortalId) || merchants[0] || null;
  }, [merchants, selectedMerchantForPortalId]);

  // Envíos del comercio seleccionado en el portal
  const activeMerchantOrders = useMemo(() => {
    if (!activePortalMerchant) return [];
    return agencyOrders.filter(o => o.artisanId === activePortalMerchant.id);
  }, [agencyOrders, activePortalMerchant]);

  // Métricas generales de la agencia
  const agencyStats = useMemo(() => {
    const totalAffiliates = merchants.length;
    const totalOrders = agencyOrders.length;
    const totalBoxes = agencyOrders.reduce((acc, o) => acc + (o.boxesCount || 0), 0);
    const totalPointsDelivered = merchants.reduce((acc, m) => acc + (m.pointsEarned || 0), 0);
    const totalVolume = agencyOrders.reduce((acc, o) => acc + (o.totalChargedToCustomer || 0), 0);
    return {
      totalAffiliates,
      totalOrders,
      totalBoxes,
      totalPointsDelivered,
      totalVolume
    };
  }, [merchants, agencyOrders]);

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* BANNER PRINCIPAL: AGENCIA CASTORES CHIGNAHUAPAN & GRUPO TRIBUNA */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-900/40 relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md flex items-center space-x-1.5 border border-emerald-400/30">
                <span>🏢</span>
                <span>AGENCIA OFICIAL GRUPO CASTORES</span>
              </span>
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <span>📍</span>
                <span>Hub Chignahuapan, Pue.</span>
              </span>
              <span className="bg-sky-950/80 text-sky-300 text-xs font-bold px-2.5 py-1 rounded-full border border-sky-700/50">
                5% Puntos de Lealtad por Envío
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Agencia de Última Milla & Consolidación para Productores de Esferas
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              <strong>Solución al cuello de botella comercial:</strong> En Chignahuapan la gente compra esfera pero <em>solo puede comprar lo que puede cargar</em>. 
              Con nuestra agencia de paquetería Castores, los talleres y artesanos pueden vender sin límite de volumen. Sus compradores depositan las cajas en nuestra bodega o nosotros las recolectamos, viajando aseguradas con protección frágil a cualquier ciudad de México.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Bodega Hub: <strong>Km 2.8 Libramiento Chignahuapan</strong></span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Salida Troncal a Puebla: <strong>18:30 hrs Diaria</strong></span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <Gift className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recompensa al Comercio: <strong>5% en Puntos Canjeables</strong></span>
              </div>
            </div>
          </div>

          {/* Tarjeta Rápida de Métricas de la Agencia */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 w-full lg:w-80 shadow-2xl backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>Red de Productores</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                {agencyStats.totalAffiliates} Afiliados
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Cajas Despachadas:</span>
                <span className="text-xl font-black text-white">{agencyStats.totalBoxes.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Puntos Otorgados:</span>
                <span className="text-xl font-black text-amber-400">+{agencyStats.totalPointsDelivered.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPortalTab('register');
                  setActiveSubTab('merchant-portal');
                }}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-2 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-md transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Inscribir Negocio</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('counter')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3 py-2 rounded-xl text-xs flex items-center space-x-1 shadow-md transition-all"
                title="Ir a mostrador de recepción"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Recibir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBPESTAÑAS OPERATIVAS DE LA AGENCIA */}
      {/* ========================================================================= */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubTab('counter')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSubTab === 'counter'
              ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4 text-amber-300" />
          <span>🏢 Mostrador / Recepción en Bodega</span>
          <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
            Drop-Off
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('merchant-portal')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSubTab === 'merchant-portal'
              ? 'bg-gradient-to-r from-sky-600 to-indigo-700 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4 text-sky-400" />
          <span>📱 Portal del Negocio & Avances</span>
          <span className="bg-sky-100 text-sky-800 text-[10px] px-2 py-0.2 rounded-full font-bold">
            Autoservicio
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('affiliates')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSubTab === 'affiliates'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>📋 Padrón de Negocios Afiliados ({merchants.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('rewards')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSubTab === 'rewards'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>🎁 Recompensas & Puntos (5%)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('manifest')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSubTab === 'manifest'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-500" />
          <span>🚐 Salida Diaria a Puebla (18:30 hrs)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ÁREA 1: MOSTRADOR / RECEPCIÓN DE ENVÍOS EN BODEGA (DROP-OFF DE TURISTAS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'counter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Formulario de Recepción en Ventanilla */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Ventanilla de Agencia Chignahuapan
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  Recepción de Cajas & Despacho a Domicilio
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registra las cajas que el comprador o turista entrega en la bodega y asigna los puntos de lealtad al comercio.
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-bold text-slate-400 block">Convenio Oficial:</span>
                <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  22% OFF Castores
                </span>
              </div>
            </div>

            <form onSubmit={handleProcessCounterDropOff} className="space-y-4">
              
              {/* PASO 1: SELECCIONAR COMERCIO / PRODUCTOR DE ORIGEN */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 flex items-center space-x-1.5">
                    <Store className="w-4 h-4 text-emerald-600" />
                    <span>1. Comercio o Productor que Vendió la Esfera:</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPortalTab('register');
                      setActiveSubTab('merchant-portal');
                    }}
                    className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Inscribir Nuevo Productor</span>
                  </button>
                </div>

                <div className="relative">
                  <select
                    value={counterMerchantId}
                    onChange={(e) => setCounterMerchantId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {merchants.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.clientNumber ? `[${m.clientNumber}] ` : ''}{m.businessName} — Contacto: {m.contactName} ({m.tier || 'Bronce'} · {m.servicesCount || 0} envíos)
                      </option>
                    ))}
                    <option value="direct-client">-- Venta Directa en Mostrador / Sin Productor Afiliado --</option>
                  </select>
                </div>

                {counterPricing.selectedMerchant && (
                  <div className="flex items-center justify-between text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-800">
                        {counterPricing.selectedMerchant.clientNumber}:
                      </span>{' '}
                      <span>{counterPricing.selectedMerchant.workshopAddress}</span>
                    </div>
                    <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Gana {counterPricing.pointsPct}% en Puntos
                    </span>
                  </div>
                )}
              </div>

              {/* PASO 2: DATOS DEL COMPRADOR / TURISTA DESTINATARIO */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  2. Datos del Comprador / Destinatario en Destino:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Nombre Completo del Cliente:</label>
                    <input
                      type="text"
                      required
                      value={counterBuyerName}
                      onChange={(e) => setCounterBuyerName(e.target.value)}
                      placeholder="Ej. Ing. Carlos Mendoza Treviño"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Celular / WhatsApp (Para Rastreo):</label>
                    <input
                      type="tel"
                      value={counterBuyerPhone}
                      onChange={(e) => setCounterBuyerPhone(e.target.value)}
                      placeholder="Ej. 81 1234 5678"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Ciudad Destino en la República:</label>
                    <select
                      value={counterDestinationCity}
                      onChange={(e) => setCounterDestinationCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                    >
                      {POPULAR_DESTINATIONS.map(d => (
                        <option key={d.city} value={d.city}>
                          {d.city} ({d.avgDays === 1 ? 'Día siguiente' : `${d.avgDays} días`})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Tipo de Entrega:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCounterDeliveryType('Domicilio')}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          counterDeliveryType === 'Domicilio'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        🏠 A Domicilio
                      </button>
                      <button
                        type="button"
                        onClick={() => setCounterDeliveryType('Ocurre Oficina Castores')}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          counterDeliveryType === 'Ocurre Oficina Castores'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        🏢 Ocurre Oficina
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Dirección de Entrega (Calle, Número, Colonia, C.P.):</label>
                  <input
                    type="text"
                    value={counterDestinationAddress}
                    onChange={(e) => setCounterDestinationAddress(e.target.value)}
                    placeholder={counterDeliveryType === 'Domicilio' ? "Ej. Av. Constitución #450, Col. Obispado, C.P. 64060" : "Se entregará en la terminal Castores más cercana a la ciudad"}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* PASO 3: CAJAS Y EMBALAJE ANTISHOCK */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  3. Paquetes Recibidos & Protección Frágil:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Número de Cajas:</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={counterBoxesCount}
                      onChange={(e) => setCounterBoxesCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Tipo de Embalaje Frágil:</label>
                    <select
                      value={counterPackagingId}
                      onChange={(e) => setCounterPackagingId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                    >
                      {PACKAGING_CATALOG.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (+${p.costToCustomer} c/u)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Descripción del Contenido:</label>
                  <input
                    type="text"
                    value={counterItemsDescription}
                    onChange={(e) => setCounterItemsDescription(e.target.value)}
                    placeholder="Ej. 3 Cajas con 150 esferas decoradas al óleo y 2 coronas de herrería"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* BOTÓN PROCESAR RECEPCIÓN */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-black py-3.5 px-4 rounded-2xl shadow-lg transition-transform active:scale-95 text-sm flex items-center justify-center space-x-2"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Cobrar Envío & Generar Guía Castores (${counterPricing.totalToCustomer.toLocaleString()} MXN)</span>
                </button>
              </div>

            </form>
          </div>

          {/* Tarjeta Lateral de Cotización en Tiempo Real & Desglose de Puntos */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-amber-400" />
                  <span className="font-black text-sm uppercase tracking-wider text-slate-200">Cotización de Despacho</span>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Castores Alianza
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Flete Nacional Castores ({counterBoxesCount} cajas a {counterDestinationCity}):</span>
                  <span className="font-semibold text-slate-200">${counterPricing.castoresListPrice.toLocaleString()} MXN</span>
                </div>

                <div className="flex justify-between text-emerald-400">
                  <span>Descuento Convenio Tribuna-Castores (22%):</span>
                  <span className="font-bold">-${counterPricing.castoresDiscount.toLocaleString()} MXN</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Embalaje Antishock ({counterPricing.pack.name}):</span>
                  <span className="font-semibold text-slate-200">${counterPricing.packagingCost.toLocaleString()} MXN</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Conexión Troncal Chignahuapan → Puebla:</span>
                  <span className="font-semibold text-slate-200">${counterPricing.shuttleCost.toLocaleString()} MXN</span>
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block uppercase">Total Cobrado al Cliente:</span>
                    <span className="text-2xl font-black text-amber-400">
                      ${counterPricing.totalToCustomer.toLocaleString()} MXN
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Tiempo estimado:</span>
                    <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md inline-block">
                      {counterPricing.dest.avgDays === 1 ? '24 horas' : `${counterPricing.dest.avgDays} a ${counterPricing.dest.avgDays + 1} días`}
                    </span>
                  </div>
                </div>
              </div>

              {/* CAJA DESTACADA: PUNTOS OTORGADOS AL PRODUCTOR */}
              <div className="bg-gradient-to-r from-emerald-950/80 to-teal-950/60 p-4 rounded-2xl border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-300 flex items-center space-x-1.5">
                    <Gift className="w-4 h-4 text-emerald-400" />
                    <span>Incentivo al Negocio Afiliado:</span>
                  </span>
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {counterPricing.pointsPct}% Cashback
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-white">+{counterPricing.pointsEarned}</span>
                    <span className="text-xs text-emerald-300 ml-1.5 font-bold">Puntos Castores</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-300">
                    Equivalente a ${counterPricing.pointsEarned} MXN
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-snug">
                  Al completar este despacho, {counterPricing.selectedMerchant ? counterPricing.selectedMerchant.businessName : 'el comercio afiliado'} acumula estos puntos en su cuenta para canjear por material de empaque o efectivo.
                </p>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center space-x-2 bg-slate-800/60 p-3 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Garantía de Cristal Soplado: Cada paquete viaja asegurado con protocolo antishock.</span>
              </div>
            </div>

            {/* Acceso Rápido a Pases Promocionales para Talleres */}
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-amber-900 font-black text-xs uppercase tracking-wider">
                <QrCode className="w-4 h-4 text-amber-700" />
                <span>Pase de Despacho para Turistas</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                ¿Un taller quiere colocar un letrero con su código en su mostrador para que los turistas lleven sus cajas a la bodega?
              </p>
              <button
                type="button"
                onClick={() => {
                  setPortalTab('promo-pass');
                  setActiveSubTab('merchant-portal');
                }}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-sm transition-all"
              >
                <span>Generar Pase Digital con QR para Mostrador</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ÁREA 2: PORTAL DEL NEGOCIO / TALLER (AUTOSERVICIO & AVANCES) */}
      {/* ========================================================================= */}
      {activeSubTab === 'merchant-portal' && (
        <div className="space-y-6">
          
          {/* Subnavegación del Portal */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black text-sky-700 uppercase tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Área de Autoservicio para Comerciantes
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Portal del Negocio Afiliado a Castores
              </h2>
              <p className="text-xs text-slate-500">
                Inscribe tu negocio, consulta tus puntos ganados y descarga tu pase con código QR para tus clientes.
              </p>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setPortalTab('my-dashboard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  portalTab === 'my-dashboard'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📊 Mi Negocio & Avances
              </button>

              <button
                type="button"
                onClick={() => setPortalTab('register')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  portalTab === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ➕ Inscribir Mi Negocio
              </button>

              <button
                type="button"
                onClick={() => setPortalTab('promo-pass')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  portalTab === 'promo-pass'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎟️ Pase con QR
              </button>
            </div>
          </div>

          {/* SUBVISTA A: MI NEGOCIO & AVANCES */}
          {portalTab === 'my-dashboard' && (
            <div className="space-y-6">
              
              {/* Selector de Comercio para simular acceso */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block">Consultar Expediente del Taller:</span>
                  <div className="text-base font-black text-amber-400">
                    {activePortalMerchant ? `${activePortalMerchant.clientNumber} — ${activePortalMerchant.businessName}` : 'Selecciona un taller'}
                  </div>
                </div>

                <div className="w-full md:w-80">
                  <select
                    value={selectedMerchantForPortalId}
                    onChange={(e) => setSelectedMerchantForPortalId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {merchants.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.clientNumber} - {m.businessName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {activePortalMerchant && (
                <>
                  {/* Ficha Principal de Métricas del Taller */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Número de Cliente y Nivel */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Número de Cliente Oficial</span>
                      <div className="text-2xl font-black text-slate-900 tracking-tight">
                        {activePortalMerchant.clientNumber}
                      </div>
                      <div className="pt-1">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full border inline-block ${
                          activePortalMerchant.tier === 'Diamante' ? 'bg-sky-100 text-sky-900 border-sky-300' :
                          activePortalMerchant.tier === 'Oro' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                          activePortalMerchant.tier === 'Plata' ? 'bg-slate-100 text-slate-900 border-slate-300' :
                          'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          Nivel {activePortalMerchant.tier || 'Bronce'} ({(activePortalMerchant.tier === 'Diamante' ? '7%' : activePortalMerchant.tier === 'Oro' ? '6%' : activePortalMerchant.tier === 'Plata' ? '5.5%' : '5%')} Cashback)
                        </span>
                      </div>
                    </div>

                    {/* Contador de Servicios */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Servicios Despachados</span>
                      <div className="text-2xl font-black text-slate-900">
                        {activePortalMerchant.servicesCount || 0} envíos
                      </div>
                      <p className="text-xs text-slate-500">
                        Total de <strong>{activePortalMerchant.totalBoxesShipped || 0} cajas</strong> transportadas con Castores.
                      </p>
                    </div>

                    {/* Saldo de Puntos Disponibles */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-lg shadow-emerald-950/10 space-y-2">
                      <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider block">Puntos Disponibles</span>
                      <div className="text-3xl font-black text-white">
                        {(activePortalMerchant.pointsBalance || 0).toLocaleString()} pts
                      </div>
                      <div className="text-xs font-bold text-emerald-100 flex items-center justify-between">
                        <span>Valor: ${(activePortalMerchant.pointsBalance || 0).toLocaleString()} MXN</span>
                        <button
                          type="button"
                          onClick={() => setActiveSubTab('rewards')}
                          className="bg-white text-emerald-900 px-2.5 py-0.5 rounded-lg font-black text-[10px] hover:bg-emerald-50 transition-colors"
                        >
                          Canjear
                        </button>
                      </div>
                    </div>

                    {/* Volumen Facturado a sus Clientes */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Volumen Operado en Fletes</span>
                      <div className="text-2xl font-black text-slate-900">
                        ${(activePortalMerchant.totalVolumeMXN || 0).toLocaleString()} MXN
                      </div>
                      <p className="text-xs text-emerald-700 font-semibold">
                        Acumulados en la agencia
                      </p>
                    </div>
                  </div>

                  {/* Ficha de Detalles del Negocio & Productos */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">
                          {activePortalMerchant.businessName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Contacto: <strong>{activePortalMerchant.contactName}</strong> · Tel: <strong>{activePortalMerchant.phone}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {activePortalMerchant.whatsapp && (
                          <a
                            href={`https://wa.me/52${activePortalMerchant.whatsapp}?text=Hola%20${encodeURIComponent(activePortalMerchant.contactName)},%20te%20saludamos%20de%20la%20Agencia%20Castores%20Chignahuapan`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setPortalTab('promo-pass')}
                          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Ver Pase QR</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                        <span className="font-bold text-slate-400 uppercase text-[10px] block">Dirección en Chignahuapan:</span>
                        <p className="font-semibold text-slate-800">{activePortalMerchant.workshopAddress}</p>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                        <span className="font-bold text-slate-400 uppercase text-[10px] block">Productos que Vende:</span>
                        <p className="font-semibold text-slate-800">{activePortalMerchant.productsDescription || 'Esferas artesanales y decoraciones navideñas'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Historial de Envíos Realizados por Clientes de este Taller */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-slate-900 text-base">
                        Envíos Despachados para Clientes de este Taller ({activeMerchantOrders.length})
                      </h4>
                      <span className="text-xs text-slate-500">
                        Cada envío ha sumado 5% de puntos a tu monedero
                      </span>
                    </div>

                    {activeMerchantOrders.length === 0 ? (
                      <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
                        <Package className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs text-slate-500 font-semibold">
                          Aún no hay envíos registrados para este taller.
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Entrega a tus compradores tu Número de Cliente <strong>{activePortalMerchant.clientNumber}</strong> para que lo indiquen en la agencia.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-3">Fecha & Folio</th>
                              <th className="py-2.5 px-3">Guía Castores</th>
                              <th className="py-2.5 px-3">Comprador</th>
                              <th className="py-2.5 px-3">Destino</th>
                              <th className="py-2.5 px-3">Cajas</th>
                              <th className="py-2.5 px-3">Monto Flete</th>
                              <th className="py-2.5 px-3 text-right">Puntos Ganados</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {activeMerchantOrders.map(ord => (
                              <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-3 px-3 font-mono font-bold text-slate-800">
                                  <div>{ord.id}</div>
                                  <div className="text-[10px] font-normal text-slate-400">{ord.date}</div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className="bg-amber-100 text-amber-900 font-black px-2 py-0.5 rounded-md text-[11px]">
                                    {ord.castoresGuideNumber}
                                  </span>
                                </td>
                                <td className="py-3 px-3 font-bold text-slate-900">
                                  {ord.buyerName}
                                </td>
                                <td className="py-3 px-3 text-slate-600">
                                  {ord.destinationCity}
                                </td>
                                <td className="py-3 px-3 font-semibold text-slate-800">
                                  {ord.boxesCount} cajas
                                </td>
                                <td className="py-3 px-3 font-bold text-slate-900">
                                  ${ord.totalChargedToCustomer?.toLocaleString()} MXN
                                </td>
                                <td className="py-3 px-3 text-right font-black text-emerald-700">
                                  +{ord.pointsAwardedToMerchant || Math.round(ord.totalChargedToCustomer * 0.05)} pts
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>
          )}

          {/* SUBVISTA B: INSCRIBIR PERSONALMENTE UN NEGOCIO (FORMULARIO PÚBLICO) */}
          {portalTab === 'register' && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Afiliación Gratuita
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Inscripción de Taller o Comercio en la Red Castores
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Regístrate para recibir tu <strong>Número de Cliente oficial (CAS-CHIG-XXX)</strong>, comenzar a enviar las compras de tus clientes foráneos y ganar 5% de puntos por cada flete.
                </p>
              </div>

              <form onSubmit={handleRegisterNewMerchant} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nombre Comercial del Negocio o Taller *:</label>
                  <input
                    type="text"
                    required
                    value={regBusinessName}
                    onChange={(e) => setRegBusinessName(e.target.value)}
                    placeholder="Ej. Taller Artesanal Las Esferas de la Sierra"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nombre de la Persona de Contacto / Propietario *:</label>
                    <input
                      type="text"
                      required
                      value={regContactName}
                      onChange={(e) => setRegContactName(e.target.value)}
                      placeholder="Ej. Don Jesús Rivera"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Teléfono Celular / WhatsApp *:</label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="Ej. 797 102 3344"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dirección Física en Chignahuapan (con referencias):</label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Ej. Calle Romero Vargas #45, Barrio de Teotlalpan (frente a la capilla)"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Productos que Vendes (Mención / Descripción):</label>
                  <textarea
                    rows={3}
                    value={regProductsDescription}
                    onChange={(e) => setRegProductsDescription(e.target.value)}
                    placeholder="Ej. Esferas tradicionales de vidrio soplado números 4, 6 y 8, figuras de óleo, campanas, coronas navideñas con follaje y árboles miniatura."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1 text-xs text-emerald-900">
                  <div className="flex items-center space-x-1.5 font-black">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>¡Bono de Bienvenida Inmediato!</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Al completar este registro recibirás automáticamente tu Número de Cliente oficial y <strong>50 Puntos de Bienvenida ($50 MXN)</strong> para usar en la agencia.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-black py-3 px-4 rounded-2xl shadow-lg transition-transform active:scale-95 text-xs sm:text-sm flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finalizar Afiliación & Generar Número de Cliente</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SUBVISTA C: PASE DIGITAL CON QR PARA MOSTRADOR DEL TALLER */}
          {portalTab === 'promo-pass' && (
            <div className="max-w-xl mx-auto space-y-4">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl space-y-6 text-center print:border-black" id="printable-merchant-pass">
                
                {/* Header del Pase */}
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-2 bg-slate-950 text-white px-3 py-1 rounded-full text-xs font-black">
                    <span>🎄 GRUPO TRIBUNA</span>
                    <span>·</span>
                    <span className="text-amber-400">AGENCIA CASTORES</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    ¡Compra Todas las Esferas que Quieras!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Nosotros nos encargamos de que viajen seguras y empacadas con burbuja antishock hasta la puerta de tu hogar en cualquier parte de México.
                  </p>
                </div>

                {/* Tarjeta Destacada con el Número de Cliente del Productor */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-3xl border-2 border-dashed border-amber-400 space-y-3">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">
                    Comercio Afiliado Autorizado:
                  </span>
                  <div className="text-xl font-black text-slate-900">
                    {activePortalMerchant ? activePortalMerchant.businessName : 'Taller Artesanal'}
                  </div>
                  
                  <div className="bg-white py-3 px-5 rounded-2xl inline-block shadow-sm border border-amber-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Muestra este folio en bodega:</span>
                    <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-700 tracking-wider">
                      {activePortalMerchant ? activePortalMerchant.clientNumber : 'CAS-CHIG-001'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium">
                    Presentando este folio obtienes atención preferencial y seguro de protección contra roturas en tu envío.
                  </p>
                </div>

                {/* Instrucciones para el Turista / Comprador */}
                <div className="grid grid-cols-3 gap-2 text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="font-black text-amber-700 text-sm block">Paso 1:</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">Elige y paga tus esferas en este taller sin preocuparte por el espacio en tu auto.</p>
                  </div>
                  <div>
                    <span className="font-black text-emerald-700 text-sm block">Paso 2:</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">Lleva tus compras a la Bodega Castores o solicita que pasemos por ellas.</p>
                  </div>
                  <div>
                    <span className="font-black text-sky-700 text-sm block">Paso 3:</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">Recibe en tu casa con guía de rastreo oficial en 24 a 48 horas.</p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                  📍 <strong>Agencia Castores:</strong> Libramiento Chignahuapan Km 2.8 · 📞 Tel: <strong>+52 797 971 4520</strong>
                </div>

              </div>

              {/* Botones de Acción para Imprimir y Compartir */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-2.5 rounded-2xl text-xs flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Letrero para Mostrador</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const text = `🎄 ¡Hola! Si compras en *${activePortalMerchant?.businessName}*, puedes enviar todas tus esferas por paquetería Castores presentando nuestro Folio Oficial: *${activePortalMerchant?.clientNumber}* en la Bodega Hub Chignahuapan. Viajan aseguradas a cualquier ciudad de México.`;
                    navigator.clipboard.writeText(text);
                    alert('📋 ¡Texto promocional copiado al portapapeles! Listo para enviar a tus clientes por WhatsApp.');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center space-x-1"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Copiar Mensaje WhatsApp</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* ÁREA 3: PADRÓN DE NEGOCIOS & PRODUCTORES AFILIADOS (TABLA COMPLETA) */}
      {/* ========================================================================= */}
      {activeSubTab === 'affiliates' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">
                Directorio Oficial Chignahuapan
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                Padrón de Productores & Comerciantes Afiliados ({filteredMerchants.length})
              </h2>
              <p className="text-xs text-slate-500">
                Control de números de cliente, productos que elaboran, contador de servicios y puntos acumulados (5%).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setPortalTab('register');
                setActiveSubTab('merchant-portal');
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Afiliar Nuevo Comercio</span>
            </button>
          </div>

          {/* Barra de Filtros y Búsqueda */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={merchantSearchTerm}
                onChange={(e) => setMerchantSearchTerm(e.target.value)}
                placeholder="Buscar por número CAS-CHIG, nombre del negocio, contacto o producto..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={merchantTierFilter}
                onChange={(e) => setMerchantTierFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="ALL">Todos los Niveles</option>
                <option value="BRONCE">🥉 Bronce</option>
                <option value="PLATA">🥈 Plata</option>
                <option value="ORO">🥇 Oro</option>
                <option value="DIAMANTE">💎 Diamante</option>
              </select>
            </div>
          </div>

          {/* Grilla de Tarjetas de Comercios Afiliados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMerchants.map(merchant => (
              <div
                key={merchant.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Encabezado de la Tarjeta con Número de Cliente */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-black text-xs text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                        {merchant.clientNumber || 'CAS-CHIG-PEND'}
                      </span>
                      <h4 className="font-black text-slate-900 text-base mt-1.5 leading-snug">
                        {merchant.businessName}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Contacto: <strong>{merchant.contactName}</strong>
                      </p>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      merchant.tier === 'Diamante' ? 'bg-sky-100 text-sky-900 border-sky-300' :
                      merchant.tier === 'Oro' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                      merchant.tier === 'Plata' ? 'bg-slate-100 text-slate-800 border-slate-300' :
                      'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {merchant.tier || 'Bronce'}
                    </span>
                  </div>

                  {/* Dirección y Teléfono */}
                  <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{merchant.workshopAddress}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 pt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="font-semibold">{merchant.phone}</span>
                    </div>
                  </div>

                  {/* Productos que Vende */}
                  <div className="text-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Productos que Vende:
                    </span>
                    <p className="text-slate-700 bg-white p-2 rounded-xl border border-slate-200 line-clamp-2 font-medium">
                      {merchant.productsDescription || 'Esferas navideñas de cristal y artesanía'}
                    </p>
                  </div>

                  {/* Indicadores de Rendimiento & Puntos (5%) */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="bg-slate-100/80 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-500 block font-semibold">Servicios con Nosotros:</span>
                      <span className="font-black text-slate-900 text-sm">
                        {merchant.servicesCount || 0} envíos
                      </span>
                    </div>

                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                      <span className="text-[10px] text-emerald-700 block font-bold">Puntos Disponibles:</span>
                      <span className="font-black text-emerald-800 text-sm">
                        +{(merchant.pointsBalance || 0).toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones de la Tarjeta */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMerchantForPortalId(merchant.id);
                      setPortalTab('my-dashboard');
                      setActiveSubTab('merchant-portal');
                    }}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center space-x-1"
                  >
                    <span>Ver Expediente</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCounterMerchantId(merchant.id);
                        setActiveSubTab('counter');
                      }}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-sm"
                      title="Registrar nuevo envío para este comercio"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Recibir Envío</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ÁREA 4: CATÁLOGO DE RECOMPENSAS & CANJE DE PUNTOS (5% LEALTAD) */}
      {/* ========================================================================= */}
      {activeSubTab === 'rewards' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              Programa de Lealtad & Recompensas
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Catálogo de Canje de Puntos Castores (5% Cashback)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Por cada envío que sus clientes depositan en la agencia, los productores acumulan puntos canjeables por insumos, recolecciones o efectivo.
            </p>
          </div>

          {/* Selector del Comercio para canjear */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs font-black text-slate-800 block">Selecciona el Taller que Canjeará Recompensas:</label>
              <p className="text-[11px] text-slate-500">El saldo se descontará de su monedero de puntos.</p>
            </div>

            <div className="w-full sm:w-80">
              <select
                value={selectedMerchantForPortalId}
                onChange={(e) => setSelectedMerchantForPortalId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                {merchants.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.clientNumber} - {m.businessName} ({(m.pointsBalance || 0)} pts disponibles)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grilla de Recompensas Disponibles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENCY_REWARDS_CATALOG.map(reward => {
              const currentMerchant = merchants.find(m => m.id === selectedMerchantForPortalId) || merchants[0];
              const canAfford = currentMerchant && (currentMerchant.pointsBalance || 0) >= reward.pointsCost;

              return (
                <div
                  key={reward.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl p-2 bg-amber-50 rounded-2xl border border-amber-200">{reward.icon}</span>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {reward.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-base leading-snug">
                        {reward.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {reward.description}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Costo en Puntos:</span>
                        <span className="font-black text-emerald-700 text-base">
                          {reward.pointsCost} pts
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Valor Estimado:</span>
                        <span className="font-black text-slate-800">
                          ${reward.valueMXN} MXN
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => handleRedeemReward(currentMerchant.id, reward)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md active:scale-95'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>{canAfford ? 'Canjear Ahora' : 'Puntos Insuficientes'}</span>
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ÁREA 5: MANIFIESTO DE SALIDA DIARIA A TERMINAL PUEBLA (18:30 HRS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'manifest' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Conexión Troncal Chignahuapan → Puebla
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Manifiesto de Carga para Salida Diaria (18:30 hrs)
              </h2>
              <p className="text-xs text-slate-500">
                Unidad asignada: <strong>{CHIGNAHUAPAN_HUB_INFO.shuttleUnit}</strong> · Chofer: <strong>Rodrigo Castelán</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="bg-slate-900 hover:bg-slate-800 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Manifiesto del Chofer</span>
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-slate-400 block font-bold">Ruta Troncal:</span>
              <span className="font-black text-slate-900 text-sm">Bodega Chignahuapan ➔ Terminal Castores Puebla</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold">Hora Límite de Recepción:</span>
              <span className="font-black text-amber-700 text-sm">17:45 hrs</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold">Total Paquetes a Bordo:</span>
              <span className="font-black text-emerald-700 text-sm">{agencyOrders.length} envíos documentados</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Folio & Fecha</th>
                  <th className="py-2.5 px-3">Guía Castores</th>
                  <th className="py-2.5 px-3">Taller de Origen</th>
                  <th className="py-2.5 px-3">Destinatario & Ciudad</th>
                  <th className="py-2.5 px-3">Bultos</th>
                  <th className="py-2.5 px-3">Embalaje</th>
                  <th className="py-2.5 px-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agencyOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      <div>{ord.id}</div>
                      <div className="text-[10px] text-slate-400">{ord.date}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {ord.castoresGuideNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{ord.artisanBusiness}</div>
                      <div className="text-[10px] text-slate-400">{ord.clientNumber || 'Directo'}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{ord.buyerName}</div>
                      <div className="text-slate-500 text-[11px]">{ord.destinationCity}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {ord.boxesCount} cajas
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {ord.packagingName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        Listo p/ Cargar
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TICKET DE RECEPCIÓN / COMPROBANTE DE DESPACHO */}
      {/* ========================================================================= */}
      {selectedReceiptOrder && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedReceiptOrder(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-black text-slate-900 text-sm">Comprobante de Recepción en Bodega</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceiptOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-emerald-50/50 p-5 rounded-2xl border border-amber-200 text-center space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Guía Oficial Castores:</span>
              <div className="text-2xl font-mono font-black text-slate-900 tracking-wider">
                {selectedReceiptOrder.castoresGuideNumber}
              </div>
              <p className="text-xs text-slate-600">
                Folio Interno: <strong>{selectedReceiptOrder.id}</strong> · {selectedReceiptOrder.date}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Comprador:</span>
                <span className="font-bold text-slate-900">{selectedReceiptOrder.buyerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Destino:</span>
                <span className="font-bold text-slate-900">{selectedReceiptOrder.destinationCity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Taller Afiliado:</span>
                <span className="font-bold text-emerald-700">{selectedReceiptOrder.artisanBusiness}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Cajas:</span>
                <span className="font-bold text-slate-900">{selectedReceiptOrder.boxesCount} cajas</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Cobrado:</span>
                <span className="font-black text-amber-700">${selectedReceiptOrder.totalChargedToCustomer?.toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-emerald-700 font-bold">Puntos Abonados al Comercio:</span>
                <span className="font-black text-emerald-700">+{selectedReceiptOrder.pointsAwardedToMerchant} pts</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const text = `🎄 *AGENCIA CASTORES CHIGNAHUAPAN*\n¡Hola ${selectedReceiptOrder.buyerName}! Tu paquete de ${selectedReceiptOrder.boxesCount} cajas de esferas ha sido recibido en nuestra Bodega Hub.\n*Guía Castores:* ${selectedReceiptOrder.castoresGuideNumber}\n*Destino:* ${selectedReceiptOrder.destinationCity}\n*Estatus:* Resguardado para salida troncal a terminal Puebla.\n¡Gracias por tu compra en ${selectedReceiptOrder.artisanBusiness}!`;
                  navigator.clipboard.writeText(text);
                  alert('📋 ¡Notificación para el comprador copiada! Listo para enviar por WhatsApp.');
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp Comprador</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
