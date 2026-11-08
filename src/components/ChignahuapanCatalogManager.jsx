import React, { useState, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Camera, 
  Plus, 
  Search, 
  Filter, 
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
  Image as ImageIcon, 
  Tag, 
  ChevronRight, 
  AlertCircle,
  X,
  Layers,
  ArrowUpDown,
  Smartphone
} from 'lucide-react';

import {
  SPHERE_NUMBERS,
  SPHERE_TYPES,
  PACKAGING_COUNTS,
  INITIAL_SPHERES_CATALOG,
  INITIAL_ARTISANS
} from '../data/chignahuapanData';

export default function ChignahuapanCatalogManager({ onOpenShippingQuote }) {
  // Catálogo con persistencia en localStorage
  const [catalog, setCatalog] = useState(() => {
    const saved = localStorage.getItem('tribuna_spheres_catalog_v1');
    return saved ? JSON.parse(saved) : INITIAL_SPHERES_CATALOG;
  });

  // Artesanos
  const [artisans] = useState(() => {
    const saved = localStorage.getItem('tribuna_chignahuapan_artisans_v1');
    return saved ? JSON.parse(saved) : INITIAL_ARTISANS;
  });

  // Canasta de Compra Consolidada: { [productId]: quantity }
  const [consolidatedCart, setConsolidatedCart] = useState(() => {
    const saved = localStorage.getItem('tribuna_consolidated_cart_v1');
    return saved ? JSON.parse(saved) : { 'esf-001': 10, 'esf-004': 15, 'esf-006': 8, 'esf-011': 6 };
  });

  // Filtros y Búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('ALL'); // 'ALL' | '#3' | '#4' | '#5' | '#6' | '#7' | '#8'
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedArtisan, setSelectedArtisan] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'number'

  // Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);

  // Estados del Formulario de Nueva Esfera (Optimizado para móvil)
  const [formName, setFormName] = useState('');
  const [formNumber, setFormNumber] = useState('#5');
  const [formType, setFormType] = useState('Esfera Clásica (Dos Texturas)');
  const [formArtisanId, setFormArtisanId] = useState(artisans[0]?.id || 'art-01');
  const [formColorMotif, setFormColorMotif] = useState('');
  const [formPackaging, setFormPackaging] = useState('Estuche Acetato (12 piezas - Docena)');
  const [formPiecesPerPack, setFormPiecesPerPack] = useState(12);
  const [formArtisanCost, setFormArtisanCost] = useState(90);
  const [formTribunaPrice, setFormTribunaPrice] = useState(140);
  const [formStock, setFormStock] = useState(50);
  const [formNotes, setFormNotes] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const fileInputRef = useRef(null);

  // Guardar en localStorage
  React.useEffect(() => {
    localStorage.setItem('tribuna_spheres_catalog_v1', JSON.stringify(catalog));
  }, [catalog]);

  React.useEffect(() => {
    localStorage.setItem('tribuna_consolidated_cart_v1', JSON.stringify(consolidatedCart));
  }, [consolidatedCart]);

  // Procesamiento y Compresión de Foto desde el Celular (Cámara o Galería)
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionar para evitar saturar el almacenamiento local (máx 800px)
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 800;

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

        // Convertir a JPEG comprimido
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        setFormPhotoUrl(compressedBase64);
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Crear o actualizar producto
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Por favor introduce el nombre de la esfera o motivo.');
      return;
    }

    const art = artisans.find(a => a.id === formArtisanId) || artisans[0];
    const generatedCode = `ESF-${formNumber.replace('#', '')}-${formName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct = {
      id: `esf-${Date.now()}`,
      code: generatedCode,
      name: formName.trim(),
      number: formNumber,
      type: formType,
      artisanId: art.id,
      artisanName: art.businessName,
      colorMotif: formColorMotif.trim() || 'Color tradicional artesanal',
      packaging: formPackaging,
      piecesPerPack: Number(formPiecesPerPack),
      artisanCost: Number(formArtisanCost),
      tribunaWholesalePrice: Number(formTribunaPrice),
      suggestedRetailPrice: Math.round(Number(formTribunaPrice) * 1.35),
      stockAvailable: Number(formStock),
      dimensionsCm: 'Estándar Chignahuapan',
      approxWeightGr: Number(formPiecesPerPack) * 30,
      photoUrl: formPhotoUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      notes: formNotes.trim() || 'Pieza catalogada en ruta por Chignahuapan.'
    };

    setCatalog(prev => [newProduct, ...prev]);
    setIsAddModalOpen(false);

    // Reset form
    setFormName('');
    setFormColorMotif('');
    setFormNotes('');
    setFormPhotoUrl('');

    alert(`🎉 ¡Esfera "${newProduct.name}" agregada exitosamente al catálogo de Grupo Tribuna!`);
  };

  // Manejo de cantidades en Compra Consolidada
  const handleUpdateCartQty = (productId, delta) => {
    setConsolidatedCart(prev => {
      const current = prev[productId] || 0;
      const updated = Math.max(0, current + delta);
      const nextCart = { ...prev };
      if (updated === 0) {
        delete nextCart[productId];
      } else {
        nextCart[productId] = updated;
      }
      return nextCart;
    });
  };

  // Filtrado y ordenamiento de catálogo
  const filteredCatalog = useMemo(() => {
    return catalog.filter(item => {
      const matchSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.colorMotif.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchNumber = selectedNumber === 'ALL' || item.number === selectedNumber;
      const matchType = selectedType === 'ALL' || item.type === selectedType;
      const matchArtisan = selectedArtisan === 'ALL' || item.artisanId === selectedArtisan;

      return matchSearch && matchNumber && matchType && matchArtisan;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.artisanCost - b.artisanCost;
      if (sortBy === 'price-desc') return b.artisanCost - a.artisanCost;
      if (sortBy === 'number') return a.number.localeCompare(b.number);
      return 0; // default featured
    });
  }, [catalog, searchQuery, selectedNumber, selectedType, selectedArtisan, sortBy]);

  // Resumen de la Compra Consolidada
  const cartSummary = useMemo(() => {
    let totalBoxes = 0;
    let totalPieces = 0;
    let totalArtisanInvestment = 0;
    let totalTribunaWholesaleValue = 0;
    let totalWeightKg = 0;

    Object.entries(consolidatedCart).forEach(([prodId, qty]) => {
      const item = catalog.find(p => p.id === prodId);
      if (item && qty > 0) {
        totalBoxes += qty;
        totalPieces += qty * (item.piecesPerPack || 12);
        totalArtisanInvestment += qty * item.artisanCost;
        totalTribunaWholesaleValue += qty * item.tribunaWholesalePrice;
        totalWeightKg += (qty * (item.approxWeightGr || 300)) / 1000;
      }
    });

    const projectedGrossProfit = totalTribunaWholesaleValue - totalArtisanInvestment;
    const marginPct = totalTribunaWholesaleValue > 0 
      ? Math.round((projectedGrossProfit / totalTribunaWholesaleValue) * 100) 
      : 0;

    // Estimación de cajas maestras de flete (aprox 4 a 6 estuches por caja máster de cartón triple onda)
    const estimatedMasterBoxes = Math.ceil(totalBoxes / 4);

    return {
      totalBoxes,
      totalPieces,
      totalArtisanInvestment,
      totalTribunaWholesaleValue,
      projectedGrossProfit,
      marginPct,
      totalWeightKg: Math.round(totalWeightKg * 10) / 10,
      estimatedMasterBoxes
    };
  }, [consolidatedCart, catalog]);

  // Generar texto para compartir por WhatsApp
  const handleShareConsolidatedOrder = () => {
    let text = `*🎄 GRUPO TRIBUNA - ORDEN DE COMPRA CONSOLIDADA EN CHIGNAHUAPAN*\n`;
    text += `_Fecha: ${new Date().toLocaleDateString('es-MX')}_\n\n`;
    text += `*📦 RESUMEN GLOBAL:*\n`;
    text += `• Total Paquetes / Estuches: ${cartSummary.totalBoxes}\n`;
    text += `• Total Esferas / Piezas: ${cartSummary.totalPieces.toLocaleString()}\n`;
    text += `• Inversión a Talleres Artesanales: $${cartSummary.totalArtisanInvestment.toLocaleString()} MXN\n`;
    text += `• Valor de Venta Mayorista: $${cartSummary.totalTribunaWholesaleValue.toLocaleString()} MXN\n`;
    text += `• Ganancia Proyectada Grupo Tribuna: +$${cartSummary.projectedGrossProfit.toLocaleString()} MXN (${cartSummary.marginPct}% margen)\n`;
    text += `• Volumen Estimado: ${cartSummary.estimatedMasterBoxes} cajas máster (${cartSummary.totalWeightKg} kg)\n\n`;

    text += `*🛍️ DETALLE DE PRODUCTOS A RECOLECTAR:*\n`;
    Object.entries(consolidatedCart).forEach(([prodId, qty]) => {
      const item = catalog.find(p => p.id === prodId);
      if (item && qty > 0) {
        text += `• *${qty}x* ${item.name} (${item.number})\n`;
        text += `  - Taller: ${item.artisanName}\n`;
        text += `  - Empaque: ${item.packaging}\n`;
        text += `  - Costo Artesano: $${item.artisanCost} c/u | Total: $${(qty * item.artisanCost).toLocaleString()} MXN\n`;
      }
    });

    navigator.clipboard.writeText(text);
    alert('📋 ¡Orden de compra consolidada copiada al portapapeles! Lista para pegar en WhatsApp o compartir con el equipo.');
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER PRINCIPAL DEL CATÁLOGO (Optimizado para móvil y escritorio) */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950 to-amber-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-red-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                📱 Módulo Móvil de Catalogación
              </span>
              <span className="text-xs text-red-300 font-semibold">
                Chignahuapan, Pue.
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Catálogo Vivo de Esferas & Artesanías Navideñas
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Registra piezas directamente en los talleres desde tu celular con foto, calibre por número (#3 al #8), textura, costos y empaque para consolidar compras por volumen.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Botón flotante/destacado para Añadir al Vuelo */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black px-4 py-3 rounded-2xl shadow-lg shadow-red-950/40 text-xs sm:text-sm flex items-center space-x-2 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>+ Catalogar con Foto</span>
            </button>

            {/* Botón Ver Compra Consolidada */}
            <button
              onClick={() => setIsCartModalOpen(true)}
              className="relative bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-3 rounded-2xl shadow-md text-xs sm:text-sm flex items-center space-x-2 active:scale-95 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Compra Consolidada</span>
              <span className="sm:hidden">Compra</span>
              {cartSummary.totalBoxes > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {cartSummary.totalBoxes}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* BARRA DE HERRAMIENTAS: BÚSQUEDA Y FILTROS RÁPIDOS (TOUCH-FRIENDLY) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        
        {/* Input de Búsqueda y Orden */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por motivo, color, temática (Grinch, Talavera), taller o código..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio Artesano: Menor a Mayor</option>
              <option value="price-desc">Precio Artesano: Mayor a Menor</option>
              <option value="number">Calibre (#3 al #8)</option>
            </select>

            <select
              value={selectedArtisan}
              onChange={(e) => setSelectedArtisan(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">Todos los Talleres</option>
              {artisans.map(a => (
                <option key={a.id} value={a.id}>{a.businessName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros Pills por Número de Esfera */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-bold text-slate-500 text-[11px] whitespace-nowrap mr-1">Calibre:</span>
          
          <button
            onClick={() => setSelectedNumber('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              selectedNumber === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Todos los Tamaños
          </button>

          {SPHERE_NUMBERS.map(sn => (
            <button
              key={sn.number}
              onClick={() => setSelectedNumber(sn.number)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                selectedNumber === sn.number
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={sn.description}
            >
              <span>{sn.label}</span>
            </button>
          ))}
        </div>

        {/* Filtros Pills por Categoría / Tipo */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs border-t border-slate-100 pt-2">
          <span className="font-bold text-slate-500 text-[11px] whitespace-nowrap mr-1">Gama:</span>

          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedType === 'ALL'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            Todas las Gamas
          </button>

          {SPHERE_TYPES.map(st => (
            <button
              key={st}
              onClick={() => setSelectedType(st)}
              className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                selectedType === st
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* GRID DE PRODUCTOS CATALOGADOS (Diseño Tarjetas Visuales con Foto) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCatalog.map(item => {
          const inCartQty = consolidatedCart[item.id] || 0;
          const profitPerPack = item.tribunaWholesalePrice - item.artisanCost;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                inCartQty > 0 ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
              }`}
            >
              <div>
                
                {/* Imagen del Producto con Badges de Calibre */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden group cursor-pointer" onClick={() => setSelectedProductDetail(item)}>
                  <img
                    src={item.photoUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Calibre por Número Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                    <span className="bg-red-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow-md">
                      {item.number}
                    </span>
                    <span className="bg-slate-900/80 backdrop-blur-sm text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {item.type}
                    </span>
                  </div>

                  {/* Piezas por empaque */}
                  <div className="absolute bottom-2.5 left-2.5 text-white">
                    <span className="text-xs font-bold block">{item.piecesPerPack} piezas / pack</span>
                    <span className="text-[10px] text-slate-300 font-mono">{item.code}</span>
                  </div>

                  {/* Stock en Taller */}
                  <div className="absolute top-2.5 right-2.5 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {item.stockAvailable} packs disp.
                  </div>
                </div>

                {/* Contenido Textual */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 
                      onClick={() => setSelectedProductDetail(item)}
                      className="font-extrabold text-slate-900 text-sm line-clamp-2 leading-snug cursor-pointer hover:text-red-600 transition-colors"
                    >
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    🎨 {item.colorMotif}
                  </p>

                  <div className="text-[11px] text-slate-600 flex items-center space-x-1">
                    <Store className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span className="truncate">{item.artisanName}</span>
                  </div>

                  {/* Desglose de Precios y Ganancia */}
                  <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Costo Artesano:</span>
                      <span className="font-extrabold text-slate-900">${item.artisanCost} MXN</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Venta Mayorista Tribuna:</span>
                      <span className="font-black text-amber-700">${item.tribunaWholesalePrice} MXN</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[11px]">
                      <span className="font-bold text-emerald-700">Margen Tribuna:</span>
                      <span className="font-black text-emerald-700">+${profitPerPack} ({Math.round((profitPerPack / item.tribunaWholesalePrice) * 100)}%)</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Acciones de Compra Consolidada (+ / - Cantidad) */}
              <div className="p-4 pt-0">
                {inCartQty === 0 ? (
                  <button
                    onClick={() => handleUpdateCartQty(item.id, 1)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar a Compra Consolidada</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-amber-50 border border-amber-300 rounded-xl p-1.5">
                    <div className="flex items-center space-x-2 pl-2">
                      <span className="text-[10px] font-bold text-amber-900 uppercase">En Orden:</span>
                      <span className="font-black text-slate-900 text-sm">{inCartQty} cajas</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleUpdateCartQty(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white text-slate-800 font-black flex items-center justify-center shadow-xs hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleUpdateCartQty(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-xs hover:bg-amber-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* BARRA INFERIOR FIJA: RESUMEN RÁPIDO DE COMPRA CONSOLIDADA */}
      {cartSummary.totalBoxes > 0 && (
        <div className="sticky bottom-4 z-20 bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Compra Consolidada</span>
                <span className="text-base font-black text-white">{cartSummary.totalBoxes} Cajas ({cartSummary.totalPieces.toLocaleString()} esferas)</span>
              </div>
            </div>

            <div className="hidden md:block border-l border-slate-700 pl-4">
              <span className="text-[10px] text-slate-400 block">Inversión Artesanos:</span>
              <span className="font-bold text-slate-200">${cartSummary.totalArtisanInvestment.toLocaleString()} MXN</span>
            </div>

            <div className="hidden lg:block border-l border-slate-700 pl-4">
              <span className="text-[10px] text-slate-400 block">Venta Mayorista Tribuna:</span>
              <span className="font-bold text-amber-300">${cartSummary.totalTribunaWholesaleValue.toLocaleString()} MXN</span>
            </div>

            <div className="border-l border-slate-700 pl-4">
              <span className="text-[10px] text-emerald-400 font-bold block">Utilidad Estimada:</span>
              <span className="text-base font-black text-emerald-400">+${cartSummary.projectedGrossProfit.toLocaleString()} MXN</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleShareConsolidatedOrder}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors border border-slate-700"
              title="Copiar pedido consolidado a WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Copiar WhatsApp</span>
            </button>

            <button
              onClick={() => setIsCartModalOpen(true)}
              className="flex-1 sm:flex-none bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md"
            >
              <span>Ver Pedido Completo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CATALOGAR CON FOTO DESDE CELULAR (CÁMARA / GALERÍA) */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Catalogar Esfera en Chignahuapan</h3>
                  <p className="text-[11px] text-slate-500">Toma foto en el taller y captura costos en tiempo real</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              {/* Sección de Foto / Cámara */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                  Foto de la Esfera / Presentación:
                </label>

                {formPhotoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden h-44 bg-slate-100 border-2 border-red-500 group">
                    <img src={formPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormPhotoUrl('')}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-md hover:bg-red-700"
                      title="Eliminar y volver a tomar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-red-50/40 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="font-bold text-slate-800 text-xs">Toca para Tomar Foto o Subir desde Galería</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">La imagen se comprime automáticamente para guardarse en tu celular</p>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Nombre y Calibre */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700">Nombre / Modelo de la Esfera:</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Esfera Clásica Rojo con Escarcha Dorada"
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Calibre / Número:</label>
                  <select
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 text-xs font-bold text-red-700"
                  >
                    {SPHERE_NUMBERS.map(sn => (
                      <option key={sn.number} value={sn.number}>{sn.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Categoría y Taller */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Gama / Tipo de Esfera:</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 text-xs font-medium"
                  >
                    {SPHERE_TYPES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Taller Artesano Proveedor:</label>
                  <select
                    value={formArtisanId}
                    onChange={(e) => setFormArtisanId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 text-xs font-medium"
                  >
                    {artisans.map(a => (
                      <option key={a.id} value={a.id}>{a.businessName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Motivo y Empaque */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Motivo / Textura / Acabado:</label>
                  <input
                    type="text"
                    value={formColorMotif}
                    onChange={(e) => setFormColorMotif(e.target.value)}
                    placeholder="Ej. Nieve cristalizada, Talavera, Grinch óleo"
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Presentación de Empaque:</label>
                  <select
                    value={formPackaging}
                    onChange={(e) => {
                      setFormPackaging(e.target.value);
                      const p = PACKAGING_COUNTS.find(pc => pc.label === e.target.value);
                      if (p) setFormPiecesPerPack(p.pieces);
                    }}
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 text-xs"
                  >
                    {PACKAGING_COUNTS.map(pc => (
                      <option key={pc.id} value={pc.label}>{pc.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Costos y Margen */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block text-[10px]">Costo Artesano ($):</label>
                  <input
                    type="number"
                    min="1"
                    value={formArtisanCost}
                    onChange={(e) => {
                      const cost = Number(e.target.value);
                      setFormArtisanCost(cost);
                      setFormTribunaPrice(Math.round(cost * 1.55)); // Margen automático sugerido ~35%
                    }}
                    className="w-full mt-1 px-2 py-1.5 border rounded-lg font-bold text-slate-900 text-center"
                  />
                </div>

                <div>
                  <label className="font-bold text-amber-800 block text-[10px]">Precio Mayorista ($):</label>
                  <input
                    type="number"
                    min="1"
                    value={formTribunaPrice}
                    onChange={(e) => setFormTribunaPrice(Number(e.target.value))}
                    className="w-full mt-1 px-2 py-1.5 border border-amber-300 rounded-lg font-bold text-amber-800 text-center"
                  />
                </div>

                <div>
                  <label className="font-bold text-emerald-700 block text-[10px]">Margen Tribuna:</label>
                  <div className="mt-2 text-center font-black text-emerald-700">
                    +${formTribunaPrice - formArtisanCost} MXN
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Notas del Taller / Disponibilidad:</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Detalles sobre fragilidad, tiempo de producción o piezas en mostrador..."
                  rows={2}
                  className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black py-3.5 rounded-2xl shadow-lg text-sm transition-transform active:scale-95"
              >
                Guardar en Catálogo Grupo Tribuna
              </button>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DETALLE Y FICHA TÉCNICA DE LA ESFERA */}
      {/* ========================================================================= */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-black text-red-600">{selectedProductDetail.number} · {selectedProductDetail.code}</span>
                <h3 className="text-base font-black text-slate-900">{selectedProductDetail.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedProductDetail(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden h-56 bg-slate-100">
              <img src={selectedProductDetail.photoUrl} alt={selectedProductDetail.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p><strong>Gama:</strong> {selectedProductDetail.type}</p>
              <p><strong>Taller:</strong> {selectedProductDetail.artisanName}</p>
              <p><strong>Motivo / Textura:</strong> {selectedProductDetail.colorMotif}</p>
              <p><strong>Empaque:</strong> {selectedProductDetail.packaging} ({selectedProductDetail.piecesPerPack} piezas)</p>
              <p><strong>Notas:</strong> {selectedProductDetail.notes}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500">Costo Artesano:</span>
                <div className="font-bold text-slate-900">${selectedProductDetail.artisanCost}</div>
              </div>
              <div>
                <span className="text-[10px] text-amber-700">Venta Mayorista:</span>
                <div className="font-bold text-amber-700">${selectedProductDetail.tribunaWholesalePrice}</div>
              </div>
              <div>
                <span className="text-[10px] text-emerald-700">Utilidad Tribuna:</span>
                <div className="font-bold text-emerald-700">+${selectedProductDetail.tribunaWholesalePrice - selectedProductDetail.artisanCost}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  handleUpdateCartQty(selectedProductDetail.id, 5);
                  setSelectedProductDetail(null);
                }}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar 5 Cajas al Pedido</span>
              </button>
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="bg-slate-100 px-4 py-3 rounded-xl font-bold text-xs"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: RESUMEN DE COMPRA CONSOLIDADA & LOGÍSTICA CASTORES */}
      {/* ========================================================================= */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Orden de Compra Consolidada</span>
                <h3 className="text-lg font-black text-slate-900">
                  Lote Mayorista de Esferas Chignahuapan
                </h3>
              </div>
              <button 
                onClick={() => setIsCartModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Métricas del Lote Consolidado */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Total Cajas:</span>
                <div className="text-xl font-black text-slate-900">{cartSummary.totalBoxes}</div>
                <span className="text-[10px] text-slate-400">{cartSummary.totalPieces} piezas</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Inversión Talleres:</span>
                <div className="text-xl font-black text-slate-900">${cartSummary.totalArtisanInvestment.toLocaleString()}</div>
                <span className="text-[10px] text-slate-400">Costo artesano directo</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Venta Mayorista:</span>
                <div className="text-xl font-black text-amber-700">${cartSummary.totalTribunaWholesaleValue.toLocaleString()}</div>
                <span className="text-[10px] text-slate-400">Cobro a clientes</span>
              </div>

              <div className="bg-emerald-100/70 p-2 rounded-xl">
                <span className="text-emerald-800 text-[10px] uppercase font-black">Ganancia Tribuna:</span>
                <div className="text-xl font-black text-emerald-800">+${cartSummary.projectedGrossProfit.toLocaleString()}</div>
                <span className="text-[10px] text-emerald-700 font-bold">{cartSummary.marginPct}% de margen</span>
              </div>
            </div>

            {/* Lista de Productos en la Canasta */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {Object.entries(consolidatedCart).map(([prodId, qty]) => {
                const item = catalog.find(p => p.id === prodId);
                if (!item) return null;

                return (
                  <div key={prodId} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={item.photoUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <div className="font-extrabold text-slate-900">{item.name} ({item.number})</div>
                        <div className="text-[11px] text-slate-500">
                          {item.artisanName} · {item.packaging}
                        </div>
                        <div className="text-[11px] text-slate-700 font-semibold">
                          Costo: ${item.artisanCost} · Venta: ${item.tribunaWholesalePrice}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateCartQty(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white border font-bold flex items-center justify-center hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="font-black text-slate-900 w-8 text-center">{qty}</span>
                      <button
                        onClick={() => handleUpdateCartQty(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-white border font-bold flex items-center justify-center hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Logística de Flete Castores Proyectada */}
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs space-y-1 text-amber-900">
              <div className="font-bold flex items-center space-x-1.5">
                <Boxes className="w-4 h-4 text-amber-700" />
                <span>Logística para Consolidar:</span>
              </div>
              <p>
                Este lote requiere aproximadamente <strong>{cartSummary.estimatedMasterBoxes} cajas máster triple onda</strong> (~{cartSummary.totalWeightKg} kg).
              </p>
              <p className="text-[11px] text-amber-800">
                Puede trasladarse en la Van Sprinter diaria a Puebla a las 18:30 hrs y ser documentado con la <strong>Alianza Castores (22% OFF)</strong> hacia Monterrey, Guadalajara o CDMX.
              </p>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleShareConsolidatedOrder}
                className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Copiar Orden para WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setIsCartModalOpen(false);
                  if (onOpenShippingQuote) onOpenShippingQuote();
                }}
                className="w-full sm:flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md"
              >
                <span>Cotizar Flete en Castores</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
