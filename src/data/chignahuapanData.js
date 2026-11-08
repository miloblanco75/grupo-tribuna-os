// Datos iniciales de la División de Logística Chignahuapan & Alianza Grupo Castores
// Grupo Tribuna - Acopio, Embalaje Frágil y Envíos Nacionales de Esferas Navideñas

export const CASTORES_ALLIANCE_INFO = {
  partnerName: 'Grupo Castores Paquetería y Cargas Consolidadas S.A. de C.V.',
  branch: 'Puebla, Pue. - Centro de Distribución y Tránsito',
  representative: 'Estefanía Sánchez',
  representativeRole: 'Jefe Comercial Paquetería',
  agreementDate: 'Noviembre 2026',
  contractFolio: 'CAST-PUE-TRIBUNA-2026-NOV',
  discountPercentage: 22, // 22% de descuento sobre tarifa pública web
  paymentModel: 'Modalidad de Pagos Anticipados (Monedero Prepago Corporativo con Dispersión API)',
  coverage: 'Nacional e Internacional (Domicilio y Ocurre Oficina)',
  dailyDepartures: 'Salidas diarias con conexión desde Puebla a toda la República',
  apiIntegration: 'Disponible para generación y documentación de guías en tiempo real'
};

export const INITIAL_CASTORES_WALLET = {
  currentBalance: 46850.00,
  totalDeposited: 85000.00,
  totalConsumed: 38150.00,
  currency: 'MXN',
  lastDepositDate: '2026-11-05',
  lastDepositAmount: 25000.00,
  bankReference: 'BBVA CIE 1892349 - Convenio Castores Prepagos',
  transactions: [
    {
      id: 'tx-dep-01',
      date: '2026-11-01',
      type: 'DEPOSITO',
      concept: 'Apertura de saldo prepago inicial convenio Grupo Castores',
      amount: 60000.00,
      balanceAfter: 60000.00,
      reference: 'DEP-CIE-991204'
    },
    {
      id: 'tx-cons-01',
      date: '2026-11-02',
      type: 'CONSUMO_GUIA',
      concept: 'Guía Castores #6829104 - Envío 4 cajas a Monterrey, N.L.',
      amount: -1850.00,
      balanceAfter: 58150.00,
      reference: 'GUIA-6829104'
    },
    {
      id: 'tx-cons-02',
      date: '2026-11-03',
      type: 'CONSUMO_GUIA',
      concept: 'Guía Castores #6829158 - Tarima consolidada a Guadalajara, Jal.',
      amount: -4900.00,
      balanceAfter: 53250.00,
      reference: 'GUIA-6829158'
    },
    {
      id: 'tx-dep-02',
      date: '2026-11-05',
      type: 'DEPOSITO',
      concept: 'Recarga quincenal de saldo para pico de temporada navideña',
      amount: 25000.00,
      balanceAfter: 78250.00,
      reference: 'DEP-CIE-994118'
    },
    {
      id: 'tx-cons-03',
      date: '2026-11-06',
      type: 'CONSUMO_GUIA',
      concept: 'Guía Castores #6830012 - Envío 8 cajas a Mérida, Yuc.',
      amount: -3400.00,
      balanceAfter: 74850.00,
      reference: 'GUIA-6830012'
    },
    {
      id: 'tx-cons-04',
      date: '2026-11-07',
      type: 'CONSUMO_GUIA',
      concept: 'Guías consolidadas lote fin de semana (#6830110 a #6830145)',
      amount: -28000.00,
      balanceAfter: 46850.00,
      reference: 'LOTE-NOV-07'
    }
  ]
};

export const CHIGNAHUAPAN_HUB_INFO = {
  hubName: 'Bodega de Acopio & Logística Grupo Tribuna - Chignahuapan',
  address: 'Libramiento Chignahuapan - Zacatlán Km 2.8, Col. Ixtlahuaca',
  municipality: 'Chignahuapan, Puebla',
  postalCode: '73300',
  phone: '+52 797 971 4520',
  manager: 'Ing. Mateo Galindo',
  managerRole: 'Coordinador General de Acopio & Embalaje Frágil',
  operatingHours: 'Lunes a Domingo: 08:00 - 20:00 hrs',
  totalAreaSqm: 320,
  storageCapacityBoxes: 1800,
  currentStoredBoxes: 485,
  shuttleUnit: 'Van Sprinter 3.5 Ton con suspensión neumática antishock',
  shuttleSchedule: 'Salidas diarias de Chignahuapan a Puebla (Terminal Castores) a las 18:30 hrs',
  shuttleTransferFeeStandard: 85.00 // Costo estándar por bulto/caja por flete Chignahuapan -> Puebla
};

