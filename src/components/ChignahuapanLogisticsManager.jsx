import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Truck, 
  Store, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  HelpCircle,
  FileText,
  UserCheck,
  TrendingUp,
  CreditCard,
  Boxes,
  Barcode,
  Camera
} from 'lucide-react';

import ChignahuapanCatalogManager from './ChignahuapanCatalogManager';

import {
  CASTORES_ALLIANCE_INFO,
  INITIAL_CASTORES_WALLET,
  CHIGNAHUAPAN_HUB_INFO,
  PACKAGING_CATALOG,
  INITIAL_ARTISANS,
  INITIAL_PICKUP_SCHEDULE,
  INITIAL_ORDERS,
  POPULAR_DESTINATIONS
} from '../data/chignahuapanData';

export default function ChignahuapanLogisticsManager() {
  // Estados principales con persistencia en localStorage
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('tribuna_chignahuapan_orders_v1');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [artisans, setArtisans] = useState(() => {
    const saved = localStorage.getItem('tribuna_chignahuapan_artisans_v1');
    return saved ? JSON.parse(saved) : INITIAL_ARTISANS;
  });

  const [pickups, setPickups] = useState(() => {
    const saved = localStorage.getItem('tribuna_chignahuapan_pickups_v1');
    return saved ? JSON.parse(saved) : INITIAL_PICKUP_SCHEDULE;
  });

  const [wallet, setWallet] = useState(() => {
    const saved = localStorage.getItem('tribuna_castores_wallet_v1');
    return saved ? JSON.parse(saved) : INITIAL_CASTORES_WALLET;
  });

  // Pestaña activa dentro del módulo de Chignahuapan: 'catalog' por defecto para catalogar en ruta
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'orders' | 'calculator' | 'pickups' | 'artisans' | 'alliance'

  // Filtros y búsquedas
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modales
  const [isNewPickupModalOpen, setIsNewPickupModalOpen] = useState(false);
  const [isNewArtisanModalOpen, setIsNewArtisanModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState(null);

  // Estados para el Cotizador Inteligente
  const [calcArtisanId, setCalcArtisanId] = useState(artisans[0]?.id || '');
  const [calcBuyerName, setCalcBuyerName] = useState('');
  const [calcBuyerPhone, setCalcBuyerPhone] = useState('');
  const [calcDestinationCity, setCalcDestinationCity] = useState(POPULAR_DESTINATIONS[0].city);
  const [calcDestinationAddress, setCalcDestinationAddress] = useState('');
  const [calcDeliveryType, setCalcDeliveryType] = useState('Domicilio'); // 'Domicilio' | 'Ocurre Oficina Castores'
  const [calcItemsDescription, setCalcItemsDescription] = useState('3 Cajas de esferas artesanales de cristal soplado (180 piezas surtidas)');
  const [calcBoxesCount, setCalcBoxesCount] = useState(3);
  const [calcBoxLength, setCalcBoxLength] = useState(45); // cm
  const [calcBoxWidth, setCalcBoxWidth] = useState(40); // cm
  const [calcBoxHeight, setCalcBoxHeight] = useState(35); // cm
  const [calcWeightRealKg, setCalcWeightRealKg] = useState(15);
  const [calcPackagingId, setCalcPackagingId] = useState('pack-premium');
  const [calcIncludeShuttlePuebla, setCalcIncludeShuttlePuebla] = useState(true);
  const [calcMarginPct, setCalcMarginPct] = useState(25); // % margen Tribuna sobre Castores
  const [calcPickupFee, setCalcPickupFee] = useState(70.00);

  // Guardar en localStorage ante cambios
  React.useEffect(() => {
    localStorage.setItem('tribuna_chignahuapan_orders_v1', JSON.stringify(orders));
  }, [orders]);

  React.useEffect(() => {
    localStorage.setItem('tribuna_chignahuapan_artisans_v1', JSON.stringify(artisans));
  }, [artisans]);

  React.useEffect(() => {
    localStorage.setItem('tribuna_chignahuapan_pickups_v1', JSON.stringify(pickups));
  }, [pickups]);

  React.useEffect(() => {
    localStorage.setItem('tribuna_castores_wallet_v1', JSON.stringify(wallet));
  }, [wallet]);

  // Cálculos dinámicos del Cotizador
  const quoteCalculation = useMemo(() => {
    const selectedDest = POPULAR_DESTINATIONS.find(d => d.city === calcDestinationCity) || POPULAR_DESTINATIONS[0];
    const selectedPack = PACKAGING_CATALOG.find(p => p.id === calcPackagingId) || PACKAGING_CATALOG[0];

    // Peso volumétrico: (L * W * H / 5000) por cada caja
    const singleBoxVolumetric = (calcBoxLength * calcBoxWidth * calcBoxHeight) / 5000;
    const totalVolumetricWeight = Math.ceil(singleBoxVolumetric * calcBoxesCount);
    const weightToBill = Math.max(calcWeightRealKg, totalVolumetricWeight);

    // Tarifa base Castores (pública estimada según zona y peso a facturar)
    const baseCastoresListPrice = Math.round(weightToBill * selectedDest.baseRatePerKg * (calcDeliveryType === 'Domicilio' ? 1.15 : 1.0));
    
    // Descuento Alianza Castores para Grupo Tribuna (22%)
    const discountAmount = Math.round(baseCastoresListPrice * (CASTORES_ALLIANCE_INFO.discountPercentage / 100));
    const castoresNetCost = baseCastoresListPrice - discountAmount;

    // Margen de utilidad de Grupo Tribuna sobre el flete Castores
    const tribunaFreightMargin = Math.round(baseCastoresListPrice * (calcMarginPct / 100));

    // Costo de Embalaje Frágil (Cobrado al cliente vs Costo material)
    const totalPackagingCharged = selectedPack.costToCustomer * calcBoxesCount;
    const totalPackagingCost = selectedPack.costMaterialTribuna * calcBoxesCount;
    const packagingProfit = totalPackagingCharged - totalPackagingCost;

    // Flete troncal Chignahuapan -> Puebla
    const shuttleTotal = calcIncludeShuttlePuebla ? (calcBoxesCount * CHIGNAHUAPAN_HUB_INFO.shuttleTransferFeeStandard) : 0;
    const shuttleCostEstimate = Math.round(shuttleTotal * 0.45); // Combustible y desgaste unidad Tribuna
    const shuttleProfit = shuttleTotal - shuttleCostEstimate;

    // Recolección local cobrada al artesano
    const pickupProfit = calcPickupFee; // Ingreso directo cobrado al vendedor por recoger en su taller

    // Total a cobrar al cliente final (Comprador de esferas)
    const totalChargedToCustomer = (baseCastoresListPrice + tribunaFreightMargin) + totalPackagingCharged + shuttleTotal;

    // Costo operativo que asume Grupo Tribuna (incluyendo lo que descuenta Castores del saldo prepago)
    const totalOperativeCostTribuna = castoresNetCost + totalPackagingCost + shuttleCostEstimate;

    // Utilidad Neta Total para Grupo Tribuna en esta operación
    const netProfitTribuna = (totalChargedToCustomer + pickupProfit) - totalOperativeCostTribuna;

    return {
      weightToBill,
      totalVolumetricWeight,
      baseCastoresListPrice,
      discountAmount,
      castoresNetCost,
      tribunaFreightMargin,
      totalPackagingCharged,
      totalPackagingCost,
      packagingProfit,
      shuttleTotal,
      shuttleCostEstimate,
      shuttleProfit,
      pickupProfit,
      totalChargedToCustomer,
      totalOperativeCostTribuna,
      netProfitTribuna,
      selectedPack,
      selectedDest
    };
  }, [
    calcDestinationCity,
    calcDeliveryType,
    calcBoxesCount,
    calcBoxLength,
    calcBoxWidth,
    calcBoxHeight,
    calcWeightRealKg,
    calcPackagingId,
    calcIncludeShuttlePuebla,
    calcMarginPct,
    calcPickupFee
  ]);

  // Manejador para crear un nuevo pedido desde el cotizador
  const handleCreateOrderFromQuote = () => {
    if (!calcBuyerName) {
      alert('Por favor ingrese el nombre del comprador o cliente.');
      return;
    }

    if (wallet.currentBalance < quoteCalculation.castoresNetCost) {
      alert(`⚠️ Saldo insuficiente en Monedero Castores ($${wallet.currentBalance.toLocaleString()} MXN). Se requiere al menos $${quoteCalculation.castoresNetCost.toLocaleString()} MXN para documentar la guía.`);
      return;
    }

    const selectedArtisan = artisans.find(a => a.id === calcArtisanId) || artisans[0];
    const newFolio = `GT-CHIG-2026-${String(orders.length + 101).padStart(3, '0')}`;
    const generatedGuide = `${Math.floor(6830300 + Math.random() * 900)}-PUE`;

    const newOrder = {
      id: newFolio,
      castoresGuideNumber: generatedGuide,
      date: new Date().toISOString().split('T')[0],
      artisanId: selectedArtisan.id,
      artisanBusiness: selectedArtisan.businessName,
      buyerName: calcBuyerName,
      buyerPhone: calcBuyerPhone || '+52 55 0000 0000',
      buyerEmail: 'cliente@pedidonavidad.com',
      destinationCity: calcDestinationCity,
      destinationAddress: calcDestinationAddress || `Destino en ${calcDestinationCity}`,
      deliveryType: calcDeliveryType,
      itemsSummary: `${calcBoxesCount} Cajas (${calcItemsDescription})`,
      boxesCount: Number(calcBoxesCount),
      totalWeightKg: Number(calcWeightRealKg),
      volumetricWeightKg: quoteCalculation.totalVolumetricWeight,
      packagingTypeId: calcPackagingId,
      packagingName: quoteCalculation.selectedPack.name,
      requiresTribunaShuttleToPuebla: calcIncludeShuttlePuebla,
      shuttleFee: quoteCalculation.shuttleTotal,
      castoresListPrice: quoteCalculation.baseCastoresListPrice,
      castoresDiscountPct: CASTORES_ALLIANCE_INFO.discountPercentage,
      castoresNetCostToTribuna: quoteCalculation.castoresNetCost,
      tribunaMarginOnCastores: quoteCalculation.tribunaFreightMargin,
      packagingCostCharged: quoteCalculation.totalPackagingCharged,
      packagingCostReal: quoteCalculation.totalPackagingCost,
      localPickupFeeChargedToArtisan: Number(calcPickupFee),
      totalChargedToCustomer: quoteCalculation.totalChargedToCustomer,
      totalOperativeCostTribuna: quoteCalculation.totalOperativeCostTribuna,
      tribunaNetProfit: quoteCalculation.netProfitTribuna,
      status: 'En Bodega Chignahuapan (Acopio)',
      castoresStatus: 'Guía electrónica generada en API Castores · Pendiente arribo a Puebla',
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fragilityWarrantyActive: true,
      notes: `Pedido documentado en Bodega Tribuna. Embalaje ${quoteCalculation.selectedPack.name}.`
    };

    // Descontar del monedero prepago de Castores
    const newBalance = wallet.currentBalance - quoteCalculation.castoresNetCost;
    const newTx = {
      id: `tx-cons-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'CONSUMO_GUIA',
      concept: `Guía Castores #${generatedGuide} - ${newFolio} a ${calcDestinationCity}`,
      amount: -quoteCalculation.castoresNetCost,
      balanceAfter: newBalance,
      reference: `GUIA-${generatedGuide}`
    };

    setWallet(prev => ({
      ...prev,
      currentBalance: newBalance,
      totalConsumed: prev.totalConsumed + quoteCalculation.castoresNetCost,
      transactions: [newTx, ...prev.transactions]
    }));

    // Actualizar pedidos
    setOrders(prev => [newOrder, ...prev]);

    // Actualizar contador del artesano
    setArtisans(prev => prev.map(a => {
      if (a.id === selectedArtisan.id) {
        return { ...a, totalOrdersSent: a.totalOrdersSent + 1 };
      }
      return a;
    }));

    alert(`✅ ¡Envío ${newFolio} creado exitosamente!\nSe descontaron $${quoteCalculation.castoresNetCost.toLocaleString()} MXN del saldo prepago Castores.\nGuía Castores asignada: ${generatedGuide}`);
    setActiveTab('orders');
    setSelectedOrderForLabel(newOrder);
  };

  // Manejador para cambiar estado de un pedido
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      let castoresStatus = o.castoresStatus;
      if (newStatus === 'En Tránsito a Puebla (Conexión Troncal)') {
        castoresStatus = 'En ruta Chignahuapan -> Puebla en Van Tribuna (Salida 18:30 hrs)';
      } else if (newStatus === 'Documentado en Castores Puebla') {
        castoresStatus = 'Recibido en terminal Castores Puebla · Escaneo REMO completado';
      } else if (newStatus === 'En Tránsito Nacional Castores') {
        castoresStatus = `En tránsito interestatal hacia ${o.destinationCity}`;
      } else if (newStatus === 'Entregado al Cliente Final') {
        castoresStatus = 'Entregado con acuse de recibo y sin incidencias de fragilidad';
      }
      return {
        ...o,
        status: newStatus,
        castoresStatus
      };
    }));
  };

  // Manejador de Recargas de Saldo a Castores
  const [depositAmount, setDepositAmount] = useState(20000);
  const [depositRef, setDepositRef] = useState('');

  const handleAddDeposit = (e) => {
    e.preventDefault();
    if (depositAmount <= 0) return;

    const amountNum = Number(depositAmount);
    const newBal = wallet.currentBalance + amountNum;
    const tx = {
      id: `tx-dep-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'DEPOSITO',
      concept: `Depósito bancario a cuenta concentradora Castores (${depositRef || 'Banca Móvil'})`,
      amount: amountNum,
      balanceAfter: newBal,
      reference: depositRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setWallet(prev => ({
      ...prev,
      currentBalance: newBal,
      totalDeposited: prev.totalDeposited + amountNum,
      lastDepositDate: new Date().toISOString().split('T')[0],
      lastDepositAmount: amountNum,
      transactions: [tx, ...prev.transactions]
    }));

    setIsDepositModalOpen(false);
    setDepositRef('');
    alert(`💰 ¡Depósito de $${amountNum.toLocaleString()} MXN registrado correctamente!\nNuevo saldo disponible: $${newBal.toLocaleString()} MXN`);
  };

  // Manejador para programar una nueva recolección
  const [newPickupArtisanId, setNewPickupArtisanId] = useState(artisans[0]?.id || '');
  const [newPickupDate, setNewPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPickupTimeSlot, setNewPickupTimeSlot] = useState('11:00 - 13:00 hrs');
  const [newPickupBoxes, setNewPickupBoxes] = useState(10);
  const [newPickupFee, setNewPickupFee] = useState(70);
  const [newPickupNotes, setNewPickupNotes] = useState('');

  const handleCreatePickup = (e) => {
    e.preventDefault();
    const art = artisans.find(a => a.id === newPickupArtisanId) || artisans[0];
    const newPick = {
      id: `pic-2026-${String(pickups.length + 1).padStart(3, '0')}`,
      artisanId: art.id,
      artisanName: art.businessName,
      workshopAddress: art.workshopAddress,
      pickupDate: newPickupDate,
      timeSlot: newPickupTimeSlot,
      estimatedBoxes: Number(newPickupBoxes),
      pickupFeeCharged: Number(newPickupFee),
      paymentStatus: 'Pendiente de Cobro',
      assignedDriver: 'Manuel Romero (Unidad Van-01)',
      status: 'Programada',
      notes: newPickupNotes || 'Recolección de cajas para consolidación en Bodega Chignahuapan.'
    };

    setPickups(prev => [newPick, ...prev]);
    setIsNewPickupModalOpen(false);
    setNewPickupNotes('');
    alert(`📅 ¡Recolección en taller ${art.businessName} agendada para el ${newPickupDate} (${newPickupTimeSlot})!`);
  };

  // Manejador para registrar un nuevo artesano
  const [newArtisanName, setNewArtisanName] = useState('');
  const [newArtisanOwner, setNewArtisanOwner] = useState('');
  const [newArtisanAddress, setNewArtisanAddress] = useState('');
  const [newArtisanPhone, setNewArtisanPhone] = useState('');
  const [newArtisanSpecialty, setNewArtisanSpecialty] = useState('');
  const [newArtisanFee, setNewArtisanFee] = useState(65);

  const handleCreateArtisan = (e) => {
    e.preventDefault();
    if (!newArtisanName) return;

    const newArt = {
      id: `art-${String(artisans.length + 1).padStart(2, '0')}`,
      businessName: newArtisanName,
      artisanName: newArtisanOwner || 'Artesano Registrado',
      workshopAddress: newArtisanAddress || 'Chignahuapan, Puebla',
      phone: newArtisanPhone || '+52 797 000 0000',
      specialty: newArtisanSpecialty || 'Esferas tradicionales decoradas',
      rating: 5.0,
      yearsInBusiness: 10,
      negotiatedPickupFee: Number(newArtisanFee),
      totalOrdersSent: 0,
      activePendingPickups: 0,
      notes: 'Nuevo taller incorporado a la red de envíos de Grupo Tribuna.'
    };

    setArtisans(prev => [...prev, newArt]);
    setIsNewArtisanModalOpen(false);
    setNewArtisanName('');
    setNewArtisanOwner('');
    setNewArtisanAddress('');
    setNewArtisanPhone('');
    setNewArtisanSpecialty('');
    alert(`🎨 ¡Taller artesano "${newArt.businessName}" dado de alta con éxito!`);
  };

  // KPIs Financieros Consolidados de la División
  const totalBilledOrders = orders.reduce((acc, o) => acc + (o.totalChargedToCustomer || 0), 0);
  const totalNetProfitTribuna = orders.reduce((acc, o) => acc + (o.tribunaNetProfit || 0), 0);
  const totalBoxesShipped = orders.reduce((acc, o) => acc + (o.boxesCount || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Entregado al Cliente Final').length;

  // Filtrado de órdenes
  const filteredOrders = orders.filter(o => {
    const matchSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.castoresGuideNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.destinationCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.artisanBusiness.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchSearch;
    return matchSearch && o.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* BANNER PRINCIPAL DE LA DIVISIÓN */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md flex items-center space-x-1.5 border border-emerald-400/30">
                <span>🎄</span>
                <span>GRUPO TRIBUNA LOGÍSTICA</span>
              </span>
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <span>📦</span>
                <span>División Envíos Chignahuapan</span>
              </span>
              <span className="bg-sky-950/80 text-sky-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-sky-700/50">
                Alianza Oficial Castores ({CASTORES_ALLIANCE_INFO.discountPercentage}% Descuento)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Hub de Acopio, Protección Frágil & Envíos de Esferas Navideñas
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Solución logística integral para artesanos y compradores de Chignahuapan, Puebla. 
              Resguardamos compras de gran volumen en nuestra <strong>Bodega Hub</strong>, aplicamos <strong>embalaje especializado antishock</strong>, conectamos con la terminal de <strong>Grupo Castores en Puebla</strong> y garantizamos entregas seguras en todo México con tarifas corporativas preferenciales.
            </p>

            {/* Badges de Operación */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>Bodega Chignahuapan: <strong>{CHIGNAHUAPAN_HUB_INFO.currentStoredBoxes} / {CHIGNAHUAPAN_HUB_INFO.storageCapacityBoxes} cajas</strong></span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Salida Troncal Puebla: <strong>18:30 hrs Diaria</strong></span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Garantía de Cristal Soplado: <strong>100% Protegido</strong></span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Monedero Prepago Castores */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 w-full lg:w-80 shadow-xl backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Saldo Prepago Castores</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                API Activa
              </span>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">
                ${wallet.currentBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-slate-400 flex justify-between mt-1">
                <span>Consumido: ${wallet.totalConsumed.toLocaleString()}</span>
                <span>Convenio 22% OFF</span>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round((wallet.currentBalance / wallet.totalDeposited) * 100))}%` }}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Recargar Saldo</span>
              </button>
              <button
                onClick={() => setActiveTab('alliance')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-3 py-2 rounded-xl text-xs transition-colors"
                title="Ver detalles de la alianza"
              >
                Convenio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPIS ESTRATÉGICOS DE LA DIVISIÓN */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Envíos Totales Temporada */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Envíos Documentados</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{orders.length}</div>
          <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
            <span className="text-emerald-600 font-bold">● {activeOrdersCount} en tránsito</span>
            <span>· {totalBoxesShipped} cajas totales</span>
          </p>
        </div>

        {/* KPI 2: Facturación Total Clientes */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Facturado Clientes</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ${totalBilledOrders.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Flete nacional + Embalaje + Troncal
          </p>
        </div>

        {/* KPI 3: Utilidad Neta Grupo Tribuna */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg shadow-emerald-900/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Utilidad Neta Tribuna</span>
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ${totalNetProfitTribuna.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-emerald-100 mt-1">
            Margen Castores + Embalaje + Recolecciones
          </p>
        </div>

        {/* KPI 4: Red de Artesanos & Talleres */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Artesanos Aliados</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{artisans.length}</div>
          <p className="text-xs text-slate-500 mt-1">
            Talleres activos en Chignahuapan
          </p>
        </div>

      </div>

      {/* PESTAÑAS DE NAVEGACIÓN DEL MÓDULO */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 'catalog'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-md shadow-emerald-900/30'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
          }`}
        >
          <Camera className="w-4 h-4 text-amber-300" />
          <span>📸 Catálogo de Esferas (Móvil)</span>
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
            Alimentar
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-900/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Gestión de Pedidos & Envíos ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 'calculator'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-900/20'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Cotizador Inteligente Multicomponente</span>
        </button>

        <button
          onClick={() => setActiveTab('pickups')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 'pickups'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Recolección en Talleres ({pickups.filter(p => p.status !== 'Completada en Bodega').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('artisans')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 'artisans'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Directorio de Artesanos ({artisans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alliance')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 'alliance'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4 text-amber-500" />
          <span>Alianza Grupo Castores & Monedero</span>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* PESTAÑA 0: CATÁLOGO DE ESFERAS (MÓVIL & COMPRA CONSOLIDADA) */}
      {/* ========================================================================= */}
      {activeTab === 'catalog' && (
        <ChignahuapanCatalogManager 
          onOpenShippingQuote={() => setActiveTab('calculator')}
        />
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 1: GESTIÓN DE PEDIDOS Y ENVÍOS (TABLA OPERATIVA) */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Barra de Búsqueda y Acciones */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 w-full">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por folio, cliente, guía o destino..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="ALL">Todos los Estados ({orders.length})</option>
                <option value="En Bodega Chignahuapan (Acopio)">En Bodega (Acopio)</option>
                <option value="Embalaje Especializado Aplicado">Embalaje Aplicado</option>
                <option value="En Tránsito a Puebla (Conexión Troncal)">En Tránsito a Puebla</option>
                <option value="Documentado en Castores Puebla">Documentado en Castores</option>
                <option value="En Tránsito Nacional Castores">En Tránsito Nacional</option>
                <option value="Entregado al Cliente Final">Entregado</option>
              </select>
            </div>

            <button
              onClick={() => setActiveTab('calculator')}
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Cotizar & Crear Envío</span>
            </button>
          </div>

          {/* Listado de Envíos */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">No se encontraron envíos</h3>
                <p className="text-xs text-slate-500 mt-1">Intenta con otros términos o crea un nuevo envío desde el cotizador.</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div 
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-black text-sm flex items-center justify-center">
                        GT
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-slate-900 text-sm sm:text-base">{order.id}</span>
                          <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-lg font-mono font-bold border border-slate-200">
                            Guía Castores: {order.castoresGuideNumber}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                          <span>Fecha: {order.date}</span>
                          <span>•</span>
                          <span>Taller: <strong>{order.artisanBusiness}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Selector de Estado Operativo */}
                    <div className="flex items-center space-x-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-colors ${
                          order.status === 'Entregado al Cliente Final'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.status === 'En Tránsito Nacional Castores'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="En Bodega Chignahuapan (Acopio)">📦 En Bodega (Acopio)</option>
                        <option value="Embalaje Especializado Aplicado">🛡️ Embalaje Especializado</option>
                        <option value="En Tránsito a Puebla (Conexión Troncal)">🚐 En Tránsito a Puebla</option>
                        <option value="Documentado en Castores Puebla">🏢 Documentado en Castores</option>
                        <option value="En Tránsito Nacional Castores">🚚 En Tránsito Nacional</option>
                        <option value="Entregado al Cliente Final">✅ Entregado al Cliente Final</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrderForLabel(order)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 border border-slate-300 transition-colors"
                        title="Ver e imprimir guía oficial y etiqueta frágil"
                      >
                        <Barcode className="w-3.5 h-3.5" />
                        <span>Etiqueta</span>
                      </button>
                    </div>

                  </div>

                  {/* Cuerpo del Pedido */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    
                    {/* Datos del Comprador y Destino */}
                    <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="font-bold text-slate-800 flex items-center space-x-1.5 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>Comprador & Destino</span>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">{order.buyerName}</p>
                      <p className="text-slate-600">{order.destinationCity}</p>
                      <p className="text-slate-500 text-[11px] truncate" title={order.destinationAddress}>{order.destinationAddress}</p>
                      <div className="text-[11px] text-slate-600 flex items-center space-x-1 pt-1">
                        <Phone className="w-3 h-3" />
                        <span>{order.buyerPhone}</span>
                        <span className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px] font-semibold">{order.deliveryType}</span>
                      </div>
                    </div>

                    {/* Especificaciones de Carga y Embalaje */}
                    <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="font-bold text-slate-800 flex items-center space-x-1.5 text-xs">
                        <Boxes className="w-3.5 h-3.5 text-amber-500" />
                        <span>Contenido & Embalaje Frágil</span>
                      </div>
                      <p className="font-semibold text-slate-900">{order.itemsSummary}</p>
                      <p className="text-slate-600">
                        {order.boxesCount} Cajas · {order.totalWeightKg} kg real ({order.volumetricWeightKg} kg vol.)
                      </p>
                      <div className="flex items-center space-x-1.5 pt-1">
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                          {order.packagingName}
                        </span>
                        {order.fragilityWarrantyActive && (
                          <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[10px] flex items-center space-x-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Garantía Esfera</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Desglose Económico y Ganancia */}
                    <div className="space-y-1.5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-3.5 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between text-slate-300 text-[11px]">
                        <span>Cobrado al Cliente:</span>
                        <span className="font-bold text-white text-xs">${order.totalChargedToCustomer?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Costo Neto Castores (Desc. 22%):</span>
                        <span>-${order.castoresNetCostToTribuna?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Costo Material Embalaje:</span>
                        <span>-${order.packagingCostReal?.toLocaleString()}</span>
                      </div>
                      {order.localPickupFeeChargedToArtisan > 0 && (
                        <div className="flex items-center justify-between text-emerald-300 text-[11px]">
                          <span>Recolección al Vendedor:</span>
                          <span>+${order.localPickupFeeChargedToArtisan}</span>
                        </div>
                      )}
                      <div className="border-t border-slate-700 pt-1.5 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">Ganancia Neta Tribuna:</span>
                        <span className="text-base font-black text-emerald-400">
                          +${order.tribunaNetProfit?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Estatus detallado Castores */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Truck className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span><strong>Rastreo Castores:</strong> {order.castoresStatus}</span>
                    </div>
                    <span className="text-slate-500 font-medium">Entrega estimada: <strong>{order.estimatedDeliveryDate}</strong></span>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 2: COTIZADOR INTELIGENTE MULTICOMPONENTE */}
      {/* ========================================================================= */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel Izquierdo: Formulario de Parámetros de Cotización */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            
            <div className="border-b border-slate-100 pb-3">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulador & Generador de Envíos</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Cotizador Multicomponente de Envíos de Esferas
              </h2>
              <p className="text-xs text-slate-500">
                Calcula al instante el precio al cliente, el descuento de Castores, el costo de embalaje frágil y la utilidad de Grupo Tribuna.
              </p>
            </div>

            {/* Paso 1: Taller Artesano de Origen en Chignahuapan */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Taller / Artesano de Chignahuapan (Origen)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <select
                    value={calcArtisanId}
                    onChange={(e) => {
                      setCalcArtisanId(e.target.value);
                      const art = artisans.find(a => a.id === e.target.value);
                      if (art) setCalcPickupFee(art.negotiatedPickupFee);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-red-500"
                  >
                    {artisans.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.businessName} ({a.artisanName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-600 font-medium">Cobro Recolección al Vendedor:</span>
                  <div className="flex items-center space-x-1 font-bold text-xs text-slate-900">
                    <span>$</span>
                    <input
                      type="number"
                      value={calcPickupFee}
                      onChange={(e) => setCalcPickupFee(Number(e.target.value))}
                      className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-center text-xs"
                    />
                    <span>MXN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Paso 2: Datos del Comprador y Destino */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Destino & Datos del Comprador
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Ciudad de Destino:</label>
                  <select
                    value={calcDestinationCity}
                    onChange={(e) => setCalcDestinationCity(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-red-500"
                  >
                    {POPULAR_DESTINATIONS.map(d => (
                      <option key={d.city} value={d.city}>
                        {d.city} ({d.avgDays})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Modalidad de Entrega:</label>
                  <select
                    value={calcDeliveryType}
                    onChange={(e) => setCalcDeliveryType(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Domicilio">Entrega a Domicilio (+15% seguro y entrega)</option>
                    <option value="Ocurre Oficina Castores">Ocurre en Sucursal Castores (Económico)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Nombre del Comprador:</label>
                  <input
                    type="text"
                    value={calcBuyerName}
                    onChange={(e) => setCalcBuyerName(e.target.value)}
                    placeholder="Ej. Ing. Salvador Garza"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Teléfono / WhatsApp:</label>
                  <input
                    type="text"
                    value={calcBuyerPhone}
                    onChange={(e) => setCalcBuyerPhone(e.target.value)}
                    placeholder="+52 81 0000 0000"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">Dirección Completa de Entrega:</label>
                <input
                  type="text"
                  value={calcDestinationAddress}
                  onChange={(e) => setCalcDestinationAddress(e.target.value)}
                  placeholder="Calle, número, colonia, municipio y código postal"
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Paso 3: Dimensiones de Cajas y Tipo de Embalaje Frágil */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Dimensiones, Peso & Embalaje Frágil para Esferas
              </label>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">Descripción de la Carga de Esferas:</label>
                <input
                  type="text"
                  value={calcItemsDescription}
                  onChange={(e) => setCalcItemsDescription(e.target.value)}
                  placeholder="Ej. 4 Cajas Grandes con 480 esferas doradas tradicionales"
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Núm. Cajas:</label>
                  <input
                    type="number"
                    min="1"
                    value={calcBoxesCount}
                    onChange={(e) => setCalcBoxesCount(Math.max(1, Number(e.target.value)))}
                    className="w-full mt-1 px-2 py-1.5 border border-slate-300 rounded-lg font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Largo (cm):</label>
                  <input
                    type="number"
                    value={calcBoxLength}
                    onChange={(e) => setCalcBoxLength(Number(e.target.value))}
                    className="w-full mt-1 px-2 py-1.5 border border-slate-300 rounded-lg text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Ancho (cm):</label>
                  <input
                    type="number"
                    value={calcBoxWidth}
                    onChange={(e) => setCalcBoxWidth(Number(e.target.value))}
                    className="w-full mt-1 px-2 py-1.5 border border-slate-300 rounded-lg text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Alto (cm):</label>
                  <input
                    type="number"
                    value={calcBoxHeight}
                    onChange={(e) => setCalcBoxHeight(Number(e.target.value))}
                    className="w-full mt-1 px-2 py-1.5 border border-slate-300 rounded-lg text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Peso Real (kg):</label>
                  <input
                    type="number"
                    value={calcWeightRealKg}
                    onChange={(e) => setCalcWeightRealKg(Number(e.target.value))}
                    className="w-full mt-1 px-2 py-1.5 border border-slate-300 rounded-lg font-bold text-center"
                  />
                </div>
              </div>

              {/* Selector de Embalaje Frágil */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-semibold text-slate-700">Seleccionar Nivel de Embalaje Protector:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PACKAGING_CATALOG.map(pkg => (
                    <div
                      key={pkg.id}
                      onClick={() => setCalcPackagingId(pkg.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        calcPackagingId === pkg.id
                          ? 'border-red-500 bg-red-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>{pkg.name}</span>
                        <span className="text-red-700">${pkg.costToCustomer} c/u</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                        {pkg.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opciones Adicionales de Flete y Margen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={calcIncludeShuttlePuebla}
                    onChange={(e) => setCalcIncludeShuttlePuebla(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="font-bold text-slate-800">Conexión Troncal Chignahuapan → Puebla</span>
                    <p className="text-[10px] text-slate-500">Van Sprinter con suspensión neumática ($85 por caja)</p>
                  </div>
                </label>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <span className="font-bold text-slate-700">Margen Tribuna sobre Castores:</span>
                  <div className="flex items-center space-x-1 font-bold">
                    <input
                      type="number"
                      value={calcMarginPct}
                      onChange={(e) => setCalcMarginPct(Number(e.target.value))}
                      className="w-12 px-1 py-0.5 border border-slate-300 rounded text-center text-xs"
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Panel Derecho: Resumen Financiero y Documentación */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white rounded-3xl p-6 shadow-xl border border-slate-700/80 space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">Desglose de Cotización</span>
                  <h3 className="text-lg font-black text-white">Resumen Financiero del Envío</h3>
                </div>
                <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
                  {calcBoxesCount} Cajas ({quoteCalculation.weightToBill} kg)
                </span>
              </div>

              {/* Comparador de Precios Castores (Lista vs Descuento Alianza) */}
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Tarifa Lista Pública Castores:</span>
                  <span className="line-through text-slate-400">${quoteCalculation.baseCastoresListPrice.toLocaleString()} MXN</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span>Descuento Convenio Alianza ({CASTORES_ALLIANCE_INFO.discountPercentage}%):</span>
                  <span>-${quoteCalculation.discountAmount.toLocaleString()} MXN</span>
                </div>
                <div className="flex items-center justify-between text-amber-300 font-bold border-t border-slate-700 pt-1.5">
                  <span>Costo Neto Castores (a descontar de saldo):</span>
                  <span>${quoteCalculation.castoresNetCost.toLocaleString()} MXN</span>
                </div>
              </div>

              {/* Desglose de lo cobrado al Comprador */}
              <div className="space-y-2 text-xs">
                <div className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Conceptos Cobrados al Cliente:</div>
                
                <div className="flex items-center justify-between text-slate-200">
                  <span>Flete Nacional Castores + Margen Tribuna ({calcMarginPct}%):</span>
                  <span className="font-bold">${(quoteCalculation.baseCastoresListPrice + quoteCalculation.tribunaFreightMargin).toLocaleString()} MXN</span>
                </div>

                <div className="flex items-center justify-between text-slate-200">
                  <span>Embalaje Especializado ({quoteCalculation.selectedPack.name}):</span>
                  <span className="font-bold">${quoteCalculation.totalPackagingCharged.toLocaleString()} MXN</span>
                </div>

                {calcIncludeShuttlePuebla && (
                  <div className="flex items-center justify-between text-slate-200">
                    <span>Flete Conexión Chignahuapan → Puebla ({calcBoxesCount} cajas):</span>
                    <span className="font-bold">${quoteCalculation.shuttleTotal.toLocaleString()} MXN</span>
                  </div>
                )}

                <div className="border-t border-slate-700 pt-2 flex items-center justify-between">
                  <span className="text-sm font-black text-white">TOTAL COTIZADO AL CLIENTE:</span>
                  <span className="text-2xl font-black text-amber-400">
                    ${quoteCalculation.totalChargedToCustomer.toLocaleString()} MXN
                  </span>
                </div>
              </div>

              {/* Desglose de Utilidad Neta de Grupo Tribuna */}
              <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>UTILIDAD NETA GRUPO TRIBUNA:</span>
                  <span className="text-xl font-black text-emerald-300">
                    +${quoteCalculation.netProfitTribuna.toLocaleString()} MXN
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-200/90 pt-1 border-t border-emerald-800/60">
                  <div>• Margen Flete: +${quoteCalculation.tribunaFreightMargin + quoteCalculation.discountAmount}</div>
                  <div>• Margen Embalaje: +${quoteCalculation.packagingProfit}</div>
                  <div>• Ganancia Troncal: +${quoteCalculation.shuttleProfit}</div>
                  <div>• Recolección Taller: +${quoteCalculation.pickupProfit}</div>
                </div>
              </div>

              {/* Botón de Emisión de Orden */}
              <button
                onClick={handleCreateOrderFromQuote}
                className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-xl transition-all transform active:scale-95 text-sm flex items-center justify-center space-x-2"
              >
                <Barcode className="w-5 h-5" />
                <span>Documentar Envío & Descontar de Castores</span>
              </button>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Garantía de protección contra rotura de esferas activada automáticamente.</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 3: RECOLECCIÓN EN TALLERES & TIENDAS */}
      {/* ========================================================================= */}
      {activeTab === 'pickups' && (
        <div className="space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Agenda de Recolecciones Locales en Chignahuapan
              </h3>
              <p className="text-xs text-slate-500">
                Camionetas y vans recolectando pedidos en los talleres de los artesanos para concentrar en la Bodega Hub.
              </p>
            </div>

            <button
              onClick={() => setIsNewPickupModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Programar Recolección</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pickups.map(pickup => (
              <div 
                key={pickup.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{pickup.artisanName}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                      {pickup.id}
                    </span>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    pickup.status === 'Completada en Bodega'
                      ? 'bg-emerald-100 text-emerald-800'
                      : pickup.status === 'En Proceso de Recolección'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {pickup.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span>{pickup.workshopAddress}</span>
                  </p>
                  <p className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>Fecha: <strong>{pickup.pickupDate}</strong> ({pickup.timeSlot})</span>
                  </p>
                  <p className="flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>Operador Asignado: <strong>{pickup.assignedDriver}</strong></span>
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Cajas Estimadas:</span>
                    <div className="font-bold text-slate-900 text-sm">{pickup.estimatedBoxes} bultos</div>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-500">Tarifa al Vendedor:</span>
                    <div className="font-bold text-emerald-700 text-sm">${pickup.pickupFeeCharged} MXN</div>
                    <span className="text-[10px] text-slate-500 font-semibold">{pickup.paymentStatus}</span>
                  </div>
                </div>

                {pickup.status !== 'Completada en Bodega' && (
                  <button
                    onClick={() => {
                      setPickups(prev => prev.map(p => {
                        if (p.id === pickup.id) {
                          return {
                            ...p,
                            status: 'Completada en Bodega',
                            paymentStatus: 'Cobrado al Vendedor'
                          };
                        }
                        return p;
                      }));
                      alert(`✅ Recolección ${pickup.id} marcada como recibida en Bodega Hub Chignahuapan.`);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Marcar Recibido en Bodega Hub</span>
                  </button>
                )}

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 4: DIRECTORIO DE ARTESANOS Y TALLERES */}
      {/* ========================================================================= */}
      {activeTab === 'artisans' && (
        <div className="space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Padrón de Artesanos & Talleres de Esferas Registrados
              </h3>
              <p className="text-xs text-slate-500">
                Productores de Chignahuapan integrados a la plataforma de envíos con tarifa de recolección convenida.
              </p>
            </div>

            <button
              onClick={() => setIsNewArtisanModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Nuevo Artesano</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artisans.map(art => (
              <div 
                key={art.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{art.id}</span>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                        {art.businessName}
                      </h4>
                    </div>
                    <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2 py-0.5 rounded-lg flex items-center space-x-0.5">
                      <span>★</span>
                      <span>{art.rating}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    Responsable: <strong>{art.artisanName}</strong> ({art.yearsInBusiness} años en el oficio)
                  </p>

                  <p className="text-xs text-slate-600 flex items-start space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{art.workshopAddress}</span>
                  </p>

                  <p className="text-xs text-slate-600 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{art.phone}</span>
                  </p>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Especialidad: </span>
                    <span>{art.specialty}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Envíos Despachados:</span>
                    <div className="font-bold text-slate-900 text-sm">{art.totalOrdersSent} órdenes</div>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-500 text-[11px]">Costo Recolección:</span>
                    <div className="font-bold text-emerald-700 text-sm">${art.negotiatedPickupFee} MXN</div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 5: ALIANZA GRUPO CASTORES & ESTADO DE CUENTA */}
      {/* ========================================================================= */}
      {activeTab === 'alliance' && (
        <div className="space-y-6">
          
          {/* Ficha Oficial de la Alianza Castores */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  GC
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-red-100 text-red-800 font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                      Convenio Comercial Noviembre 2026
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Folio: {CASTORES_ALLIANCE_INFO.contractFolio}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    Alianza Estratégica: {CASTORES_ALLIANCE_INFO.partnerName}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Atención Directa: <strong>{CASTORES_ALLIANCE_INFO.representative}</strong> ({CASTORES_ALLIANCE_INFO.representativeRole}) · Sucursal Puebla
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Depósito Prepago</span>
              </button>
            </div>

            {/* Términos del Acuerdo según la carta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <span className="text-red-600 font-black">22%</span>
                  <span>Descuento Corporativo</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Descuento directo sobre tarifas generales públicas para paquetería y carga consolidada en toda la República Mexicana.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  <span>Modalidad Prepagada</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Depósitos anticipados con dispersión automática conforme se generan envíos vía API, evitando trámites individuales por caja.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Seguro & Conexión Puebla</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Integración directa con el sistema API de Castores, escaneo de evidencias REMO y salidas diarias desde Puebla.
                </p>
              </div>

            </div>

            {/* Historial de Movimientos del Saldo Prepago */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">
                  Estado de Cuenta & Movimientos del Monedero Prepago
                </h4>
                <span className="text-xs text-slate-500">
                  Cuenta Concentradora: {wallet.bankReference}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Concepto / Guía</th>
                      <th className="p-3">Referencia</th>
                      <th className="p-3 text-right">Monto</th>
                      <th className="p-3 text-right">Saldo Posterior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {wallet.transactions.map((tx, idx) => (
                      <tr key={tx.id || idx} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-600">{tx.date}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            tx.type === 'DEPOSITO' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-slate-800">{tx.concept}</td>
                        <td className="p-3 font-mono text-slate-500 text-[11px]">{tx.reference}</td>
                        <td className={`p-3 text-right font-black ${
                          tx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'
                        }`}>
                          {tx.amount > 0 ? `+$${tx.amount.toLocaleString()}` : `-$${Math.abs(tx.amount).toLocaleString()}`}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          ${tx.balanceAfter.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VISOR DE ETIQUETA / GUÍA OFICIAL PARA IMPRIMIR */}
      {/* ========================================================================= */}
      {selectedOrderForLabel && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Etiqueta de Embarque Oficial</span>
                <h3 className="text-lg font-black text-slate-900">{selectedOrderForLabel.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderForLabel(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Recuadro Imprimible de la Etiqueta */}
            <div className="border-4 border-dashed border-slate-800 p-5 rounded-2xl space-y-4 bg-slate-50/50">
              
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
                <div>
                  <div className="text-xl font-black tracking-tight text-slate-950">GRUPO TRIBUNA</div>
                  <div className="text-[10px] font-bold text-red-700 uppercase">División Logística Chignahuapan</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-red-600">PAQUETERÍA CASTORES</div>
                  <div className="text-[11px] font-mono font-bold">Guía: {selectedOrderForLabel.castoresGuideNumber}</div>
                </div>
              </div>

              {/* Advertencia de Fragilidad */}
              <div className="bg-red-600 text-white font-black text-center py-2 px-3 rounded-xl tracking-wider text-sm shadow-md animate-pulse">
                ⚠️ ALTA FRAGILIDAD · ESFERAS ARTESANALES DE CRISTAL SOPLADO · MANÉJESE CON EXTREMO CUIDADO ⚠️
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="border-r border-slate-300 pr-3 space-y-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Remitente:</span>
                  <p className="font-extrabold text-slate-900">{CHIGNAHUAPAN_HUB_INFO.hubName}</p>
                  <p className="text-slate-600">{CHIGNAHUAPAN_HUB_INFO.address}</p>
                  <p className="text-slate-600">Chignahuapan, Pue. C.P. 73300</p>
                  <p className="text-[11px] text-slate-500">Taller Origen: <strong>{selectedOrderForLabel.artisanBusiness}</strong></p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Destinatario:</span>
                  <p className="font-extrabold text-slate-900">{selectedOrderForLabel.buyerName}</p>
                  <p className="text-slate-700 font-medium">{selectedOrderForLabel.destinationAddress}</p>
                  <p className="font-bold text-slate-900">{selectedOrderForLabel.destinationCity}</p>
                  <p className="text-slate-600">Tel: {selectedOrderForLabel.buyerPhone}</p>
                </div>
              </div>

              <div className="bg-slate-200/80 p-3 rounded-xl flex items-center justify-between text-xs font-semibold">
                <span>Cajas: <strong>{selectedOrderForLabel.boxesCount}</strong></span>
                <span>Peso Real: <strong>{selectedOrderForLabel.totalWeightKg} kg</strong></span>
                <span>Volumétrico: <strong>{selectedOrderForLabel.volumetricWeightKg} kg</strong></span>
                <span>Embalaje: <strong>{selectedOrderForLabel.packagingName}</strong></span>
              </div>

              {/* Simulación Código de Barras */}
              <div className="text-center pt-2">
                <div className="font-mono text-xs font-bold tracking-widest text-slate-700">
                  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  *{selectedOrderForLabel.id}*{selectedOrderForLabel.castoresGuideNumber}*
                </div>
              </div>

            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Etiqueta Oficial</span>
              </button>
              <button
                onClick={() => setSelectedOrderForLabel(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl text-xs sm:text-sm"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PROGRAMAR NUEVA RECOLECCIÓN EN TALLER */}
      {/* ========================================================================= */}
      {isNewPickupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Programar Recolección en Taller</h3>
              <button onClick={() => setIsNewPickupModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreatePickup} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Taller Artesano:</label>
                <select
                  value={newPickupArtisanId}
                  onChange={(e) => {
                    setNewPickupArtisanId(e.target.value);
                    const art = artisans.find(a => a.id === e.target.value);
                    if (art) setNewPickupFee(art.negotiatedPickupFee);
                  }}
                  className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50"
                >
                  {artisans.map(a => (
                    <option key={a.id} value={a.id}>{a.businessName} - {a.workshopAddress}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Fecha de Recolección:</label>
                  <input
                    type="date"
                    value={newPickupDate}
                    onChange={(e) => setNewPickupDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Franja Horaria:</label>
                  <input
                    type="text"
                    value={newPickupTimeSlot}
                    onChange={(e) => setNewPickupTimeSlot(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Cajas Estimadas:</label>
                  <input
                    type="number"
                    value={newPickupBoxes}
                    onChange={(e) => setNewPickupBoxes(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Tarifa a Cobrar ($ MXN):</label>
                  <input
                    type="number"
                    value={newPickupFee}
                    onChange={(e) => setNewPickupFee(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Notas / Instrucciones de Carga:</label>
                <textarea
                  value={newPickupNotes}
                  onChange={(e) => setNewPickupNotes(e.target.value)}
                  placeholder="Detalles sobre fragilidad, cajas listas en mostrador, etc."
                  rows={2}
                  className="w-full mt-1 px-3 py-2 border rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl mt-2"
              >
                Guardar Recolección
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTRAR NUEVO ARTESANO */}
      {/* ========================================================================= */}
      {isNewArtisanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Registrar Taller Artesano en Chignahuapan</h3>
              <button onClick={() => setIsNewArtisanModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateArtisan} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Nombre del Taller / Negocio:</label>
                <input
                  type="text"
                  required
                  value={newArtisanName}
                  onChange={(e) => setNewArtisanName(e.target.value)}
                  placeholder="Ej. Taller Artesanal La Sagrada Familia"
                  className="w-full mt-1 px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Artesano Responsable:</label>
                  <input
                    type="text"
                    value={newArtisanOwner}
                    onChange={(e) => setNewArtisanOwner(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Teléfono / WhatsApp:</label>
                  <input
                    type="text"
                    value={newArtisanPhone}
                    onChange={(e) => setNewArtisanPhone(e.target.value)}
                    placeholder="+52 797 000 0000"
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Dirección en Chignahuapan:</label>
                <input
                  type="text"
                  value={newArtisanAddress}
                  onChange={(e) => setNewArtisanAddress(e.target.value)}
                  placeholder="Calle, número, barrio o colonia"
                  className="w-full mt-1 px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Especialidad de Esfera:</label>
                  <input
                    type="text"
                    value={newArtisanSpecialty}
                    onChange={(e) => setNewArtisanSpecialty(e.target.value)}
                    placeholder="Ej. Esferas caladas, vitral, jumbo"
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Tarifa Acordada Recolección ($):</label>
                  <input
                    type="number"
                    value={newArtisanFee}
                    onChange={(e) => setNewArtisanFee(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl mt-2 shadow-md"
              >
                Dar de Alta Taller
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RECARGAR SALDO PREPAGO CASTORES */}
      {/* ========================================================================= */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase">Monedero Prepagado</span>
                <h3 className="text-base font-extrabold text-slate-900">Registrar Depósito a Castores</h3>
              </div>
              <button onClick={() => setIsDepositModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddDeposit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Monto a Depositar ($ MXN):</label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 border rounded-xl font-bold text-base text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Referencia Bancaria / CIE BBVA:</label>
                <input
                  type="text"
                  value={depositRef}
                  onChange={(e) => setDepositRef(e.target.value)}
                  placeholder="Ej. SPEI-9923847-CASTORES"
                  className="w-full mt-1 px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/80 text-amber-900 text-[11px] space-y-1">
                <p className="font-bold">Información de la Cuenta Concentradora:</p>
                <p>Banco: BBVA Bancomer · Convenio CIE: 1892349</p>
                <p>Beneficiario: Grupo Castores Paquetería S.A. de C.V.</p>
                <p>El saldo se aplicará inmediatamente a la plataforma para el descuento de guías.</p>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl mt-2 shadow-md text-sm"
              >
                Confirmar Depósito al Saldo
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
