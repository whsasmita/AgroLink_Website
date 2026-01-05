# AgroLink Web - Use Case Scenarios

## 📋 Ringkasan Sistem
AgroLink adalah platform digital yang menghubungkan petani (Farmer), pekerja (Worker), dan pengemudi (Driver) untuk memfasilitasi penjualan produk pertanian, manajemen proyek, dan layanan pengiriman.

---

## 🎭 Aktor Utama (Actors)

### 1. **Farmer (Petani)**
- Menjual produk pertanian
- Membuat dan mengelola proyek
- Merekrut pekerja
- Menerima pengiriman
- Melihat laporan pembayaran

### 2. **Worker (Pekerja)**
- Mencari pekerjaan
- Mengajukan aplikasi pekerjaan
- Menerima kontrak pekerjaan
- Menyelesaikan pekerjaan

### 3. **Driver (Pengemudi)**
- Menerima pesanan pengiriman
- Mengelola pengiriman
- Melihat lokasi petani di peta
- Melacak status pengiriman

### 4. **General User (Pengguna Umum)**
- Membeli produk pertanian
- Melihat katalog produk
- Mengajukan pesanan

### 5. **System (Admin)**
- Mengelola user
- Melihat laporan sistem

---

## 📌 Use Case Utama

### **A. Authentication & Authorization**

#### UC-1: Registrasi User
**Actor:** Guest/Calon User
**Preconditions:** User belum memiliki akun
**Flow:**
1. User mengakses halaman Register
2. User memilih role (Farmer, Worker, Driver, General)
3. User mengisi form: email, password, nama lengkap
4. System validasi email unique
5. System membuat akun dengan role terpilih
6. User diarahkan ke halaman login
**Postconditions:** Akun berhasil dibuat

#### UC-2: Login
**Actor:** Registered User
**Preconditions:** User telah terdaftar
**Flow:**
1. User membuka halaman Login
2. User memasukkan email & password
3. System verifikasi kredensial
4. System menyimpan token di localStorage
5. User diarahkan ke dashboard sesuai role
**Postconditions:** User authenticated

#### UC-3: Role Selection
**Actor:** New User
**Preconditions:** User baru selesai registrasi
**Flow:**
1. System menampilkan pilihan role jika belum dipilih
2. User memilih role (Farmer/Worker/Driver/General)
3. System menyimpan role preference
4. User diarahkan ke onboarding/profile completion
**Postconditions:** Role ditetapkan

---

### **B. Product Management (E-Commerce)**

#### UC-4: Farmer Membuat Produk Baru
**Actor:** Farmer
**Preconditions:** Farmer sudah login
**Flow:**
1. Farmer membuka menu "Produk Saya"
2. Farmer klik "Tambah Produk Baru"
3. Farmer mengisi form: nama, deskripsi, harga, kategori, foto
4. Farmer upload gambar produk
5. System validasi data
6. Farmer submit
7. Produk tersimpan dengan status "Active"
8. Produk muncul di katalog publik
**Postconditions:** Produk tersedia untuk dibeli

#### UC-5: General User Melihat Daftar Produk
**Actor:** General User
**Preconditions:** User berada di halaman E-Commerce
**Flow:**
1. System menampilkan daftar produk dengan pagination
2. User bisa filter berdasarkan kategori, harga
3. User bisa search produk
4. User klik detail produk untuk melihat informasi lengkap
5. System menampilkan: deskripsi, harga, foto, seller info, rating
**Postconditions:** User melihat detail produk

#### UC-6: General User Membeli Produk
**Actor:** General User
**Preconditions:** User melihat produk yang diinginkan
**Flow:**
1. User klik "Tambah ke Keranjang"
2. System menyimpan item ke cart
3. User lanjut belanja atau ke checkout
4. Di checkout, user review pesanan
5. User memilih alamat pengiriman
6. System hitung ongkir (jika ada driver)
7. User lanjut ke pembayaran
8. System membuat order
9. Order dikirim ke Farmer & Driver
**Postconditions:** Order berhasil dibuat, status "Pending Payment"

---

### **C. Project Management (Farmer)**

