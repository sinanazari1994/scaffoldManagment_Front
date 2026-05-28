export const ROLES = {
  CONTRACTOR: 'Contractor',
  OFFICE_MANAGER: 'OfficeManager',
  WORKER: 'Worker',
  SUPPORT_AGENT: 'SupportAgent',   // جدید
  SUPER_ADMIN: 'SuperAdmin',       // جدید
};
export const SERVICE_TYPES = [
  'داربست نما',
  'کفراژبندی',
  'چهارپایه',
  'زیر بتن',
  'سایر'
];


export const TRANSACTION_TYPES = {
  TRANSFER_OUT: 'خروج به پروژه',
  TRANSFER_IN: 'ورود از پروژه',
  SALE: 'فروش',
  SCRAP: 'ضایعات',
};
export const TASK_TYPES = {
  TRANSFER: 'Transfer',
  INSTALL: 'Install',
  DISMANTLE: 'Dismantle',
};

export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
};
export const AVAILABLE_WORKERS = ['حسن کارگر', 'علی کارگر', 'محمد کارگر', 'رضا کارگر'];
export const TASK_COLORS = {
  Transfer: {
    border: 'task-card-transfer',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: '🚚',
  },
  Install: {
    border: 'task-card-install',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    icon: '🔧',
  },
  Dismantle: {
    border: 'task-card-dismantle',
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: '🔨',
  },

  
  
};