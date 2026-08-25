# 🚀 PANDUAN IMPLEMENTASI FRONTEND AGROLINK: ROLE MITRA & EDIT PROFIL PEMBERI KERJA (FARMER)

    Hai! Kamu bertugas memperbarui dan menambahkan fitur baru di Website Utama AgroLink (Frontend Client, bukan Admin Panel) dengan memanfaatkan template, komponen UI (Form, Modal, Table, Card,

Sidebar Layout), dan styling yang sudah ada di codebase.

    ---

    ## 📌 TUGAS 1: Update Profil "Farmer" (Pemberi Kerja)

    ### 1. Ubah Label Role Farmer
    * Ganti seluruh label teks yang menampilkan role `"farmer"` atau `"Petani"` di antarmuka pengguna (UI, badge role, header, dropdown menu, dll.) menjadi **"Pemberi Kerja"**.
    * *Catatan*: Nilai role di state/API tetap `"farmer"`, hanya teks tampilan (label) yang diubah menjadi **"Pemberi Kerja"**.

    ### 2. Tambah Input `type` pada Halaman Edit Profil Farmer
    * Tambahkan pilihan **Tipe Bidang Usaha** pada form edit profil Farmer.
    * Format UI: Gunakan **Radio Button** atau **Select Box** dengan 3 opsi:
      1. `agriculture` → **Pertanian (Tanaman Pangan / Hortikultura / Perkebunan)**
      2. `livestock` → **Peternakan (Unggas / Ruminansia / Hewan Ternak)**
      3. `construction` → **Konstruksi / Pertukangan Pertanian**

    #### 📡 Endpoint API:
    * **Method & URL**: `POST /api/v1/profile/details`
    * **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`
    * **Request Body**:
    ```json
    {
      "details": {
        "type": "agriculture",
        "address": "Jl. Raya Bedugul No. 12, Tabanan",
        "additional_info": "Lahan pertanian sayur & buah organik"
      }
    }


• Contoh Response (200 OK):

    {
      "status": "success",
      "message": "Role details updated successfully",
      "data": {
        "id": "f74320eb-2fe1-4dff-ac49-32e9d26ea589",
        "name": "I Wayan Suweca",
        "email": "i.diksa3@gmail.com",
        "role": "farmer",
        "farmer": {
          "user_id": "f74320eb-2fe1-4dff-ac49-32e9d26ea589",
          "type": "agriculture",
          "address": "Jl. Raya Bedugul No. 12, Tabanan",
          "additional_info": "Lahan pertanian sayur & buah organik"
        }
      }
    }

──────

## 📌 TUGAS 2: Fitur Baru Role "Mitra" (Mitra Bisnis / B2B)

Role "mitra" adalah entitas bisnis (perusahaan, organisasi, atau individu) yang bekerja sama secara B2B dengan Pemberi Kerja (Petani).

### 1. Izin Akses Protected Route (Route Guards)

Tambahkan role "mitra" ke dalam guard rute terproteksi berikut:

• /mitra/profile (Edit / Kelola Profil Mitra Bisnis)  
 • /mitra/cooperations (Kelola Pengajuan & Penawaran Kerja Sama B2B)  
 • /mitra/contracts (Daftar & Unduh Kontrak Kerja Sama)  
 • /ai/chat (Chatbot Konsultasi AI AgroLink)  
 • /profile (Pengaturan Akun Dasar & Ganti Foto Profil)  
 ──────

### 2. Sidebar Khusus Role Mitra

Gunakan template sidebar yang sudah ada di codebase (sama persis dengan layout Worker/Farmer), lalu sesuaikan menu navigasinya untuk role Mitra:

1. 🏠 Beranda / Dashboard (/dashboard atau /mitra)
2. 🏢 Profil Usaha Mitra (/mitra/profile)
3. 🤝 Kerja Sama Bisnis (B2B) (/mitra/cooperations)
4. 📄 Kontrak & Dokumen Legal (/mitra/contracts)
5. 🤖 AgroLink AI Assistant (/ai/chat)
6. ⚙️ Pengaturan Akun (/profile)  
   ──────

### 3. Halaman Edit / Kelola Profil Mitra (/mitra/profile)

Gunakan template form yang ada di codebase. Form ini mencakup data identitas bisnis, kontak, legalitas, dan rekening pencairan:

• Jenis Mitra (Selectbox): perusahaan, organisasi, individu  
 • Nama Usaha / Mitra: Text input  
 • Deskripsi Singkat: Textarea  
 • Nomor Telepon Bisnis: Text input  
 • Email Bisnis: Email input  
 • Website: URL input (opsional)  
 • Alamat Lengkap: Textarea  
 • Provinsi & Kota/Kabupaten: Text/Select input  
 • Legalitas (NPWP, NIB, NIK KTP): Text input  
 • Informasi Bank (Nama Bank, Nomor Rekening, Atas Nama Rekening): Text input  
 • Logo Mitra: Image URL / Upload

#### 📡 Endpoint Profil Mitra:

1. Ambil Profil Mitra Saya:  
   • GET /api/v1/mitra/profile/my  
   • Response (200 OK):  



    {
      "status": "success",
      "message": "Mitra profile retrieved",
      "data": {
        "user_id": "01faab38-8f9d-416a-9f7f-6d39397c6adf",
        "jenis_mitra": "perusahaan",
        "nama_mitra": "PT Bali Agro Sejahtera",
        "deskripsi_singkat": "Distributor hasil tani dan rempah Bali ke pasar modern",
        "nomor_telepon_bisnis": "081234567890",
        "email_bisnis": "kontak@baliagrosejahtera.com",
        "website": "https://baliagrosejahtera.com",
        "alamat_lengkap": "Jl. Bypass Ngurah Rai No. 88, Denpasar",
        "provinsi": "Bali",
        "kota_kabupaten": "Kota Denpasar",
        "npwp": "01.234.567.8-901.000",
        "nib": "1234567890123",
        "status_verifikasi": "verified",
        "nama_bank": "BCA",
        "nomor_rekening": "1234567890",
        "atas_nama_rekening": "PT Bali Agro Sejahtera",
        "logo_mitra": "/public/uploads/mitra/logo.jpg",
        "rating_mitra": 4.9,
        "total_transaksi_berhasil": 12
      }
    }


2. Simpan / Update Profil Mitra:  
   • POST /api/v1/mitra/profile  
   • Request Body:  



    {
      "jenis_mitra": "perusahaan",
      "nama_mitra": "PT Bali Agro Sejahtera",
      "deskripsi_singkat": "Distributor hasil tani dan rempah Bali ke pasar modern",
      "nomor_telepon_bisnis": "081234567890",
      "email_bisnis": "kontak@baliagrosejahtera.com",
      "website": "https://baliagrosejahtera.com",
      "alamat_lengkap": "Jl. Bypass Ngurah Rai No. 88, Denpasar",
      "provinsi": "Bali",
      "kota_kabupaten": "Kota Denpasar",
      "npwp": "01.234.567.8-901.000",
      "nib": "1234567890123",
      "nama_bank": "BCA",
      "nomor_rekening": "1234567890",
      "atas_nama_rekening": "PT Bali Agro Sejahtera",
      "logo_mitra": "/public/uploads/mitra/logo.jpg"
    }


──────

### 4. Halaman Kerja Sama B2B (/mitra/cooperations)

Halaman ini menampilkan daftar proposal kerja sama antara Mitra dan Pemberi Kerja (Petani).

#### 📡 Daftar Endpoint Kerja Sama B2B:

1. Mitra Membuat Penawaran ke Petani:  
   • POST /api/v1/cooperations/offer  
   • Request Body:  



    {
      "farmer_id": "f74320eb-2fe1-4dff-ac49-32e9d26ea589",
      "title": "Kerja Sama Pasokan Kopi Arabica Kintamani 500kg",
      "description": "Pengadaan rutin biji kopi arabica mutu grade 1 selama 3 bulan",
      "proposed_amount": 72500000,
      "start_date": "2026-09-01T08:00:00Z",
      "end_date": "2026-11-30T17:00:00Z",
      "notes": "Pengiriman bertahap setiap 2 minggu sekali"
    }


2. Lihat Daftar Kerja Sama Saya:  
   • GET /api/v1/cooperations/my  
   • Response (200 OK):  



    {
      "status": "success",
      "message": "Cooperations retrieved",
      "data": [
        {
          "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          "title": "Kerja Sama Pasokan Kopi Arabica Kintamani 500kg",
          "initiator_type": "mitra",
          "status": "approved",
          "proposed_amount": 72500000,
          "agreed_amount": 72500000,
          "farmer": {
            "user_id": "f74320eb-2fe1-4dff-ac49-32e9d26ea589",
            "name": "I Wayan Suweca",
            "email": "i.diksa3@gmail.com",
            "phone": "08123456789"
          },
          "mitra": {
            "user_id": "01faab38-8f9d-416a-9f7f-6d39397c6adf",
            "name": "PT Bali Agro Sejahtera",
            "email": "kontak@baliagrosejahtera.com"
          },
          "created_at": "2026-08-20T10:00:00Z"
        }
      ]
    }


3. Detail Kerja Sama:  
   • GET /api/v1/cooperations/:id
4. Approve / Setujui Kerja Sama:  
   • POST /api/v1/cooperations/:id/approve  
   • Request Body:  



    {
      "agreed_amount": 72500000,
      "notes": "Disetujui sesuai kesepakatan"
    }


5. Tolak Kerja Sama:  
   • POST /api/v1/cooperations/:id/reject  
   • Request Body:  



    {
      "notes": "Kapasitas panen belum mencukupi"
    }

6. Inisiasi Pembayaran Midtrans (Khusus Mitra):
   • POST /api/v1/cooperations/:id/initiate-payment
   • Response (200 OK): Mengembalikan snap_token Midtrans untuk popup pembayaran Snap.

──────

### 5. Halaman Kontrak Kerja Sama (/mitra/contracts)

1. Ambil Daftar Kontrak:
   • GET /api/v1/contracts/my
2. Unduh PDF Kontrak Resmi:
   • GET /api/v1/contracts/:id/download (Mengunduh file PDF kontrak kerja sama B2B)

──────

### 💡 Catatan Kunci untuk Frontend:

• Komponen & Style: Gunakan kembali komponen form input, card, badge status, modal, dan button yang sudah ada pada modul Worker/Farmer agar konsistensi desain tetap terjaga 100%.  
 • Autentikasi: Semua request wajib menyertakan header Authorization: Bearer <token>.
