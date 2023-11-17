// socketConfig.js

const socketIo = require("socket.io");
const Message = require("../Models/messageModel");
const fs = require("fs");
const path = require("path");

// sendMessage fonksiyonunu tanımlayın
async function sendMessage({ sender, receiver, text }) {
    // sohbet dosyasının yolunu oluştur
    const participants = [sender, receiver].sort();
    const chatId = participants.join("_");
    const chatFilePath = path.join(__dirname, "..", "public", "chats", `chat_${chatId}.txt`);

    // mesajı dosyaya ekle
    fs.appendFileSync(chatFilePath, `${sender}: ${text}\n`);

    // Veritabanında sohbet yolu var mı diye kontrol et
    let chat = await Message.findOne({ chatId: chatId });
    if (!chat) {
        // Eğer yoksa yeni bir kayıt oluştur
        chat = new Message({
            chatId: chatId,
            participants: participants,
            chatFilePath: chatFilePath,
            lastMessage: text,
            lastMessageTime: new Date()
        });
    } else {
        // Eğer varsa, son mesaj bilgilerini güncelle
        chat.lastMessage = text;
        chat.lastMessageTime = new Date();
    }
    await chat.save();

    // Bu kısım artık yalnızca WebSocket bağlantısı içinde kullanılmalıdır
    // socket.broadcast.emit('messageReceived', { sender, receiver, text });
}

// WebSocket bağlantılarını işleyen ana modül
module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        // ... Bağlantı işleyicileri ...

        socket.on("sendMessage", (message) => {
            // sendMessage fonksiyonunu WebSocket mesajı olarak kullanın
            sendMessage(message).then(() => {
                socket.broadcast.emit('messageReceived', message);
            }).catch(err => {
                console.error("Error sending message:", err);
            });
        });

        socket.on("disconnect", () => {
            console.log("user disconnected : ", socket.id);
        });
    });

    // Dışa aktarılan nesneyi güncelleyin
    return { io, sendMessage };
};

// Ayrıca, sendMessage fonksiyonunu dışa aktarın
module.exports.sendMessage = sendMessage;
