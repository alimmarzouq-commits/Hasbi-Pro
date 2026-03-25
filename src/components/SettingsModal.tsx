import * as React from "react";
import { Modal } from "./ui/Modal";
import { Download, Trash2, Check } from "lucide-react";
import { CURRENCIES } from "@/src/lib/constants";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: any[];
  setTransactions: (txs: any[]) => void;
  currency: string;
  setCurrency: (c: string) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  transactions,
  setTransactions,
  currency,
  setCurrency,
}: SettingsModalProps) {
  const handleExport = () => {
    if (transactions.length === 0) {
      toast.error("لا توجد بيانات لتصديرها");
      return;
    }

    const headers = ["التاريخ", "النوع", "الفئة", "المبلغ", "طريقة الدفع", "رقم المرجع"];
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) => {
        const typeStr = t.type === "income" ? "إيراد" : "مصروف";
        const dateStr = new Date(t.date).toLocaleDateString("ar-LY");
        return `"${dateStr}","${typeStr}","${t.catId}","${t.amount}","${t.method}","${t.receipt || ""}"`;
      }),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("تم تصدير البيانات بنجاح");
  };

  const handleClear = () => {
    if (window.confirm("هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.")) {
      setTransactions([]);
      toast.success("تم مسح جميع البيانات");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="الإعدادات">
      <div className="flex flex-col gap-6 text-right">
        <div>
          <h4 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-3">العملة المفضلة</h4>
          <div className="grid grid-cols-2 gap-2">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-colors",
                  currency === c.code
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                )}
              >
                <span className="font-bold text-sm">{c.name}</span>
                {currency === c.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />

        <div>
          <h4 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-3">إدارة البيانات</h4>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold transition-colors"
            >
              <Download className="w-5 h-5" />
              تصدير البيانات (CSV)
            </button>
            <button
              onClick={handleClear}
              className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-500 font-bold transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              مسح جميع البيانات
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
