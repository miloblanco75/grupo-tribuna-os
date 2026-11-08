import React, { useState, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Camera, 
  Plus, 
  Search, 
  DollarSign, 
  Boxes, 
  Package, 
  Store, 
  Check, 
  ShoppingCart, 
  Trash2, 
  Edit3, 
  Share2, 
  Printer, 
  Tag, 
  ChevronRight, 
  AlertCircle,
  X,
  Layers,
  FileText,
  Calendar,
  Save,
  Clock,
  CheckCircle2,
  ListOrdered,
  Calculator,
  TrendingUp,
  Truck,
  ShieldCheck
} from 'lucide-react';

import {
  SPHERE_NUMBERS,
  SPHERE_TYPES,
  INITIAL_ARTISANS,
  calculateDirectSumPricing,
  calculateCascadingPricing,
  calculateTribunaPricing,
  PRICING_PERCENTAGES,
  TOTAL_DIRECT_MULTIPLIER,
  TOTAL_CASCADING_MULTIPLIER
} from '../data/chignahuapanData';

export default function ChignahuapanCatalogManager({ onOpenShippingQuote }) {
  // Pestaña activa dentro del área de catálogo: 'create' | 'order' | 'history'
  const [activeCatalogTab, setActiveCatalogTab] = useState('create');

  // Catálogo de modelos creados por el usuario (empezamos limpio)
  const [catalog, setCatalog] = useState(() => {
    const saved = localStorage.getItem('tribuna_spheres_catalog_v2_custom');
    return saved ? JSON.parse(saved) : [];
  });

  // Historial de Pedidos Guardados por el usuario
  const [savedOrders, setSavedOrders] = useState(() => {
    const saved = localStorage.getItem('tribuna_saved_purchase_orders_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // Directorio de Artesanos
  const [artisans] = useState(() => {
    const saved = localStorage.getItem('tribuna_chignahuapan_artisans_v1');
    return saved ? JSON.parse(saved) : INITIAL_ARTISANS;
  });

  // Estado para el levantamiento de pedido actual: { [modelId]: cantidadPaquetes }
  const [orderItems, setOrderItems] = useState({});
  const [orderArtisanName, setOrderArtisanName] = useState(artisans[0]?.businessName || 'Taller Artesanal Chignahuapan');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderExpectedDate, setOrderExpectedDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [orderAdvancePayment, setOrderAdvancePayment] = useState(0);

  // Estados del Formulario de Campos Rellenables para Crear Modelo
  const [formModelName, setFormModelName] = useState('');
  const [formSize, setFormSize] = useState('#5 (Mediana 7 cm)');
  const [formTypeName, setFormTypeName] = useState('Esfera Clásica (Dos Texturas)');
  const [formPiecesPerPack, setFormPiecesPerPack] = useState(12);
  const [formArtisanCost, setFormArtisanCost] = useState('');
  const [formWholesalePrice, setFormWholesalePrice] = useState('');
  const [formArtisanProvider, setFormArtisanProvider] = useState(artisans[0]?.businessName || 'Taller Artesanal');
  const [formNotes, setFormNotes] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [editingModelId, setEditingModelId] = useState(null);

  // Modo de cálculo de fórmula: 'direct' (Opción 1: Suma Directa +84% ➔ $184) | 'cascade' (Opción 2: Cascada +116% ➔ $216)
  const [pricingMode, setPricingMode] = useState('direct');

  const fileInputRef = useRef(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Desglose de cálculo para el costo ingresado en el formulario
  const formPricing = useMemo(() => {
    return calculateTribunaPricing(formArtisanCost, pricingMode);
  }, [formArtisanCost, pricingMode]);

  // Persistir en localStorage
  React.useEffect(() => {
    localStorage.removeItem('tribuna_spheres_catalog_v1');
    localStorage.removeItem('tribuna_consolidated_cart_v1');
    localStorage.setItem('tribuna_spheres_catalog_v2_custom', JSON.stringify(catalog));
  }, [catalog]);

  React.useEffect(() => {
    localStorage.setItem('tribuna_saved_purchase_orders_v2', JSON.stringify(savedOrders));
  }, [savedOrders]);

  // Manejo de Compresión y Carga de Foto desde Cámara / Celular
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 700;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.72);
        setFormPhotoUrl(compressedBase64);
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Guardar Nuevo Modelo en Catálogo
  const handleSaveModel = (e) => {
    e.preventDefault();

    if (!formModelName.trim()) {
      alert('Por favor escribe el nombre o modelo de la esfera.');
      return;
    }
    if (!formSize.trim()) {
      alert('Por favor indica el tamaño de la esfera.');
      return;
    }
    if (!formArtisanCost || Number(formArtisanCost) <= 0) {
      alert('Por favor escribe el precio o costo del artesano.');
      return;
    }

    const costNum = Number(formArtisanCost);
    const calculatedPricing = calculateTribunaPricing(costNum, pricingMode);
    const saleNum = formWholesalePrice ? Number(formWholesalePrice) : calculatedPricing.recommendedWholesalePrice;

    if (editingModelId) {
      // Actualizar modelo existente
      setCatalog(prev => prev.map(item => {
        if (item.id !== editingModelId) return item;
        return {
          ...item,
          name: formModelName.trim(),
          size: formSize.trim(),
          typeName: formTypeName.trim(),
          piecesPerPack: Number(formPiecesPerPack) || 12,
          artisanCost: costNum,
          wholesalePrice: saleNum,
          pricingMode,
          pricingBreakdown: calculatedPricing,
          artisanProvider: formArtisanProvider.trim(),
          photoUrl: formPhotoUrl || item.photoUrl,
          notes: formNotes.trim()
        };
      }));
      setEditingModelId(null);
      alert(`✅ Modelo "${formModelName}" actualizado correctamente.`);
    } else {
      // Crear nuevo modelo
      const newModel = {
        id: `mod-${Date.now()}`,
        code: `MOD-${Math.floor(100 + Math.random() * 900)}`,
        name: formModelName.trim(),
        size: formSize.trim(),
        typeName: formTypeName.trim() || 'Esfera Navideña',
        piecesPerPack: Number(formPiecesPerPack) || 12,
        artisanCost: costNum,
        wholesalePrice: saleNum,
        pricingMode,
        pricingBreakdown: calculatedPricing,
        artisanProvider: formArtisanProvider.trim() || 'Taller Chignahuapan',
        photoUrl: formPhotoUrl || '',
        notes: formNotes.trim(),
        createdAt: new Date().toISOString().split('T')[0]
      };

      setCatalog(prev => [newModel, ...prev]);
      alert(`🎉 Modelo "${newModel.name}" guardado exitosamente.\nCosto Artesano: $${newModel.artisanCost} ➔ Venta Tribuna: $${newModel.wholesalePrice} MXN`);
    }

    // Limpiar formulario para el siguiente modelo
    setFormModelName('');
    setFormNotes('');
    setFormArtisanCost('');
    setFormWholesalePrice('');
    setFormPhotoUrl('');
  };

  // Cargar modelo en formulario para edición
  const handleEditModel = (model) => {
    setEditingModelId(model.id);
    setFormModelName(model.name);
    setFormSize(model.size);
    setFormTypeName(model.typeName);
    setFormPiecesPerPack(model.piecesPerPack);
    setFormArtisanCost(model.artisanCost);
    setFormWholesalePrice(model.wholesalePrice);
    setFormArtisanProvider(model.artisanProvider);
    setFormNotes(model.notes || '');
    setFormPhotoUrl(model.photoUrl || '');
    setActiveCatalogTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Eliminar modelo
  const handleDeleteModel = (modelId) => {
    if (confirm('¿Deseas eliminar este modelo del catálogo?')) {
      setCatalog(prev => prev.filter(m => m.id !== modelId));
      setOrderItems(prev => {
        const next = { ...prev };
        delete next[modelId];
        return next;
      });
    }
  };

  // Manejo de cantidades en el área de pedido
  const handleUpdateOrderQty = (modelId, delta) => {
    setOrderItems(prev => {
      const current = prev[modelId] || 0;
      const updated = Math.max(0, current + delta);
      const next = { ...prev };
      if (updated === 0) {
        delete next[modelId];
      } else {
        next[modelId] = updated;
      }
      return next;
    });
  };

  const handleSetExactOrderQty = (modelId, value) => {
    const valNum = Math.max(0, parseInt(value) || 0);
    setOrderItems(prev => {
      const next = { ...prev };
      if (valNum === 0) {
        delete next[modelId];
      } else {
        next[modelId] = valNum;
      }
      return next;
    });
  };

  // Cálculo del pedido actual con desglose en cascada (18% x 13% x 13% x 28% x 12%)
  const currentOrderSummary = useMemo(() => {
    let totalPacks = 0;
    let totalPieces = 0;
    let totalArtisanCost = 0;
    let totalWholesaleValue = 0;
    const categoryBreakdown = {};

    Object.entries(orderItems).forEach(([modelId, qty]) => {
      const item = catalog.find(m => m.id === modelId);
      if (item && qty > 0) {
        totalPacks += qty;
        totalPieces += qty * item.piecesPerPack;
        const lineCost = qty * item.artisanCost;
        const lineSale = qty * item.wholesalePrice;
        totalArtisanCost += lineCost;
        totalWholesaleValue += lineSale;

        const cat = item.typeName || 'General';
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + qty;
      }
    });

    // Desglose de totales con la fórmula activa (Opción 1: Suma Directa +84%)
    const cascadeTotals = calculateTribunaPricing(totalArtisanCost, pricingMode);

    const projectedProfit = totalWholesaleValue - totalArtisanCost;
    const marginPct = totalWholesaleValue > 0 ? Math.round((projectedProfit / totalWholesaleValue) * 100) : 0;
    const pendingBalance = Math.max(0, totalArtisanCost - Number(orderAdvancePayment || 0));

    return {
      totalPacks,
      totalPieces,
      totalArtisanCost,
      totalWholesaleValue,
      cascadeTotals,
      projectedProfit,
      marginPct,
      categoryBreakdown,
      pendingBalance
    };
  }, [orderItems, catalog, orderAdvancePayment, pricingMode]);

  // Guardar el Pedido Hecho en el Historial con datos de la fórmula
  const handleSavePurchaseOrder = () => {
    if (currentOrderSummary.totalPacks === 0) {
      alert('Debes agregar al menos 1 paquete de algún modelo para guardar el pedido.');
      return;
    }

    const orderFolio = `PED-CHIG-${String(savedOrders.length + 1).padStart(3, '0')}`;
    const dateNow = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Armar desglose detallado de productos
    const itemsDetail = Object.entries(orderItems).map(([modelId, qty]) => {
      const item = catalog.find(m => m.id === modelId);
      const cascadeItem = calculateTribunaPricing(item.artisanCost, pricingMode);
      return {
        modelId,
        code: item.code,
        name: item.name,
        size: item.size,
        typeName: item.typeName,
        piecesPerPack: item.piecesPerPack,
        packsOrdered: qty,
        totalPieces: qty * item.piecesPerPack,
        unitArtisanCost: item.artisanCost,
        unitWholesalePrice: item.wholesalePrice,
        pricingBreakdown: cascadeItem,
        subtotalArtisanCost: qty * item.artisanCost,
        subtotalWholesaleValue: qty * item.wholesalePrice,
        profit: (qty * item.wholesalePrice) - (qty * item.artisanCost),
        artisanProvider: item.artisanProvider
      };
    });

    const newSavedOrder = {
      id: `ord-${Date.now()}`,
      folio: orderFolio,
      date: dateNow,
      time: timeNow,
      expectedDeliveryDate: orderExpectedDate,
      artisanName: orderArtisanName,
      items: itemsDetail,
      totalPacks: currentOrderSummary.totalPacks,
      totalPieces: currentOrderSummary.totalPieces,
      totalArtisanCost: currentOrderSummary.totalArtisanCost,
      totalWholesaleValue: currentOrderSummary.totalWholesaleValue,
      pricingMode,
      cascadeTotals: currentOrderSummary.cascadeTotals,
      projectedProfit: currentOrderSummary.projectedProfit,
      marginPct: currentOrderSummary.marginPct,
      advancePayment: Number(orderAdvancePayment) || 0,
      pendingBalance: currentOrderSummary.pendingBalance,
      categoryBreakdown: currentOrderSummary.categoryBreakdown,
      notes: orderNotes.trim() || 'Pedido levantado directamente en ruta por Chignahuapan.',
      status: 'Guardado / Por Recolectar' // 'Guardado / Por Recolectar' | 'En Bodega Hub Chignahuapan' | 'Empacado' | 'Enviado con Castores'
    };

    setSavedOrders(prev => [newSavedOrder, ...prev]);

    // Limpiar canasta actual
    setOrderItems({});
    setOrderNotes('');
    setOrderAdvancePayment(0);
    setActiveCatalogTab('history');

    alert(`🎉 ¡Pedido ${orderFolio} guardado exitosamente!\nTotal: ${newSavedOrder.totalPacks} paquetes (${newSavedOrder.totalPieces} piezas)\nCosto Base Artesanos: $${newSavedOrder.totalArtisanCost.toLocaleString()} MXN\nTotal Facturado: $${newSavedOrder.totalWholesaleValue.toLocaleString()} MXN`);
  };

  // Cambiar estado de un pedido guardado
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setSavedOrders(prev => prev.map(ord => {
      if (ord.id !== orderId) return ord;
      return { ...ord, status: newStatus };
    }));
  };

  // Eliminar un pedido guardado
  const handleDeleteSavedOrder = (orderId, folio) => {
    if (confirm(`¿Deseas eliminar el pedido ${folio} del historial?`)) {
      setSavedOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  // Copiar Pedido Guardado para WhatsApp con desglose de fórmula
  const handleCopyOrderWhatsApp = (order) => {
    let text = `*🎄 GRUPO TRIBUNA - PEDIDO DE ESFERAS CHIGNAHUAPAN*\n`;
    text += `*Folio:* ${order.folio} | *Fecha:* ${order.date} (${order.time})\n`;
    text += `*Taller / Proveedor:* ${order.artisanName}\n`;
    text += `*Entrega Estimada:* ${order.expectedDeliveryDate}\n\n`;
    text += `*📦 DESGLOSE DE PRODUCTOS:*\n`;

    order.items.forEach(it => {
      text += `• *${it.packsOrdered}x paquetes* - ${it.name}\n`;
      text += `  Tamaño: ${it.size} | Tipo: ${it.typeName}\n`;
      text += `  ${it.piecesPerPack} pzas/pack (${it.totalPieces} esferas)\n`;
      text += `  Costo: $${it.unitArtisanCost} c/u | Venta: $${it.unitWholesalePrice} c/u\n`;
      text += `  Subtotal Costo: $${it.subtotalArtisanCost.toLocaleString()} MXN\n`;
    });

    const cascade = order.cascadeTotals || calculateTribunaPricing(order.totalArtisanCost, order.pricingMode || pricingMode);
    const modeLabel = cascade.mode === 'cascade' ? 'Cascada Compuesta (+116%)' : 'Opción 1: Suma Directa (+84%)';

    text += `\n*📐 FÓRMULA DE COSTOS, TRANSPORTE Y UTILIDAD TRIBUNA (${modeLabel}):*\n`;
    text += `• Costo Base Artesanos: $${order.totalArtisanCost.toLocaleString()} MXN\n`;
    text += `• (+) Flete Castores (18%): +$${cascade.castoresAmount?.toLocaleString() || '0'} MXN\n`;
    text += `• (+) Flete Troncal Chig-Pue (13%): +$${cascade.troncalAmount?.toLocaleString() || '0'} MXN\n`;
    text += `• (+) Embalaje Antishock (13%): +$${cascade.packagingAmount?.toLocaleString() || '0'} MXN\n`;
    text += `• (+) Utilidad Neta Tribuna (28%): +$${cascade.profitAmount?.toLocaleString() || order.projectedProfit.toLocaleString()} MXN\n`;
    text += `• (+) Acopio Hub & Merma (12%): +$${cascade.handlingAmount?.toLocaleString() || '0'} MXN\n`;
    text += `• TOTAL VENTA / FACTURADO: $${order.totalWholesaleValue.toLocaleString()} MXN\n`;

    text += `\n*💰 TOTALES FINALES:*\n`;
    text += `• Total Paquetes: ${order.totalPacks} estuches/cajas\n`;
    text += `• Total Esferas: ${order.totalPieces.toLocaleString()} piezas\n`;
    text += `• Inversión Artesanos: $${order.totalArtisanCost.toLocaleString()} MXN\n`;
    if (order.advancePayment > 0) {
      text += `• Anticipo Pagado: $${order.advancePayment.toLocaleString()} MXN\n`;
      text += `• Saldo Pendiente: $${order.pendingBalance.toLocaleString()} MXN\n`;
    }
    text += `• Ganancia Tribuna Proyectada: +$${order.projectedProfit.toLocaleString()} MXN (${order.marginPct}%)\n`;
    if (order.notes) text += `• Notas: ${order.notes}\n`;

    navigator.clipboard.writeText(text);
    alert(`📋 ¡Pedido ${order.folio} copiado al portapapeles con la fórmula de Opción 1 (+84%)! Listo para enviar por WhatsApp.`);
  };

  // Filtrado de modelos
  const filteredCatalog = catalog.filter(m => {
    const q = searchFilter.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.size.toLowerCase().includes(q) ||
      m.typeName.toLowerCase().includes(q) ||
      m.artisanProvider.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* ENCABEZADO PRINCIPAL DE CATALOGACIÓN Y PEDIDOS */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950 to-amber-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-red-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                🎄 Chignahuapan, Puebla
              </span>
              <span className="text-xs text-amber-300 font-bold">
                Grupo Tribuna Logística
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Catálogo de Modelos & Levantamiento de Pedidos
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Registra los modelos directamente con los campos rellenables conforme visitas cada taller artesanal y levanta tus pedidos con costo, categoría y guardado permanente.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-xs font-bold text-center">
              <span className="text-amber-300 block text-base font-black">{catalog.length}</span>
              <span className="text-[10px] text-slate-300">Modelos Creados</span>
            </span>

            <span className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-xs font-bold text-center">
              <span className="text-emerald-400 block text-base font-black">{savedOrders.length}</span>
              <span className="text-[10px] text-slate-300">Pedidos Guardados</span>
            </span>
          </div>
        </div>
      </div>

      {/* PESTAÑAS DE TRABAJO */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        
        <button
          onClick={() => setActiveCatalogTab('create')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeCatalogTab === 'create'
              ? 'bg-red-600 text-white shadow-md shadow-red-900/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>1. Crear / Escribir Modelos ({catalog.length})</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('order')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeCatalogTab === 'order'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-900/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>2. Hacer Pedido</span>
          {currentOrderSummary.totalPacks > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.2 rounded-full">
              {currentOrderSummary.totalPacks} pks
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveCatalogTab('history')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeCatalogTab === 'history'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Pedidos Guardados ({savedOrders.length})</span>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* ÁREA 1: FORMULARIO CON CAMPOS RELLENABLES PARA CREAR MODELO */}
      {/* ========================================================================= */}
      {activeCatalogTab === 'create' && (
        <div className="space-y-6">
          
          {/* Card del Formulario Rellenable */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">
                  {editingModelId ? 'Editando Modelo' : 'Nuevo Modelo de Esfera'}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {editingModelId ? 'Modificar Datos del Modelo' : 'Escribir y Registrar Nuevo Modelo'}
                </h2>
                <p className="text-xs text-slate-500">
                  Completa los campos tal como te indiquen en el taller de Chignahuapan.
                </p>
              </div>

              {editingModelId && (
                <button
                  onClick={() => {
                    setEditingModelId(null);
                    setFormModelName('');
                    setFormArtisanCost('');
                    setFormWholesalePrice('');
                    setFormNotes('');
                    setFormPhotoUrl('');
                  }}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl"
                >
                  Cancelar Edición
                </button>
              )}
            </div>

            <form onSubmit={handleSaveModel} className="space-y-4 text-xs">
              
              {/* Campo 1: Nombre del Modelo (Escribible) */}
              <div>
                <label className="font-black text-slate-800 text-xs uppercase tracking-wider block mb-1">
                  1. Nombre / Modelo de la Esfera: <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formModelName}
                  onChange={(e) => setFormModelName(e.target.value)}
                  placeholder="Escribe el modelo (Ej: Esfera Grinch cara pintada, Esfera Espejo Lisa, Canoa 8 pzas rubí...)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Fila: Tamaño + Tipo / Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Campo 2: Tamaño / Calibre */}
                <div>
                  <label className="font-black text-slate-800 text-xs uppercase tracking-wider block mb-1">
                    2. Tamaño / Calibre: <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formSize}
                    onChange={(e) => setFormSize(e.target.value)}
                    placeholder="Ej: #4 Económica, #5 Mediana, #6 Clásica, 8 cm, Jumbo 12 cm..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5 text-[10px]">
                    <span className="text-slate-400 font-semibold">Atajos:</span>
                    {['#3 Mini', '#4 Económica', '#5 Mediana', '#6 Clásica', '#7 Grande', '#8 Monumental'].map(sz => (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => setFormSize(sz)}
                        className="bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-semibold"
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Campo 3: Nombre del Tipo / Categoría */}
                <div>
                  <label className="font-black text-slate-800 text-xs uppercase tracking-wider block mb-1">
                    3. Nombre del Tipo / Categoría: <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTypeName}
                    onChange={(e) => setFormTypeName(e.target.value)}
                    placeholder="Ej: Económica, Clásica (2 texturas), Temática, Canoa, Racimo, Árbol Abundancia..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5 text-[10px]">
                    <span className="text-slate-400 font-semibold">Atajos:</span>
                    {['Económica', 'Mediana', 'Clásica', 'Temática', 'Canoa', 'Racimo', 'Árbol Abundancia'].map(tp => (
                      <button
                        type="button"
                        key={tp}
                        onClick={() => setFormTypeName(tp)}
                        className="bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-semibold"
                      >
                        {tp}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Fila: Cantidad por Paquete + Precios */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Campo 4: Cantidad por paquete */}
                <div>
                  <label className="font-black text-slate-800 text-xs uppercase tracking-wider block mb-1">
                    4. Cantidad por Paquete: <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formPiecesPerPack}
                    onChange={(e) => setFormPiecesPerPack(e.target.value)}
                    placeholder="12"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
                    <span className="text-slate-400">Común:</span>
                    {[6, 8, 12, 24, 32, 48].map(n => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => setFormPiecesPerPack(n)}
                        className="bg-slate-100 hover:bg-slate-200 px-1.5 py-0.2 rounded font-bold"
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Campo 5: Precio / Costo Artesano */}
                <div>
                  <label className="font-black text-slate-800 text-xs uppercase tracking-wider block mb-1">
                    5. Costo Artesano ($ MXN): <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={formArtisanCost}
                    onChange={(e) => {
                      const cost = e.target.value;
                      setFormArtisanCost(cost);
                      if (cost && Number(cost) > 0) {
                        const pricing = calculateTribunaPricing(cost, pricingMode);
                        setFormWholesalePrice(pricing.recommendedWholesalePrice);
                      } else {
                        setFormWholesalePrice('');
                      }
                    }}
                    placeholder="Ej: 100.00"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Lo que te cobra el taller artesanal por paquete</span>
                </div>

                {/* Campo 6: Precio Venta Tribuna */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-black text-amber-800 text-xs uppercase tracking-wider">
                      6. Precio Venta Tribuna ($):
                    </label>
                    {formArtisanCost && Number(formArtisanCost) > 0 && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        {pricingMode === 'direct' ? 'Opción 1 (+84% ➔ 1.84x)' : 'Opción 2 (~2.16x)'}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={formWholesalePrice}
                    onChange={(e) => setFormWholesalePrice(e.target.value)}
                    placeholder="Ej: 184.00"
                    className="w-full px-3.5 py-2.5 bg-amber-50/50 border border-amber-300 rounded-xl text-xs font-black text-amber-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  {formArtisanCost && formWholesalePrice && (
                    <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                      Margen Bruto Total: +${Number(formWholesalePrice) - Number(formArtisanCost)} MXN
                    </span>
                  )}
                </div>

              </div>

              {/* DESGLOSE VISUAL DE LA FÓRMULA DE COSTOS Y UTILIDAD TRIBUNA */}
              {Number(formArtisanCost) > 0 && (
                <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 border border-amber-300/80 rounded-2xl p-4 space-y-3 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="p-1.5 bg-amber-500 text-white rounded-xl shadow-xs">
                        <Calculator className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="font-black text-amber-950 text-xs uppercase tracking-wide block">
                          {pricingMode === 'direct' 
                            ? 'Fórmula Opción 1: Suma Directa (+84% sobre costo base)' 
                            : 'Fórmula Opción 2: Cascada Compuesta (~2.16x)'}
                        </span>
                        <span className="text-[10px] text-amber-800">
                          {pricingMode === 'direct'
                            ? 'Costo + 18% Castores + 13% Troncal + 13% Embalaje + 28% Tribuna + 12% Acopio ($100 ➔ $184 MXN)'
                            : 'Costo x 1.18 x 1.13 x 1.13 x 1.28 x 1.12 ($100 ➔ $216 MXN)'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Selector de Opción de Cálculo */}
                      <div className="bg-white/90 p-0.5 rounded-xl border border-amber-300 flex text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => {
                            setPricingMode('direct');
                            if (formArtisanCost && Number(formArtisanCost) > 0) {
                              const p = calculateDirectSumPricing(formArtisanCost);
                              setFormWholesalePrice(p.recommendedWholesalePrice);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            pricingMode === 'direct'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          ⭐ Opción 1 (+84% ➔ $184)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPricingMode('cascade');
                            if (formArtisanCost && Number(formArtisanCost) > 0) {
                              const p = calculateCascadingPricing(formArtisanCost);
                              setFormWholesalePrice(p.recommendedWholesalePrice);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            pricingMode === 'cascade'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Opción 2 (Cascada $216)
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFormWholesalePrice(formPricing.recommendedWholesalePrice)}
                        className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black px-2.5 py-1 rounded-xl text-[11px] shadow-xs flex items-center space-x-1 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Fijar ${formPricing.recommendedWholesalePrice} MXN</span>
                      </button>
                    </div>
                  </div>

                  {/* Pasos de la Fórmula */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                      <div className="flex items-center space-x-1 text-slate-500 text-[10px] font-bold">
                        <span>🚚</span>
                        <span>Castores (18%)</span>
                      </div>
                      <div className="font-black text-slate-900 text-sm mt-0.5">
                        +${formPricing.castoresAmount} <span className="text-[10px] text-slate-400 font-normal">MXN</span>
                      </div>
                      <div className="text-[9px] text-slate-500 font-semibold mt-0.5">
                        {pricingMode === 'direct' ? 'Sobre base de costo' : `Subtotal: $${formPricing.steps?.[0]?.subtotal || 0}`}
                      </div>
                    </div>

                    <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                      <div className="flex items-center space-x-1 text-slate-500 text-[10px] font-bold">
                        <span>🚐</span>
                        <span>Troncal (13%)</span>
                      </div>
                      <div className="font-black text-slate-900 text-sm mt-0.5">
                        +${formPricing.troncalAmount} <span className="text-[10px] text-slate-400 font-normal">MXN</span>
                      </div>
                      <div className="text-[9px] text-slate-500 font-semibold mt-0.5">
                        {pricingMode === 'direct' ? 'Sobre base de costo' : `Subtotal: $${formPricing.steps?.[1]?.subtotal || 0}`}
                      </div>
                    </div>

                    <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                      <div className="flex items-center space-x-1 text-slate-500 text-[10px] font-bold">
                        <span>📦</span>
                        <span>Embalaje (13%)</span>
                      </div>
                      <div className="font-black text-slate-900 text-sm mt-0.5">
                        +${formPricing.packagingAmount} <span className="text-[10px] text-slate-400 font-normal">MXN</span>
                      </div>
                      <div className="text-[9px] text-slate-500 font-semibold mt-0.5">
                        {pricingMode === 'direct' ? 'Sobre base de costo' : `Subtotal: $${formPricing.steps?.[2]?.subtotal || 0}`}
                      </div>
                    </div>

                    <div className="bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-300 shadow-2xs">
                      <div className="flex items-center space-x-1 text-emerald-800 text-[10px] font-black">
                        <span>💎</span>
                        <span>Utilidad Tribuna (28%)</span>
                      </div>
                      <div className="font-black text-emerald-700 text-sm mt-0.5">
                        +${formPricing.profitAmount} <span className="text-[10px] text-emerald-600 font-normal">MXN</span>
                      </div>
                      <div className="text-[9px] text-emerald-800 font-semibold mt-0.5">
                        {pricingMode === 'direct' ? 'Ganancia neta directa' : `Subtotal: $${formPricing.steps?.[3]?.subtotal || 0}`}
                      </div>
                    </div>

                    <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                      <div className="flex items-center space-x-1 text-slate-500 text-[10px] font-bold">
                        <span>🏢</span>
                        <span>Acopio / Merma (12%)</span>
                      </div>
                      <div className="font-black text-slate-900 text-sm mt-0.5">
                        +${formPricing.handlingAmount} <span className="text-[10px] text-slate-400 font-normal">MXN</span>
                      </div>
                      <div className="text-[9px] text-amber-900 font-bold mt-0.5">
                        Total Final: ${formPricing.recommendedWholesalePrice} MXN
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Taller Artesano + Foto Opcional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">
                    Taller / Artesano Proveedor:
                  </label>
                  <input
                    type="text"
                    value={formArtisanProvider}
                    onChange={(e) => setFormArtisanProvider(e.target.value)}
                    placeholder="Nombre del taller o artesano"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">
                    Foto del Modelo (Opcional):
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 border border-slate-300"
                    >
                      <Camera className="w-4 h-4 text-red-600" />
                      <span>{formPhotoUrl ? 'Cambiar Foto' : 'Tomar / Subir Foto'}</span>
                    </button>
                    {formPhotoUrl && (
                      <span className="text-emerald-700 font-bold text-xs flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Foto Cargada</span>
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Botón Guardar Modelo */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black py-3.5 px-4 rounded-2xl shadow-lg transition-transform active:scale-95 text-sm flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingModelId ? 'Guardar Cambios del Modelo' : '➕ Guardar Modelo en Catálogo'}</span>
                </button>
              </div>

            </form>

          </div>

          {/* LISTA DE MODELOS YA CREADOS */}
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Modelos Creados en Catálogo ({catalog.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Modelos listos para agregar a tus pedidos de compra consolidada.
                </p>
              </div>

              {catalog.length > 0 && (
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Buscar modelo o tamaño..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              )}
            </div>

            {catalog.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200 space-y-2">
                <Package className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">Tu catálogo está listo y vacío</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Usa los campos de arriba para escribir tu primer modelo con su tamaño, tipo de esfera, piezas por paquete y costo artesano.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCatalog.map(model => (
                  <div
                    key={model.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                            {model.size}
                          </span>
                          <h4 className="font-black text-slate-900 text-base mt-1 leading-snug">
                            {model.name}
                          </h4>
                          <span className="text-xs text-slate-500 font-semibold">
                            {model.typeName}
                          </span>
                        </div>

                        {model.photoUrl && (
                          <img src={model.photoUrl} alt={model.name} className="w-14 h-14 rounded-2xl object-cover border" />
                        )}
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Piezas por paquete:</span>
                          <span className="font-bold text-slate-900">{model.piecesPerPack} pzas</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Costo Artesano (Base):</span>
                          <span className="font-black text-slate-900">${model.artisanCost} MXN</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Precio Venta Tribuna:</span>
                          <span className="font-black text-amber-700">${model.wholesalePrice} MXN</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-1 text-[11px]">
                          <span className="text-emerald-700 font-bold">Margen Bruto Total:</span>
                          <span className="text-emerald-700 font-black">+${model.wholesalePrice - model.artisanCost} MXN</span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-500 flex flex-wrap gap-1">
                          <span className="bg-amber-100/80 text-amber-900 px-1.5 py-0.5 rounded font-semibold">18% Castores</span>
                          <span className="bg-amber-100/80 text-amber-900 px-1.5 py-0.5 rounded font-semibold">13% Troncal</span>
                          <span className="bg-amber-100/80 text-amber-900 px-1.5 py-0.5 rounded font-semibold">13% Embalaje</span>
                          <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-bold">28% Tribuna</span>
                          <span className="bg-amber-100/80 text-amber-900 px-1.5 py-0.5 rounded font-semibold">12% Acopio</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 truncate">
                        📍 Taller: <strong>{model.artisanProvider}</strong>
                      </div>
                    </div>

                    {/* Acciones del modelo */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEditModel(model)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Editar modelo"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteModel(model.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Eliminar modelo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          handleUpdateOrderQty(model.id, 1);
                          setActiveCatalogTab('order');
                        }}
                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar al Pedido</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ÁREA 2: HACER PEDIDO & GUARDAR EL PEDIDO HECHO */}
      {/* ========================================================================= */}
      {activeCatalogTab === 'order' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">
                  Área de Compras
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  Levantar Pedido de Compra Consolidada
                </h2>
                <p className="text-xs text-slate-500">
                  Indica la cantidad de paquetes de cada modelo y guarda el pedido con costo y categoría.
                </p>
              </div>

              {catalog.length > 0 && (
                <button
                  onClick={() => setActiveCatalogTab('create')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Crear Otro Modelo</span>
                </button>
              )}
            </div>

            {catalog.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">No hay modelos registrados para pedir</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Primero escribe y crea tus modelos de esfera en la pestaña anterior para poder armar tu pedido.
                </p>
                <button
                  onClick={() => setActiveCatalogTab('create')}
                  className="bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Ir a Crear Modelos
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Datos del Taller / Proveedor del Pedido */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Taller / Proveedor del Pedido:</label>
                    <input
                      type="text"
                      value={orderArtisanName}
                      onChange={(e) => setOrderArtisanName(e.target.value)}
                      placeholder="Nombre del taller artesanal"
                      className="w-full px-3 py-2 bg-white border rounded-xl font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Fecha Prometida de Entrega:</label>
                    <input
                      type="date"
                      value={orderExpectedDate}
                      onChange={(e) => setOrderExpectedDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border rounded-xl font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Anticipo Pagado ($ MXN):</label>
                    <input
                      type="number"
                      min="0"
                      value={orderAdvancePayment}
                      onChange={(e) => setOrderAdvancePayment(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-white border rounded-xl font-semibold"
                    />
                  </div>
                </div>

                {/* Tabla de Modelos y Cantidades */}
                <div className="space-y-3">
                  <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Selecciona cantidades por modelo:
                  </div>

                  <div className="space-y-2">
                    {catalog.map(model => {
                      const qty = orderItems[model.id] || 0;
                      const lineCost = qty * model.artisanCost;
                      const lineSale = qty * model.wholesalePrice;

                      return (
                        <div 
                          key={model.id}
                          className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            qty > 0 ? 'bg-amber-50/60 border-amber-300' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-black text-xs flex items-center justify-center flex-shrink-0">
                              {model.size.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-black text-slate-900 text-sm">{model.name}</div>
                              <div className="text-xs text-slate-500">
                                Tamaño: <strong>{model.size}</strong> · Tipo: <strong>{model.typeName}</strong> · {model.piecesPerPack} pzas/pack
                              </div>
                              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                                Costo: <span className="font-bold">${model.artisanCost}</span> · Venta: <span className="font-bold">${model.wholesalePrice}</span>
                              </div>
                            </div>
                          </div>

                          {/* Control de Cantidad y Subtotal */}
                          <div className="flex items-center justify-between sm:justify-end space-x-4">
                            {qty > 0 && (
                              <div className="text-right text-xs">
                                <span className="text-[10px] text-slate-400 block">Subtotal Costo:</span>
                                <span className="font-black text-slate-900">${lineCost.toLocaleString()} MXN</span>
                              </div>
                            )}

                            <div className="flex items-center space-x-1.5 bg-white border border-slate-300 rounded-xl p-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderQty(model.id, -1)}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-black flex items-center justify-center"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={qty}
                                onChange={(e) => handleSetExactOrderQty(model.id, e.target.value)}
                                className="w-12 text-center text-xs font-black text-slate-900 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderQty(model.id, 1)}
                                className="w-7 h-7 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notas del Pedido */}
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">
                    Notas adicionales del pedido (embalaje, colores acordados, etc.):
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Escribe detalles del pedido para el taller..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                {/* RESUMEN FINANCIERO Y BOTÓN DE GUARDADO */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                      Resumen del Pedido Actual
                    </span>
                    <span className="text-xs bg-red-600 px-2.5 py-0.5 rounded-full font-bold">
                      {currentOrderSummary.totalPacks} Paquetes ({currentOrderSummary.totalPieces.toLocaleString()} Esferas)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Inversión Artesano:</span>
                      <span className="text-lg font-black text-white">${currentOrderSummary.totalArtisanCost.toLocaleString()} MXN</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">Valor Venta Mayorista:</span>
                      <span className="text-lg font-black text-amber-300">${currentOrderSummary.totalWholesaleValue.toLocaleString()} MXN</span>
                    </div>

                    <div>
                      <span className="text-emerald-400 text-[10px] block">Utilidad Proyectada:</span>
                      <span className="text-lg font-black text-emerald-400">+${currentOrderSummary.projectedProfit.toLocaleString()} MXN</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">Saldo por Liquidar:</span>
                      <span className="text-lg font-black text-rose-300">${currentOrderSummary.pendingBalance.toLocaleString()} MXN</span>
                    </div>
                  </div>

                  {/* Desglose Operativo del Pedido */}
                  {currentOrderSummary.totalArtisanCost > 0 && (
                    <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                        <span className="text-amber-400 font-bold flex items-center space-x-1.5">
                          <Calculator className="w-3.5 h-3.5" />
                          <span>
                            {pricingMode === 'direct'
                              ? 'Fórmula Opción 1: Suma Directa (+84% sobre costo base)'
                              : 'Fórmula Opción 2: Cascada Compuesta (~2.16x)'}
                          </span>
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-700 flex text-[9px] font-bold">
                            <button
                              type="button"
                              onClick={() => setPricingMode('direct')}
                              className={`px-2 py-0.5 rounded ${pricingMode === 'direct' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}
                            >
                              ⭐ Opción 1 (+84%)
                            </button>
                            <button
                              type="button"
                              onClick={() => setPricingMode('cascade')}
                              className={`px-2 py-0.5 rounded ${pricingMode === 'cascade' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}
                            >
                              Opción 2 (Cascada)
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-300 font-semibold bg-slate-700/80 px-2 py-0.5 rounded-md">
                            {pricingMode === 'direct' ? '1.84x Base' : '~2.16x Base'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                        <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-700/80">
                          <span className="text-slate-400 text-[10px] block font-semibold">🚚 Castores (18%)</span>
                          <span className="font-bold text-white">+${currentOrderSummary.cascadeTotals?.castoresAmount?.toLocaleString()} MXN</span>
                        </div>
                        <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-700/80">
                          <span className="text-slate-400 text-[10px] block font-semibold">🚐 Troncal (13%)</span>
                          <span className="font-bold text-white">+${currentOrderSummary.cascadeTotals?.troncalAmount?.toLocaleString()} MXN</span>
                        </div>
                        <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-700/80">
                          <span className="text-slate-400 text-[10px] block font-semibold">📦 Embalaje (13%)</span>
                          <span className="font-bold text-white">+${currentOrderSummary.cascadeTotals?.packagingAmount?.toLocaleString()} MXN</span>
                        </div>
                        <div className="bg-emerald-950/60 p-2 rounded-xl border border-emerald-600/50">
                          <span className="text-emerald-400 text-[10px] block font-black">💎 Utilidad Tribuna (28%)</span>
                          <span className="font-black text-emerald-300">+${currentOrderSummary.cascadeTotals?.profitAmount?.toLocaleString()} MXN</span>
                        </div>
                        <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-700/80">
                          <span className="text-slate-400 text-[10px] block font-semibold">🏢 Acopio / Merma (12%)</span>
                          <span className="font-bold text-amber-300">+${currentOrderSummary.cascadeTotals?.handlingAmount?.toLocaleString()} MXN</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSavePurchaseOrder}
                      disabled={currentOrderSummary.totalPacks === 0}
                      className={`w-full font-black py-4 px-4 rounded-2xl shadow-xl transition-all text-sm flex items-center justify-center space-x-2 ${
                        currentOrderSummary.totalPacks > 0
                          ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white cursor-pointer active:scale-95'
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Save className="w-5 h-5" />
                      <span>💾 GUARDAR PEDIDO HECHO EN EL SISTEMA</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ÁREA 3: HISTORIAL DE PEDIDOS GUARDADOS */}
      {/* ========================================================================= */}
      {activeCatalogTab === 'history' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Historial de Pedidos Hechos & Guardados ({savedOrders.length})
              </h3>
              <p className="text-xs text-slate-500">
                Consulta los pedidos realizados a los talleres de Chignahuapan, copia a WhatsApp o supervisa su estado.
              </p>
            </div>

            <button
              onClick={() => setActiveCatalogTab('order')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Hacer Nuevo Pedido</span>
            </button>
          </div>

          {savedOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">No tienes pedidos guardados todavía</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ve al área de <strong>"2. Hacer Pedido"</strong> para armar y guardar tu primera orden de compra en Chignahuapan.
              </p>
              <button
                onClick={() => setActiveCatalogTab('order')}
                className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                Ir a Hacer Pedido
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  
                  {/* Encabezado del Pedido Guardado */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                        GT
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-slate-900 text-base">{order.folio}</span>
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {order.date} ({order.time})
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Taller: <strong className="text-slate-800">{order.artisanName}</strong> · Entrega: <strong>{order.expectedDeliveryDate}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Selector de Estado Operativo */}
                    <div className="flex items-center space-x-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                          order.status.includes('Completado') || order.status.includes('Entregado')
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.status.includes('En Bodega')
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Guardado / Por Recolectar">📦 Guardado / Por Recolectar</option>
                        <option value="En Bodega Hub Chignahuapan">🏢 En Bodega Hub Chignahuapan</option>
                        <option value="Empacado con Protección Frágil">🛡️ Empacado con Protección Frágil</option>
                        <option value="Enviado con Castores">🚚 Enviado con Castores</option>
                        <option value="Entregado">✅ Entregado</option>
                      </select>

                      <button
                        onClick={() => handleCopyOrderWhatsApp(order)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-xs"
                        title="Copiar pedido a WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => handleDeleteSavedOrder(order.id, order.folio)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg transition-colors"
                        title="Eliminar pedido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tabla / Lista de Modelos del Pedido */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-100 rounded-xl overflow-hidden">
                      <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Modelo / Esfera</th>
                          <th className="p-2.5">Tamaño</th>
                          <th className="p-2.5">Tipo / Categoría</th>
                          <th className="p-2.5 text-center">Paquetes</th>
                          <th className="p-2.5 text-center">Esferas Totales</th>
                          <th className="p-2.5 text-right">Costo Unit.</th>
                          <th className="p-2.5 text-right">Subtotal Costo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {order.items.map((it, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-bold text-slate-900">{it.name}</td>
                            <td className="p-2.5 text-slate-700 font-semibold">{it.size}</td>
                            <td className="p-2.5 text-slate-600">{it.typeName}</td>
                            <td className="p-2.5 text-center font-black text-slate-900">{it.packsOrdered}</td>
                            <td className="p-2.5 text-center text-slate-600">{it.totalPieces} pzas</td>
                            <td className="p-2.5 text-right font-medium">${it.unitArtisanCost}</td>
                            <td className="p-2.5 text-right font-black text-slate-900">${it.subtotalArtisanCost.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Desglose de Fórmula Guardado */}
                  {order.totalArtisanCost > 0 && (() => {
                    const cascade = order.cascadeTotals || calculateTribunaPricing(order.totalArtisanCost, order.pricingMode || pricingMode);
                    const isDirect = cascade.mode !== 'cascade';
                    return (
                      <div className="bg-slate-100/70 p-3 rounded-2xl border border-slate-200 text-[11px] space-y-1.5">
                        <div className="flex items-center justify-between text-slate-700 font-bold">
                          <span className="flex items-center space-x-1">
                            <Calculator className="w-3.5 h-3.5 text-red-600" />
                            <span>
                              {isDirect 
                                ? 'Fórmula Opción 1: Suma Directa (+84% sobre costo base):' 
                                : 'Fórmula Opción 2: Cascada Compuesta (~2.16x):'}
                            </span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {isDirect ? 'Multiplicador: 1.84x' : 'Multiplicador: ~2.16x'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10px]">
                          <div className="bg-white p-2 rounded-xl border border-slate-200">
                            <span className="text-slate-500 block">🚚 Castores (18%)</span>
                            <span className="font-bold text-slate-900">+${cascade.castoresAmount?.toLocaleString()} MXN</span>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-200">
                            <span className="text-slate-500 block">🚐 Troncal (13%)</span>
                            <span className="font-bold text-slate-900">+${cascade.troncalAmount?.toLocaleString()} MXN</span>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-200">
                            <span className="text-slate-500 block">📦 Embalaje (13%)</span>
                            <span className="font-bold text-slate-900">+${cascade.packagingAmount?.toLocaleString()} MXN</span>
                          </div>
                          <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-300 text-emerald-900">
                            <span className="block font-bold">💎 Utilidad Tribuna (28%)</span>
                            <span className="font-black text-emerald-700">+${cascade.profitAmount?.toLocaleString()} MXN</span>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-200">
                            <span className="text-slate-500 block">🏢 Acopio / Merma (12%)</span>
                            <span className="font-bold text-slate-900">+${cascade.handlingAmount?.toLocaleString()} MXN</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Totales y Finanzas del Pedido */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div>
                        <strong>Total Paquetes:</strong> {order.totalPacks} ({order.totalPieces.toLocaleString()} esferas)
                      </div>
                      {order.notes && (
                        <div className="text-slate-500">
                          <strong>Notas:</strong> {order.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Costo Inversión:</span>
                        <span className="font-black text-slate-900 text-sm">${order.totalArtisanCost.toLocaleString()} MXN</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Venta Estimada:</span>
                        <span className="font-black text-amber-700 text-sm">${order.totalWholesaleValue.toLocaleString()} MXN</span>
                      </div>
                      <div className="bg-emerald-100 px-3 py-1.5 rounded-xl">
                        <span className="text-emerald-800 text-[10px] font-bold block">Ganancia Tribuna:</span>
                        <span className="font-black text-emerald-800 text-sm">+${order.projectedProfit.toLocaleString()} MXN</span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
