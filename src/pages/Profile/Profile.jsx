import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { getProfile, editProfile } from "../../services/profileService";
import Loading from "../../components/fragments/loading/Index";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch (err) {
        setError("Gagal mengambil data profil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const fileInputRef = useState(null);

  const handleEditPhoto = () => {
    if (fileInputRef[0]) {
      fileInputRef[0].click();
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("profile_picture", file);
        await editProfile(formData);
        const res = await getProfile();
        setProfile(res.data);
      } catch (err) {
        setError("Gagal upload foto profil.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg shadow-md">
          <span className="text-red-700 font-medium text-lg">{error}</span>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <h2 className="text-2xl font-bold text-main mb-6">Biodata</h2>
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <img
              src={profile.profile_picture}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-2 border-main"
            />
            <button
              onClick={handleEditPhoto}
              className="absolute bottom-0 right-0 bg-main hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
            >
              <MdEdit size={16} />
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={el => (fileInputRef[1] && fileInputRef[1](el))}
              onChange={handlePhotoChange}
            />
          </div>
          
          <h2 className="text-3xl font-bold text-main mb-2">{profile.name}</h2>
          
          <div className="flex items-center gap-3 mb-1">
            <span className="text-lg text-gray-600">
              {profile.role === "farmer"
                ? "Petani"
                : profile.role === "worker"
                ? "Pekerja"
                : "Ekspedisi"}
            </span>
            <span className={profile.is_active ? "text-main" : "text-main__text"}>•</span>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                profile.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {profile.is_active ? "Aktif" : "Tidak Aktif"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="ml-2 text-gray-900">{profile.email}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">No. HP:</span>
            <span className="ml-2 text-gray-900">{profile.phone_number}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Dibuat:</span>
            <span className="ml-2 text-gray-900">
              {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">
              Terakhir Update:
            </span>
            <span className="ml-2 text-gray-900">
              {new Date(profile.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          onClick={() => navigate("/profile/biodata/edit")}
        >
          Edit Profil
        </button>
      </div>
    </>
  );
};

export default ProfilePage;