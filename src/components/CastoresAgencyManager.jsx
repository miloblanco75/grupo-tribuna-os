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
  HelpCircle,
  Settings,
  CheckSquare,
  Square,
  Tag,
  Info,
  Camera,
  ShieldAlert,
  Eye
} from 'lucide-react';

import {
  CASTORES_ALLIANCE_INFO,
  CHIGNAHUAPAN_HUB_INFO,
  INITIAL_SHUTTLE_CONFIG,
  PACKAGING_CATALOG,
  INITIAL_ARTISANS,
  INITIAL_ORDERS,
  POPULAR_DESTINATIONS,
  TIERS_CONFIG,
  AGENCY_REWARDS_CATALOG,
  REGISTERED_CLIENTS_PRESETS,
  SPHERE_CONTENT_CATEGORIES,
  CONTENT_QUICK_TAGS
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

  // Configuración manual de Salidas Troncales a Puebla (Horario, chofer, días, etc.)
  const [shuttleConfig, setShuttleConfig] = useState(() => {
    const saved = localStorage.getItem('tribuna_shuttle_config_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SHUTTLE_CONFIG;
  });

  const [isShuttleModalOpen, setIsShuttleModalOpen] = useState(false);
  const [tempShuttleConfig, setTempShuttleConfig] = useState(shuttleConfig);

  useEffect(() => {
    localStorage.setItem('tribuna_shuttle_config_v1', JSON.stringify(shuttleConfig));
  }, [shuttleConfig]);

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
  const [selectedLabelOrder, setSelectedLabelOrder] = useState(null);
  const [selectedBoxIndexForLabel, setSelectedBoxIndexForLabel] = useState('ALL');
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [rewardToRedeem, setRewardToRedeem] = useState(null);

  // Filtros de búsqueda en directorio
  const [merchantSearchTerm, setMerchantSearchTerm] = useState('');
  const [merchantTierFilter, setMerchantTierFilter] = useState('ALL');

  // =========================================================================
  // ESTADOS DEL MOSTRADOR / RECEPCIÓN DE ENVÍOS EN BODEGA
  // =========================================================================
  const [counterMerchantId, setCounterMerchantId] = useState(merchants[0]?.id || '');

  // Selección de Cliente / Comprador
  const [counterClientPresetId, setCounterClientPresetId] = useState('');
  const [counterClientType, setCounterClientType] = useState('Turista Particular en Tienda');
  const [counterBuyerName, setCounterBuyerName] = useState('');
  const [counterBuyerPhone, setCounterBuyerPhone] = useState('');
  const [counterDestinationCity, setCounterDestinationCity] = useState(POPULAR_DESTINATIONS[0].city);
  const [counterDestinationAddress, setCounterDestinationAddress] = useState('');
  const [counterDeliveryType, setCounterDeliveryType] = useState('Domicilio'); // 'Domicilio' | 'Ocurre Oficina Castores'

  // Contenido detallado del envío (Esferas de Chignahuapan)
  const [counterContentCategory, setCounterContentCategory] = useState(SPHERE_CONTENT_CATEGORIES[0].label);
  const [counterPiecesCount, setCounterPiecesCount] = useState(120);
  const [counterFragilityLevel, setCounterFragilityLevel] = useState('Alta Fragilidad - Cristal Soplado Artesanal');
  const [counterItemsDescription, setCounterItemsDescription] = useState('Esferas tradicionales sopladas al soplete con decorado navideño espiral');
  const [counterBoxesCount, setCounterBoxesCount] = useState(3);
  const [counterPackagingId, setCounterPackagingId] = useState('pack-premium');
  const [counterDeclaredValue, setCounterDeclaredValue] = useState(2500);

  // Estados de Inspección Física, Blindaje contra Roturas y Evidencia Fotográfica
  const [counterCheckVisualIntegrity, setCounterCheckVisualIntegrity] = useState(true);
  const [counterCheckAntishockPacking, setCounterCheckAntishockPacking] = useState(true);
  const [counterCheckSealedSecurityTape, setCounterCheckSealedSecurityTape] = useState(true);
  const [counterInspectionInspector, setCounterInspectionInspector] = useState('Rodrigo Castelán (Encargado Hub)');
  const [counterInspectionNotes, setCounterInspectionNotes] = useState('Esferas inspeccionadas en mostrador ante el cliente. 0 piezas rotas registradas. Empacadas con celdas y cinta Castores.');
  const [counterEvidencePhoto, setCounterEvidencePhoto] = useState(null);
  const [counterWarrantyActive, setCounterWarrantyActive] = useState(true);

  // Manejador para carga de foto testigo / evidencia
  const handleEvidencePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCounterEvidencePhoto(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  // =========================================================================
  // ESTADOS DE SELECCIÓN DE CLIENTES PARA SALIDA A PUEBLA (MANIFIESTO)
  // =========================================================================
  const [selectedOrderIdsForManifest, setSelectedOrderIdsForManifest] = useState(() => {
    const saved = localStorage.getItem('tribuna_manifest_selected_ids_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return agencyOrders.map(o => o.id);
  });

  const [manifestFilter, setManifestFilter] = useState('ALL'); // 'ALL' | 'SELECTED' | 'PENDING'
  const [lastDispatchedInfo, setLastDispatchedInfo] = useState(null);

  useEffect(() => {
    localStorage.setItem('tribuna_manifest_selected_ids_v1', JSON.stringify(selectedOrderIdsForManifest));
  }, [selectedOrderIdsForManifest]);

  // Manejador para seleccionar cliente frecuente o comprador anterior
  const handleSelectClientPreset = (presetId) => {
    setCounterClientPresetId(presetId);
    if (!presetId) {
      return;
    }
    const foundPreset = REGISTERED_CLIENTS_PRESETS.find(p => p.id === presetId);
    if (foundPreset) {
      setCounterBuyerName(foundPreset.name);
      setCounterBuyerPhone(foundPreset.phone);
      setCounterDestinationCity(foundPreset.city);
      setCounterDestinationAddress(foundPreset.address);
      setCounterClientType(foundPreset.clientType);
      return;
    }
    const pastOrder = agencyOrders.find(o => o.id === presetId);
    if (pastOrder) {
      setCounterBuyerName(pastOrder.buyerName);
      setCounterBuyerPhone(pastOrder.buyerPhone);
      setCounterDestinationCity(pastOrder.destinationCity);
      setCounterDestinationAddress(pastOrder.destinationAddress);
      setCounterClientType(pastOrder.clientType || 'Comprador Frecuente');
    }
  };

  // Manejador para seleccionar categoría de producto navideño
  const handleSelectContentCategory = (catLabel) => {
    setCounterContentCategory(catLabel);
    const cat = SPHERE_CONTENT_CATEGORIES.find(c => c.label === catLabel);
    if (cat) {
      setCounterFragilityLevel(cat.fragility);
      setCounterPiecesCount(cat.defaultPiecesPerBox * counterBoxesCount);
      if (!counterItemsDescription || counterItemsDescription.includes('Esferas tradicionales')) {
        setCounterItemsDescription(cat.desc);
      }
    }
  };

  // Manejador para cambiar número de cajas con recalculo proporcional de piezas
  const handleBoxesCountChange = (newCount) => {
    const validCount = Math.max(1, parseInt(newCount) || 1);
    setCounterBoxesCount(validCount);
    const cat = SPHERE_CONTENT_CATEGORIES.find(c => c.label === counterContentCategory);
    const perBox = cat ? cat.defaultPiecesPerBox : 40;
    setCounterPiecesCount(validCount * perBox);
  };

  // Manejador para chips rápidos de contenido
  const handleAppendQuickTag = (tag) => {
    if (!counterItemsDescription || counterItemsDescription.trim() === '') {
      setCounterItemsDescription(tag);
    } else if (!counterItemsDescription.includes(tag)) {
      setCounterItemsDescription(prev => `${prev}, ${tag}`);
    }
  };

  // Manejadores para selección de clientes en el Manifiesto a Puebla
  const handleToggleOrderSelection = (orderId) => {
    setSelectedOrderIdsForManifest(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleSelectAllOrders = () => {
    setSelectedOrderIdsForManifest(agencyOrders.map(o => o.id));
  };

  const handleDeselectAllOrders = () => {
    setSelectedOrderIdsForManifest([]);
  };

  const handleDispatchSelectedToPuebla = () => {
    if (selectedOrderIdsForManifest.length === 0) {
      alert('Por favor selecciona al menos un cliente / envío para despachar en la salida troncal.');
      return;
    }

    const confirmed = window.confirm(
      `¿Confirmar salida troncal a Puebla para ${selectedOrderIdsForManifest.length} envíos seleccionados?\n\n` +
      `Chofer asignado: ${shuttleConfig.assignedDriver}\n` +
      `Unidad: ${shuttleConfig.assignedUnit}\n` +
      `Horario: ${shuttleConfig.departureTime ? `${shuttleConfig.departureTime} hrs` : 'Inmediata'}`
    );

    if (!confirmed) return;

    const departureTimestamp = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    setAgencyOrders(prev => prev.map(ord => {
      if (selectedOrderIdsForManifest.includes(ord.id)) {
        return {
          ...ord,
          status: 'En Tránsito Troncal Chignahuapan → Puebla',
          castoresStatus: `A bordo de ${shuttleConfig.assignedUnit} · Chofer: ${shuttleConfig.assignedDriver} · Salida: ${departureTimestamp} hrs`,
          dispatchedAt: new Date().toISOString(),
          assignedDriverForTrip: shuttleConfig.assignedDriver
        };
      }
      return ord;
    }));

    setLastDispatchedInfo({
      count: selectedOrderIdsForManifest.length,
      time: departureTimestamp,
      driver: shuttleConfig.assignedDriver,
      unit: shuttleConfig.assignedUnit
    });
  };

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
      clientType: counterClientType,
      destinationCity: counterDestinationCity,
      destinationAddress: counterDestinationAddress.trim() || `Ocurre Oficina Castores ${counterDestinationCity}`,
      deliveryType: counterDeliveryType,
      contentCategory: counterContentCategory,
      piecesCount: Number(counterPiecesCount),
      fragilityLevel: counterFragilityLevel,
      itemsSummary: `${counterBoxesCount} Cajas (${counterPiecesCount} piezas · ${counterContentCategory} · ${counterItemsDescription})`,
      contentDetails: counterItemsDescription,
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
      castoresStatus: `Resguardado en bodega · Programado para salida troncal a Puebla (${shuttleConfig.departureTime ? `${shuttleConfig.departureTime} hrs` : 'Horario Manual'})`,
      estimatedDeliveryDate: counterPricing.dest.avgDays === 1 ? 'Mañana' : `En ${counterPricing.dest.avgDays} días hábiles`,
      fragilityWarrantyActive: counterWarrantyActive,
      warrantyCoverageMXN: Number(counterDeclaredValue) || 2500,
      inspectionData: {
        visualApproved: counterCheckVisualIntegrity,
        antishockApproved: counterCheckAntishockPacking,
        tapeSealed: counterCheckSealedSecurityTape,
        inspectedBy: counterInspectionInspector,
        notes: counterInspectionNotes,
        evidencePhoto: counterEvidencePhoto,
        inspectionTimestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      },
      notes: `Recepción en mostrador de agencia Castores. Productor aliado: ${selectedMerchant?.businessName || 'N/A'}`
    };

    // Actualizar pedidos e incluir en manifiesto activo
    setAgencyOrders(prev => [newOrder, ...prev]);
    setSelectedOrderIdsForManifest(prev => [newFolio, ...prev]);

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
    setCounterClientPresetId('');
    setCounterEvidencePhoto(null);
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
              <button
                type="button"
                onClick={() => {
                  setTempShuttleConfig({ ...shuttleConfig });
                  setIsShuttleModalOpen(true);
                }}
                className="flex items-center space-x-1.5 bg-slate-900/90 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-amber-400 transition-all text-left group cursor-pointer"
                title="Hacer clic para definir manualmente los horarios de salida a Puebla"
              >
                <Truck className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Salida a Puebla: <strong className="text-amber-300">{shuttleConfig.departureTime ? `${shuttleConfig.departureTime} hrs` : 'Por definir'}</strong> ({shuttleConfig.statusText || shuttleConfig.departureFrequencyText})</span>
                <span className="text-[10px] text-sky-400 font-bold ml-1 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-700">⚙️ Definir</span>
              </button>
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
          <span>🚐 Salidas a Puebla ({shuttleConfig.departureTime ? `${shuttleConfig.departureTime} hrs` : 'Manual'})</span>
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
              <div className="space-y-3.5 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    2. Cliente / Comprador que Usa el Servicio:
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Puedes elegir un cliente registrado o capturar uno nuevo
                  </span>
                </div>

                {/* SELECTOR RÁPIDO DE CLIENTES REGISTRADOS / HABITUALES */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Elegir Cliente Frecuente / Registrado:</span>
                    </label>
                    {counterClientPresetId && (
                      <button
                        type="button"
                        onClick={() => {
                          setCounterClientPresetId('');
                          setCounterBuyerName('');
                          setCounterBuyerPhone('');
                          setCounterDestinationAddress('');
                          setCounterClientType('Turista Particular en Tienda');
                        }}
                        className="text-[10px] text-rose-600 hover:underline font-bold"
                      >
                        Limpiar y nuevo cliente
                      </button>
                    )}
                  </div>

                  <select
                    value={counterClientPresetId}
                    onChange={(e) => handleSelectClientPreset(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">-- ➕ Capturar Nuevo Comprador / Turista en Mostrador --</option>
                    <optgroup label="⭐ Clientes Mayoristas & Boutiques Registradas">
                      {REGISTERED_CLIENTS_PRESETS.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.city} · {p.clientType})
                        </option>
                      ))}
                    </optgroup>
                    {agencyOrders.length > 0 && (
                      <optgroup label="📋 Clientes con Envíos Previos en Bodega">
                        {Array.from(new Set(agencyOrders.map(o => o.buyerName))).map((buyer, idx) => {
                          const pastOrd = agencyOrders.find(o => o.buyerName === buyer);
                          return (
                            <option key={`past-${idx}`} value={pastOrd.id}>
                              {buyer} ({pastOrd.destinationCity} · {pastOrd.clientType || 'Comprador Frecuente'})
                            </option>
                          );
                        })}
                      </optgroup>
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
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
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Tipo de Cliente:</label>
                    <select
                      value={counterClientType}
                      onChange={(e) => setCounterClientType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
                    >
                      <option value="Turista Particular en Tienda">🛍️ Turista Particular en Tienda</option>
                      <option value="Comprador Mayorista / Boutiques">🏢 Comprador Mayorista / Boutiques</option>
                      <option value="Envío Directo del Productor">📦 Envío Directo del Productor</option>
                      <option value="Despacho Corporativo / Interiorismo">🎨 Despacho de Interiorismo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Celular / WhatsApp (Para Notificaciones de Rastreo):</label>
                    <input
                      type="tel"
                      value={counterBuyerPhone}
                      onChange={(e) => setCounterBuyerPhone(e.target.value)}
                      placeholder="Ej. 81 1234 5678"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>

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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Modalidad de Entrega:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCounterDeliveryType('Domicilio')}
                        className={`py-2 px-1.5 rounded-xl text-xs font-bold border text-center transition-all ${
                          counterDeliveryType === 'Domicilio'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        🏠 Domicilio
                      </button>
                      <button
                        type="button"
                        onClick={() => setCounterDeliveryType('Ocurre Oficina Castores')}
                        className={`py-2 px-1.5 rounded-xl text-xs font-bold border text-center transition-all ${
                          counterDeliveryType === 'Ocurre Oficina Castores'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        🏢 Ocurre
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
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
              </div>

              {/* PASO 3: CAJAS, ESPECIFICACIÓN DE CONTENIDO & PROTECCIÓN FRÁGIL */}
              <div className="space-y-4 pt-3 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    3. ¿Qué Contiene el Envío? (Esferas & Artesanías de Cristal):
                  </span>
                  <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Inspección & Declaración Obligatoria Castores
                  </span>
                </div>

                {/* FILA 1: BULTOS, PIEZAS Y CATEGORÍA */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Cajas Recibidas:</label>
                    <input
                      type="number"
                      min="1"
                      max="150"
                      value={counterBoxesCount}
                      onChange={(e) => handleBoxesCountChange(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Piezas Totales de Esferas:</label>
                    <input
                      type="number"
                      min="1"
                      value={counterPiecesCount}
                      onChange={(e) => setCounterPiecesCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-xl text-xs font-black text-amber-950 focus:outline-none focus:bg-white"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      ~{Math.round(counterPiecesCount / counterBoxesCount)} pzas por caja
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Categoría Principal de Producto:</label>
                    <select
                      value={counterContentCategory}
                      onChange={(e) => handleSelectContentCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                    >
                      {SPHERE_CONTENT_CATEGORIES.map(c => (
                        <option key={c.id} value={c.label}>
                          {c.label} (~{c.defaultPiecesPerBox} pzas/caja)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* FILA 2: EMBALAJE Y NIVEL DE FRAGILIDAD */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
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

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Nivel de Fragilidad & Manejo:</label>
                    <select
                      value={counterFragilityLevel}
                      onChange={(e) => setCounterFragilityLevel(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                    >
                      <option value="Alta Fragilidad - Cristal Soplado Artesanal">💎 Alta Fragilidad - Cristal Soplado Artesanal</option>
                      <option value="Extrema Fragilidad - Arte Manual al Óleo">🎨 Extrema Fragilidad - Arte Manual al Óleo</option>
                      <option value="Alta Fragilidad + Componente Electrónico">💡 Alta Fragilidad + Componente Electrónico / LED</option>
                      <option value="Media Fragilidad - Estructura Rígida de Herrería">🛡️ Media Fragilidad - Herrería y Cristal Mixto</option>
                    </select>
                  </div>
                </div>

                {/* FILA 3: CHIPS RÁPIDOS PARA AGREGAR ACABADOS Y MODELOS */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 block">
                    Etiquetas Rápidas de Modelos y Acabados (Click para agregar al detalle):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {CONTENT_QUICK_TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAppendQuickTag(tag)}
                        className="text-[11px] font-semibold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 px-2.5 py-1 rounded-lg transition-all shadow-sm active:scale-95"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FILA 4: TEXTO DETALLADO DEL CONTENIDO */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Descripción Específica del Contenido (Modelos, Colores, Calibres):
                  </label>
                  <input
                    type="text"
                    required
                    value={counterItemsDescription}
                    onChange={(e) => setCounterItemsDescription(e.target.value)}
                    placeholder="Ej. Esferas clásicas N°6 espiral rubí y oro, figuras con escarcha blanca y campanas de cristal"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                  />
                </div>

                {/* TARJETA RESUMEN EN VIVO DE INSPECCIÓN DE CONTENIDO */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3.5 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-black text-emerald-800 tracking-wider block">
                      🔮 Resumen de Contenido Declarado:
                    </span>
                    <p className="font-bold text-slate-900">
                      {counterBoxesCount} {counterBoxesCount === 1 ? 'Caja' : 'Cajas'} · <span className="text-emerald-700 font-black">{counterPiecesCount} Esferas en Total</span> ({counterContentCategory})
                    </p>
                    <p className="text-[11px] text-slate-600 truncate max-w-md">
                      Detalle: {counterItemsDescription}
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Protección Asignada:</span>
                    <span className="font-bold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full text-[10px] inline-block border border-amber-300">
                      {counterFragilityLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* PASO 4: PROTOCOLO DE INSPECCIÓN FÍSICA & EVIDENCIA TESTIGO */}
              <div className="space-y-3.5 pt-3 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>4. Protocolo de Inspección Física & Evidencia (Blindaje contra Reclamos):</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Revisión en Presencia del Remitente
                  </span>
                </div>

                {/* 3 CHECKBOXES DE CONTROL DE INTEGRIDAD */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={counterCheckVisualIntegrity}
                      onChange={(e) => setCounterCheckVisualIntegrity(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">
                        1. Inspección visual completada (0 piezas rotas al momento de ingreso a bodega)
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Se abrieron las cajas en mostrador ante el cliente y se comprobó que no hay esferas estrelladas de origen.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={counterCheckAntishockPacking}
                      onChange={(e) => setCounterCheckAntishockPacking(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">
                        2. Celdas antishock y amortiguamiento verificado
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Las esferas cuentan con separación física individual (alveolos de cartón/burbuja), sin holguras que provoquen golpes internos.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={counterCheckSealedSecurityTape}
                      onChange={(e) => setCounterCheckSealedSecurityTape(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">
                        3. Sellado perimetral con cinta de seguridad inviolable Castores
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Caja cerrada con cinta de alta adherencia con leyenda "MUY FRÁGIL / NO ABRIR EN RUTA".
                      </span>
                    </div>
                  </label>
                </div>

                {/* INSPECTOR & NOTAS DE CONDICIÓN */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Inspeccionado por:</label>
                    <input
                      type="text"
                      value={counterInspectionInspector}
                      onChange={(e) => setCounterInspectionInspector(e.target.value)}
                      placeholder="Ej. Rodrigo Castelán (Hub)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Dictamen / Observaciones de Inspección:</label>
                    <input
                      type="text"
                      value={counterInspectionNotes}
                      onChange={(e) => setCounterInspectionNotes(e.target.value)}
                      placeholder="Ej. Esferas en óptimo estado, sin fisuras de taller, celdas acolchadas colocadas."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                {/* ADJUNTAR FOTO TESTIGO / EVIDENCIA */}
                <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-amber-100 rounded-xl text-amber-900 shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-black text-slate-900 block">
                        Foto Testigo de la Caja Abierta (Opcional):
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {counterEvidencePhoto ? '✅ Foto de evidencia cargada y lista para archivo.' : 'Toma una foto de las esferas dentro de la caja antes de encintar para blindar el flete.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {counterEvidencePhoto ? (
                      <div className="flex items-center space-x-2">
                        <img 
                          src={counterEvidencePhoto} 
                          alt="Evidencia" 
                          className="w-10 h-10 object-cover rounded-lg border border-emerald-400 shadow-xs" 
                        />
                        <button
                          type="button"
                          onClick={() => setCounterEvidencePhoto(null)}
                          className="text-[10px] text-rose-600 hover:underline font-bold"
                        >
                          Eliminar Foto
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-all">
                        <Camera className="w-3.5 h-3.5 text-amber-600" />
                        <span>Tomar / Subir Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleEvidencePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
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
      {/* ========================================================================= */}
      {/* ÁREA 5: MANIFIESTO DE SALIDA A TERMINAL PUEBLA (CONFIGURABLE MANUALMENTE) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* ÁREA 5: MANIFIESTO DE SALIDA A PUEBLA & SELECCIÓN DE CLIENTES Y CONTENIDO */}
      {/* ========================================================================= */}
      {activeSubTab === 'manifest' && (() => {
        const selectedOrders = agencyOrders.filter(o => selectedOrderIdsForManifest.includes(o.id));
        const totalSelectedBoxes = selectedOrders.reduce((sum, o) => sum + (o.boxesCount || 0), 0);
        const totalSelectedPieces = selectedOrders.reduce((sum, o) => sum + (o.piecesCount || (o.boxesCount * 40)), 0);
        const totalSelectedWeight = selectedOrders.reduce((sum, o) => sum + (o.totalWeightKg || (o.boxesCount * 6)), 0);

        const displayedOrders = manifestFilter === 'SELECTED' 
          ? selectedOrders 
          : manifestFilter === 'PENDING'
            ? agencyOrders.filter(o => !selectedOrderIdsForManifest.includes(o.id))
            : agencyOrders;

        const isAllSelected = agencyOrders.length > 0 && selectedOrderIdsForManifest.length === agencyOrders.length;

        return (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            
            {/* ENCABEZADO DEL MANIFIESTO & BOTONES PRINCIPALES */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    Troncal Castores Chignahuapan → Puebla
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {shuttleConfig.statusText || 'Salida Manual'}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  Manifiesto de Carga: Salida a Puebla ({shuttleConfig.departureTime ? `${shuttleConfig.departureTime} hrs` : 'Horario Manual'})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecciona qué clientes y envíos viajan en esta unidad. Chofer: <strong>{shuttleConfig.assignedDriver}</strong> · Unidad: <strong>{shuttleConfig.assignedUnit}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempShuttleConfig({ ...shuttleConfig });
                    setIsShuttleModalOpen(true);
                  }}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                  title="Configurar horario, frecuencia o salida manualmente"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configurar Horario</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Manifiesto</span>
                </button>

                <button
                  type="button"
                  onClick={handleDispatchSelectedToPuebla}
                  disabled={selectedOrderIdsForManifest.length === 0}
                  className={`font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all ${
                    selectedOrderIdsForManifest.length > 0
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white active:scale-95'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Despachar {selectedOrderIdsForManifest.length} Envíos a Puebla</span>
                </button>
              </div>
            </div>

            {/* BANNER DE NOTIFICACIÓN DE ÚLTIMO DESPACHO */}
            {lastDispatchedInfo && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-black text-emerald-900 block text-sm">
                      ¡Salida Troncal Despachada Exitosamente a las {lastDispatchedInfo.time} hrs!
                    </span>
                    <span className="text-emerald-800">
                      <strong>{lastDispatchedInfo.count} envíos de clientes</strong> fueron cargados en la unidad <strong>{lastDispatchedInfo.unit}</strong> a cargo del chofer <strong>{lastDispatchedInfo.driver}</strong> rumbo a la Terminal Castores Puebla.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLastDispatchedInfo(null)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 text-xs"
                >
                  ✕ Cerrar
                </button>
              </div>
            )}

            {/* TARJETAS KPI DE LA SALIDA SELECCIONADA */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-0.5">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Clientes Seleccionados:</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-xl font-black text-slate-900">{selectedOrderIdsForManifest.length}</span>
                  <span className="text-slate-500 text-[11px]">de {agencyOrders.length} en bodega</span>
                </div>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 space-y-0.5">
                <span className="text-amber-800 font-bold uppercase text-[10px] block">Cajas a Cargar:</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-xl font-black text-amber-900">{totalSelectedBoxes}</span>
                  <span className="text-amber-700 text-[11px]">cajas antishock</span>
                </div>
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 space-y-0.5">
                <span className="text-emerald-800 font-bold uppercase text-[10px] block">Piezas de Esferas Totales:</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-xl font-black text-emerald-900">{totalSelectedPieces.toLocaleString()}</span>
                  <span className="text-emerald-700 text-[11px]">esferas protegidas</span>
                </div>
              </div>

              <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-200 space-y-0.5">
                <span className="text-sky-800 font-bold uppercase text-[10px] block">Peso de Carga Troncal:</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-xl font-black text-sky-900">{totalSelectedWeight} kg</span>
                  <span className="text-sky-700 text-[11px]">/ 3,500 kg capacidad</span>
                </div>
              </div>
            </div>

            {/* BARRA DE FILTROS & CONTROLES DE SELECCIÓN DE CLIENTES */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              {/* Botones de Filtro */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setManifestFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    manifestFilter === 'ALL'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Todos en Bodega ({agencyOrders.length})
                </button>

                <button
                  type="button"
                  onClick={() => setManifestFilter('SELECTED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    manifestFilter === 'SELECTED'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  Seleccionados para esta Salida ({selectedOrderIdsForManifest.length})
                </button>

                <button
                  type="button"
                  onClick={() => setManifestFilter('PENDING')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    manifestFilter === 'PENDING'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  En Resguardo ({agencyOrders.length - selectedOrderIdsForManifest.length})
                </button>
              </div>

              {/* Botones rápidos de selección */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllOrders}
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Seleccionar Todos</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeselectAllOrders}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1"
                >
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                  <span>Desmarcar Todos</span>
                </button>
              </div>
            </div>

            {/* TABLA PRINCIPAL DEL MANIFIESTO */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 text-center w-12">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={(e) => {
                          if (e.target.checked) handleSelectAllOrders();
                          else handleDeselectAllOrders();
                        }}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        title="Seleccionar o desmarcar todos"
                      />
                    </th>
                    <th className="py-3 px-3">Folio & Guía</th>
                    <th className="py-3 px-3">Cliente / Destinatario & Origen</th>
                    <th className="py-3 px-3">Contenido Detallado de Esferas</th>
                    <th className="py-3 px-3">Bultos & Embalaje</th>
                    <th className="py-3 px-3 text-center">Estado para este Viaje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {displayedOrders.map(ord => {
                    const isSelected = selectedOrderIdsForManifest.includes(ord.id);
                    const pieces = ord.piecesCount || (ord.boxesCount * 40);

                    return (
                      <tr 
                        key={ord.id} 
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-emerald-50/30 hover:bg-emerald-50/50' : 'hover:bg-slate-50 opacity-80'
                        }`}
                        onClick={() => handleToggleOrderSelection(ord.id)}
                      >
                        {/* Checkbox de Selección */}
                        <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleOrderSelection(ord.id)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>

                        {/* Folio y Guía Castores */}
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-800">
                          <div className="font-black text-slate-900">{ord.id}</div>
                          <div className="mt-1">
                            <span className="font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 text-[11px]">
                              {ord.castoresGuideNumber}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">{ord.date}</div>
                        </td>

                        {/* Cliente Destinatario & Taller de Origen */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-black text-slate-900 text-sm">{ord.buyerName}</span>
                            {ord.clientType && (
                              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {ord.clientType}
                              </span>
                            )}
                          </div>
                          <div className="text-slate-600 text-xs font-semibold mt-0.5">
                            📍 {ord.destinationCity} {ord.deliveryType ? `(${ord.deliveryType})` : ''}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
                            <span className="font-bold text-emerald-800">Taller:</span>
                            <span>{ord.artisanBusiness}</span>
                            <span className="text-slate-400 font-mono">({ord.clientNumber || 'Directo'})</span>
                          </div>
                          {ord.buyerPhone && ord.buyerPhone !== 'No proporcionado' && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              📞 {ord.buyerPhone}
                            </div>
                          )}
                        </td>

                        {/* Contenido Detallado de Esferas */}
                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="flex flex-wrap items-center gap-1 mb-1">
                            <span className="bg-amber-100 text-amber-950 font-black px-2 py-0.5 rounded-md text-[10px] border border-amber-200">
                              {ord.contentCategory || '🔮 Esferas Tradicionales'}
                            </span>
                            <span className="bg-emerald-100 text-emerald-900 font-black px-2 py-0.5 rounded-md text-[10px] border border-emerald-300">
                              {pieces.toLocaleString()} Piezas
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 font-medium line-clamp-2 leading-relaxed">
                            {ord.contentDetails || ord.itemsSummary}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-1">
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block">
                              {ord.fragilityLevel || 'Alta Fragilidad'}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                              <span>✓</span>
                              <span>0 Roturas Certificadas</span>
                            </span>
                          </div>
                        </td>

                        {/* Bultos & Embalaje */}
                        <td className="py-3.5 px-3">
                          <div className="font-black text-slate-900 text-sm">
                            {ord.boxesCount} {ord.boxesCount === 1 ? 'Caja' : 'Cajas'}
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            {ord.packagingName}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            ~{ord.totalWeightKg || (ord.boxesCount * 6)} kg totales
                          </div>
                        </td>

                        {/* Estado para este Viaje & Acción Sticker */}
                        <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          {isSelected ? (
                            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-black px-2.5 py-1 rounded-full text-[10px] inline-flex items-center space-x-1 shadow-xs">
                              <span>🚚</span>
                              <span>A bordo p/ Puebla</span>
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center space-x-1">
                              <span>⏳</span>
                              <span>En Resguardo Bodega</span>
                            </span>
                          )}
                          <div className="text-[10px] text-slate-400 mt-1">
                            {ord.status === 'En Tránsito Troncal Chignahuapan → Puebla' ? 'Despachado' : 'Listo para Carga'}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLabelOrder(ord);
                              setSelectedBoxIndexForLabel('ALL');
                            }}
                            className="mt-1.5 w-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-black px-2 py-1 rounded-lg text-[10px] flex items-center justify-center space-x-1 border border-amber-300 shadow-xs transition-all"
                            title="Generar e imprimir etiquetas adhesivas para las cajas"
                          >
                            <Tag className="w-3 h-3 text-amber-800" />
                            <span>Stickers ({ord.boxesCount})</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* SECCIÓN IMPRIMIBLE PARA EL CHOFER (MANIFIESTO OFICIAL CON HOJA DE RUTA) */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-black text-slate-900 text-sm flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Hoja de Ruta Oficial & Manifiesto para el Operador de la Van</span>
                </span>
                <p className="text-slate-500 text-[11px]">
                  Al presionar "Imprimir Manifiesto", se generará la hoja de embarque exclusiva con los <strong>{selectedOrderIdsForManifest.length} clientes seleccionados</strong>, número de cajas, piezas declaradas e inventario de cristal frágil para inspección en autopista y entrega en la Terminal Castores Puebla.
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shrink-0 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Hoja de Ruta ({selectedOrderIdsForManifest.length} Envíos)</span>
              </button>
            </div>

          </div>
        );
      })()}

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
                <span className="text-slate-500">Cliente / Destinatario:</span>
                <span className="font-bold text-slate-900 text-right">
                  {selectedReceiptOrder.buyerName}
                  {selectedReceiptOrder.clientType && (
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {selectedReceiptOrder.clientType}
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Destino:</span>
                <span className="font-bold text-slate-900">{selectedReceiptOrder.destinationCity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Taller de Origen:</span>
                <span className="font-bold text-emerald-700">{selectedReceiptOrder.artisanBusiness}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Bultos & Embalaje:</span>
                <span className="font-bold text-slate-900">
                  {selectedReceiptOrder.boxesCount} {selectedReceiptOrder.boxesCount === 1 ? 'caja' : 'cajas'} · {selectedReceiptOrder.packagingName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Contenido Declarado:</span>
                <span className="font-black text-amber-900 text-right">
                  {selectedReceiptOrder.piecesCount || (selectedReceiptOrder.boxesCount * 40)} Esferas
                  <span className="text-[10px] text-slate-500 block font-normal">
                    {selectedReceiptOrder.contentCategory || 'Esferas Tradicionales'}
                  </span>
                </span>
              </div>
              {selectedReceiptOrder.contentDetails && (
                <div className="py-1 border-b border-slate-100 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-500 block">Detalle de Modelos:</span>
                  <span className="font-medium">{selectedReceiptOrder.contentDetails}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Protección & Fragilidad:</span>
                <span className="font-bold text-slate-800 text-[11px]">
                  {selectedReceiptOrder.fragilityLevel || 'Alta Fragilidad - Cristal Soplado'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Cobrado:</span>
                <span className="font-black text-amber-700">${selectedReceiptOrder.totalChargedToCustomer?.toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-emerald-700 font-bold">Puntos Abonados al Comercio:</span>
                <span className="font-black text-emerald-700">+{selectedReceiptOrder.pointsAwardedToMerchant} pts</span>
              </div>
            </div>

            {/* BLOQUE INSPECCIÓN FÍSICA Y DICTAMEN EN COMPROBANTE */}
            <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-900 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Dictamen de Inspección Física:</span>
                </span>
                <span className="bg-emerald-200 text-emerald-950 font-black px-2 py-0.5 rounded-full text-[10px]">
                  0 Roturas al Recibir
                </span>
              </div>
              <p className="text-[11px] text-emerald-900 font-medium leading-relaxed">
                {selectedReceiptOrder.inspectionData?.notes || 'Esferas inspeccionadas en mostrador ante el cliente. 0 piezas rotas registradas.'}
              </p>
              <div className="flex justify-between items-center text-[10px] text-emerald-800 pt-0.5 border-t border-emerald-200/60">
                <span>Inspector: <strong>{selectedReceiptOrder.inspectionData?.inspectedBy || 'Rodrigo Castelán (Hub)'}</strong></span>
                <span>Garantía Antishock: <strong>${(selectedReceiptOrder.warrantyCoverageMXN || 2500).toLocaleString()} MXN</strong></span>
              </div>
              {selectedReceiptOrder.inspectionData?.evidencePhoto && (
                <div className="pt-1 flex items-center space-x-2">
                  <img 
                    src={selectedReceiptOrder.inspectionData.evidencePhoto} 
                    alt="Foto Testigo" 
                    className="w-12 h-12 object-cover rounded-lg border border-emerald-300 shadow-xs" 
                  />
                  <span className="text-[10px] text-emerald-800 font-bold">
                    📸 Foto testigo de caja abierta archivada en sistema
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedLabelOrder(selectedReceiptOrder);
                  setSelectedBoxIndexForLabel('ALL');
                }}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95"
              >
                <Tag className="w-4 h-4 text-slate-950" />
                <span>Imprimir Etiquetas Adhesivas ({selectedReceiptOrder.boxesCount} Stickers para Cajas)</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const pieces = selectedReceiptOrder.piecesCount || (selectedReceiptOrder.boxesCount * 40);
                    const cat = selectedReceiptOrder.contentCategory || 'Esferas Tradicionales';
                    const text = `🎄 *AGENCIA CASTORES CHIGNAHUAPAN*\n` +
                      `¡Hola ${selectedReceiptOrder.buyerName}! Tu envío de esferas ha sido recibido e inspeccionado en nuestra Bodega Hub.\n\n` +
                      `📋 *Guía Oficial Castores:* ${selectedReceiptOrder.castoresGuideNumber}\n` +
                      `📍 *Destino:* ${selectedReceiptOrder.destinationCity}\n` +
                      `📦 *Bultos:* ${selectedReceiptOrder.boxesCount} cajas (${selectedReceiptOrder.packagingName})\n` +
                      `🔮 *Contenido:* ${pieces} esferas (${cat})\n` +
                      `🛡️ *Inspección Física:* Certificada en mostrador (0 esferas rotas registradas de origen y precintado inviolable Castores)\n` +
                      `🛡️ *Garantía Antishock:* Activa ($${(selectedReceiptOrder.warrantyCoverageMXN || 2500).toLocaleString()} MXN)\n` +
                      `🚚 *Estatus:* ${selectedReceiptOrder.castoresStatus}\n\n` +
                      `¡Gracias por tu compra en ${selectedReceiptOrder.artisanBusiness}!`;
                    navigator.clipboard.writeText(text);
                    alert('📋 ¡Notificación detallada para el comprador copiada! Listo para enviar por WhatsApp.');
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
                  <span>Imprimir Ticket</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ESTABLECER SALIDAS TRONCALES A PUEBLA MANUALMENTE */}
      {/* ========================================================================= */}
      {isShuttleModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsShuttleModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">
                  Configuración Operativa Troncal
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Establecer Salidas Chignahuapan → Puebla
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShuttleModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShuttleConfig(tempShuttleConfig);
                setIsShuttleModalOpen(false);
                alert(`✅ Horario de salida actualizado:\nHora: ${tempShuttleConfig.departureTime || 'Por definir'} hrs\nFrecuencia: ${tempShuttleConfig.departureFrequencyText}\nChofer: ${tempShuttleConfig.assignedDriver}`);
              }}
              className="space-y-4 text-xs"
            >
              {/* Modo de Salida */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Criterio / Modo de Salida:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTempShuttleConfig(prev => ({ 
                      ...prev, 
                      departureMode: 'MANUAL',
                      statusText: 'Salida Manual / Por Definir'
                    }))}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      tempShuttleConfig.departureMode === 'MANUAL'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🛠️ Manual / Por Definir
                  </button>

                  <button
                    type="button"
                    onClick={() => setTempShuttleConfig(prev => ({ 
                      ...prev, 
                      departureMode: 'POR_VOLUMEN',
                      statusText: `Al juntar ${prev.minBoxesToDepart || 40} cajas`
                    }))}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      tempShuttleConfig.departureMode === 'POR_VOLUMEN'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    📦 Por Volumen Mínimo
                  </button>

                  <button
                    type="button"
                    onClick={() => setTempShuttleConfig(prev => ({ 
                      ...prev, 
                      departureMode: 'PROGRAMADA',
                      statusText: 'Horario Fijo Programado'
                    }))}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      tempShuttleConfig.departureMode === 'PROGRAMADA'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🕒 Horario Fijo
                  </button>
                </div>
              </div>

              {/* Hora de Salida y Hora Límite de Recepción */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hora de Salida Manual / Prevista (hrs):</label>
                  <input
                    type="time"
                    value={tempShuttleConfig.departureTime || ''}
                    onChange={(e) => setTempShuttleConfig(prev => ({ ...prev, departureTime: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-black text-slate-900 text-sm focus:outline-none focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Puedes cambiar la hora cada día según sea necesario.</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hora Límite de Recepción en Bodega:</label>
                  <input
                    type="time"
                    value={tempShuttleConfig.cutoffTime || ''}
                    onChange={(e) => setTempShuttleConfig(prev => ({ ...prev, cutoffTime: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-black text-slate-900 text-sm focus:outline-none focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Límite para que turistas entreguen cajas antes del viaje.</span>
                </div>
              </div>

              {/* Frecuencia / Días de Operación */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Frecuencia o Días de Corrida:</label>
                <input
                  type="text"
                  value={tempShuttleConfig.departureFrequencyText || ''}
                  onChange={(e) => setTempShuttleConfig(prev => ({ ...prev, departureFrequencyText: e.target.value }))}
                  placeholder="Ej. Lunes a Domingo, o Lunes, Miércoles y Viernes, o Según carga"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:bg-white"
                />
              </div>

              {/* Volumen Mínimo de Cajas */}
              {tempShuttleConfig.departureMode === 'POR_VOLUMEN' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cajas Mínimas para Despachar la Camioneta:</label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={tempShuttleConfig.minBoxesToDepart || 40}
                    onChange={(e) => setTempShuttleConfig(prev => ({ ...prev, minBoxesToDepart: parseInt(e.target.value) || 40 }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-black text-slate-900"
                  />
                </div>
              )}

              {/* Chofer y Unidad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chofer Responsable:</label>
                  <input
                    type="text"
                    value={tempShuttleConfig.assignedDriver || ''}
                    onChange={(e) => setTempShuttleConfig(prev => ({ ...prev, assignedDriver: e.target.value }))}
                    placeholder="Ej. Rodrigo Castelán"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unidad / Vehículo Asignado:</label>
                  <input
                    type="text"
                    value={tempShuttleConfig.assignedUnit || ''}
                    onChange={(e) => setTempShuttleConfig(prev => ({ ...prev, assignedUnit: e.target.value }))}
                    placeholder="Ej. Van Sprinter 3.5 Ton"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>
              </div>

              {/* Texto de Estatus Público */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Leyenda de Estatus (Visible en toda la App):</label>
                <input
                  type="text"
                  value={tempShuttleConfig.statusText || ''}
                  onChange={(e) => setTempShuttleConfig(prev => ({ ...prev, statusText: e.target.value }))}
                  placeholder="Ej. Salida hoy a las 18:30 hrs, o Salida Manual según volumen"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                />
              </div>

              {/* Botón Guardar */}
              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-xs flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Horario de Salida a Puebla</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsShuttleModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: GENERADOR DE ETIQUETAS ADHESIVAS / STICKERS DE CAJA (CASTORES) */}
      {/* ========================================================================= */}
      {selectedLabelOrder && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto"
          onClick={() => setSelectedLabelOrder(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ENCABEZADO DEL MODAL */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-900">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Stickers de Embarque & Identificación de Cajas
                  </h3>
                  <p className="text-xs text-slate-500">
                    Guía Castores: <strong className="text-slate-900 font-mono">{selectedLabelOrder.castoresGuideNumber}</strong> · {selectedLabelOrder.boxesCount} {selectedLabelOrder.boxesCount === 1 ? 'Caja' : 'Cajas'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Stickers</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLabelOrder(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SELECTOR DE CAJA INDIVIDUAL O TODAS LAS CAJAS */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-700">Ver e Imprimir:</span>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedBoxIndexForLabel('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    selectedBoxIndexForLabel === 'ALL'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Todas las Cajas (1 a {selectedLabelOrder.boxesCount})
                </button>
                {Array.from({ length: selectedLabelOrder.boxesCount }, (_, i) => i + 1).map((boxNum) => (
                  <button
                    key={`btn-box-${boxNum}`}
                    type="button"
                    onClick={() => setSelectedBoxIndexForLabel(boxNum)}
                    className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                      selectedBoxIndexForLabel === boxNum
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Caja {boxNum}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTENEDOR DE ETIQUETAS ADHESIVAS (ESTILO INDUSTRIAL 4x6 / 10x15 CM) */}
            <div className="space-y-6">
              {(selectedBoxIndexForLabel === 'ALL'
                ? Array.from({ length: selectedLabelOrder.boxesCount }, (_, i) => i + 1)
                : [selectedBoxIndexForLabel]
              ).map((boxNum) => {
                const totalPieces = selectedLabelOrder.piecesCount || (selectedLabelOrder.boxesCount * 40);
                const piecesInThisBox = Math.round(totalPieces / selectedLabelOrder.boxesCount);

                return (
                  <div
                    key={`label-box-${boxNum}`}
                    className="border-2 border-slate-950 rounded-2xl p-5 bg-white shadow-md space-y-3 font-sans print:border-black print:shadow-none print:break-after-page"
                  >
                    {/* ENCABEZADO DE TRANSPORTISTA Y HUB */}
                    <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
                      <div className="flex items-center space-x-2">
                        <div className="bg-slate-950 text-white font-black text-xs px-2.5 py-1 rounded">
                          CASTORES
                        </div>
                        <div>
                          <span className="font-black text-slate-950 text-xs tracking-wider block leading-none">
                            ALIANZA GRUPO TRIBUNA
                          </span>
                          <span className="text-[10px] text-slate-600 font-bold block mt-0.5">
                            HUB CHIGNAHUAPAN, PUE. ➔ CONEXIÓN TRONCAL PUEBLA
                          </span>
                        </div>
                      </div>

                      {/* INDICADOR GIGANTE DE NÚMERO DE PAQUETE */}
                      <div className="bg-slate-950 text-white font-mono font-black text-xs px-3 py-1.5 rounded-lg text-center tracking-wider">
                        <span className="text-[9px] block text-amber-300 font-sans font-bold uppercase">Bulto</span>
                        <span className="text-sm">CAJA {boxNum} DE {selectedLabelOrder.boxesCount}</span>
                      </div>
                    </div>

                    {/* BLOQUE CÓDIGO DE BARRAS & GUÍA OFICIAL */}
                    <div className="bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-center space-y-1">
                      <div className="flex justify-center items-center py-1">
                        {/* Simulación visual de código de barras Code128 */}
                        <div className="flex items-center h-10 space-x-[2px] overflow-hidden justify-center px-4">
                          {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 1, 4, 2, 3, 1, 3, 2, 1, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2, 1, 4, 3, 1, 2].map((w, idx) => (
                            <div 
                              key={idx} 
                              className="bg-slate-950 h-full" 
                              style={{ width: `${w}px` }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="font-mono font-black text-lg text-slate-950 tracking-widest">
                        * {selectedLabelOrder.castoresGuideNumber} *
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        FOLIO INTERNO: <strong>{selectedLabelOrder.id}</strong> · FECHA: {selectedLabelOrder.date}
                      </div>
                    </div>

                    {/* BLOQUE DESTINO DESTACADO */}
                    <div className="bg-amber-400 text-slate-950 p-2.5 rounded-xl border border-amber-500 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider block text-slate-900">
                          CIUDAD DESTINO:
                        </span>
                        <div className="text-base font-black uppercase leading-tight tracking-wide">
                          {selectedLabelOrder.destinationCity}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase block text-slate-900">MODALIDAD:</span>
                        <span className="bg-slate-950 text-white font-black text-[10px] px-2 py-0.5 rounded-md uppercase">
                          {selectedLabelOrder.deliveryType || 'A DOMICILIO'}
                        </span>
                      </div>
                    </div>

                    {/* DATOS DESTINATARIO & REMITENTE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border border-slate-300 rounded-xl p-3 bg-white">
                      {/* Destinatario */}
                      <div className="space-y-0.5 border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0 sm:pr-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          DESTINATARIO (CONSIGNEE):
                        </span>
                        <div className="font-black text-slate-900 text-xs">
                          {selectedLabelOrder.buyerName}
                        </div>
                        {selectedLabelOrder.clientType && (
                          <span className="text-[10px] text-slate-500 font-semibold block">
                            {selectedLabelOrder.clientType}
                          </span>
                        )}
                        <div className="text-[11px] text-slate-700 font-medium leading-snug pt-0.5">
                          {selectedLabelOrder.destinationAddress}
                        </div>
                        <div className="text-[11px] text-slate-900 font-bold pt-0.5">
                          TEL: {selectedLabelOrder.buyerPhone}
                        </div>
                      </div>

                      {/* Remitente */}
                      <div className="space-y-0.5 sm:pl-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          REMITENTE (SHIPPER / TALLER):
                        </span>
                        <div className="font-black text-emerald-800 text-xs">
                          {selectedLabelOrder.artisanBusiness}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 font-bold">
                          CLIENTE: {selectedLabelOrder.clientNumber || 'MOSTRADOR-DIRECTO'}
                        </div>
                        <div className="text-[11px] text-slate-600 leading-snug pt-0.5">
                          Agencia Bodega Hub Chignahuapan, Puebla, México
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold pt-0.5">
                          EMBALAJE: {selectedLabelOrder.packagingName}
                        </div>
                      </div>
                    </div>

                    {/* ESPECIFICACIÓN DE CONTENIDO DE ESTA CAJA */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase">
                          CONTENIDO DECLARADO EN ESTA CAJA:
                        </span>
                        <span className="bg-emerald-100 text-emerald-900 font-black text-[11px] px-2 py-0.5 rounded-md border border-emerald-300">
                          ~{piecesInThisBox} Esferas Artesanales
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs">
                        {selectedLabelOrder.contentCategory || 'Esferas Tradicionales de Cristal'}
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1">
                        {selectedLabelOrder.contentDetails || selectedLabelOrder.itemsSummary}
                      </p>
                    </div>

                    {/* SELLO DE SEGURIDAD ROJO: MUY FRÁGIL CRISTAL SOPLADO */}
                    <div className="bg-rose-50 border-2 border-rose-600 text-rose-950 p-2.5 rounded-xl flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <div className="text-xl">⚠️</div>
                        <div>
                          <span className="font-black text-xs text-rose-900 uppercase tracking-wider block leading-none">
                            ALTA FRAGILIDAD · CRISTAL SOPLADO DE CHIGNAHUAPAN
                          </span>
                          <span className="text-[10px] text-rose-700 font-bold block mt-0.5">
                            ↑↑ ESTE LADO ARRIBA · ESTIBA MÁXIMA 3 CAJAS · NO INVERTIR · MANEJAR CON GUANTES
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="bg-rose-600 text-white font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                          ANTISHOCK ACTIVO
                        </span>
                      </div>
                    </div>

                    {/* SELLO DE INSPECCIÓN FÍSICA CERTIFICADA */}
                    <div className="bg-emerald-50 border border-emerald-400 p-2 rounded-xl flex items-center justify-between text-[10px] text-emerald-950 font-bold">
                      <div className="flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>INSPECCIÓN FÍSICA EN MOSTRADOR: 0 ROTURAS DE ORIGEN · CINTA CASTORES INVIOLABLE</span>
                      </div>
                      <span className="font-mono text-[9px] text-emerald-800 uppercase">
                        INSPECTOR: {selectedLabelOrder.inspectionData?.inspectedBy || 'RODRIGO CASTELÁN (HUB)'}
                      </span>
                    </div>

                    {/* FOOTER DE LA ETIQUETA CON INSTRUCCIONES */}
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono pt-1">
                      <span>GRUPO TRIBUNA LOGÍSTICA · WWW.GRUPOTRIBUNA.COM.MX</span>
                      <span>ETIQUETA OFICIAL DE EMBARQUE CASTORES 2026</span>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* BOTÓN INFERIOR DE IMPRESIÓN */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Imprime en impresora térmica de etiquetas (Zebra/Xprinter) o papel adhesivo carta.
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Mandar a Imprimir ({selectedBoxIndexForLabel === 'ALL' ? `${selectedLabelOrder.boxesCount} Cajas` : `Caja ${selectedBoxIndexForLabel}`})</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
