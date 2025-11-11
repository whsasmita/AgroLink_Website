import { X, CheckCircle2, AlertTriangle } from 'lucide-react';

/**
 * Komponen Toast Reusable
 * * Props:
 * - message: Teks yang akan ditampilkan
 * - type: 'success' (hijau) atau 'error' (merah)
 * - onClose: Fungsi yang dipanggil saat tombol close diklik
 */
const ToastNotification = ({ message, type = 'success', onClose }) => {
    const isSuccess = type === 'success';

    // Tentukan style berdasarkan tipe
    const styles = {
        bgColor: isSuccess ? 'bg-green-600' : 'bg-red-600',
        borderColor: isSuccess ? 'border-green-700' : 'border-red-700',
        Icon: isSuccess ? CheckCircle2 : AlertTriangle,
    };

    return (
        <div
            className={`
                fixed top-5 left-1/2 -translate-x-1/2 md:top-10 md:right-10 md:left-auto md:-translate-x-0
                z-[100] w-full max-w-xs sm:max-w-sm
                flex items-center gap-3 p-4 
                rounded-lg border text-white shadow-lg
                ${styles.bgColor} ${styles.borderColor}
                animate-toast-in
            `}
            role="alert"
        >
            {/* Ikon */}
            <div className="flex-shrink-0">
                <styles.Icon size={20} />
            </div>
            
            {/* Pesan */}
            <span className="flex-1 text-sm font-medium">{message}</span>
            
            {/* Tombol Close */}
            <button 
                onClick={onClose} 
                className="ml-auto -mr-1 p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close notification"
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default ToastNotification;