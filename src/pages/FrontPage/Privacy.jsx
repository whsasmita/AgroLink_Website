const PrivacyPage = () => {
  const sections = [
    {
      title: "Data yang Kami Kumpulkan",
      items: [
        "Informasi akun seperti nama, email, nomor telepon, dan peran (petani, pekerja, ekspedisi, driver, atau pengguna umum).",
        "Detail transaksi dan aktivitas di platform termasuk pesanan, pembayaran, penawaran, dan riwayat percakapan.",
        "Data lokasi yang dibagikan saat mencari driver terdekat atau pengiriman ekspedisi.",
        "Data perangkat dan log penggunaan untuk menjaga keamanan akun serta meningkatkan performa layanan.",
      ],
    },
    {
      title: "Cara Kami Menggunakan Data",
      items: [
        "Memproses pendaftaran, login, dan autentikasi peran pengguna.",
        "Menjalankan fitur inti seperti pengelolaan proyek, perekrutan pekerja, pengiriman ekspedisi, pemesanan produk, dan pembayaran.",
        "Mengirim pemberitahuan terkait status pesanan, penawaran, kontrak, atau perubahan kebijakan.",
        "Mendeteksi dan mencegah penyalahgunaan, penipuan, serta menjaga keselamatan transaksi.",
      ],
    },
    {
      title: "Berbagi Data",
      items: [
        "Kami hanya membagikan data yang relevan dengan mitra logistik, penyedia pembayaran, atau pihak ketiga pendukung operasional untuk menyelesaikan layanan.",
        "Kami tidak menjual data pribadi kepada pihak lain.",
        "Pembagian data mengikuti peraturan yang berlaku dan dilindungi dengan perjanjian kerahasiaan yang sesuai.",
      ],
    },
    {
      title: "Hak Anda",
      items: [
        "Memperbarui profil, kata sandi, dan preferensi notifikasi kapan saja.",
        "Meminta penghapusan akun sesuai ketentuan hukum yang berlaku.",
        "Menghubungi kami jika menemukan aktivitas mencurigakan atau membutuhkan klarifikasi terkait kebijakan privasi.",
      ],
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto bg-white shadow-sm rounded-2xl border border-gray-100 p-8 space-y-10">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-green-600">Kebijakan Privasi</p>
          <h1 className="text-3xl md:text-4xl font-bold text-main_text">Melindungi data dan transaksi Anda di Agrolink</h1>
          <p className="text-gray-600 max-w-3xl">
            Kebijakan ini menjelaskan bagaimana Agrolink mengumpulkan, menggunakan, dan menjaga
            informasi pribadi Anda saat menggunakan fitur pertanian, ekspedisi, perekrutan pekerja,
            dan transaksi e-commerce di platform kami.
          </p>
          <p className="text-xs text-gray-500">Terakhir diperbarui: 5 Januari 2026</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <section key={section.title} className="bg-gray-50 rounded-xl border border-gray-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <h2 className="text-lg font-semibold text-main_text mb-3">{section.title}</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="bg-main/5 border border-main/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-main_text mb-2">Pertanyaan atau permintaan penghapusan akun</h3>
          <p className="text-gray-700 leading-relaxed">
            Jika Anda memiliki pertanyaan, ingin memperbarui informasi, atau meminta penghapusan data,
            hubungi tim Agrolink melalui WhatsApp di <a className="text-green-700 font-semibold" href="https://wa.me/6282147389276" target="_blank" rel="noreferrer">+62 821 4738 9276</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