export const PACKAGING_CATALOG = [
  {
    id: 'pack-standard',
    name: 'Embalaje Estándar Esferas',
    description: 'Caja de cartón corrugado reforzado 40x40x40 cm, 2 capas de plástico microburbuja, cinta de alta seguridad "MUY FRÁGIL"',
    costToCustomer: 75.00,
    costMaterialTribuna: 35.00,
    netProfit: 40.00,
    recommendedFor: 'Cajas de hasta 60 esferas medianas tradicionales'
  },
  {
    id: 'pack-premium',
    name: 'Embalaje Premium Panal Antishock',
    description: 'Caja doble corrugado 60x50x50 cm con rejillas alveoladas individuales (tipo panal), esquineros rígidos y burbuja de 1/2"',
    costToCustomer: 135.00,
    costMaterialTribuna: 60.00,
    netProfit: 75.00,
    recommendedFor: 'Esferas grandes de colección, figuras caladas y piezas con aplicaciones de cristal'
  },
  {
    id: 'pack-jumbo',
    name: 'Embalaje Tarima / Jumbo Monumental',
    description: 'Caja triple onda paletizada, foam de polietileno de alta densidad, esquineros de acero/plástico y emplayado reforzado con sensor de inclinación',
    costToCustomer: 220.00,
    costMaterialTribuna: 95.00,
    netProfit: 125.00,
    recommendedFor: 'Pedidos de mayoreo, figuras navideñas monumentales (nacimientos, ángeles gigantes)'
  }
];

export const INITIAL_ARTISANS = [
  {
    id: 'art-01',
    businessName: 'Esferas Artesanales Don Chucho',
    artisanName: 'Jesús Herrera Rivera',
    workshopAddress: 'Calle Romero Vargas #45, Barrio de Teotlalpan, Chignahuapan, Pue.',
    phone: '+52 797 102 3344',
    specialty: 'Esfera tradicional soplada al soplete y decorada a mano en óleo',
    rating: 4.9,
    yearsInBusiness: 34,
    negotiatedPickupFee: 60.00, // Tarifa preferencial de recolección local
    totalOrdersSent: 38,
    activePendingPickups: 2,
    notes: 'Taller familiar de alta calidad. Empacan en cajas de 12 docenas.'
  },
  {
    id: 'art-02',
    businessName: 'El Ángel Navideño & Diseños de Cristal',
    artisanName: 'Carmen Olvera Morales',
    workshopAddress: 'Av. Castro Poniente #112, Col. Centro, Chignahuapan, Pue.',
    phone: '+52 797 105 8890',
    specialty: 'Esferas jumbo diamantadas, campanas navideñas y esferas con luz LED',
    rating: 4.8,
    yearsInBusiness: 22,
    negotiatedPickupFee: 70.00,
    totalOrdersSent: 54,
    activePendingPickups: 1,
    notes: 'Vende mucho volumen a compradores foráneos de Monterrey y Guadalajara.'
  },
  {
    id: 'art-03',
    businessName: 'Taller Hermanos Trejo (Navicristal)',
    artisanName: 'Roberto Trejo Soto',
    workshopAddress: 'Carretera a los Baños Termales Km 1.2, Chignahuapan, Pue.',
    phone: '+52 797 114 9021',
    specialty: 'Producción de mayoreo: esferas clásicas doradas, rojas y plateadas en escala',
    rating: 4.7,
    yearsInBusiness: 18,
    negotiatedPickupFee: 90.00,
    totalOrdersSent: 72,
    activePendingPickups: 3,
    notes: 'Requiere recolección con diablito o rampa por volumen de tarimas.'
  },
  {
    id: 'art-04',
    businessName: 'Esferas Finas La Joya de la Sierra',
    artisanName: 'Yolanda Morales de la Cruz',
    workshopAddress: 'Barrio de Toltempan s/n (Junto al Santuario del Honguito), Chignahuapan, Pue.',
    phone: '+52 797 971 7733',
    specialty: 'Esferas caladas con relieve, vitrales navideños y figuras de animales de la sierra',
    rating: 5.0,
    yearsInBusiness: 28,
    negotiatedPickupFee: 65.00,
    totalOrdersSent: 29,
    activePendingPickups: 0,
    notes: 'Piezas sumamente frágiles y de alto valor unitario. Obligatorio embalaje Premium.'
  },
  {
    id: 'art-05',
    businessName: 'Artesanías y Cristales Navideños San Rafael',
    artisanName: 'Felipe San Rafael Ortega',
    workshopAddress: 'Calle Nigromante #28, Centro, Chignahuapan, Pue.',
    phone: '+52 797 109 2311',
    specialty: 'Centros de mesa esféricos, coronas con esferas tejidas y recuerdos corporativos',
    rating: 4.8,
    yearsInBusiness: 15,
    negotiatedPickupFee: 60.00,
    totalOrdersSent: 41,
    activePendingPickups: 1,
    notes: 'Excelente disposición horaria para recolección en turno matutino.'
  }
];

