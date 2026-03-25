import * as React from "react";
import { Modal } from "./ui/Modal";
import { CATEGORIES, PAYMENT_METHODS, type TransactionType } from "@/src/lib/constants";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: any) => void;
}

export function AddTransactionModal({ isOpen, onClose, onSave }: AddTransactionModalProps) {
  const [step, setStep] = React.useState(1);
  const [type, setType] = React.useState<TransactionType>("expense");
  const [catId, setCatId] = React.useState<number | null>(null);
  const [method, setMethod] = React.useState<string>("");
  const [amount, setAmount] = React.useState("");
  const [receipt, setReceipt] = React.useState("");
  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0]);

  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setType("expense");
      setCatId(null);
      setMethod("");
      setAmount("");
      setReceipt("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!amount || isNaN(Number(amount))) {
      alert("الرجاء إدخال مبلغ صحيح");
      return;
    }

    const timestamp = new Date(date);
    timestamp.setHours(new Date().getHours(), new Date().getMinutes());

    onSave({
      id: Date.now(),
      type,
      catId,
      amount: Number(amount),
      method,
      receipt,
      date: timestamp.toISOString(),
    });
    onClose();
  };

  const filteredCategories = CATEGORIES.filter((c) => c.type === type);
  const currentMethods = PAYMENT_METHODS[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة جديد">
      {step > 1 && (
        <button
          onClick={() => setStep(step - 1)}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      )}

      <div className="mb-6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-medium w-full max-w-[200px] text-center"
        />
      </div>

      {step === 1 && (
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={() => {
              setType("income");
              setStep(2);
            }}
            className="flex flex-col items-center gap-3 transition-transform active:scale-95"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Plus className="w-8 h-8" />
            </div>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">إيراد</span>
          </button>
          <button
            onClick={() => {
              setType("expense");
              setStep(2);
            }}
            className="flex flex-col items-center gap-3 transition-transform active:scale-95"
          >
            <div className="w-20 h-20 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Minus className="w-8 h-8" />
            </div>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">مصروف</span>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCatId(cat.id);
                setStep(3);
              }}
              className="flex flex-col items-center p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <cat.icon className="w-8 h-8 mb-2" style={{ color: cat.color }} />
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{cat.name}</span>
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="flex justify-center gap-6 mt-8">
          {currentMethods.map((m) => (
            <button
              key={m.name}
              onClick={() => {
                setMethod(m.name);
                setStep(4);
              }}
              className="flex flex-col items-center gap-3 transition-transform active:scale-95"
            >
              <div
                className="w-20 h-20 rounded-full text-white flex items-center justify-center shadow-lg"
                style={{ backgroundColor: m.color, boxShadow: `0 10px 25px ${m.color}40` }}
              >
                <m.icon className="w-8 h-8" />
              </div>
              <span className="font-bold text-zinc-700 dark:text-zinc-300">{m.name}</span>
            </button>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-4 mt-4">
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-center text-2xl font-black text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50"
            autoFocus
          />
          {method === "كاش" && (
            <input
              type="text"
              placeholder="رقم المرجع (اختياري)"
              value={receipt}
              onChange={(e) => setReceipt(e.target.value)}
              className="w-full p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-center text-lg font-medium text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          )}
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg mt-4 transition-colors shadow-lg shadow-emerald-500/30"
          >
            حفظ العملية
          </button>
        </div>
      )}
    </Modal>
  );
}
