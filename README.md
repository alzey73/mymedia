# mymedia

Express + MongoDB + Socket.IO ile yazılmış basit bir medya paylaşım ve mesajlaşma uygulaması.

- Kullanıcı kaydı ve girişi (bcrypt + JWT)
- Video / resim yükleme ve kullanıcı sayfasında görüntüleme
- Kullanıcılar arası gerçek zamanlı mesajlaşma (Socket.IO)

## Kurulum

```bash
npm install
cp .env.example .env   # değerleri doldurun
npm run dev            # veya: npm start
```

Uygulama `http://localhost:3000` adresinde açılır (frontend `views/` klasöründen aynı sunucu tarafından servis edilir).

## Ortam değişkenleri

| Değişken | Açıklama |
|---|---|
| `SECRET_KEY` | JWT imzalama anahtarı (zorunlu) |
| `MONGO_URI` | Tam MongoDB bağlantı adresi. Verilmezse aşağıdakilerden oluşturulur |
| `MONGO_USERNAME`, `MONGO_PASSWORD`, `MONGO_HOST` | Atlas bağlantı bilgileri |
| `PORT` | Sunucu portu (varsayılan 3000) |
| `CORS_ORIGIN` | Farklı bir kökenden gelen istemcilere izin vermek için (varsayılan: sadece aynı köken) |

## API

| Metot | Yol | Auth | Açıklama |
|---|---|---|---|
| POST | `/api/users` | – | Kayıt (`email`, `password`) |
| POST | `/api/users/login` | – | Giriş, JWT döner |
| GET | `/api/users` | ✓ | Kullanıcı listesi (`_id`, `email`) |
| GET | `/api/userpages/userpage` | ✓ | Kullanıcının yüklediği dosyalar |
| POST | `/api/userpages/upload` | ✓ | Dosya yükleme (`file`, `description`; mp4/webm/jpg/png/gif/webp, en fazla 100 MB) |
| GET | `/api/messagepage?with=<userId>` | ✓ | Mesajlar (`with` verilirse sadece o kişiyle olan sohbet) |

Auth gerektiren istekler token'ı `x-auth-token` header'ında gönderir.

### Socket.IO

Bağlanırken token `auth` ile verilir: `io({ auth: { token } })`.

- `sendMessage` → `{ text, receiver }` (gönderen token'dan belirlenir). Callback `{ ok, error? }` döner.
- `messageReceived` ← `{ _id, sender, receiver, text, createdAt }` (sadece gönderen ve alıcıya iletilir)