export const INITIAL_PICKUP_SCHEDULE = [
  {
    id: 'pic-2026-001',
    artisanId: 'art-01',
    artisanName: 'Esferas Artesanales Don Chucho',
    workshopAddress: 'Calle Romero Vargas #45, Barrio de Teotlalpan',
    pickupDate: '2026-11-08',
    timeSlot: '11:00 - 12:30 hrs',
    estimatedBoxes: 6,
    pickupFeeCharged: 60.00,
    paymentStatus: 'Cobrado al Vendedor',
    assignedDriver: 'Manuel Romero (Unidad Van-01)',
    status: 'Completada en Bodega',
    notes: 'Cajas listas en mostrador, etiquetadas con datos del comprador de Monterrey.'
  },
  {
    id: 'pic-2026-002',
    artisanId: 'art-02',
    artisanName: 'El Ángel Navideño & Diseños de Cristal',
    workshopAddress: 'Av. Castro Poniente #112, Col. Centro',
    pickupDate: '2026-11-08',
    timeSlot: '14:00 - 15:30 hrs',
    estimatedBoxes: 12,
    pickupFeeCharged: 70.00,
    paymentStatus: 'Cobrado al Vendedor',
    assignedDriver: 'Manuel Romero (Unidad Van-01)',
    status: 'En Proceso de Recolección',
    notes: 'Esferas jumbo con figuras de reyes magos.'
  },
  {
    id: 'pic-2026-003',
    artisanId: 'art-03',
    artisanName: 'Taller Hermanos Trejo (Navicristal)',
    workshopAddress: 'Carretera a los Baños Termales Km 1.2',
    pickupDate: '2026-11-08',
    timeSlot: '16:00 - 17:30 hrs',
    estimatedBoxes: 25,
    pickupFeeCharged: 90.00,
    paymentStatus: 'Pendiente de Cobro',
    assignedDriver: 'Rodrigo Castelán (Camioneta 3.5t)',
    status: 'Programada',
    notes: 'Carga pesada para consolidación directa a terminal Puebla.'
  },
  {
    id: 'pic-2026-004',
    artisanId: 'art-05',
    artisanName: 'Artesanías y Cristales Navideños San Rafael',
    workshopAddress: 'Calle Nigromante #28, Centro',
    pickupDate: '2026-11-09',
    timeSlot: '09:30 - 11:00 hrs',
    estimatedBoxes: 8,
    pickupFeeCharged: 60.00,
    paymentStatus: 'Pendiente de Cobro',
    assignedDriver: 'Manuel Romero (Unidad Van-01)',
    status: 'Programada',
    notes: 'Empaquetado delicado de coronas con esfera de cristal.'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'GT-CHIG-2026-101',
    castoresGuideNumber: '6830184-PUE',
    date: '2026-11-07',
    artisanId: 'art-01',
    artisanBusiness: 'Esferas Artesanales Don Chucho',
    buyerName: 'Ing. Salvador Garza Villarreal',
    buyerPhone: '+52 81 8329 4410',
    buyerEmail: 'sgarza@decoracionesmty.com',
    destinationCity: 'Monterrey, Nuevo León',
    destinationAddress: 'Av. Vasconcelos #1450, Col. del Valle, San Pedro Garza García, N.L., C.P. 66220',
    deliveryType: 'Domicilio',
    itemsSummary: '4 Cajas Grandes (480 Esferas Artesanales Tradicionales Espiral Oro y Rubí)',
    boxesCount: 4,
    totalWeightKg: 28,
    volumetricWeightKg: 42,
    packagingTypeId: 'pack-premium',
    packagingName: 'Embalaje Premium Panal Antishock',
    requiresTribunaShuttleToPuebla: true,
    shuttleFee: 340.00, // 4 cajas * 85
    castoresListPrice: 2200.00,
    castoresDiscountPct: 22,
    castoresNetCostToTribuna: 1716.00, // 2200 * 0.78 descontado de saldo prepago
    tribunaMarginOnCastores: 550.00, // 25% sobre lista
    packagingCostCharged: 540.00, // 4 * 135
    packagingCostReal: 240.00, // 4 * 60
    localPickupFeeChargedToArtisan: 60.00,
    // Finanzas consolidadas
    totalChargedToCustomer: 3630.00, // Flete Castores Comercial ($2750) + Embalaje ($540) + Troncal Chig-Pue ($340)
    totalOperativeCostTribuna: 2296.00, // Castores neto ($1716) + Embalaje insumos ($240) + Gasolina/chofer troncal ($340)
    tribunaNetProfit: 1394.00, // Ganancia neta total para Grupo Tribuna
    status: 'En Tránsito Nacional Castores',
    castoresStatus: 'En Ruta hacia Centro de Distribución Monterrey La Fe',
    estimatedDeliveryDate: '2026-11-10',
    fragilityWarrantyActive: true,
    notes: 'Cliente mayorista frecuente para boutiques en San Pedro.'
  },
  {
    id: 'GT-CHIG-2026-102',
    castoresGuideNumber: '6830201-PUE',
    date: '2026-11-07',
    artisanId: 'art-02',
    artisanBusiness: 'El Ángel Navideño & Diseños de Cristal',
    buyerName: 'Lic. Claudia Del Río Ramos',
    buyerPhone: '+52 33 3615 9012',
    buyerEmail: 'claudia.delrio@gmail.com',
    destinationCity: 'Guadalajara, Jalisco',
    destinationAddress: 'Av. Providencia #2450, Col. Providencia, Guadalajara, Jal., C.P. 44630',
    deliveryType: 'Domicilio',
    itemsSummary: '2 Cajas Jumbo (120 Esferas Monumentales con Nieve Artificial y Luz LED)',
    boxesCount: 2,
    totalWeightKg: 18,
    volumetricWeightKg: 35,
    packagingTypeId: 'pack-jumbo',
    packagingName: 'Embalaje Tarima / Jumbo Monumental',
    requiresTribunaShuttleToPuebla: true,
    shuttleFee: 170.00,
    castoresListPrice: 1650.00,
    castoresDiscountPct: 22,
    castoresNetCostToTribuna: 1287.00,
    tribunaMarginOnCastores: 412.50,
    packagingCostCharged: 440.00,
    packagingCostReal: 190.00,
    localPickupFeeChargedToArtisan: 70.00,
    totalChargedToCustomer: 2672.50,
    totalOperativeCostTribuna: 1647.00,
    tribunaNetProfit: 1095.50,
    status: 'Documentado en Castores Puebla',
    castoresStatus: 'Salida programada 21:00 hrs hacia HUB Castores Guadalajara González Gallo',
    estimatedDeliveryDate: '2026-11-09',
    fragilityWarrantyActive: true,
    notes: 'Esferas con tecnología LED integrada, embalaje reforzado con foam.'
  },
  {
    id: 'GT-CHIG-2026-103',
    castoresGuideNumber: '6830245-PUE',
    date: '2026-11-08',
    artisanId: 'art-04',
    artisanBusiness: 'Esferas Finas La Joya de la Sierra',
    buyerName: 'Arq. Rodrigo Montes de Oca',
    buyerPhone: '+52 55 5280 1199',
    buyerEmail: 'rmontes@disenoyespacios.com.mx',
    destinationCity: 'Ciudad de México (CDMX)',
    destinationAddress: 'Homero #910 Depto 402, Polanco V Sección, Miguel Hidalgo, CDMX, C.P. 11560',
    deliveryType: 'Domicilio',
    itemsSummary: '3 Cajas Esferas Caladas Edición Especial Vitral Azul y Esmeralda',
    boxesCount: 3,
    totalWeightKg: 12,
    volumetricWeightKg: 20,
    packagingTypeId: 'pack-premium',
    packagingName: 'Embalaje Premium Panal Antishock',
    requiresTribunaShuttleToPuebla: true,
    shuttleFee: 255.00,
    castoresListPrice: 950.00,
    castoresDiscountPct: 22,
    castoresNetCostToTribuna: 741.00,
    tribunaMarginOnCastores: 285.00,
    packagingCostCharged: 405.00,
    packagingCostReal: 180.00,
    localPickupFeeChargedToArtisan: 65.00,
    totalChargedToCustomer: 1895.00,
    totalOperativeCostTribuna: 1176.00,
    tribunaNetProfit: 784.00,
    status: 'En Bodega Chignahuapan (Acopio)',
    castoresStatus: 'Asignado a van troncal para salida hoy 18:30 hrs hacia Puebla',
    estimatedDeliveryDate: '2026-11-09',
    fragilityWarrantyActive: true,
    notes: 'Piezas exclusivas de autor para residencia en Polanco.'
  },
  {
    id: 'GT-CHIG-2026-104',
    castoresGuideNumber: '6830280-PUE',
    date: '2026-11-08',
    artisanId: 'art-03',
    artisanBusiness: 'Taller Hermanos Trejo (Navicristal)',
    buyerName: 'Doña Beatriz Alcocer Méndez',
    buyerPhone: '+52 999 924 8832',
    buyerEmail: 'balcocer@boutiquemerida.com',
    destinationCity: 'Mérida, Yucatán',
    destinationAddress: 'Calle 60 Norte #381 x 21 y 23, Col. Buenavista, Mérida, Yuc., C.P. 97125',
    deliveryType: 'Ocurre Oficina Castores Mérida Periférico',
    itemsSummary: '8 Cajas Esferas Navideñas Lisas y Diamantadas Surtidas (Mayoreo)',
    boxesCount: 8,
    totalWeightKg: 64,
    volumetricWeightKg: 95,
    packagingTypeId: 'pack-standard',
    packagingName: 'Embalaje Estándar Esferas',
    requiresTribunaShuttleToPuebla: true,
    shuttleFee: 680.00,
    castoresListPrice: 3800.00,
    castoresDiscountPct: 22,
    castoresNetCostToTribuna: 2964.00,
    tribunaMarginOnCastores: 950.00,
    packagingCostCharged: 600.00,
    packagingCostReal: 280.00,
    localPickupFeeChargedToArtisan: 90.00,
    totalChargedToCustomer: 6030.00,
    totalOperativeCostTribuna: 3924.00,
    tribunaNetProfit: 2196.00,
    status: 'Embalaje Especializado Aplicado',
    castoresStatus: 'Listo en rack de embarque Bodega Chignahuapan',
    estimatedDeliveryDate: '2026-11-12',
    fragilityWarrantyActive: true,
    notes: 'Envío hacia Mérida con recolección ocurre en sucursal Castores Periférico Oriente.'
  }
];

