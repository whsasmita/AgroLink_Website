import { useState, useEffect } from "react";
import {
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  FileCheck,
  CreditCard,
  CheckCircle2,
  Clock,
  Star,
  TrendingUp,
  Save,
  RotateCcw,
  Image as ImageIcon,
} from "lucide-react";
import { getMitraProfile, updateMitraProfile } from "../../../services/mitraService";

const MitraProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    jenis_mitra: "perusahaan",
    nama_mitra: "",
    deskripsi_singkat: "",
    nomor_telepon_bisnis: "",
    email_bisnis: "",
    website: "",
    alamat_lengkap: "",
    provinsi: "",
    kota_kabupaten: "",
    npwp: "",
    nib: "",
    nama_bank: "",
    nomor_rekening: "",
    atas_nama_rekening: "",
    logo_mitra: "",
  });

  const [stats, setStats] = useState({
    status_verifikasi: "pending",
    rating_mitra: 0,
    total_transaksi_berhasil: 0,
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMitraProfile();
      if (response && response.data) {
        const data = response.data;
        setFormData({
          jenis_mitra: data.jenis_mitra || "perusahaan",
          nama_mitra: data.nama_mitra || "",
          deskripsi_singkat: data.deskripsi_singkat || "",
          nomor_telepon_bisnis: data.nomor_telepon_bisnis || "",
          email_bisnis: data.email_bisnis || "",
          website: data.website || "",
          alamat_lengkap: data.alamat_lengkap || "",
          provinsi: data.provinsi || "",
          kota_kabupaten: data.kota_kabupaten || "",
          npwp: data.npwp || "",
          nib: data.nib || "",
          nama_bank: data.nama_bank || "",
          nomor_rekening: data.nomor_rekening || "",
          atas_nama_rekening: data.atas_nama_rekening || "",
          logo_mitra: data.logo_mitra || "",
        });

        setStats({
          status_verifikasi: data.status_verifikasi || "pending",
          rating_mitra: data.rating_mitra || 0,
          total_transaksi_berhasil: data.total_transaksi_berhasil || 0,
        });
      }
    } catch (err) {
      console.error("Error loading mitra profile:", err);
      setError(err.message || "Gagal memuat profil mitra.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nama_mitra.trim()) {
      setError("Nama usaha / mitra wajib diisi.");
      return;
    }
    if (!formData.nomor_telepon_bisnis.trim()) {
      setError("Nomor telepon bisnis wajib diisi.");
      return;
    }
    if (!formData.email_bisnis.trim()) {
      setError("Email bisnis wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      await updateMitraProfile(formData);
      setSuccess("Profil usaha mitra berhasil disimpan dan diperbarui!");
      // Refetch to sync state
      await fetchProfile();
    } catch (err) {
      console.error("Error saving mitra profile:", err);
      setError(err.message || "Gagal menyimpan data profil mitra.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-28 bg-gray-200 rounded-xl"></div>
            <div className="h-28 bg-gray-200 rounded-xl"></div>
            <div className="h-28 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-main">
            Profil Usaha Mitra (B2B)
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-1">
            Kelola identitas bisnis, kontak legalitas, dan informasi rekening pencairan kemitraan.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchProfile}
          className="flex items-center gap-2 px-4 py-2 text-main border border-main rounded-xl hover:bg-main hover:text-white transition-colors"
        >
          <RotateCcw size={16} />
          Refresh
        </button>
      </div>

      {/* Stats / Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Verification Status */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div
            className={`p-3.5 rounded-xl flex items-center justify-center ${
              stats.status_verifikasi === "verified"
                ? "bg-green-100 text-green-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            {stats.status_verifikasi === "verified" ? (
              <CheckCircle2 size={28} />
            ) : (
              <Clock size={28} />
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Status Verifikasi</p>
            <p className="text-lg font-bold text-gray-800 capitalize">
              {stats.status_verifikasi === "verified" ? "Terverifikasi" : "Menunggu Verifikasi"}
            </p>
            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full mt-1 ${
                stats.status_verifikasi === "verified"
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {stats.status_verifikasi === "verified" ? "Akun B2B Resmi" : "Proses Tinjauan"}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
            <Star size={28} className="fill-yellow-500 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Rating Mitra</p>
            <p className="text-lg font-bold text-gray-800">
              {stats.rating_mitra ? `${stats.rating_mitra} / 5.0` : "Belum Ada Ulasan"}
            </p>
            <span className="text-xs text-gray-400">Reputasi Kemitraan</span>
          </div>
        </div>

        {/* Successful Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Transaksi Berhasil</p>
            <p className="text-lg font-bold text-gray-800">
              {stats.total_transaksi_berhasil} Kerjasama
            </p>
            <span className="text-xs text-blue-600 font-medium">Mitra Aktif AgroLink</span>
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-sm text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-main rounded-r-xl shadow-sm text-green-800 text-sm">
          {success}
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Identitas Usaha */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Building2 className="text-main" size={22} />
            <h2 className="text-lg font-bold text-gray-800">Identitas Entitas Mitra</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Jenis Mitra */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jenis Mitra <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    value: "perusahaan",
                    title: "Perusahaan (PT/CV)",
                    desc: "Entitas badan hukum berbadan usaha resmi",
                  },
                  {
                    value: "organisasi",
                    title: "Organisasi / Koperasi",
                    desc: "Yayasan, paguyuban, atau koperasi tani",
                  },
                  {
                    value: "individu",
                    title: "Individu / Perorangan",
                    desc: "Pemberi modal atau distributor perorangan",
                  },
                ].map((item) => (
                  <label
                    key={item.value}
                    className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                      formData.jenis_mitra === item.value
                        ? "border-main bg-green-50 ring-2 ring-main/20 text-main"
                        : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{item.title}</span>
                      <input
                        type="radio"
                        name="jenis_mitra"
                        value={item.value}
                        checked={formData.jenis_mitra === item.value}
                        onChange={handleChange}
                        className="text-main focus:ring-main"
                      />
                    </div>
                    <span className="text-xs text-gray-500">{item.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nama Mitra */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Usaha / Mitra <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_mitra"
                value={formData.nama_mitra}
                onChange={handleChange}
                placeholder="Contoh: PT Bali Agro Sejahtera"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                required
              />
            </div>

            {/* Logo Mitra URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Logo Mitra (URL / Path Gambar)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="logo_mitra"
                  value={formData.logo_mitra}
                  onChange={handleChange}
                  placeholder="Contoh: /uploads/mitra/logo.png atau URL gambar"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                />
                {formData.logo_mitra && (
                  <div className="w-12 h-12 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                    <img
                      src={formData.logo_mitra}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Deskripsi Singkat */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi Singkat Usaha
              </label>
              <textarea
                name="deskripsi_singkat"
                value={formData.deskripsi_singkat}
                onChange={handleChange}
                rows={3}
                placeholder="Jelaskan fokus bidang usaha, komoditas, atau layanan yang disediakan mitra..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Kontak & Lokasi Bisnis */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Phone className="text-main" size={22} />
            <h2 className="text-lg font-bold text-gray-800">Kontak & Alamat Operasional</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Nomor Telepon Bisnis */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Telepon Bisnis <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="nomor_telepon_bisnis"
                  value={formData.nomor_telepon_bisnis}
                  onChange={handleChange}
                  placeholder="081234567890"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                  required
                />
              </div>
            </div>

            {/* Email Bisnis */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Bisnis <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email_bisnis"
                  value={formData.email_bisnis}
                  onChange={handleChange}
                  placeholder="kontak@perusahaan.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                  required
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website Resmi (Opsional)
              </label>
              <div className="relative">
                <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://perusahaan.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Provinsi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Provinsi
              </label>
              <input
                type="text"
                name="provinsi"
                value={formData.provinsi}
                onChange={handleChange}
                placeholder="Contoh: Bali"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
              />
            </div>

            {/* Kota / Kabupaten */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kota / Kabupaten
              </label>
              <input
                type="text"
                name="kota_kabupaten"
                value={formData.kota_kabupaten}
                onChange={handleChange}
                placeholder="Contoh: Kota Denpasar"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
              />
            </div>

            {/* Alamat Lengkap */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat Kantor / Operasional Lengkap
              </label>
              <textarea
                name="alamat_lengkap"
                value={formData.alamat_lengkap}
                onChange={handleChange}
                rows={2}
                placeholder="Jl. Bypass Ngurah Rai No. 88, Denpasar, Bali"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Legalitas Usaha */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <FileCheck className="text-main" size={22} />
            <h2 className="text-lg font-bold text-gray-800">Legalitas & Dokumen Usaha</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* NPWP */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Pokok Wajib Pajak (NPWP)
              </label>
              <input
                type="text"
                name="npwp"
                value={formData.npwp}
                onChange={handleChange}
                placeholder="01.234.567.8-901.000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm font-mono"
              />
            </div>

            {/* NIB */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Induk Berusaha (NIB)
              </label>
              <input
                type="text"
                name="nib"
                value={formData.nib}
                onChange={handleChange}
                placeholder="1234567890123"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Rekening Bank */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <CreditCard className="text-main" size={22} />
            <h2 className="text-lg font-bold text-gray-800">Informasi Rekening Bank Mitra</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Nama Bank */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Bank
              </label>
              <input
                type="text"
                name="nama_bank"
                value={formData.nama_bank}
                onChange={handleChange}
                placeholder="Contoh: BCA / Mandiri / BRI"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm uppercase"
              />
            </div>

            {/* Nomor Rekening */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Rekening
              </label>
              <input
                type="text"
                name="nomor_rekening"
                value={formData.nomor_rekening}
                onChange={handleChange}
                placeholder="Contoh: 1234567890"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm font-mono"
              />
            </div>

            {/* Atas Nama Rekening */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Atas Nama Rekening
              </label>
              <input
                type="text"
                name="atas_nama_rekening"
                value={formData.atas_nama_rekening}
                onChange={handleChange}
                placeholder="Contoh: PT Bali Agro Sejahtera"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-8 py-3.5 font-semibold text-white bg-main hover:bg-green-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan Perubahan...
              </>
            ) : (
              <>
                <Save size={18} />
                Simpan Profil Mitra
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MitraProfilePage;
