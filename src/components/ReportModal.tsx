import * as React from "react";
import { Modal } from "./ui/Modal";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: any[];
  filterMode: string;
  filterDate: Date;
  currencySymbol: string;
}

export function ReportModal({ isOpen, onClose, transactions, filterMode, filterDate, currencySymbol }: ReportModalProps) {
  const filtered = transactions.filter((tx) => {
    const d = new Date(tx.date);
    if (filterMode === "daily") return d.toDateString() === filterDate.toDateString();
    if (filterMode === "monthly")
      return d.getMonth() === filterDate.getMonth() && d.getFullYear() === filterDate.getFullYear();
    return d.getFullYear() === filterDate.getFullYear();
  });

  let inc = 0,
    exp = 0;
  filtered.forEach((tx) => (tx.type === "income" ? (inc += tx.amount) : (exp += tx.amount)));
  const net = inc - exp;

  const pieData = [
    { name: "إيرادات", value: inc || 1, color: inc ? "#10b981" : "#e4e4e7" },
    { name: "مصروفات", value: exp || (inc ? 0 : 1), color: exp ? "#f43f5e" : "#e4e4e7" },
  ];

  // Prepare bar chart data based on filterMode
  const barData = React.useMemo(() => {
    if (filterMode === "daily") {
      return [{ name: "اليوم", إيرادات: inc, مصروفات: exp }];
    } else if (filterMode === "monthly") {
      // Group by week
      const weeks = [0, 0, 0, 0];
      const incWeeks = [0, 0, 0, 0];
      filtered.forEach(tx => {
        const d = new Date(tx.date);
        const week = Math.min(Math.floor(d.getDate() / 7), 3);
        if (tx.type === "income") incWeeks[week] += tx.amount;
        else weeks[week] += tx.amount;
      });
      return weeks.map((w, i) => ({ name: `الأسبوع ${i + 1}`, إيرادات: incWeeks[i], مصروفات: w }));
    } else {
      // Group by month
      const months = Array(12).fill(0);
      const incMonths = Array(12).fill(0);
      filtered.forEach(tx => {
        const m = new Date(tx.date).getMonth();
        if (tx.type === "income") incMonths[m] += tx.amount;
        else months[m] += tx.amount;
      });
      const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
      return months.map((m, i) => ({ name: monthNames[i], إيرادات: incMonths[i], مصروفات: m }));
    }
  }, [filtered, filterMode, inc, exp]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تحليل الفترة" className="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-4">نظرة عامة</h4>
          <div className="relative h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => (value === 1 && !inc && !exp ? 0 : `${value.toLocaleString()} ${currencySymbol}`)}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">الصافي</span>
              <span
                className="text-xl font-black"
                style={{ color: net >= 0 ? "#10b981" : "#f43f5e" }}
              >
                {net.toLocaleString()} {currencySymbol}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex justify-between items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">إجمالي الإيرادات</span>
              <span className="font-black text-emerald-500">{inc.toLocaleString()} {currencySymbol}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">إجمالي المصروفات</span>
              <span className="font-black text-rose-500">{exp.toLocaleString()} {currencySymbol}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-4">التدفق المالي</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Bar dataKey="إيرادات" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="مصروفات" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Modal>
  );
}
