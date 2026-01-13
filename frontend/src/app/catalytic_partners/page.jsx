"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";

/* -------- DYNAMIC LEAFLET IMPORTS -------- */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

/* -------- DISTANCE FUNCTION -------- */
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function BloodDonorMap() {
  const router = useRouter();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  /* -------- FETCH DONORS AND CURRENT USER -------- */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

    fetch("http://127.0.0.1:8000/accounts/blood-donors/")
      .then((res) => res.json())
      .then((data) => {
        setDonors(data);

        const currentBackendUser = data.find(
          (d) => d.username === parsedUser.username
        );

        if (currentBackendUser) {
          setCurrentLocation({
            latitude: currentBackendUser.latitude,
            longitude: currentBackendUser.longitude,
          });
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* -------- LEAFLET ICON FIX -------- */
  useEffect(() => {
    import("leaflet").then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);

  /* -------- LOGOUT -------- */
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/global_posts";
  };

  /* -------- USER COORDINATES -------- */
  const userLat = currentLocation?.latitude || 26.8129;
  const userLng = currentLocation?.longitude || 87.2840;

  /* -------- DONORS WITH DISTANCE -------- */
  const donorsWithDistance = donors.map((d) => ({
    ...d,
    distance: getDistanceKm(userLat, userLng, d.latitude, d.longitude),
  }));

  const nearestDonors = [...donorsWithDistance]
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10); // top 10 nearest donors

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading donors...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-green-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Sidebar */}
      <div className="w-96 bg-white/95 backdrop-blur-md shadow-2xl overflow-y-auto border-r-4 border-green-300 p-6 relative z-10">
        {/* Logo + Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-green-900">Catalytic Partners</h1>
          <button
            onClick={() => window.history.back()}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
          >
            Back
          </button>
        </div>

        {/* User Greeting */}
        {user && (
          <div className="mb-6">
            <span className="text-green-800 font-semibold">Hi, {user.username}</span>
          </div>
        )}

        {/* Nearest Donors */}
        <div>
          <h3 className="text-xl font-bold text-green-700 mb-3">
            Nearest Partners
          </h3>
          {nearestDonors.length === 0 ? (
            <p className="text-gray-600">No partners found nearby.</p>
          ) : (
            nearestDonors.map((d) => (
              <div
                key={d.id}
                className="bg-green-50 border-2 border-green-200 rounded-xl p-3 mb-3 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-green-800">{d.username}</span>
                  {d.blood_group && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {d.blood_group}
                    </span>
                  )}
                </div>
                <div className="text-sm text-green-900">
                  <p>City: {d.city}</p>
                  <p>Distance: {d.distance.toFixed(1)} km</p>
                  {d.phone && <p>📞 {d.phone}</p>}
                </div>
                <button
  onClick={() => window.open("/chat-video", "_blank", "noopener,noreferrer")}
  className="mt-2 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium"
>
  Chat
</button>

              </div>
            ))
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative z-10">
        <MapContainer
          center={[userLat, userLng]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {donors.map((donor) => (
            <Marker
              key={donor.id}
              position={[donor.latitude, donor.longitude]}
            >
              <Popup>
                <div>
                  <h4 className="font-bold text-green-700">{donor.username}</h4>
                  <p>City: {donor.city}</p>
                  <p>Blood Group: {donor.blood_group || "N/A"}</p>
                  <p>Age: {donor.age ?? "N/A"}</p>
                  <p>Gender: {donor.gender || "N/A"}</p>
                  <p>📞 {donor.phone || "N/A"}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px,0px) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}