#### UC-7: Farmer Membuat Proyek Pertanian
**Actor:** Farmer
**Preconditions:** Farmer sudah login
**Flow:**
1. Farmer membuka "Proyek Saya"
2. Farmer klik "Buat Proyek Baru"
3. Farmer isi form: nama proyek, lokasi (map), tanggal mulai, tanggal selesai, budget, deskripsi
4. Farmer tentukan kebutuhan pekerja & skill yang diperlukan
5. Farmer submit
6. System validasi & create project
7. Proyek published dengan status "Open for Application"
**Postconditions:** Proyek siap untuk diaplikasikan pekerja

#### UC-8: Farmer Melihat Daftar Proyek
**Actor:** General User
**Preconditions:** User di halaman "Daftar Proyek"
**Flow:**
1. System menampilkan daftar proyek aktif
2. User bisa filter berdasarkan lokasi, kategori, budget range
3. User klik detail proyek
4. System tampilkan: deskripsi lengkap, lokasi di peta, budget, deadline
5. Jika user adalah worker, tampilkan tombol "Apply"
**Postconditions:** User melihat detail proyek

#### UC-9: Worker Melamar Proyek
**Actor:** Worker
**Preconditions:** Worker melihat proyek yang sesuai
**Flow:**
1. Worker klik "Lamar Sekarang"
2. System membuka form aplikasi
3. Worker isi: pengalaman, portofolio, proposal harga (opsional)
4. Worker submit
5. System notifikasi Farmer tentang aplikasi baru
6. Aplikasi tersimpan dengan status "Pending Review"
**Postconditions:** Aplikasi terkirim ke Farmer

#### UC-10: Farmer Mereview & Accept Worker
**Actor:** Farmer
**Preconditions:** Ada aplikasi masuk dari worker
**Flow:**
1. Farmer buka "Aplikasi Pekerjaan"
2. Farmer review profil worker & proposal
3. Farmer klik "Terima" atau "Tolak"
4. Jika diterima: System membuat contract/task assignment
5. System notifikasi worker tentang keputusan
6. Worker dapat melihat kontrak di "Kontrak Saya"
**Postconditions:** Worker diterima, task assignment dibuat

#### UC-11: Worker Menyelesaikan Pekerjaan
**Actor:** Worker
**Preconditions:** Worker memiliki task assignment aktif
**Flow:**
1. Worker buka "Pekerjaan Saya" > task aktif
2. Worker lihat detail task & timeline
3. Worker update progress/status pekerjaan
4. Worker bisa upload file evidence/hasil kerja
5. Ketika selesai, worker klik "Tandai Selesai"
6. System notifikasi Farmer
7. Farmer bisa review & approve completion
8. Jika approved: task selesai, worker dapat pembayaran
**Postconditions:** Task marked as completed, payment processed

---

### **D. Delivery/Expedition Management**

#### UC-12: Farmer Membuat Permintaan Pengiriman
**Actor:** Farmer
**Preconditions:** Ada order yang perlu dikirim
**Flow:**
1. Farmer membuka "Pengiriman"
2. Farmer klik "Buat Pengiriman Baru"
3. Farmer isi: dari lokasi (farm), ke lokasi (buyer), produk, berat, ukuran
4. System auto-detect driver tersedia di area
5. System tampilkan opsi driver dengan estimasi harga
6. Farmer pilih driver & submit
7. System notifikasi driver
**Postconditions:** Permintaan pengiriman terkirim ke driver

#### UC-13: Driver Melihat Permintaan Pengiriman
**Actor:** Driver
**Preconditions:** Driver sudah login, ada permintaan pengiriman
**Flow:**
1. Driver buka "Pengiriman"
2. System menampilkan daftar pengiriman available (dengan filter lokasi otomatis)
3. Driver bisa lihat detail: lokasi pickup, drop-off, produk, bayaran
4. Driver lihat map dengan nearby farms
5. Driver klik "Terima Pengiriman"
**Postconditions:** Driver accepted delivery

#### UC-14: Driver Melacak Pengiriman
**Actor:** Driver
**Preconditions:** Driver accepted delivery
**Flow:**
1. Driver buka delivery detail
2. System tampilkan map dengan route ke pickup location
3. Driver navigate ke pickup location
4. Ketika tiba, driver klik "Arrived at Pickup"
5. Farmer konfirmasi & berikan barang
6. Driver klik "Pickup Complete"
7. System update status & tampilkan route ke drop-off
8. Driver navigate ke drop-off
9. Ketika tiba, driver klik "Arrived at Destination"
10. Buyer konfirmasi barang diterima
11. System tandai delivery complete
**Postconditions:** Delivery completed, payment to driver processed