export const POPULAR_DESTINATIONS = [
  { city: 'Ciudad de México (CDMX)', state: 'CDMX', avgDays: '24 a 48 hrs', baseRatePerKg: 38.00 },
  { city: 'Monterrey', state: 'Nuevo León', avgDays: '48 a 72 hrs', baseRatePerKg: 52.00 },
  { city: 'Guadalajara', state: 'Jalisco', avgDays: '48 a 72 hrs', baseRatePerKg: 48.00 },
  { city: 'Mérida', state: 'Yucatán', avgDays: '72 a 96 hrs', baseRatePerKg: 58.00 },
  { city: 'Querétaro', state: 'Querétaro', avgDays: '24 a 48 hrs', baseRatePerKg: 40.00 },
  { city: 'Tijuana', state: 'Baja California', avgDays: '96 a 120 hrs', baseRatePerKg: 74.00 },
  { city: 'Cancún', state: 'Quintana Roo', avgDays: '72 a 96 hrs', baseRatePerKg: 62.00 },
  { city: 'Veracruz', state: 'Veracruz', avgDays: '24 a 48 hrs', baseRatePerKg: 36.00 },
  { city: 'León', state: 'Guanajuato', avgDays: '48 hrs', baseRatePerKg: 44.00 },
  { city: 'Chihuahua', state: 'Chihuahua', avgDays: '72 a 96 hrs', baseRatePerKg: 64.00 }
];

