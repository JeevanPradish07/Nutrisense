import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, X, Info } from 'lucide-react';

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />,
};

export default function ToastContainer() {
    const { toasts, removeToast } = useApp();
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className="pointer-events-auto flex items-start gap-3 bg-navy-700 border border-white/10 rounded-xl px-4 py-3 shadow-xl animate-slide-up"
                    role="alert"
                >
                    {icons[t.type] ?? icons.info}
                    <p className="text-sm text-gray-200 flex-1">{t.msg}</p>
                    <button
                        onClick={() => removeToast(t.id)}
                        className="text-gray-500 hover:text-gray-300 transition-colors"
                        aria-label="Dismiss notification"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
