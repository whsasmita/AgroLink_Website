import { useState, useCallback } from "react";

// useMapInput Hook
const useMapInput = (initialLat = -8.243, initialLng = 115.321) => {
  const [position, setPosition] = useState({ lat: initialLat, lng: initialLng });
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  // Initialize map
  const initMap = useCallback((mapContainer, lat, lng) => {
    if (!window.google) {
      setError("Google Maps tidak tersedia");
      return;
    }

    const mapInstance = new window.google.maps.Map(mapContainer, {
      center: { lat, lng },
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: false,
    });

    const markerInstance = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstance,
      draggable: true,
    });

    // Event listener untuk drag marker
    markerInstance.addListener("dragend", async (event) => {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      setPosition({ lat: newLat, lng: newLng });
      await reverseGeocode(newLat, newLng);
    });

    // Event listener untuk klik map
    mapInstance.addListener("click", async (event) => {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      markerInstance.setPosition({ lat: newLat, lng: newLng });
      setPosition({ lat: newLat, lng: newLng });
      await reverseGeocode(newLat, newLng);
    });

    setMap(mapInstance);
    setMarker(markerInstance);
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung browser Anda");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = { lat: latitude, lng: longitude };
        
        setPosition(newPos);
        
        if (map && marker) {
          map.setCenter(newPos);
          marker.setPosition(newPos);
        }
        
        await reverseGeocode(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        setError("Gagal mendapatkan lokasi: " + error.message);
        setLoading(false);
      }
    );
  }, [map, marker]);

  // Reverse geocode to get address
  const reverseGeocode = async (lat, lng) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      
      if (response.results[0]) {
        setAddress(response.results[0].formatted_address);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  // Update position manually
  const updatePosition = useCallback((lat, lng) => {
    const newPos = { lat, lng };
    setPosition(newPos);
    
    if (map && marker) {
      map.setCenter(newPos);
      marker.setPosition(newPos);
    }
    
    reverseGeocode(lat, lng);
  }, [map, marker]);

  return {
    position,
    address,
    loading,
    error,
    initMap,
    getCurrentLocation,
    updatePosition,
    setAddress
  };
};

export default useMapInput;