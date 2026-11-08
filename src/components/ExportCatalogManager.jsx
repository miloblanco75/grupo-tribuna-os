import React, { useState, useMemo } from 'react';
import { 
  Globe2, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Package, 
  Euro, 
  Sparkles, 
  Share2, 
  Download, 
  Plus, 
  X, 
  Eye, 
  MessageCircle,
  Building,
  Mail,
  Award,
  ChevronRight,
  Info,
  Calculator,
  TrendingUp,
  Percent,
  Check
} from 'lucide-react';
import { 
  INITIAL_EXPORT_PRODUCTS, 
  PRODUCER_CONTACTS, 
  EU_EXPORT_STANDARDS 
} from '../data/exportProductsData';

export default function ExportCatalogManager() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('villacorp_export_products_v2_breakdown');
    return saved ? JSON.parse(saved) : INITIAL_EXPORT_PRODUCTS;
  });

  const [activeSubTab, setActiveSubTab] = useState('catalog'); // 'catalog', 'producers', 'dossier', 'compliance'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isOwnerDossierMode, setIsOwnerDossierMode] = useState(true); // Toggle para ver costos en el Dossier

  // Guardar en localStorage
  const saveProducts = (updated) => {
    setProducts(updated);
    localStorage.setItem('villacorp_export_products_v2_breakdown', JSON.stringify(updated));
  };

  // Formulario nuevo producto
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Mieles & Apicultura',
    producerId: 'prod-don-cuco',
    state: 'Puebla',
    priceEur: '9.00',
    unit: 'Pieza / Envase',
    euHsCode: '0409.00',
    description: '',
    packaging: 'Caja reforzada para exportación',
    image: '/productos/prod_01.jpeg',
    featured: false,
    pricingBreakdown: {
      producerCostMxn: 120,
      exportLogisticsMxn: 25,
      totalBaseMxn: 145,
      exchangeRate: 21.0,
      villacorpMarginPct: 30,
      exportPriceEur: 9.00,
      euRetailTargetEur: 16.00,
      buyerMarginPct: 44,
      calculationNotes: 'Cálculo estándar: Costo productor $120 MXN + $25 MXN empaque y flete puerto = $145 MXN (~€6.90 EUR). Con 30% de margen Villacorp Trade se cotiza a €9.00 EUR. Venta proyectada en tiendas gourmet europeas a €16.00 EUR.'
    }
  });

  // Categorías únicas
  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(products.map(p => p.category)))];
  }, [products]);

  // Estados únicos
  const states = useMemo(() => {
    return ['all', ...Array.from(new Set(products.map(p => p.state)))];
  }, [products]);

  // Filtrado
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.euHsCode && p.euHsCode.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesState = selectedState === 'all' || p.state === selectedState;

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [products, searchQuery, selectedCategory, selectedState]);

  // Obtener contacto del productor
  const getProducer = (producerId) => {
    return PRODUCER_CONTACTS.find(pr => pr.id === producerId) || {
      brand: 'Productor Regional Mexicano',
      representative: 'Contacto Comercial',
      address: 'México',
      phones: [],
      whatsapp: ''
    };
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProd.name.trim()) return;

    const created = {
      ...newProd,
      id: `exp-${Date.now()}`,
      code: `VIL-EXP-${Math.floor(100 + Math.random() * 900)}`,
      euCompliance: {
        originCert: 'Certificado EUR.1 México-UE',
        labAnalysis: 'Análisis de inocuidad estándar',
        labeling: 'Etiquetado conforme a Reglamento UE 1169/2011'
      }
    };

    saveProducts([created, ...products]);
    setIsNewProductModalOpen(false);
    setNewProd({
      name: '',
      category: 'Mieles & Apicultura',
      producerId: 'prod-don-cuco',
      state: 'Puebla',
      priceEur: '9.00',
      unit: 'Pieza / Envase',
      euHsCode: '0409.00',
      description: '',
      packaging: 'Caja reforzada para exportación',
      image: '/productos/prod_01.jpeg',
      featured: false,
      pricingBreakdown: {
        producerCostMxn: 120,
        exportLogisticsMxn: 25,
        totalBaseMxn: 145,
        exchangeRate: 21.0,
        villacorpMarginPct: 30,
        exportPriceEur: 9.00,
        euRetailTargetEur: 16.00,
        buyerMarginPct: 44,
        calculationNotes: 'Cálculo estándar: Costo productor $120 MXN + $25 MXN empaque y flete puerto = $145 MXN (~€6.90 EUR). Con 30% de margen Villacorp Trade se cotiza a €9.00 EUR. Venta proyectada en tiendas gourmet europeas a €16.00 EUR.'
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Principal de Exportación */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="text-2xl">🇪🇺</span>
              <span className="bg-indigo-500/30 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full border border-indigo-400/30 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-blue-300" />
                Villacorp Global Trade & Export
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                TLCUEM Arancel 0%
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Catálogo de Productos para Europa & Memoria de Cálculo
            </h1>
            <p className="text-sm text-indigo-200/90 max-w-3xl mt-1.5 leading-relaxed">
              Productos emblemáticos regionales de alta demanda con fichas técnicas para la Unión Europea. Cada producto cuenta con su <strong>memoria financiera transparente</strong> (costo base de taller en pesos mexicanos, empaque de exportación, margen Villacorp y precio de anaquel europeo).
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
            <button
              onClick={() => setActiveSubTab('dossier')}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 text-xs sm:text-sm transition-all transform active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Dossier Comprador UE</span>
            </button>
            <button
              onClick={() => setIsNewProductModalOpen(true)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl border border-white/20 text-xs sm:text-sm transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Agregar Producto</span>
            </button>
          </div>
        </div>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-indigo-500/30">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-indigo-200 font-medium">Fotos & Muestras</div>
            <div className="text-xl font-black text-white mt-0.5">71 Imágenes</div>
            <div className="text-[10px] text-emerald-300">Catalogadas en /public/productos</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-indigo-200 font-medium">Líneas de Producto</div>
            <div className="text-xl font-black text-white mt-0.5">{products.length} Fichas</div>
            <div className="text-[10px] text-blue-300">Con desglose de costeo unitario</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-indigo-200 font-medium">Productores Directos</div>
            <div className="text-xl font-black text-white mt-0.5">{PRODUCER_CONTACTS.length} Marcas</div>
            <div className="text-[10px] text-amber-300">Teléfonos & WhatsApp verificados</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-indigo-200 font-medium">Margen Villacorp Meta</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">30% - 38%</div>
            <div className="text-[10px] text-emerald-300">TC ref: $21.00 MXN / 1€</div>
          </div>
        </div>
      </div>

      {/* Sub-navegación dentro de Exportación */}
      <div className="flex border-b border-slate-200 space-x-2 text-sm font-semibold overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`pb-2.5 px-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeSubTab === 'catalog'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Galería & Catálogo ({filteredProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('producers')}
          className={`pb-2.5 px-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeSubTab === 'producers'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Directorio de Productores & Contactos ({PRODUCER_CONTACTS.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dossier')}
          className={`pb-2.5 px-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeSubTab === 'dossier'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Dossier Comprador Europeo</span>
        </button>

        <button
          onClick={() => setActiveSubTab('compliance')}
          className={`pb-2.5 px-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeSubTab === 'compliance'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Normativas UE & Certificados</span>
        </button>
      </div>

      {/* VISTA 1: CATÁLOGO DE PRODUCTOS */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-6">
          
          {/* Banner explicativo del cálculo para el dueño */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <Calculator className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 font-black uppercase tracking-wider block">
                  Memoria de Costeo y Precios de Exportación para el Dueño
                </strong>
                <p className="text-amber-900/90 mt-0.5 leading-relaxed">
                  Cada producto incluye el desglose transparente: <strong>Costo adquisición productor ($ MXN)</strong> + <strong>Empaque de exportación & flete puerto ($ MXN)</strong> ➔ Conversión a <strong>Euros (€ al TC $21.00)</strong> ➔ <strong>Margen Villacorp (30-38%)</strong> ➔ <strong>PVP en Tiendas Gourmet UE</strong>.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-amber-200/70 text-amber-950 px-3 py-1 rounded-lg self-start md:self-auto border border-amber-300">
              Arancel TLCUEM: 0% EUR.1
            </span>
          </div>

          {/* Barra de Filtros y Búsqueda */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por miel, jamoncillo, productor, fracción arancelaria..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center space-x-1 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Categoría:</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                <option value="all">Todas las categorías</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <div className="flex items-center space-x-1 text-xs text-slate-500 ml-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Origen:</span>
              </div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                <option value="all">Todos los orígenes</option>
                {states.filter(s => s !== 'all').map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid de Productos */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No se encontraron productos</h3>
              <p className="text-xs text-slate-500 mt-1">Prueba cambiando los términos de búsqueda o filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((prod) => {
                const producer = getProducer(prod.producerId);
                const pb = prod.pricingBreakdown || {
                  producerCostMxn: 100,
                  exportLogisticsMxn: 25,
                  totalBaseMxn: 125,
                  exchangeRate: 21.0,
                  villacorpMarginPct: 30,
                  exportPriceEur: parseFloat(prod.priceEur),
                  euRetailTargetEur: parseFloat(prod.priceEur) * 1.8,
                  buyerMarginPct: 45,
                  calculationNotes: 'Cálculo de referencia de exportación estándar.'
                };

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* Imagen del producto */}
                    <div 
                      className="relative h-48 bg-slate-100 overflow-hidden cursor-pointer"
                      onClick={() => setSelectedProductModal(prod)}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/productos/prod_01.jpeg';
                        }}
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {prod.category}
                        </span>
                        {prod.featured && (
                          <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.2 rounded-full flex items-center gap-1 shadow">
                            <Sparkles className="w-2.5 h-2.5" /> DESTACADO UE
                          </span>
                        )}
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-emerald-600/90 text-white font-black text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm shadow">
                        €{prod.priceEur} <span className="text-[9px] font-normal">EUR</span>
                      </div>
                      <button 
                        className="absolute bottom-2 right-2 p-1.5 bg-white/90 rounded-lg text-slate-700 shadow hover:bg-white text-xs flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductModal(prod);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-semibold">Ver Ficha</span>
                      </button>
                    </div>

                    {/* Contenido Card */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-mono text-indigo-600 font-bold">{prod.code}</span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            {prod.state}
                          </span>
                        </div>

                        <h3 
                          className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors"
                          onClick={() => setSelectedProductModal(prod)}
                        >
                          {prod.name}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>

                      {/* PILL DE DESGLOSE FINANCIERO PARA EL DUEÑO */}
                      <div 
                        onClick={() => setSelectedProductModal(prod)}
                        className="mt-3 p-2 bg-gradient-to-r from-amber-50 to-indigo-50/60 rounded-xl border border-amber-200/80 cursor-pointer hover:border-indigo-400 transition-colors"
                        title="Clic para ver la memoria completa de cálculo para el dueño"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 mb-1">
                          <span className="flex items-center gap-1">
                            <Calculator className="w-3 h-3 text-amber-700" />
                            Cálculo Dueño:
                          </span>
                          <span className="text-indigo-700 font-black">+{pb.villacorpMarginPct}% Margen</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
                          <div className="bg-white/80 p-1 rounded">
                            <div className="text-[9px] text-slate-400">Taller</div>
                            <div className="font-bold text-slate-800">${pb.producerCostMxn}</div>
                          </div>
                          <div className="bg-white/80 p-1 rounded">
                            <div className="text-[9px] text-emerald-600 font-semibold">FOB UE</div>
                            <div className="font-black text-emerald-700">€{prod.priceEur}</div>
                          </div>
                          <div className="bg-white/80 p-1 rounded">
                            <div className="text-[9px] text-slate-400">Anaquel UE</div>
                            <div className="font-bold text-indigo-700">€{pb.euRetailTargetEur}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                        {/* Productor y Contacto Rápido */}
                        <div className="flex items-center justify-between">
                          <div className="truncate mr-2">
                            <div className="text-[10px] text-slate-400 font-medium">Productor / Marca:</div>
                            <div className="text-xs font-semibold text-slate-800 truncate" title={producer.brand}>
                              {producer.brand}
                            </div>
                          </div>
                          {producer.whatsapp && (
                            <a
                              href={`https://wa.me/${producer.whatsapp}?text=Hola,%20me%20comunico%20desde%20Villacorp%20para%20la%20exportación%20a%20Europa%20de%20${encodeURIComponent(prod.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors flex-shrink-0"
                              title={`Contactar vía WhatsApp (${producer.phones[0] || ''})`}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        {/* Fracción arancelaria y presentación */}
                        <div className="flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1.5 rounded-lg text-slate-600">
                          <span>HS: {prod.euHsCode ? prod.euHsCode.split(' ')[0] : 'N/A'}</span>
                          <span className="font-semibold text-slate-800">{prod.unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: DIRECTORIO DE PRODUCTORES & CONTACTOS EXTRAÍDOS */}
      {activeSubTab === 'producers' && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-900 leading-relaxed">
              <strong className="font-bold">Contactos directos extraídos de empaques originales y tarjetas:</strong> Todos estos datos fueron leídos de las fotografías de los productos (tarjetas de visita de Chignahuapan, sellos de lote de Campeche, etiquetas oficiales de Mérida y Tuxtla Gutiérrez). Tienen enlaces directos de llamada y WhatsApp para cotizar lotes de exportación.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCER_CONTACTS.map((prod) => (
              <div 
                key={prod.id} 
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100">
                      {prod.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {prod.state}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {prod.brand}
                  </h3>
                  <div className="text-xs text-emerald-700 font-medium mt-0.5">
                    Titular: {prod.representative}
                  </div>

                  {prod.rfc && (
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      RFC: {prod.rfc}
                    </div>
                  )}

                  {/* Dirección física */}
                  <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{prod.address}</span>
                  </div>

                  {/* Productos fabricados */}
                  <div className="mt-3 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Líneas de producto: </span>
                    <span className="text-slate-500">{prod.productsSummary}</span>
                  </div>
                </div>

                {/* Teléfonos y Contacto */}
                <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Teléfonos & Enlaces Directos
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {prod.phones.map((tel, idx) => (
                      <a
                        key={idx}
                        href={`tel:${tel.replace(/[^0-9]/g, '')}`}
                        className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                        title="Llamar directamente"
                      >
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{tel}</span>
                      </a>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    {prod.whatsapp && (
                      <a
                        href={`https://wa.me/${prod.whatsapp}?text=Hola,%20me%20comunico%20de%20Villacorp%20para%20la%20exportación%20a%20Europa`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-3 rounded-xl shadow-sm transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Directo</span>
                      </a>
                    )}
                    {prod.email && (
                      <a
                        href={`mailto:${prod.email}`}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                        title={prod.email}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {prod.website && (
                      <a
                        href={prod.website}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl transition-colors"
                        title="Visitar sitio web oficial"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 3: DOSSIER COMERCIAL COMPRADOR EUROPEO */}
      {activeSubTab === 'dossier' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl">🇪🇺</span>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Dossier Oficial de Oferta Exportable
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Portafolio Comercial Unión Europea · Villacorp Trade
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Valores FOB Puerto Progreso / Veracruz · Cotización en Euros (€ EUR) · Arancel 0% TLCUEM EUR.1
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Selector de Modo Dueño vs Modo Comprador */}
              <button
                onClick={() => setIsOwnerDossierMode(!isOwnerDossierMode)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all border ${
                  isOwnerDossierMode
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="Alternar entre vista interna del dueño (con costos en MXN y márgenes) o vista cliente europeo"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{isOwnerDossierMode ? '👁️ Modo Dueño (Costos Visibles)' : 'Modo Comprador UE'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl shadow text-xs sm:text-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Imprimir / PDF</span>
              </button>
            </div>
          </div>

          {/* Tabla Resumen de Productos de Exportación */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-3">Código</th>
                  <th className="py-3 px-3">Producto</th>
                  <th className="py-3 px-3">Origen</th>
                  {isOwnerDossierMode && (
                    <>
                      <th className="py-3 px-3 bg-amber-50/50 text-amber-900">Costo Taller ($ MXN)</th>
                      <th className="py-3 px-3 bg-amber-50/50 text-amber-900">Empaque/Flete ($ MXN)</th>
                      <th className="py-3 px-3 bg-amber-50/50 text-amber-900">Margen Villacorp</th>
                    </>
                  )}
                  <th className="py-3 px-3">Fracción Arancelaria</th>
                  <th className="py-3 px-3">Presentación</th>
                  <th className="py-3 px-3 text-right">Precio FOB (€)</th>
                  {isOwnerDossierMode && (
                    <th className="py-3 px-3 text-right text-indigo-700 bg-indigo-50/50">Anaquel UE (€)</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => {
                  const producer = getProducer(prod.producerId);
                  const pb = prod.pricingBreakdown || {
                    producerCostMxn: 100,
                    exportLogisticsMxn: 25,
                    totalBaseMxn: 125,
                    exchangeRate: 21.0,
                    villacorpMarginPct: 30,
                    exportPriceEur: parseFloat(prod.priceEur),
                    euRetailTargetEur: parseFloat(prod.priceEur) * 1.8,
                    buyerMarginPct: 45
                  };

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-indigo-600 whitespace-nowrap">
                        {prod.code}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{prod.name}</div>
                        <div className="text-[11px] text-slate-500 max-w-xs truncate">{producer.brand}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        {prod.state}
                      </td>
                      
                      {isOwnerDossierMode && (
                        <>
                          <td className="py-3 px-3 whitespace-nowrap font-semibold text-slate-800 bg-amber-50/30">
                            ${pb.producerCostMxn.toLocaleString()} MXN
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-slate-600 bg-amber-50/30">
                            +${pb.exportLogisticsMxn.toLocaleString()} MXN
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap font-bold text-emerald-700 bg-amber-50/30">
                            {pb.villacorpMarginPct}%
                          </td>
                        </>
                      )}

                      <td className="py-3 px-3 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                        {prod.euHsCode ? prod.euHsCode.split(' ')[0] : 'N/A'}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        {prod.unit}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-emerald-700 whitespace-nowrap text-sm">
                        €{prod.priceEur}
                      </td>
                      {isOwnerDossierMode && (
                        <td className="py-3 px-3 text-right font-black text-indigo-700 bg-indigo-50/30 whitespace-nowrap text-sm">
                          €{pb.euRetailTargetEur}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-800">Condiciones Comerciales y de Envío:</div>
            <div>• Incoterms disponibles: FOB Puerto de Progreso (Yucatán) / Veracruz / Altamira o CIF Róterdam / Hamburgo / Valencia.</div>
            <div>• Certificados incluidos: Certificado de Origen EUR.1 (Arancel 0% TLCUEM), Certificado Fitosanitario / Zoosanitario Senasica y Factura Comercial con packing list.</div>
            <div>• Empaques de exportación: Tarimas estándar europeas (120 x 80 cm) tratadas bajo norma NIMF-15 (fumigación térmica).</div>
          </div>
        </div>
      )}

      {/* VISTA 4: NORMATIVAS UE & REQUISITOS */}
      {activeSubTab === 'compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EU_EXPORT_STANDARDS.map((std, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {std.badge}
                  </span>
                  <Award className="w-5 h-5 text-indigo-500" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  {std.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {std.description}
                </p>
              </div>
            ))}
          </div>

          {/* Guía paso a paso para el despacho */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Ruta Operativa para Embarque hacia la Unión Europea
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-bold text-indigo-700">Paso 1: Proveedor & Lote</div>
                <p className="text-slate-600">Contacto con el artesano/apicultor, recolección de muestra y pruebas de laboratorio (humedad &lt;18% en miel, alérgenos en dulces).</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-bold text-indigo-700">Paso 2: Etiquetado Bilingüe UE</div>
                <p className="text-slate-600">Impresión de contraetiqueta en español/inglés/francés con gramaje neto, tabla nutrimental de 100g y fecha de caducidad obligatoria.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-bold text-indigo-700">Paso 3: VUCEM & EUR.1</div>
                <p className="text-slate-600">Emisión del Certificado de Origen EUR.1 a través de VUCEM para que el importador europeo aplique tasa arancelaria 0%.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETALLE DE PRODUCTO & MEMORIA DE CÁLCULO PARA EL DUEÑO */}
      {selectedProductModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🇪🇺</span>
                <span className="font-mono text-xs font-bold text-indigo-300">
                  {selectedProductModal.code}
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs font-semibold">{selectedProductModal.category}</span>
              </div>
              <button 
                onClick={() => setSelectedProductModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido con imagen grande y ficha */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-72 flex items-center justify-center">
                    <img
                      src={selectedProductModal.image}
                      alt={selectedProductModal.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[11px] text-center text-slate-400 mt-2">
                    Fotografía original de archivo ({selectedProductModal.image})
                  </div>

                  {/* Precios y Presentación */}
                  <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-emerald-800 font-medium">Precio Exportación Ref. (FOB)</div>
                      <div className="text-xl font-black text-emerald-900">€{selectedProductModal.priceEur} EUR</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-emerald-800 font-medium">Presentación</div>
                      <div className="text-xs font-bold text-emerald-950">{selectedProductModal.unit}</div>
                    </div>
                  </div>
                </div>

                {/* Ficha técnica y contacto */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {selectedProductModal.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {selectedProductModal.description}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fracción Arancelaria UE:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedProductModal.euHsCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Origen Geográfico:</span>
                      <span className="font-semibold text-slate-800">{selectedProductModal.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Empaque Primario/Secundario:</span>
                      <span className="text-slate-700 max-w-[200px] text-right">{selectedProductModal.packaging}</span>
                    </div>
                  </div>

                  {/* Datos del Productor */}
                  {(() => {
                    const producer = getProducer(selectedProductModal.producerId);
                    return (
                      <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-2">
                        <div className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-indigo-600" />
                          Fabricante / Productor Artesanal:
                        </div>
                        <div className="text-xs font-bold text-slate-800">{producer.brand}</div>
                        <div className="text-[11px] text-slate-600 leading-tight">{producer.address}</div>
                        
                        {producer.phones.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-2">
                            {producer.phones.map((tel, idx) => (
                              <a
                                key={idx}
                                href={`tel:${tel.replace(/[^0-9]/g, '')}`}
                                className="text-[11px] font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-md border border-indigo-200 flex items-center gap-1 hover:bg-indigo-600 hover:text-white transition-colors"
                              >
                                <Phone className="w-3 h-3" />
                                {tel}
                              </a>
                            ))}
                          </div>
                        )}

                        {producer.whatsapp && (
                          <a
                            href={`https://wa.me/${producer.whatsapp}?text=Hola,%20me%20comunico%20desde%20Villacorp%20para%20la%20exportación%20a%20Europa%20de%20${encodeURIComponent(selectedProductModal.name)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl mt-2 transition-all shadow-sm"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Enviar WhatsApp de Consulta</span>
                          </a>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* SECCIÓN DESTACADA: MEMORIA DE CÁLCULO FINANCIERO PARA EL DUEÑO */}
              {(() => {
                const pb = selectedProductModal.pricingBreakdown || {
                  producerCostMxn: 100,
                  exportLogisticsMxn: 25,
                  totalBaseMxn: 125,
                  exchangeRate: 21.0,
                  villacorpMarginPct: 30,
                  exportPriceEur: parseFloat(selectedProductModal.priceEur),
                  euRetailTargetEur: parseFloat(selectedProductModal.priceEur) * 1.8,
                  buyerMarginPct: 45,
                  calculationNotes: 'Cálculo de referencia de exportación estándar.'
                };

                return (
                  <div className="border border-amber-300 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-amber-200 text-amber-950 rounded-lg">
                          <Calculator className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-amber-950 uppercase tracking-wider">
                            Memoria de Cálculo y Estructura de Precios (Para el Dueño)
                          </h4>
                          <p className="text-[11px] text-amber-800">
                            Fórmula de costeo unitario desde taller de origen hasta anaquel gourmet en Europa
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-black bg-emerald-600 text-white px-2.5 py-1 rounded-lg shadow-sm">
                        Margen Villacorp: {pb.villacorpMarginPct}%
                      </span>
                    </div>

                    {/* Cascada de Costos en Tarjetas */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">1. Costo Taller</div>
                        <div className="text-sm font-black text-slate-800 mt-0.5">${pb.producerCostMxn.toLocaleString()} MXN</div>
                        <div className="text-[9px] text-slate-400">Adquisición local</div>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">2. Empaque & Flete</div>
                        <div className="text-sm font-bold text-amber-700 mt-0.5">+${pb.exportLogisticsMxn.toLocaleString()} MXN</div>
                        <div className="text-[9px] text-slate-400">Pallet / EUR.1 / Puerto</div>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">3. Total Puesto Puerto</div>
                        <div className="text-sm font-black text-slate-900 mt-0.5">${pb.totalBaseMxn.toLocaleString()} MXN</div>
                        <div className="text-[9px] text-indigo-600 font-semibold">~€{(pb.totalBaseMxn / pb.exchangeRate).toFixed(2)} EUR</div>
                      </div>

                      <div className="bg-amber-100/60 p-2.5 rounded-xl border border-amber-300 shadow-xs">
                        <div className="text-[10px] text-amber-900 font-semibold uppercase">4. Margen Villacorp</div>
                        <div className="text-sm font-black text-amber-950 mt-0.5">+{pb.villacorpMarginPct}%</div>
                        <div className="text-[9px] text-amber-800 font-medium">Comercialización</div>
                      </div>

                      <div className="bg-emerald-500 p-2.5 rounded-xl text-white shadow-sm">
                        <div className="text-[10px] text-emerald-100 font-semibold uppercase">5. Cotización FOB</div>
                        <div className="text-base font-black text-white mt-0.5">€{selectedProductModal.priceEur} EUR</div>
                        <div className="text-[9px] text-emerald-100">Precio de Exportación</div>
                      </div>

                      <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 shadow-xs">
                        <div className="text-[10px] text-indigo-800 font-semibold uppercase">6. Venta Anaquel UE</div>
                        <div className="text-sm font-black text-indigo-900 mt-0.5">€{pb.euRetailTargetEur} EUR</div>
                        <div className="text-[9px] text-indigo-600 font-semibold">Margen tienda: ~{pb.buyerMarginPct}%</div>
                      </div>
                    </div>

                    {/* Explicación en Texto Completo */}
                    <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-xs text-slate-700 leading-relaxed space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Explicación detallada de la fórmula para este producto:</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        {pb.calculationNotes}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Cumplimiento UE */}
              {selectedProductModal.euCompliance && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-500">
                  <div className="font-semibold text-slate-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Requisitos y Certificaciones UE:
                  </div>
                  <div>• {selectedProductModal.euCompliance.originCert}</div>
                  <div>• {selectedProductModal.euCompliance.labAnalysis}</div>
                  <div>• {selectedProductModal.euCompliance.labeling}</div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedProductModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR NUEVO PRODUCTO DE EXPORTACIÓN */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm">Nuevo Producto para Catálogo Europa</span>
              </div>
              <button 
                onClick={() => setIsNewProductModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Comercial del Producto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Miel de Azahar Artesanal Don Cuco"
                  value={newProd.name}
                  onChange={(e) => setNewProd({...newProd, name: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({...newProd, category: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Mieles & Apicultura">Mieles & Apicultura</option>
                    <option value="Dulcería Tradicional & Confitería">Dulcería Tradicional & Confitería</option>
                    <option value="Chocolatería & Cacao Maya">Chocolatería & Cacao Maya</option>
                    <option value="Salsas & Condimentos Gourmet">Salsas & Condimentos Gourmet</option>
                    <option value="Salsas & Mixología">Salsas & Mixología</option>
                    <option value="Artesanías & Decoración">Artesanías & Decoración</option>
                    <option value="Moda Artesanal & Calzado">Moda Artesanal & Calzado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Productor / Marca</label>
                  <select
                    value={newProd.producerId}
                    onChange={(e) => setNewProd({...newProd, producerId: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {PRODUCER_CONTACTS.map(p => (
                      <option key={p.id} value={p.id}>{p.brand} ({p.state})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Precio Ref. (€ EUR)</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={newProd.priceEur}
                    onChange={(e) => setNewProd({...newProd, priceEur: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Presentación / Unidad</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Frasco 500g"
                    value={newProd.unit}
                    onChange={(e) => setNewProd({...newProd, unit: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">HS Code (Arancel)</label>
                  <input
                    type="text"
                    placeholder="Ej. 0409.00"
                    value={newProd.euHsCode}
                    onChange={(e) => setNewProd({...newProd, euHsCode: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción para el Comprador Europeo</label>
                <textarea
                  rows="3"
                  placeholder="Detalles de elaboración, notas de sabor o técnica artesanal..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({...newProd, description: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fotografía del Catálogo (Ruta)</label>
                  <select
                    value={newProd.image}
                    onChange={(e) => setNewProd({...newProd, image: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {[1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 18, 22, 25, 26, 32, 33, 36, 40, 45, 47, 48, 49, 51, 55, 57, 59, 63, 66, 68, 70].map(n => (
                      <option key={n} value={`/productos/prod_${n < 10 ? '0' + n : n}.jpeg`}>
                        Foto /productos/prod_{n < 10 ? '0' + n : n}.jpeg
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProd.featured}
                      onChange={(e) => setNewProd({...newProd, featured: e.target.checked})}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="font-bold text-slate-700">Producto Destacado UE</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow"
                >
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