---

### **E. Chat & Messaging**

#### UC-15: User Membuka Inbox/Chat
**Actor:** Any Authenticated User (Farmer, Worker, Driver)
**Preconditions:** User sudah login
**Flow:**
1. User klik menu "Inbox"
2. System tampilkan daftar recent contacts
3. User klik contact untuk buka chat
4. System tampilkan message history
5. User type message & send
6. System real-time update chat via Socket.io
7. Message tersimpan & recipient notifikasi
**Postconditions:** Chat tersimpan, both users dapat akses

---

### **F. Payment & Transaction**

#### UC-16: Farmer Melihat Laporan Pembayaran
**Actor:** Farmer
**Preconditions:** Ada transaksi (order/project) yang completed
**Flow:**
1. Farmer buka "Pembayaran"
2. System tampilkan daftar transaksi masuk
3. Farmer filter berdasarkan tanggal, status (pending/completed)
4. Farmer bisa export laporan
5. System tampilkan total income
**Postconditions:** Farmer review payment reports

#### UC-17: Proses Pembayaran Order
**Actor:** General User
**Preconditions:** User di checkout page dengan items
**Flow:**
1. User review total harga (produk + ongkir)
2. User pilih metode pembayaran
3. System generate payment request
4. User diarahkan ke payment gateway
5. User konfirmasi & bayar
6. Payment gateway verifikasi
7. System update order status ke "Paid"
8. Order dikirim ke Farmer & Driver
**Postconditions:** Order paid, delivery initiated

---

### **G. Profile & Account Management**

#### UC-18: User Edit Profil
**Actor:** Any User
**Preconditions:** User sudah login
**Flow:**
1. User buka "Akun/Profil Saya"
2. User klik "Edit Profil"
3. User edit data: nama, foto, bio, kontak
4. User save changes
5. System validasi & update
6. User notifikasi update berhasil
**Postconditions:** Profil updated

#### UC-19: Farmer Melengkapi Data Lahan
**Actor:** Farmer
**Preconditions:** Farmer sudah login
**Flow:**
1. Farmer buka "Data Pertanian"
2. Farmer bisa input lokasi lahan (via map)
3. Farmer bisa set luas lahan, jenis tanaman
4. Data tersimpan untuk keperluan rekomendasi & project planning
**Postconditions:** Farmer data lengkap

---

### **H. Review & Rating**

#### UC-20: Farmer/Buyer Memberikan Review
**Actor:** Farmer (after project) / Buyer (after order)
**Preconditions:** Project/Order sudah completed
**Flow:**
1. System menampilkan prompt review (otomatis atau manual)
2. User buka review form
3. User beri rating (1-5 stars)
4. User tulis komentar
5. User submit
6. Review tersimpan & tampil di profil worker/farmer
7. System update rating average
**Postconditions:** Review tersimpan, rating updated

---

### **I. Notification System**

#### UC-21: User Menerima Notifikasi
**Actor:** Any User
**Preconditions:** Ada event relevan (new job, payment, delivery update)
**Flow:**
1. Event terjadi di sistem
2. System generate notification
3. Notifikasi dikirim (in-app, push, email)
4. User bisa buka notifikasi di "Notifikasi" page
5. Notifikasi auto mark as read
**Postconditions:** User informed about updates

---

## 🎯 User Stories Summary

| ID | Actor | Feature | Priority |
|---|---|---|---|
| UC-1 | Guest | Register | High |
| UC-2 | User | Login | High |
| UC-3 | User | Select Role | High |
| UC-4 | Farmer | Create Product | High |
| UC-5 | General | Browse Products | High |
| UC-6 | General | Buy Product | High |
| UC-7 | Farmer | Create Project | High |
| UC-8 | General | Browse Projects | High |
| UC-9 | Worker | Apply Project | High |
| UC-10 | Farmer | Accept Worker | High |
| UC-11 | Worker | Complete Job | Medium |
| UC-12 | Farmer | Request Delivery | High |
| UC-13 | Driver | Accept Delivery | High |
| UC-14 | Driver | Track Delivery | High |
| UC-15 | User | Chat/Inbox | Medium |
| UC-16 | Farmer | View Payments | Medium |
| UC-17 | General | Process Payment | High |
| UC-18 | User | Edit Profile | Medium |
| UC-19 | Farmer | Input Farm Data | Medium |
| UC-20 | User | Give Review | Medium |
| UC-21 | User | Receive Notification | Medium |