// Calibres y Números Tradicionales de Esferas de Chignahuapan
export const SPHERE_NUMBERS = [
  { number: '#3', label: '#3 Miniatura (3-4 cm)', description: 'Ideal para racimos, guirnaldas y árboles miniatura' },
  { number: '#4', label: '#4 Económica (5 cm)', description: 'Esfera clásica pequeña tradicional, volumen alto' },
  { number: '#5', label: '#5 Mediana (6-7 cm)', description: 'El tamaño más vendido en Chignahuapan para árboles estándar' },
  { number: '#6', label: '#6 Clásica Estándar (8-9 cm)', description: 'Esfera grande tradicional con doble textura y decorados' },
  { number: '#7', label: '#7 Grande Ornamental (10-11 cm)', description: 'Esfera protagonista para árboles monumentales' },
  { number: '#8', label: '#8 Monumental / Jumbo (12-15 cm)', description: 'Piezas exclusivas de colección o exhibición' }
];

// Tipos y Categorías de Producto
export const SPHERE_TYPES = [
  'Esfera Económica',
  'Esfera Mediana',
  'Esfera Clásica (Dos Texturas)',
  'Esfera Temática / Decorada a Mano',
  'Esfera Grande / Monumental',
  'Canoa de Esferas',
  'Racimo de Esferas',
  'Árbol de la Abundancia con Semillas'
];

