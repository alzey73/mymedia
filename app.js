require('dotenv').config();
const express = require("express");
const cors = require('cors');
const path = require("path");
const http = require("http");
const { connectDB } = require("./configs/db");
const initializeSockets = require("./configs/socketConfig");

const usersRouter = require("./routers/usersRouter");
const userPagesRouter = require("./routers/userPagesRouter");
const userMessageRouter = require("./routers/userMessageRouter");

if (!process.env.SECRET_KEY) {
    console.error("SECRET_KEY tanımlı değil. .env.example dosyasına bakın.");
    process.exit(1);
}

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

// CORS_ORIGIN verilmezse sadece aynı köken (frontend bu sunucudan servis ediliyor)
const corsOrigin = process.env.CORS_ORIGIN || false;
app.use(cors({ origin: corsOrigin }));
initializeSockets(server, corsOrigin);

app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'views'), { index: 'user.html' }));

app.use("/api/users", usersRouter);
app.use("/api/userpages", userPagesRouter);
app.use("/api/messagepage", userMessageRouter);

// Multer ve diğer hatalar için ortak yakalayıcı
app.use((err, req, res, next) => {
    const status = err.status || (err.name === "MulterError" ? 400 : 500);
    if (status === 500) {
        console.error(err);
    }
    res.status(status).json({ message: status === 500 ? "Internal server error" : err.message });
});

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server (with socket.io) is running on port ${PORT}`);
    });
});
