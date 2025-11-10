import { useEffect, useState } from "react";
import { editInformationDetail } from "../../services/profileService";

const DashboardPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [user,setUser] = useState(null);

const safeJsonParse = (jsonString, fallback = null) => {
  if (!jsonString || jsonString === "null") return fallback; // Menangani null atau string "null"
  if (typeof jsonString === "object") return jsonString; // Jika sudah objek/array
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn("Gagal parse JSON:", jsonString);
    return fallback;
  }
};

  useEffect(() => {
    const userstring = localStorage.getItem("user");
    if (userstring) {
      const parsedUser = JSON.parse(userstring);
      setUser(parsedUser);
      console.log("User Role:", parsedUser.role);

      if (parsedUser.role === "driver") {
        setTimeout(() => {
          setShowPopup(true);
        }, 1000);
      }
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung fitur geolocation.");
      return;
    }

    setIsUpdating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Lokasi saat ini:", latitude, longitude);

        setLocation({ lat: latitude, lng: longitude });

        let detailsToSend; 

        try {
          const existingDetails = user.driver || {};

          detailsToSend = { ...existingDetails }; 

          delete detailsToSend.CurrentLat;
          delete detailsToSend.CurrentLng;

          detailsToSend.current_lat = latitude;
          detailsToSend.current_lng = longitude;
          
          detailsToSend.pricing_scheme = safeJsonParse(detailsToSend.pricing_scheme, null);
        
          detailsToSend.vehicle_types = safeJsonParse(detailsToSend.vehicle_types, null);
          
          if (detailsToSend.company_address === "null") {
            detailsToSend.company_address = null;
          }

          delete detailsToSend.user_id;
          delete detailsToSend.rating;
          delete detailsToSend.review_count;
          delete detailsToSend.total_deliveries;
          delete detailsToSend.created_at;
          delete detailsToSend.distance;
          delete detailsToSend.Deliveries;
          delete detailsToSend.DriverRoutes;
          delete detailsToSend.user;
          delete detailsToSend.ProjectApplications;
          delete detailsToSend.ProjectAssignments;
          delete detailsToSend.WorkerAvailability;
          
          const result = await editInformationDetail(detailsToSend, user.role);
          
          localStorage.setItem('user', JSON.stringify(result.data));
          setUser(result.data);

          setShowPopup(false);
          alert("Lokasi berhasil diperbarui!");

        } catch (apiError) {
          console.error("Gagal memperbarui lokasi via API:", apiError);
          console.error("Data yang dikirim:", detailsToSend); 
          alert(`Gagal memperbarui lokasi: ${apiError.message}`);
        } finally {
          setIsUpdating(false);
        }
      },
      (error) => {
        console.error("Gagal mendapatkan lokasi:", error);
        setIsUpdating(false);
        alert("Tidak dapat mengambil lokasi. Pastikan izin lokasi diaktifkan.");
      }
    );
  };

  return (
    <div className="p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl text-main">
            Dashboard
          </h1>
          <p className="text-sm text-main_text sm:text-base">
            Lihat rangkuman akun Anda
          </p>
        </div>
        { user && user.role === "driver" && (
          <button
            onClick={() => setShowPopup(true)}
            className="px-5 py-2 text-white transition-colors bg-main rounded-xl hover:bg-green-600"
          >
            Perbarui Lokasi
          </button>
        )}
      </div>
      {/* Popup Update Lokasi */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity bg-black bg-opacity-40">
          <div className="w-11/12 p-6 bg-white shadow-xl rounded-2xl sm:w-96">
            <h2 className="mb-3 text-xl font-bold text-center text-main">
              Perbarui Lokasi Anda
            </h2>
            <p className="mb-5 text-center text-gray-600">
              Kami memerlukan lokasi Anda untuk meningkatkan pengalaman
              pengguna.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleUpdateLocation}
                disabled={isUpdating}
                className="flex-1 bg-main text-secondary_text font-semibold py-2.5 rounded-xl hover:bg-green-600 transition-all duration-200 disabled:bg-gray-400"
              >
                {isUpdating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                    Memperbarui...
                  </div>
                ) : (
                  "Perbarui Sekarang"
                )}
              </button>
              <button
                onClick={handleClosePopup}
                disabled={isUpdating}
                className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl hover:bg-gray-300 transition-all duration-200"
              >
                Nanti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