---

## 🏗️ Aktor & Hubungan

```
                    ┌─────────────┐
                    │   System    │
                    └─────────────┘

    ┌────────┐      ┌────────┐      ┌─────────┐
    │ Farmer │◄────►│ Worker │      │ Driver  │
    └────────┘      └────────┘      └─────────┘
         │               │                │
         │   Project &   │          Delivery
         │   Product     │          Request
         │               │                │
    ┌────────┐      ┌────────────────────┴──┐
    │ General │◄────►│   Farmer (Vendor)     │
    │  User   │      └───────────────────────┘
    └────────┘
     (Buyer)
```

---

## 📊 Data Flow Utama

### 1. **Penjualan Produk**
```
Farmer Create Product → Published
General User Browse → Add to Cart → Checkout → Payment
Payment Success → Order Created → Farmer Notified
Farmer Shipping → Driver Pickup → Delivery → Complete
```

### 2. **Manajemen Proyek**
```
Farmer Create Project → Published
Worker Browse → Apply → Application Submitted
Farmer Review → Accept/Reject
Contract Created → Worker Start Job → Update Progress
Complete → Farmer Review → Payment Processed
```

### 3. **Pengiriman**
```
Order/Farmer Request Delivery
Driver Browse Available → Accept
Map Navigation → Pickup → In Transit → Drop-off → Complete
Delivery Completed → Payment to Driver
```

---

## ✅ Fitur Pendukung

- **Real-time Chat** (Socket.io)
- **Mapping & Geolocation** (Leaflet, Mapbox)
- **Push Notifications** (Pusher)
- **File Upload** (Images, PDF)
- **Payment Gateway Integration**
- **Email Notifications**
- **Role-based Access Control**
- **Search & Filter**
- **Pagination**
- **Rating & Review System**

---

## 📱 Pages/Routes yang Sudah Ada

```
FRONT PAGE (Public & Authenticated)
├── Home
├── E-Commerce
│   ├── List Products
│   └── Detail Product
├── Farmer Projects
│   ├── List Projects
│   └── Detail Project
├── Workers
│   ├── List Workers
│   └── Detail Worker
├── Expeditions
│   ├── List Expeditions
│   └── Detail Expedition
├── Cart
├── Checkout
├── Orders
├── Inbox (Messages)
├── Notifications
└── Privacy

BACK PAGE (Role-based)
├── Dashboard
├── Farmer
│   ├── Products
│   ├── Projects
│   ├── Applications
│   ├── Orders
│   ├── Payments
│   ├── Deliveries
│   └── Workers List
├── Worker
│   ├── My Jobs
│   └── Contracts
├── Driver/Expedition
│   └── My Deliveries
├── Chat
├── Review
└── History
```

---

## 🔐 Role Permissions

```
FARMER
✓ Create/Edit Products
✓ Create/Manage Projects
✓ Accept Workers
✓ Request Deliveries
✓ View Payments
✓ View Orders
✓ Chat with Workers/Drivers

WORKER
✓ View Projects
✓ Apply to Projects
✓ View My Jobs
✓ Update Progress
✓ Chat with Farmers
✓ View Contracts

DRIVER
✓ View Delivery Requests
✓ Accept Deliveries
✓ Track Deliveries
✓ View Map
✓ View Payment

GENERAL USER
✓ View Products
✓ View Projects (read-only)
✓ View Workers
✓ Buy Products
✓ Place Orders
✓ Chat (if approved for project)

ADMIN (System)
✓ All permissions
✓ User Management
✓ System Reports
```

---

Dokumen ini siap digunakan untuk membuat **Use Case Diagram** di tools seperti:
- **Lucidchart**
- **Draw.io**
- **Enterprise Architect**
- **Miro**
- **StarUML**
