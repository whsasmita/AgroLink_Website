import { useRef, useEffect } from "react";
import { MdMyLocation, MdLocationOn } from "react-icons/md";
import useMapInput from "../../hook/UseMapInput";

// MapInput Component
const MapInput = ({ label, value, lat, lng, onLocationChange, disabled }) => {
  const mapRef = useRef(null);
  const { 
    position, 
    address, 
    loading, 
    error, 
    initMap, 
    getCurrentLocation,
    setAddress 
  } = useMapInput(lat || -8.243, lng || 115.321);

  useEffect(() => {
    if (mapRef.current && !disabled) {
      // Load Google Maps script
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
        script.async = true;
        script.onload = () => {
          initMap(mapRef.current, lat || -8.243, lng || 115.321);
        };
        document.head.appendChild(script);
      } else {
        initMap(mapRef.current, lat || -8.243, lng || 115.321);
      }
    }
  }, [initMap, lat, lng, disabled]);

  useEffect(() => {
    if (position && address) {
      onLocationChange({
        address: address,
        lat: position.lat,
        lng: position.lng
      });
    }
  }, [position, address, onLocationChange]);

  useEffect(() => {
    if (value && value !== address) {
      setAddress(value);
    }
  }, [value, address, setAddress]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} *
      </label>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={value || address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
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
              <MdMyLocation size={20} />
            )}
          </button>
        </div>
        
        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}

        <div 
          ref={mapRef}
          className="w-full h-64 rounded-lg border border-gray-300 bg-gray-100"
        >
          {!window.google && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MdLocationOn size={48} className="mx-auto mb-2 opacity-50" />
                <p>Memuat peta...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          Klik pada peta atau drag marker untuk mengubah lokasi
        </div>
      </div>
    </div>
  );
};

export default MapInput;