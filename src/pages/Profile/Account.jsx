import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { getProfile } from "../../services/profileService";


// Detail Items Components
const DetailItem = ({ label, children }) => (
  <div className="flex flex-col py-4 border-b border-gray-100 sm:flex-row sm:items-center last:border-b-0">
    <span className="text-sm font-medium text-gray-500 sm:w-1/3">{label}</span>
    <div className="mt-1 font-medium text-gray-800 sm:w-2/3 sm:mt-0">{children}</div>
  </div>
);

// Skeleton Components
const SkeletonLine = ({ width = "w-full", height = "h-4" }) => (
  <div className={`bg-gray-200 rounded-md animate-[pulse_1.8s_cubic-bezier(0.4,_0,_0.6,_1)_infinite] ${width} ${height}`}></div>
);

const SkeletonDetailItem = ({ labelWidth = "w-24", valueWidth = "w-40" }) => (
  <div className="flex flex-col py-4 border-b border-gray-100 sm:flex-row last:border-b-0">
    <div className="sm:w-1/3">
      <SkeletonLine width={labelWidth} height="h-4" />
    </div>
    <div className="mt-2 sm:w-2/3 sm:mt-0">
      <SkeletonLine width={valueWidth} height="h-5" />
    </div>
  </div>
);

// const SkeletonPasswordItem = () => (
//   <div className="flex items-center">
//     <SkeletonLine width="w-16" height="h-4" />
//     <span className="ml-2 text-gray-700">:</span>
//     <div className="ml-2">
//       <SkeletonLine width="w-20" height="h-4" />
//     </div>
//     <div className="ml-3">
//       <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
//     </div>
//   </div>
// );

const AccountSkeleton = () => (
  <div className="container p-4 mx-auto sm:p-6 lg:p-8">
    <SkeletonLine width="w-48" height="h-8" />

    <div className="max-w-2xl p-6 mt-6 bg-white border border-gray-200 shadow-sm sm:p-8 rounded-xl">
      <div className="space-y-2">
        <SkeletonDetailItem labelWidth="w-16" valueWidth="w-48" />
        <SkeletonDetailItem labelWidth="w-20" valueWidth="w-32" />
        <SkeletonDetailItem labelWidth="w-32" valueWidth="w-40" />
      </div>
    </div>
  </div>
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

  // Date Format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  };

  if (loading) {
    return <AccountSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md p-6 text-center border-l-4 border-red-500 rounded-r-lg shadow-md bg-red-50">
          <h3 className="mb-2 text-lg font-bold text-red-800">Terjadi Kesalahan</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <title>Akun Pengguna - Agro Link</title>
      <meta name="description" content="Halaman akun pengguna di Agro Link" />

      {/* <div className="max-w-xl">
        <h2 className="mb-6 text-2xl font-bold text-main">Informasi Akun</h2>
        <div className="space-y-6">
          <div>
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="ml-2 text-gray-900">{profile.email}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-gray-700">Password:</span>
            <span className="ml-2 tracking-widest text-gray-900">
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
      </div> */}

      <div className="container p-4 mx-auto sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">Informasi Akun</h2>

        <div className="max-w-2xl p-6 mt-6 bg-white border border-gray-200 shadow-sm sm:p-8 rounded-xl">
          
          <DetailItem label="Email">
            {profile.email}
          </DetailItem>
          
          <DetailItem label="Password">
            <div className="flex items-center justify-between">
              <span className="text-lg tracking-widest">{"•".repeat(8)}</span>
              {/* UPDATE: Tombol edit yang lebih jelas dan interaktif */}
              <button
                className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-green-50"
                title="Ubah Password"
              >
                <MdEdit size={16} />
                Ubah
              </button>
            </div>
          </DetailItem>
          
          <DetailItem label="Terakhir Diperbarui">
            {formatDate(profile.updated_at)}
          </DetailItem>

        </div>
      </div>
    </>
  );
};

export default AccountPage;