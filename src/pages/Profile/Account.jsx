import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import Loading from "../../components/fragments/loading/Index";
import { getProfile } from "../../services/profileService";

const AccountPage = () => {
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
        setError("Gagal mengambil data akun.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
      <title>Akun Pengguna - Agro Link</title>
      <meta name="description" content="Halaman akun pengguna di Agro Link" />

      <div className="max-w-xl">
        <h2 className="text-2xl font-bold text-main mb-6">Informasi Akun</h2>
        <div className="space-y-6">
          <div>
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="ml-2 text-gray-900">{profile.email}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-gray-700">Password:</span>
            <span className="ml-2 text-gray-900 tracking-widest">
              {"*".repeat(8)}
            </span>
            <button
              className="ml-3 text-main hover:text-green-600"
              title="Edit Password"
            >
              <MdEdit size={22} />
            </button>
          </div>
          <div>
            <span className="font-semibold text-gray-700">
              Terakhir Diperbarui:
            </span>
            <span className="ml-2 text-gray-900">
              {new Date(profile.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
