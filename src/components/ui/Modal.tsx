import * as React from "react";
import { cn } from "@/src/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className={cn(
          "relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">{title}</h3>
        {children}
      </div>
    </div>
  );
}
