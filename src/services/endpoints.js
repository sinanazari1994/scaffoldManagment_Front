export const ENDPOINTS = {
  // ==================== Auth ====================
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },

  // ==================== Users ====================
  USERS: '/users',

  // ==================== Projects ====================
  PROJECTS: '/projects',
  PROJECT_FINANCIALS: (id) => `/projects/${id}/financials`,
  PROJECT_IMAGES: (id) => `/projects/${id}/images`,
  PROJECT_COMPLETE: (id) => `/projects/${id}/complete`,
  PROJECT_PAID: (id) => `/projects/${id}/paid`,
  PROJECT_AGGREGATED_INVENTORY: (id) => `/projects/${id}/aggregated-inventory`,

  // ==================== Warehouses ====================
  WAREHOUSES: '/warehouses',
  WAREHOUSE_INVENTORY: (id) => `/warehouses/${id}`,
  WAREHOUSE_ITEMS: (id) => `/warehouses/${id}/items`,
  WAREHOUSE_SELL: (id) => `/warehouses/${id}/sell`,
  WAREHOUSE_SCRAP: (id) => `/warehouses/${id}/scrap`,
  WAREHOUSE_AGGREGATED_INVENTORY: (id) => `/warehouses/${id}/aggregated-inventory`,

  // ==================== WorkEntries ====================
  WORK_ENTRIES: '/workentries',
  WORK_ENTRY_BY_PROJECT: (id) => `/workentries/by-project/${id}`,
  WORK_ENTRY_VOLUME_REPORT: (id) => `/workentries/volume-report/${id}`,
  WORK_ENTRY_INSTALL: '/workentries/install',
  WORK_ENTRY_DISMANTLE: '/workentries/dismantle',
  WORK_ENTRY_DELIVERY: '/workentries/delivery',
  WORK_ENTRY_INSTALLED_VOLUME: '/workentries/installed-volume',

  // ==================== Transfers ====================
  TRANSFERS_PENDING: '/transfers/pending',
  TRANSFERS_OUTGOING: '/transfers/outgoing',
  TRANSFER_RESOLVE: (id) => `/transfers/${id}/resolve`,
  TRANSFER_HISTORY: '/transfers/history',
  TRANSFER_RESOLVE_ITEMS: '/transfers/resolve-items',

  // ==================== Locations ====================
  LOCATIONS: '/locations',
  LOCATIONS_AVAILABLE: '/locations/available',
  LOCATIONS_BY_PROJECT: (id) => `/locations/by-project/${id}`,

  // ==================== Services ====================
  SERVICES: '/services',

  // ==================== Reports ====================
  REPORTS_INVOICE: (id) => `/reports/invoice/${id}`,
  REPORTS_FINANCIAL: '/reports/financial',
  REPORTS_TRANSACTIONS: '/reports/transactions',

  // ==================== Payments ====================
  PAYMENTS: '/payments',
  PAYMENTS_BY_PROJECT: (id) => `/payments/by-project/${id}`,

  // ==================== EquipmentTypes ====================
  EQUIPMENT_TYPES: '/equipmenttypes',

  // ==================== SubscriptionPlans (عمومی) ====================
  SUBSCRIPTION_PLANS: '/subscriptionplans',

  // ==================== Admin ====================
  ADMIN_TENANTS: '/admin/tenants',
  ADMIN_STATS: '/admin/stats',
  ADMIN_RECEIPTS: '/admin/receipts',
  ADMIN_SUBSCRIPTION_PLANS: '/admin/subscription-plans',
  ADMIN_SUPPORT_USERS: '/admin/support-users',
  ADMIN_REPORTS: '/admin/reports',
};