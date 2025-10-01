import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDelivery } from '../../../../../services/deliveryService';

// MapInput Component menggunakan Leaflet
const MapInput = ({ label, value, lat, lng, onLocationChange, disabled }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [address, setAddress] = useState(value || "");
  const [loading, setLoading] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && lat && lng) {
      const newLatLng = [lat, lng];
      markerRef.current.setLatLng(newLatLng);
      mapInstanceRef.current.setView(newLatLng, 13);
    }
  }, [lat, lng]);

  const initMap = () => {
    if (!window.L || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    const initialLat = lat || -8.243;
    const initialLng = lng || 115.321;

    const map = L.map(mapRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const marker = L.marker([initialLat, initialLng], {
      icon: customIcon,
      draggable: !disabled
    }).addTo(map);

    marker.bindPopup("Drag marker atau klik peta untuk mengubah lokasi").openPopup();

    marker.on('dragend', function(e) {
      const position = e.target.getLatLng();
      getAddress(position.lat, position.lng);
    });

    map.on('click', function(e) {
      if (!disabled) {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        getAddress(lat, lng);
      }
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Set koordinat awal saat map pertama kali dimuat
    if (!initializedRef.current) {
      getAddress(initialLat, initialLng);
      initializedRef.current = true;
    }
  };

  const getAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      const addressText = data.display_name || `${latitude}, ${longitude}`;
      
      setAddress(addressText);
      
      if (onLocationChange) {
        onLocationChange({
          address: addressText,
          lat: latitude,
          lng: longitude
        });
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      const fallbackAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      setAddress(fallbackAddress);
      
      if (onLocationChange) {
        onLocationChange({
          address: fallbackAddress,
          lat: latitude,
          lng: longitude
        });
      }
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung browser Anda');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        if (markerRef.current && mapInstanceRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
          mapInstanceRef.current.setView([latitude, longitude], 15);
          getAddress(latitude, longitude);
        }
        
        setLoading(false);
      },
      (error) => {
        alert('Gagal mendapatkan lokasi: ' + error.message);
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} *
      </label>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Alamat akan terisi otomatis dari peta"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={loading || disabled}
            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
            title="Gunakan lokasi saya"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        
        <div 
          ref={mapRef}
          className="w-full h-64 rounded-lg border border-gray-300 bg-gray-100"
        />
        
        <div className="text-xs text-gray-500">
          Klik pada peta atau drag marker untuk mengubah lokasi
        </div>
      </div>
    </div>
  );
};

// InputDelivery Component dengan Service Integration
const InputDelivery = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickup_address: "",
    pickup_lat: null,
    pickup_lng: null,
    destination_address: "",
    item_description: "",
    item_weight: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePickupLocationChange = (location) => {
    setFormData((prev) => ({
      ...prev,
      pickup_address: location.address,
      pickup_lat: location.lat,
      pickup_lng: location.lng,
    }));
    if (error) setError("");
  };

  const handleDestinationLocationChange = (location) => {
    setFormData((prev) => ({
      ...prev,
      destination_address: location.address,
    }));
    if (error) setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (!formData.pickup_address.trim()) {
      setError("Alamat penjemputan tidak boleh kosong.");
      return false;
    }
    if (formData.pickup_lat === null || formData.pickup_lng === null) {
      setError("Koordinat penjemputan tidak valid. Silakan pilih lokasi di peta.");
      return false;
    }
    if (!formData.destination_address.trim()) {
      setError("Alamat tujuan tidak boleh kosong.");
      return false;
    }
    if (!formData.item_description.trim()) {
      setError("Deskripsi barang tidak boleh kosong.");
      return false;
    }
    if (!formData.item_weight) {
      setError("Berat barang tidak boleh kosong.");
      return false;
    }

    const weight = parseFloat(formData.item_weight);
    if (isNaN(weight) || weight <= 0) {
      setError("Berat barang harus berupa angka positif.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const dataToSubmit = {
        pickup_address: formData.pickup_address,
        pickup_lat: parseFloat(formData.pickup_lat),
        pickup_lng: parseFloat(formData.pickup_lng),
        destination_address: formData.destination_address,
        item_description: formData.item_description,
        item_weight: parseFloat(formData.item_weight)
      };

      console.log('Sending data:', dataToSubmit);

      const response = await createDelivery(dataToSubmit);

      if (response.status === "success") {
        setSuccess("Pengiriman berhasil ditambahkan!");
        setTimeout(() => {
          navigate("/dashboard/delivery-list");
        }, 1500);
      } else {
        setError(response.message || "Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Error creating delivery:", err);
      setError(err.message || "Gagal menambahkan pengiriman.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/delivery-list");
  };

  return (
    <div className="p-2">
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          disabled={saving}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Tambah Pengiriman</h2>
      </div>

      <div className="max-w-5xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <span className="text-green-700 font-medium">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <MapInput
            label="Alamat Penjemputan"
            value={formData.pickup_address}
            lat={formData.pickup_lat || -8.243}
            lng={formData.pickup_lng || 115.321}
            onLocationChange={handlePickupLocationChange}
            disabled={saving}
          />
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="pickup_lat" className="block text-sm font-medium text-gray-700 mb-2">
                Latitude Penjemputan
              </label>
              <input
                type="text"
                id="pickup_lat"
                name="pickup_lat"
                value={formData.pickup_lat !== null ? formData.pickup_lat : ''}
                readOnly
                disabled={saving}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="pickup_lng" className="block text-sm font-medium text-gray-700 mb-2">
                Longitude Penjemputan
              </label>
              <input
                type="text"
                id="pickup_lng"
                name="pickup_lng"
                value={formData.pickup_lng !== null ? formData.pickup_lng : ''}
                readOnly
                disabled={saving}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
              />
            </div>
          </div>

          <MapInput
            label="Alamat Tujuan"
            value={formData.destination_address}
            onLocationChange={handleDestinationLocationChange}
            disabled={saving}
          />

          <div>
            <label
              htmlFor="item_description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Deskripsi Barang *
            </label>
            <textarea
              id="item_description"
              name="item_description"
              value={formData.item_description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Contoh: 50 Kg Kopi Arabika Kintamani"
              disabled={saving}
              required
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="item_weight"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Berat Barang (Kg) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              id="item_weight"
              name="item_weight"
              value={formData.item_weight}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Contoh: 50"
              disabled={saving}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Simpan Pengiriman
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputDelivery;