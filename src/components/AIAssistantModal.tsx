import React, { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import { CATEGORIES } from "@/src/lib/constants";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: any[];
  currencySymbol: string;
}

export function AIAssistantModal({
  isOpen,
  onClose,
  transactions,
  currencySymbol,
}: AIAssistantModalProps) {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen && !advice && transactions.length > 0) {
      generateAdvice();
    }
  }, [isOpen]);

  const generateAdvice = async () => {
    try {
      setLoading(true);
      setError("");

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in the environment variables.");
      }

      const ai = new GoogleGenAI({ apiKey });

      let inc = 0,
        exp = 0;
      transactions.forEach((tx) => {
        if (tx.type === "income") inc += tx.amount;
        else exp += tx.amount;
      });

      const recentTx = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 30)
        .map((t) => ({
          النوع: t.type === "income" ? "إيراد" : "مصروف",
          المبلغ: t.amount,
          الفئة: CATEGORIES.find((c) => c.id === t.catId)?.name || "أخرى",
          التاريخ: new Date(t.date).toLocaleDateString("ar-LY"),
        }));

      const prompt = `
      أنت مستشار مالي خبير وودود. قم بتحليل البيانات المالية التالية للمستخدم وقدم ملخصاً قصيراً و 3 نصائح عملية لتحسين ميزانيته.
      
      إجمالي الإيرادات: ${inc}
      إجمالي المصروفات: ${exp}
      الصافي: ${inc - exp}
      العملة: ${currencySymbol}
      
      تفاصيل المعاملات الأخيرة:
      ${JSON.stringify(recentTx)}
      
      أجب باللغة العربية، استخدم التنسيق (Markdown)، وكن مشجعاً. لا تذكر أنك نموذج لغوي، تصرف كمستشار مالي محترف.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setAdvice(response.text || "لم أتمكن من توليد نصيحة في الوقت الحالي.");
    } catch (err) {
      console.error(err);
      setError(
        "حدث خطأ أثناء الاتصال بالمساعد الذكي. تأكد من إعداد مفتاح API الخاص بـ Gemini."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="المستشار المالي الذكي"
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-4 text-right min-h-[300px] p-2">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-zinc-500">
            <Sparkles className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-bold">أضف بعض المعاملات أولاً</p>
            <p className="text-sm mt-2">
              ليتمكن المساعد الذكي من تحليل بياناتك وتقديم النصائح.
            </p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-emerald-500">
            <Loader2 className="w-12 h-12 mb-4 animate-spin" />
            <p className="text-zinc-600 dark:text-zinc-400 font-bold animate-pulse">
              جاري تحليل بياناتك المالية...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[300px] p-6 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-2xl text-center">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="font-bold mb-4">{error}</p>
            <button
              onClick={generateAdvice}
              className="px-6 py-2 bg-rose-100 dark:bg-rose-500/20 hover:bg-rose-200 dark:hover:bg-rose-500/30 rounded-xl font-bold transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <div className="markdown-body text-zinc-800 dark:text-zinc-200" dir="rtl">
            <Markdown>{advice}</Markdown>
          </div>
        )}
      </div>
    </Modal>
  );
}
