import { useState } from 'react';
import { X } from 'lucide-react';

const DirectOfferModal = ({ isOpen, onClose, worker, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    payment_rate: ''
  });
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Judul pekerjaan harus diisi');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Deskripsi pekerjaan harus diisi');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Lokasi harus diisi');
      return false;
    }
    if (!formData.start_date) {
      setError('Tanggal mulai harus diisi');
      return false;
    }
    if (!formData.end_date) {
      setError('Tanggal selesai harus diisi');
      return false;
    }
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setError('Tanggal selesai tidak boleh lebih awal dari tanggal mulai');
      return false;
    }
    if (!formData.payment_rate || parseFloat(formData.payment_rate) <= 0) {
      setError('Tarif pembayaran harus diisi dengan nilai valid');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        payment_rate: ''
      });
      setShowConfirmation(false);
      onClose();
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengirim penawaran');
      setShowConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      start_date: '',
      end_date: '',
      payment_rate: ''
    });
    setError('');
    setShowConfirmation(false);
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Confirmation Dialog
  if (showConfirmation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Penawaran</h3>
          
          <div className="space-y-3 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Worker:</p>
              <p className="font-semibold text-gray-900">{worker?.name}</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Judul Pekerjaan:</p>
              <p className="font-semibold text-gray-900">{formData.title}</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Lokasi:</p>
              <p className="font-semibold text-gray-900">{formData.location}</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Periode:</p>
              <p className="font-semibold text-gray-900">
                {new Date(formData.start_date).toLocaleDateString('id-ID')} - {new Date(formData.end_date).toLocaleDateString('id-ID')}
              </p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Tarif Pembayaran:</p>
              <p className="font-semibold text-gray-900">{formatPrice(formData.payment_rate)}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Apakah Anda yakin ingin mengirimkan penawaran langsung ini kepada <span className="font-semibold">{worker?.name}</span>?
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setShowConfirmation(false)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              style={{ backgroundColor: '#39B54A' }}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Penawaran'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Form Dialog
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Buat Penawaran Langsung</h2>
            <p className="text-sm text-gray-600 mt-1">Untuk: <span className="font-semibold">{worker?.name}</span></p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Worker Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                {worker?.profile_picture ? (
                  <img src={worker.profile_picture} alt={worker.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#39B54A' }}>
                    {worker?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{worker?.name}</p>
                <p className="text-sm text-gray-600">{worker?.address}</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Pekerjaan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Contoh: Perawatan Kebun Rumah"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Pekerjaan <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan detail pekerjaan yang akan dilakukan..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi Pekerjaan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Contoh: Kebun Petani Budi, Yogyakarta"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Selesai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Payment Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarif Pembayaran (IDR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="payment_rate"
              value={formData.payment_rate}
              onChange={handleChange}
              placeholder="Contoh: 175000"
              min="0"
              step="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            {formData.payment_rate && (
              <p className="text-sm text-gray-600 mt-1">
                {formatPrice(formData.payment_rate)}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#39B54A' }}
            >
              Lanjutkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DirectOfferModal;