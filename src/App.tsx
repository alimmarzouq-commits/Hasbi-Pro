import * as React from "react";
import { Moon, Sun, Wallet, PieChart as PieChartIcon, ChevronRight, ChevronLeft, Trash2, Plus, ArrowUpRight, ArrowDownRight, Settings, Search, X } from "lucide-react";
import { CATEGORIES, CURRENCIES } from "./lib/constants";
import { AddTransactionModal } from "./components/AddTransactionModal";
import { ReportModal } from "./components/ReportModal";
import { SettingsModal } from "./components/SettingsModal";
import { Card } from "./components/ui/Card";
import { cn } from "./lib/utils";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [transactions, setTransactions] = React.useState<any[]>(() => {
    const saved = localStorage.getItem("hissabi_pro_v2026");
    return saved ? JSON.parse(saved).transactions || [] : [];
  });
  const [currency, setCurrency] = React.useState<string>(() => {
    const saved = localStorage.getItem("hissabi_pro_v2026");
    return saved ? JSON.parse(saved).currency || "LYD" : "LYD";
  });
  
  const [filterMode, setFilterMode] = React.useState<"daily" | "monthly" | "yearly">("daily");
  const [filterDate, setFilterDate] = React.useState(new Date());
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  React.useEffect(() => {
    localStorage.setItem("hissabi_pro_v2026", JSON.stringify({ transactions, currency }));
  }, [transactions, currency]);

  const changePeriod = (delta: number) => {
    const newDate = new Date(filterDate);
    if (filterMode === "daily") newDate.setDate(newDate.getDate() + delta);
    else if (filterMode === "monthly") newDate.setMonth(newDate.getMonth() + delta);
    else newDate.setFullYear(newDate.getFullYear() + delta);
    setFilterDate(newDate);
  };

  const filteredTransactions = transactions.filter((tx) => {
    // Search filter
    if (searchQuery) {
      const cat = CATEGORIES.find(c => c.id === tx.catId);
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        (cat?.name.toLowerCase().includes(searchLower)) ||
        (tx.method.toLowerCase().includes(searchLower)) ||
        (tx.receipt && tx.receipt.toLowerCase().includes(searchLower)) ||
        (tx.amount.toString().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Date filter
    const d = new Date(tx.date);
    if (filterMode === "daily") return d.toDateString() === filterDate.toDateString();
    if (filterMode === "monthly")
      return d.getMonth() === filterDate.getMonth() && d.getFullYear() === filterDate.getFullYear();
    return d.getFullYear() === filterDate.getFullYear();
  });

  let inc = 0, exp = 0;
  filteredTransactions.forEach((tx) => {
    if (tx.type === "income") inc += tx.amount;
    else exp += tx.amount;
  });

  const getTitle = () => {
    if (filterMode === "daily") {
      return filterDate.toLocaleDateString("ar-LY", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } else if (filterMode === "monthly") {
      return filterDate.toLocaleDateString("ar-LY", { year: "numeric", month: "long" });
    } else {
      return "سنة " + filterDate.getFullYear();
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذه العملية؟")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("تم الحذف بنجاح");
    }
  };

  const currentCurrency = CURRENCIES.find(c => c.code === currency)?.symbol || "د.ل";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300 pb-24" dir="rtl">
      <Toaster position="top-center" dir="rtl" />
      
      <div className="max-w-md mx-auto p-4">
        <header className="flex justify-between items-center py-4 mb-2">
          <div className="flex items-center gap-3 text-emerald-500">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">مرحباً بك 👋</p>
              <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">حسابي Pro</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2.5 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-300 rounded-3xl p-6 text-white dark:text-zinc-900 shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 dark:bg-black/5 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <p className="text-zinc-400 dark:text-zinc-500 text-sm font-bold mb-1">الرصيد الإجمالي ({getTitle()})</p>
            <h2 className="text-4xl font-black tracking-tight mb-6">
              {(inc - exp).toLocaleString()} <span className="text-2xl font-bold text-zinc-400 dark:text-zinc-500">{currentCurrency}</span>
            </h2>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-white/10 dark:bg-black/5 rounded-2xl p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 dark:text-emerald-600 mb-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  الإيرادات
                </div>
                <div className="text-lg font-black">{inc.toLocaleString()}</div>
              </div>
              <div className="flex-1 bg-white/10 dark:bg-black/5 rounded-2xl p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 dark:text-rose-600 mb-1">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  المصروفات
                </div>
                <div className="text-lg font-black">{exp.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-200/50 dark:bg-zinc-900/50 p-1.5 rounded-2xl flex gap-1 mb-6">
          {["daily", "monthly", "yearly"].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode as any)}
              className={cn(
                "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all",
                filterMode === mode
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              {mode === "daily" ? "اليوم" : mode === "monthly" ? "الشهر" : "السنة"}
            </button>
          ))}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="w-12 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors"
          >
            <PieChartIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button onClick={() => changePeriod(-1)} className="p-2 text-zinc-400 hover:text-emerald-500 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center py-2 px-4 font-bold text-sm text-zinc-600 dark:text-zinc-400">
            {getTitle()}
          </div>
          <button onClick={() => changePeriod(1)} className="p-2 text-zinc-400 hover:text-emerald-500 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="البحث في المعاملات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3.5 pr-11 pl-10 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((tx, index) => {
              const cat = CATEGORIES.find((c) => c.id === tx.catId) || CATEGORIES[CATEGORIES.length - 1];
              const mLabel = tx.receipt ? `${tx.method} #${tx.receipt}` : tx.method;
              const isIncome = tx.type === "income";

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={tx.id}
                >
                  <Card className="p-4 flex items-center justify-between border-none shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-inner"
                        style={{ backgroundColor: cat.color }}
                      >
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <strong className="block text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">
                          {cat.name} <span className="text-xs font-medium text-zinc-400">({mLabel})</span>
                        </strong>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                          {new Date(tx.date).toLocaleTimeString("ar-LY", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <strong className={cn("text-base font-black", isIncome ? "text-emerald-500" : "text-rose-500")}>
                        {isIncome ? "+" : "-"}{tx.amount.toLocaleString()} <span className="text-xs">{currentCurrency}</span>
                      </strong>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filteredTransactions.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-12 flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
              </div>
              <p className="text-zinc-400 dark:text-zinc-500 font-bold">لا توجد عمليات في هذه الفترة</p>
            </motion.div>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 transition-transform active:scale-90 z-40"
      >
        <Plus className="w-8 h-8" />
      </button>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(tx) => {
          setTransactions((prev) => [...prev, tx]);
          toast.success("تمت الإضافة بنجاح");
        }}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        transactions={transactions}
        filterMode={filterMode}
        filterDate={filterDate}
        currencySymbol={currentCurrency}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        transactions={transactions}
        setTransactions={setTransactions}
        currency={currency}
        setCurrency={setCurrency}
      />
    </div>
  );
}