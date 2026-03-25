import {
  Utensils,
  Receipt,
  Bus,
  Home,
  Wifi,
  Handshake,
  Sofa,
  Shirt,
  Car,
  PackageOpen,
  Banknote,
  TrendingUp,
  MoreHorizontal,
  CreditCard,
  Landmark,
  Briefcase,
  Gift,
  HeartPulse,
  GraduationCap
} from "lucide-react";

export type TransactionType = "income" | "expense";

export interface Category {
  id: number;
  name: string;
  icon: any;
  type: TransactionType;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 1, name: "الغذاء", icon: Utensils, type: "expense", color: "#f97316" },
  { id: 2, name: "الفواتير", icon: Receipt, type: "expense", color: "#3b82f6" },
  { id: 3, name: "النقل", icon: Bus, type: "expense", color: "#a855f7" },
  { id: 4, name: "السكن", icon: Home, type: "expense", color: "#475569" },
  { id: 5, name: "الاتصالات", icon: Wifi, type: "expense", color: "#14b8a6" },
  { id: 6, name: "التزامات", icon: Handshake, type: "expense", color: "#64748b" },
  { id: 7, name: "المنزل", icon: Sofa, type: "expense", color: "#ea580c" },
  { id: 8, name: "الملابس", icon: Shirt, type: "expense", color: "#f59e0b" },
  { id: 9, name: "السيارة", icon: Car, type: "expense", color: "#ef4444" },
  { id: 10, name: "مستلزمات", icon: PackageOpen, type: "expense", color: "#10b981" },
  { id: 14, name: "صحة", icon: HeartPulse, type: "expense", color: "#f43f5e" },
  { id: 15, name: "تعليم", icon: GraduationCap, type: "expense", color: "#8b5cf6" },
  { id: 11, name: "راتب", icon: Briefcase, type: "income", color: "#22c55e" },
  { id: 12, name: "أرباح", icon: TrendingUp, type: "income", color: "#16a34a" },
  { id: 16, name: "هدايا", icon: Gift, type: "income", color: "#d946ef" },
  { id: 13, name: "أخرى", icon: MoreHorizontal, type: "income", color: "#eab308" }
];

export const PAYMENT_METHODS = {
  income: [
    { name: "كاش", icon: Banknote, color: "#22c55e" },
    { name: "تحويل", icon: Landmark, color: "#3b82f6" }
  ],
  expense: [
    { name: "كاش", icon: Banknote, color: "#f97316" },
    { name: "بطاقة", icon: CreditCard, color: "#3b82f6" }
  ]
};

export const CURRENCIES = [
  { code: "LYD", symbol: "د.ل", name: "دينار ليبي" },
  { code: "SAR", symbol: "ر.س", name: "ريال سعودي" },
  { code: "AED", symbol: "د.إ", name: "درهم إماراتي" },
  { code: "EGP", symbol: "ج.م", name: "جنيه مصري" },
  { code: "USD", symbol: "$", name: "دولار أمريكي" },
  { code: "EUR", symbol: "€", name: "يورو" }
];