// Opciones de Empaque Tradicional
export const PACKAGING_COUNTS = [
  { id: 'pack-12', label: 'Estuche Acetato (12 piezas - Docena)', pieces: 12 },
  { id: 'pack-24', label: 'Caja Estándar (24 piezas)', pieces: 24 },
  { id: 'pack-32', label: 'Caja Grande (32 piezas)', pieces: 32 },
  { id: 'pack-48', label: 'Caja Máster Mayorista (48 piezas)', pieces: 48 },
  { id: 'pack-canoa', label: 'Canoa / Charola Decorativa', pieces: 8 },
  { id: 'pack-racimo', label: 'Racimo Colgante Integrado', pieces: 12 },
  { id: 'pack-arbol', label: 'Árbol Piramidal Individual', pieces: 1 }
];

// Catálogo de Esferas creadas por el usuario en Chignahuapan
export const INITIAL_SPHERES_CATALOG = [];

// Historial de Pedidos de Compra Consolidada Guardados
export const INITIAL_SAVED_PURCHASE_ORDERS = [];

// ============================================================================
// FÓRMULA DE COSTOS, TRANSPORTE Y UTILIDAD EN CASCADA GRUPO TRIBUNA
// Fórmula: Costo Artesano x 18% x 13% x 13% x 28% x 12% (~2.16x multiplicador)
// ============================================================================
export const PRICING_CASCADING_FACTORS = [
  { key: 'castoresFreight', label: 'Flete Nacional Castores', percent: 18, factor: 1.18, icon: '🚚', description: 'Convenio corporativo Castores salidas diarias' },
  { key: 'troncalFreight', label: 'Flete Troncal Chignahuapan ➔ Puebla', percent: 13, factor: 1.13, icon: '🚐', description: 'Shuttle Sprinter suspensión neumática' },
  { key: 'packagingProtection', label: 'Embalaje Especializado Antishock', percent: 13, factor: 1.13, icon: '📦', description: 'Cajas doble corrugado, burbuja y esquineros' },
  { key: 'tribunaProfit', label: 'Utilidad Neta Grupo Tribuna', percent: 28, factor: 1.28, icon: '💎', description: 'Margen de comercialización y ganancia neta' },
  { key: 'hubHandlingMerma', label: 'Acopio Hub Chignahuapan & Merma', percent: 12, factor: 1.12, icon: '🏢', description: 'Operación bodega, etiquetado y seguro de merma' }
];

