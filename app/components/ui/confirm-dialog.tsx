import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "~/lib/utils";

interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm: ConfirmFn = useCallback((options) => {
    return new Promise<boolean>((resolve) => {
      setPending({ options, resolve });
    });
  }, []);

  function handleConfirm(value: boolean) {
    pending?.resolve(value);
    setPending(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#1f1f2e] bg-[#1a1a28] p-6 shadow-2xl">
            {pending.options.destructive && (
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
            )}
            <h2 className="mb-2 text-lg font-bold text-white">
              {pending.options.title ?? "Are you sure?"}
            </h2>
            {pending.options.message && (
              <p className="mb-6 text-sm text-gray-400">{pending.options.message}</p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => handleConfirm(false)}
                className="rounded-xl border border-[#1f1f2e] bg-[#16161f] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#1f1f2e] transition-colors"
              >
                {pending.options.cancelLabel ?? "Cancel"}
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors",
                  pending.options.destructive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#ec4899] hover:bg-[#be185d]"
                )}
              >
                {pending.options.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}
