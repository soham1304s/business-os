import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore, ToastType } from '../../store/toastStore';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="fixed bottom-0 right-0 z-[10000] p-4 sm:p-6 flex flex-col gap-3 pointer-events-none w-full sm:max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl p-4 overflow-hidden relative group"
          >
            {/* Subtle glow effect */}
            <div className={`absolute top-0 left-0 w-1.5 h-full ${
              toast.type === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' :
              toast.type === 'error' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' :
              'bg-blue-500 shadow-[0_0_10px_#3b82f6]'
            }`} />

            <div className="flex items-start gap-3 ml-2">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(toast.type)}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-semibold text-slate-100">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