export const TOTAL_CASCADING_MULTIPLIER = 1.18 * 1.13 * 1.13 * 1.28 * 1.12; // 2.160065...

export function calculateCascadingPricing(baseCost) {
  const cost = Number(baseCost) || 0;
  if (cost <= 0) {
    return {
      baseCost: 0,
      steps: [
        { key: 'castoresFreight', label: 'Flete Castores', percent: 18, addedAmount: 0, subtotal: 0 },
        { key: 'troncalFreight', label: 'Troncal Chig-Pue', percent: 13, addedAmount: 0, subtotal: 0 },
        { key: 'packagingProtection', label: 'Embalaje Antishock', percent: 13, addedAmount: 0, subtotal: 0 },
        { key: 'tribunaProfit', label: 'Utilidad Tribuna', percent: 28, addedAmount: 0, subtotal: 0 },
        { key: 'hubHandlingMerma', label: 'Acopio & Merma', percent: 12, addedAmount: 0, subtotal: 0 }
      ],
      castoresAmount: 0,
      troncalAmount: 0,
      packagingAmount: 0,
      profitAmount: 0,
      handlingAmount: 0,
      totalAdded: 0,
      finalPrice: 0,
      recommendedWholesalePrice: 0
    };
  }

  const s1 = cost * 1.18;
  const castoresAmount = s1 - cost;

  const s2 = s1 * 1.13;
  const troncalAmount = s2 - s1;

  const s3 = s2 * 1.13;
  const packagingAmount = s3 - s2;

  const s4 = s3 * 1.28;
  const profitAmount = s4 - s3;

  const s5 = s4 * 1.12;
  const handlingAmount = s5 - s4;

  const finalPrice = Math.round(s5 * 100) / 100;
  const recommendedWholesalePrice = Math.round(finalPrice);

  return {
    baseCost: cost,
    steps: [
      { key: 'castoresFreight', label: 'Flete Castores', percent: 18, addedAmount: Math.round(castoresAmount * 100) / 100, subtotal: Math.round(s1 * 100) / 100 },
      { key: 'troncalFreight', label: 'Troncal Chig-Pue', percent: 13, addedAmount: Math.round(troncalAmount * 100) / 100, subtotal: Math.round(s2 * 100) / 100 },
      { key: 'packagingProtection', label: 'Embalaje Antishock', percent: 13, addedAmount: Math.round(packagingAmount * 100) / 100, subtotal: Math.round(s3 * 100) / 100 },
      { key: 'tribunaProfit', label: 'Utilidad Tribuna', percent: 28, addedAmount: Math.round(profitAmount * 100) / 100, subtotal: Math.round(s4 * 100) / 100 },
      { key: 'hubHandlingMerma', label: 'Acopio & Merma', percent: 12, addedAmount: Math.round(handlingAmount * 100) / 100, subtotal: Math.round(s5 * 100) / 100 }
    ],
    castoresAmount: Math.round(castoresAmount * 100) / 100,
    troncalAmount: Math.round(troncalAmount * 100) / 100,
    packagingAmount: Math.round(packagingAmount * 100) / 100,
    profitAmount: Math.round(profitAmount * 100) / 100,
    handlingAmount: Math.round(handlingAmount * 100) / 100,
    totalAdded: Math.round((s5 - cost) * 100) / 100,
    finalPrice,
    recommendedWholesalePrice
  };
}

