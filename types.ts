
export enum Sector {
  CAFE = 'Cafe & Bakery',
  AUTO = 'Automotive Repair',
  SALON = 'Salon & Spa',
  MEDICAL = 'Pharmacy & Medical',
}

export interface Branch {
  id: string;
  name: string;
  location: string;
}

export interface BusinessProfile {
  companyName: string;
  sector: Sector;
  branches: Branch[];
}

export interface DailySales {
  date: string;
  revenue: number;
  profit: number;
  customers: number;
}

export interface KPIMetrics {
  totalRevenue: number;
  totalProfit: number;
  growthRate: number;
  customerCount: number;
}

export interface Role {
  id: string;
  name: string;
  isServiceProvider: boolean; // Display in Service Tab?
}

export type EmployeeStatus = 'Active' | 'Inactive';

export interface Employee {
  id: string;
  name: string;
  role: string;
  salary: number;
  status: EmployeeStatus;
  joinedDate: string;
  attendance?: {
    lastCheckIn: string;
    daysPresent: number;
  };
}

export type Unit = 'kg' | 'lbs' | 'pcs' | 'ltr' | 'gal' | 'box' | 'packs' | 'tubes' | 'kits';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  wastage?: number; // Monitored wastage
  unit: Unit;
  minLevel?: number;
  category?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  qty?: number; // For cart logic
}

export interface Customer {
  name: string;
  phone: string;
}

export type PaymentMethod = 'CASH' | 'UPI' | 'SPLIT';

export interface Transaction {
  id: string;
  employeeIds: string[];
  serviceIds: string[];
  customer: Customer;
  paymentMethod: PaymentMethod;
  splitDetails?: {
    cash: number;
    upi: number;
  };
  totalAmount: number;
  date: string;
}
