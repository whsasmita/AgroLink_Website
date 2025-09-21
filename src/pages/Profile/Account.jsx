import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { getProfile } from "../../services/profileService";

// Skeleton Components
const SkeletonLine = ({ width = "w-full", height = "h-4" }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${width} ${height}`}></div>
);

const SkeletonDetailItem = ({ labelWidth = "w-16", valueWidth = "w-32" }) => (
  <div className="flex items-center">
    <SkeletonLine width={labelWidth} height="h-4" />
    <span className="ml-2 text-gray-700">:</span>
    <div className="ml-2">
      <SkeletonLine width={valueWidth} height="h-4" />
    </div>
  </div>
);

const SkeletonPasswordItem = () => (
  <div className="flex items-center">
    <SkeletonLine width="w-16" height="h-4" />
    <span className="ml-2 text-gray-700">:</span>
    <div className="ml-2">
      <SkeletonLine width="w-20" height="h-4" />
    </div>
    <div className="ml-3">
      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

const AccountSkeleton = () => (
  <>
    <div className="max-w-xl">
      {/* Page Title Skeleton */}
      <SkeletonLine width="w-36" height="h-8" />
      
      {/* Content Skeleton */}
      <div className="space-y-6 mt-6">
        {/* Email Field Skeleton */}
        <SkeletonDetailItem labelWidth="w-10" valueWidth="w-48" />
        
        {/* Password Field Skeleton */}
        <SkeletonPasswordItem />
        
        {/* Last Updated Field Skeleton */}
        <SkeletonDetailItem labelWidth="w-32" valueWidth="w-24" />
      </div>
    </div>
  </>
);

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
    return <AccountSkeleton />;
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