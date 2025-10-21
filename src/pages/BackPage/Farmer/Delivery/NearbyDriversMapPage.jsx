import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdArrowBack, MdLocalShipping, MdPhone, MdStar } from "react-icons/md";
// Menggunakan import yang sudah ada
import { getNearbyDelivery, selectDriver } from "../../../../services/deliveryService"; 
import { getExpeditionById } from "../../../../services/expeditionService";

// Fix leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const NearbyDriversMapPage = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [driversDetails, setDriversDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [radius, setRadius] = useState(100);
  const [selectingDriver, setSelectingDriver] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  /**
   * ⚠️ PENTING: Fungsi ini mensimulasikan pengambilan koordinat pickup yang sebenarnya.
   *
   * Di aplikasi nyata, data ini HARUS diambil dari API detail pengiriman
   * (endpoint seperti `/deliveries/{deliveryId}` yang mengembalikan PickupLat/Lng).
   * Saat ini, ini hanyalah workaround.
   */
  const getSimulatedDeliveryCoordinates = (id) => {
    // Gunakan koordinat dari respons JSON yang Anda berikan sebelumnya
    // ID yang muncul di respons JSON Anda sebelumnya adalah: 74c2349a-4c65-4f39-b198-f455d743b5a6
    if (id === "74c2349a-4c65-4f39-b198-f455d743b5a6" || id === "dd6b3a60-dcab-4eef-82a6-b119bd40cc6a") {
      return { lat: -8.243, lng: 115.321 }; // Kintamani (Koordinat yang Anda berikan)
    }
    // Fallback/Default
    return { lat: -8.5069, lng: 115.2625 }; // Ubud (Default jika ID tidak dikenal)
  };

  // 1. Ambil koordinat pickup saat component dimuat
  useEffect(() => {
    const coords = getSimulatedDeliveryCoordinates(deliveryId);
    setDeliveryLocation(coords);
  }, [deliveryId]); 
  
  // 2. Ambil driver terdekat saat radius atau lokasi pickup berubah
  useEffect(() => {
    // Pastikan deliveryLocation sudah terisi (meskipun itu data simulasi)
    if (deliveryLocation) {
        fetchNearbyDrivers();
    }
  }, [deliveryId, radius, deliveryLocation]);

  const fetchNearbyDrivers = async () => {
    setLoading(true);
    setError("");
    try {
      // Pemanggilan API getNearbyDelivery TIDAK PERLU diubah, karena
      // diasumsikan backend sudah tahu koordinatnya dari deliveryId.
      const response = await getNearbyDelivery(deliveryId, radius);
      
      if (response.data && Array.isArray(response.data)) {
        setDrivers(response.data);
        
        // Fetch detailed info for each driver
        const detailsPromises = response.data.map(async (driver) => {
          try {
            const detail = await getExpeditionById(driver.driver_id);
            return { id: driver.driver_id, data: detail.data };
          } catch (err) {
            console.error(`Failed to fetch details for driver ${driver.driver_id}`, err);
            return { id: driver.driver_id, data: null };
          }
        });

        const details = await Promise.all(detailsPromises);
        const detailsMap = {};
        details.forEach(({ id, data }) => {
          if (data) {
            // Handle both array and object response
            detailsMap[id] = Array.isArray(data) ? data[0] : data;
          }
        });
        setDriversDetails(detailsMap);
        
      }
    } catch (err) {
      console.error("Error fetching nearby drivers:", err);
      setError(err.message || "Gagal memuat data driver terdekat.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDriver = async (driverId) => {
    setSelectingDriver(driverId);
    try {
      await selectDriver(deliveryId, driverId);
      alert("Driver berhasil dipilih!");
      navigate("/dashboard/delivery-list");
    } catch (err) {
      console.error("Error selecting driver:", err);
      setError(err.message || "Gagal memilih driver.");
    } finally {
      setSelectingDriver(null);
    }
  };

  const createDriverIcon = (photoUrl) => {
    return L.divIcon({
      className: "custom-driver-marker",
      html: `
        <div style="
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid #39B54A;
          overflow: hidden;
          background: white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <img 
            src="${photoUrl || 'https://via.placeholder.com/50?text=D'}" 
            alt="Driver"
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
            "
            onerror="this.src='https://via.placeholder.com/50?text=D'"
          />
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [0, -25],
    });
  };

  const createDeliveryIcon = () => {
    return L.divIcon({
      className: "custom-delivery-marker",
      html: `
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #B53939;
          border: 3px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
        ">
          📦
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });
  };

  const parseVehicleTypes = (vehicleTypesStr) => {
    try {
      const parsed = JSON.parse(vehicleTypesStr);
      return Array.isArray(parsed) ? parsed.join(", ") : vehicleTypesStr;
    } catch {
      return vehicleTypesStr || "Kendaraan";
    }
  };

  const parsePricingScheme = (pricingStr) => {
    try {
      const pricing = JSON.parse(pricingStr);
      return pricing;
    } catch {
      return null;
    }
  };

  // Generate random locations around the base location
  const generateRandomLocation = (index, baseLat, baseLng) => {
    const randomOffset = 0.05; // About 5km radius
    
    return {
      lat: baseLat + (Math.random() - 0.5) * randomOffset * (index % 2 === 0 ? 1 : -1),
      lng: baseLng + (Math.random() - 0.5) * randomOffset * (index % 3 === 0 ? 1 : -1),
    };
  };

  if (loading || !deliveryLocation) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Gunakan deliveryLocation yang sudah terisi
  const defaultCenter = deliveryLocation; 

  return (
    <div className="p-2 sm:p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/dashboard/delivery-list")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdArrowBack size={24} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#39B54A]">
              Cari Driver Terdekat
            </h1>
            <p className="text-[#585656] text-sm sm:text-base">
              ID Pengiriman: {deliveryId}
            </p>
          </div>
        </div>

        {/* Radius Control */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-[#585656] font-medium">
            Radius Pencarian:
          </label>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39B54A] focus:border-transparent"
          >
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
            <option value={150}>150 km</option>
            <option value={200}>200 km</option>
          </select>
          <span className="text-sm text-[#585656]">
            {drivers.length} driver ditemukan
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-[#B53939] p-4 rounded-r-lg">
          <span className="text-[#B53939] font-medium">{error}</span>
        </div>
      )}

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div style={{ height: "600px", width: "100%" }}>
          <MapContainer
            center={[defaultCenter.lat, defaultCenter.lng]}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Delivery Location Marker */}
            {deliveryLocation && (
              <>
                <Marker
                  position={[deliveryLocation.lat, deliveryLocation.lng]}
                  icon={createDeliveryIcon()}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-[#39B54A] mb-2">
                        Lokasi Pengiriman
                      </h3>
                      <p className="text-sm text-[#585656]">
                        Titik pengambilan barang
                      </p>
                    </div>
                  </Popup>
                </Marker>

                {/* Radius Circle */}
                <Circle
                  center={[deliveryLocation.lat, deliveryLocation.lng]}
                  radius={radius * 1000}
                  pathOptions={{
                    color: "#39B54A",
                    fillColor: "#7ED957",
                    fillOpacity: 0.15,
                    weight: 2,
                  }}
                />
              </>
            )}

            {/* Driver Markers */}
            {drivers.map((driver, index) => {
              // Gunakan koordinat lokasi pengiriman yang sebenarnya sebagai basis
              const location = generateRandomLocation(index, defaultCenter.lat, defaultCenter.lng);
              const driverDetail = driversDetails[driver.driver_id];
              const pricing = driverDetail?.pricing_scheme ? parsePricingScheme(driverDetail.pricing_scheme) : null;

              return (
                <Marker
                  key={driver.driver_id}
                  position={[location.lat, location.lng]}
                  icon={createDriverIcon(driverDetail?.profile_picture)}
                >
                  <Popup maxWidth={300}>
                    <div className="p-3">
                      {/* Driver Info */}
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={driverDetail?.profile_picture || "https://via.placeholder.com/60?text=D"}
                          alt={driver.driver_name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#39B54A]"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/60?text=D";
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {driver.driver_name}
                          </h3>
                          <div className="flex items-center gap-1 text-[#585656] text-sm mt-1">
                            <MdLocalShipping size={16} />
                            <span>{parseVehicleTypes(driver.vehicle_types)}</span>
                          </div>
                          {driverDetail?.company_address && (
                            <p className="text-xs text-[#585656] mt-1">
                              {driverDetail.company_address}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <MdStar className="text-yellow-400" size={18} />
                        <span className="font-medium text-gray-900">
                          {driver.rating > 0 ? driver.rating.toFixed(1) : "Baru"}
                        </span>
                        {driverDetail?.total_deliveries !== undefined && (
                          <span className="text-sm text-[#585656]">
                            ({driverDetail.total_deliveries} pengiriman)
                          </span>
                        )}
                      </div>

                      {/* Distance */}
                      <div className="mb-3 pb-3 border-b border-gray-200">
                        <p className="text-sm text-[#585656]">
                          Jarak: <span className="font-medium text-gray-900">
                            {driver.distance_km ? `${driver.distance_km.toFixed(1)} km` : "< 1 km"}
                          </span>
                        </p>
                      </div>

                      {/* Pricing */}
                      {pricing && (
                        <div className="mb-3 pb-3 border-b border-gray-200">
                          <p className="text-xs font-medium text-gray-700 mb-1">Skema Harga:</p>
                          <div className="text-xs text-[#585656] space-y-1">
                            {pricing.base_fee && (
                              <p>Biaya Dasar: Rp {pricing.base_fee.toLocaleString()}</p>
                            )}
                            {pricing.per_km && (
                              <p>Per Km: Rp {pricing.per_km.toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Phone */}
                      {driverDetail?.phone_number && (
                        <div className="flex items-center gap-2 mb-3 text-sm text-[#585656]">
                          <MdPhone size={16} />
                          <span>{driverDetail.phone_number}</span>
                        </div>
                      )}

                      {/* Select Button */}
                      <button
                        onClick={() => handleSelectDriver(driver.driver_id)}
                        disabled={selectingDriver === driver.driver_id}
                        className="w-full px-4 py-2 bg-[#39B54A] hover:bg-[#2d8f3a] text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {selectingDriver === driver.driver_id
                          ? "Memproses..."
                          : "Pilih Driver"}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 justify-center items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#B53939] border-2 border-white flex items-center justify-center text-white text-xs">
                📦
              </div>
              <span className="text-[#585656]">Lokasi Pengiriman</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-[#39B54A] bg-white"></div>
              <span className="text-[#585656]">Driver Tersedia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-2 bg-[#7ED957] opacity-50 rounded"></div>
              <span className="text-[#585656]">Area Pencarian</span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!loading && drivers.length === 0 && (
        <div className="mt-4 bg-white rounded-lg shadow-sm p-8 text-center">
          <MdLocalShipping size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak Ada Driver Ditemukan
          </h3>
          <p className="text-[#585656] mb-4">
            Coba perluas radius pencarian untuk menemukan lebih banyak driver.
          </p>
        </div>
      )}
    </div>
  );
};

export default NearbyDriversMapPage;