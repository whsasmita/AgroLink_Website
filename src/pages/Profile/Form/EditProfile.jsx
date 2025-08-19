import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdEdit, MdSave } from "react-icons/md";
import { getProfile, editProfile } from "../../../services/profileService";
import Loading from "../../../components/fragments/loading/Index";

const EditProfileForm = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    profile_picture: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getProfile();
        const profileData = res.data;
        setProfile(profileData);
        setFormData({
          name: profileData.name || "",
          phone_number: profileData.phone_number || "",
          profile_picture: profileData.profile_picture || ""
        });
      } catch (err) {
        setError("Gagal mengambil data profil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    if (!formData.phone_number.trim()) {
      setError("Nomor HP tidak boleh kosong.");
      return;
    }
    if (!formData.profile_picture.trim()) {
      setError("URL foto profil tidak boleh kosong.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await editProfile(formData);
      setSuccess("Profil berhasil diperbarui!");
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Gagal memuat data profil</p>
          <button 
            onClick={() => navigate('/profile')}
            className="text-blue-500 hover:text-blue-700"
          >
            Kembali ke Profil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MdArrowBack size={24} />
        </button>
        <h2 className="text-2xl font-bold text-main">Edit Profil</h2>
      </div>

      {/* Messages */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Preview */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <img
              src={formData.profile_picture || '/placeholder-avatar.png'}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full border-4 border-main"
              onError={(e) => {
                e.target.src = '/placeholder-avatar.png';
              }}
            />
            <div className="absolute bottom-0 right-0 bg-main text-white p-2 rounded-full">
              <MdEdit size={16} />
            </div>
          </div>
          <p className="text-sm text-gray-600">Preview foto profil</p>
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
            placeholder="Masukkan nama lengkap"
            disabled={saving}
          />
        </div>

        {/* Phone Number Field */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
            Nomor HP *
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
            placeholder="Masukkan nomor HP"
            disabled={saving}
          />
        </div>

        {/* Profile Picture URL Field */}
        <div>
          <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700 mb-2">
            URL Foto Profil *
          </label>
          <input
            type="url"
            id="profile_picture"
            name="profile_picture"
            value={formData.profile_picture}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
            placeholder="https://example.com/profile-picture.jpg"
            disabled={saving}
          />
          <p className="mt-1 text-sm text-gray-500">
            Masukkan URL gambar yang valid (jpg, png, gif)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
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
                <MdSave size={20} />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;