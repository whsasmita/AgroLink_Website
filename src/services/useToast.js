import { useState, useCallback } from 'react';

/**
 * Custom hook untuk mengelola state ToastNotification.
 * * @returns {object} { toast, showToast, closeToast }
 * - toast: Objek state (null atau { message, type })
 * - showToast: Fungsi (message, type, duration) untuk menampilkan toast
 * - closeToast: Fungsi untuk menutup toast secara manual
 */
export const useToast = () => {
    // State untuk menyimpan detail toast
    // (null berarti tersembunyi)
    const [toast, setToast] = useState(null);

    // useCallback agar fungsi tidak dibuat ulang di setiap render
    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        // Tampilkan toast
        setToast({ message, type });

        // Set timer untuk menutup toast secara otomatis
        setTimeout(() => {
            setToast(null);
        }, duration);
    }, []); // Tidak ada dependensi, fungsi ini stabil

    // Fungsi untuk menutup toast secara manual (jika tombol X diklik)
    const closeToast = useCallback(() => {
        setToast(null);
    }, []);

    // Kembalikan state dan fungsi-fungsi untuk digunakan oleh komponen
    return { toast, showToast, closeToast };
};