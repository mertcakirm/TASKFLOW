# ✅ TaskFlow

**Node.js** ve **Express** ile geliştirilmiş, **yönetici** ve **çalışan** rollerine sahip bir görev yönetimi (Task Manager) backend API'si. Kullanıcılar proje oluşturabilir, proje içindeki görevleri yönetebilir; yetkiler role göre ayrılır.

## ✨ Özellikler

- **Rol Tabanlı Yetkilendirme:** Yönetici (`Manager`) ve çalışan (`User`) rolleriyle endpoint bazlı erişim kontrolü.
- **Proje Yönetimi:** Proje oluşturma, listeleme, güncelleme ve silme.
- **Görev Yönetimi:** Proje içinde görev oluşturma, çalışanlara atama, durum güncelleme ve takip.
- **Kimlik Doğrulama:** `jsonwebtoken` ile JWT tabanlı oturum yönetimi, `bcrypt` ile güvenli parola hashleme.
- **ORM Desteği:** `Sequelize` ile veritabanı modelleme ve ilişki yönetimi.
- **Çoklu Veritabanı Desteği:** MySQL (`mysql3`) ile uyumlu.
- **CORS & Ortam Değişkenleri:** `cors` ve `dotenv` ile esnek yapılandırma.

## 👥 Roller ve Yetkiler

| İşlem | Yönetici | Çalışan |
| --- | :---: | :---: |
| Proje oluşturma / silme | ✅ | ❌ |
| Görev oluşturma ve atama | ✅ | ❌ |
| Atanan görevleri görüntüleme | ✅ | ✅ |
| Görev durumunu güncelleme | ✅ | ❌ |

<!-- Yetki tablosunu kodunuzdaki gerçek kurallara göre düzenleyin -->

## 🧰 Kullanılan Teknolojiler & Paketler

| Alan | Teknoloji |
| --- | --- |
| Çalışma Ortamı | Node.js |
| Framework | Express `^5.3.0` |
| ORM | Sequelize `^6.37.8` |
| Veritabanı | MySQL (`mysql2`) |
| Kimlik Doğrulama | `jsonwebtoken`, `bcrypt` |
| Diğer | `cors`, `dotenv` |
| Geliştirme | `nodemon` |

## 📦 Gereksinimler

- [Node.js](https://nodejs.org/) (LTS sürümü önerilir)
- npm
- MySQL veritabanı

## 🚀 Çalıştırma Adımları

1. Projeyi bilgisayarınıza klonlayın:

```bash
   git clone https://github.com/mertcakirm/TASKFLOW.git
```

2. Proje dizinine gidin:

```bash
   cd TASKFLOW
```

3. Gerekli bağımlılıkları yükleyin:

```bash
   npm install
```

4. Proje kök dizininde bir `.env` dosyası oluşturun:

```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=taskflow
   DB_USER=root
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key
```

5. Sunucuyu çalıştırın:

```bash
   npm start / node server.js
```

   Geliştirme modunda (otomatik yeniden başlatma):

```bash
   npm run dev / nodemon server.js
```

## 📜 Kullanılabilir Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm start` | Sunucuyu `node server.js` ile başlatır |
| `npm run dev` | Sunucuyu `nodemon` ile geliştirme modunda başlatır |
