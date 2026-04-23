# 🚀 Backend KSPPS Mitra Hasanah V2

Backend REST API untuk sistem KSPPS Mitra Hasanah. Dibangun menggunakan **Bun + Express + TypeScript + MongoDB**, dan dioptimalkan untuk **Vercel Serverless Functions**.

---

## 🧰 Tech Stack

* **Runtime**: Bun v1.3.10 + Node.js 20.x
* **Framework**: Express 4.x + TypeScript 5.5.4
* **Database**: MongoDB + Mongoose 9.x
* **Authentication**: JWT + bcryptjs + express-rate-limit
* **File Upload**: Multer + Cloudinary
* **Security**: Helmet, CORS, Morgan Logger
* **Deployment**: Vercel Serverless + vercel.json

---

## 📦 Install Dependencies

```bash
bun install
```

---

## ⚙️ Environment Variables

Buat file `.env` di root project:

```env
PORT=3000
NODE_ENV=development

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kspps_v2
JWT_SECRET=rahasia_ilahi_jangan_bocor_bre

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

## 🧪 Run Development

```bash
bun run dev
```

---

## 🏗️ Build & Run Production

```bash
bun run build
bun run start
```

---

## 🚀 Deploy ke Vercel

1. Push project ke GitHub
2. Import repository ke Vercel
3. Set semua environment variables di dashboard Vercel
4. Deploy otomatis

**Build Command:**

```bash
bun run vercel-build
```

---

## 🌐 API Endpoints

### Base URL

```
/api
```

---

## 🔐 Auth - `/api/auth`

| Method | Endpoint  | Description            | Auth         |
| ------ | --------- | ---------------------- | ------------ |
| POST   | /register | Register user baru     | antiSpam     |
| POST   | /login    | Login + return JWT     | loginLimiter |
| GET    | /me       | Get profile dari token | Bearer Token |
| POST   | /logout   | Logout                 | Bearer Token |

---

## 👤 User - `/api/user`

| Method | Endpoint    | Description    | Auth     |
| ------ | ----------- | -------------- | -------- |
| POST   | /createUser | Bikin user     | antiSpam |
| GET    | /           | Get semua user | ADMIN    |
| GET    | /:id        | Get user by ID | ADMIN    |
| PATCH  | /:id        | Update user    | ADMIN    |
| DELETE | /:id        | Hapus user     | ADMIN    |

---

## 📝 Registration - `/api/registration`

| Method | Endpoint    | Description          | Auth   |
| ------ | ----------- | -------------------- | ------ |
| POST   | /           | Daftar anggota baru  | Public |
| GET    | /           | List semua pendaftar | Admin  |
| GET    | /:id        | Detail pendaftar     | Admin  |
| PATCH  | /verify/:id | Verifikasi anggota   | Admin  |
| DELETE | /:id        | Hapus data           | Admin  |

---

## 💰 Product - `/api/product`

| Method | Endpoint  | Description                  | Auth   |
| ------ | --------- | ---------------------------- | ------ |
| GET    | /         | List katalog (?cat=simpanan) | Public |
| GET    | /full/:id | Katalog + detail             | Public |
| POST   | /         | Tambah produk                | ADMIN  |
| PATCH  | /:id      | Update produk                | ADMIN  |
| DELETE | /:id      | Hapus produk                 | ADMIN  |

---

## 📄 Product Detail - `/api/product-detail`

| Method | Endpoint | Description           | Auth   |
| ------ | -------- | --------------------- | ------ |
| GET    | /:id     | Baca brosur digital   | Public |
| POST   | /        | Buat detail baru      | ADMIN  |
| PATCH  | /:id     | Update syarat/benefit | ADMIN  |
| DELETE | /:id     | Hapus detail          | ADMIN  |

---

## 🖼️ Gallery - `/api/gallery`

| Method | Endpoint | Description             | Auth   |
| ------ | -------- | ----------------------- | ------ |
| GET    | /        | List dokumentasi        | Public |
| POST   | /        | Bulk upload max 10 foto | ADMIN  |
| DELETE | /:id     | Hapus 1 foto            | ADMIN  |

---

## 🎞️ Carousel - `/api/carousel`

| Method | Endpoint | Description   | Auth   |
| ------ | -------- | ------------- | ------ |
| GET    | /        | List carousel | Public |
| POST   | /        | Tambah banner | ADMIN  |
| DELETE | /:id     | Hapus banner  | ADMIN  |

---

## 🤲 Baitul Maal - `/api/baitul-maal`

| Method | Endpoint | Description                   | Auth   |
| ------ | -------- | ----------------------------- | ------ |
| GET    | /        | List program (?cat=KESEHATAN) | Public |
| GET    | /:id     | Detail program                | Public |
| POST   | /        | Rilis program + media         | ADMIN  |
| PATCH  | /:id     | Update program                | ADMIN  |
| DELETE | /:id     | Hapus program + aset          | ADMIN  |

---

## ☁️ Cloudinary - `/api/cloudinary`

| Method | Endpoint   | Description               |
| ------ | ---------- | ------------------------- |
| GET    | /signature | Generate upload signature |

---

## ❤️ Health Check

```
GET /
```

---

## ✨ Features

* ⚡ **Serverless MongoDB**
  Connection caching biar gak reconnect tiap request

* 🌍 **CORS Ready**
  Handle preflight OPTIONS + config di vercel.json

* ☁️ **Smart Upload**
  Auto folder Cloudinary + support video sampai 50MB

* 🔐 **Role & Rate Limit**

  * loginLimiter → 10 request / 15 menit
  * antiSpam → 5 request / menit

* 🧱 **Error Handling**
  Global handler untuk 404 & 500

---

## 👨‍💻 Author

```json
{
  "nama-kelompok": "isi nama kelompok elu bre",
  "name": "isi nama elu bre"
}
```

---

## 📄 License

MIT License
