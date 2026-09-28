const socketIo = require("socket.io");
const mongoose = require("mongoose");
const Message = require("../Models/messageModel");
const User = require("../Models/usersModel");
const { verifyToken } = require("../middlewares/authenticateJWT");

module.exports = (server, corsOrigin) => {
    const io = socketIo(server, {
        cors: {
            origin: corsOrigin,
            methods: ["GET", "POST"]
        }
    });

    // Bağlantı sırasında JWT doğrulaması
    io.use((socket, next) => {
        try {
            const decoded = verifyToken(socket.handshake.auth && socket.handshake.auth.token);
            socket.userId = String(decoded.userId);
            next();
        } catch (err) {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        // Her kullanıcı kendi odasına katılır; mesajlar sadece ilgili odalara gönderilir
        socket.join(socket.userId);

        socket.on('sendMessage', async (message, ack) => {
            const reply = typeof ack === "function" ? ack : () => {};
            try {
                const text = message && typeof message.text === "string" ? message.text.trim() : "";
                const receiver = message && message.receiver;

                if (!text || text.length > 2000) {
                    return reply({ ok: false, error: "Message must be 1-2000 characters" });
                }
                if (!mongoose.isValidObjectId(receiver) || !(await User.exists({ _id: receiver }))) {
                    return reply({ ok: false, error: "Invalid receiver" });
                }

                // Gönderen, istemcinin söylediği değil token'daki kullanıcıdır
                const saved = await Message.create({ sender: socket.userId, receiver, text });

                io.to(String(receiver)).to(socket.userId).emit('messageReceived', saved.toJSON());
                reply({ ok: true });
            } catch (err) {
                console.error("sendMessage error:", err);
                reply({ ok: false, error: "Internal server error" });
            }
        });
    });

    return io;
};
