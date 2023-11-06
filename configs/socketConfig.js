const socketIo = require("socket.io");
const Message = require("../Models/messageModel");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*",  // Tüm kökenlere izin verir. İhtiyacınıza göre bu değeri değiştirebilirsiniz.
            methods: ["GET", "POST"]
        }
    });


    io.on("connection", (socket) => {
        console.log("Someone connected : ", socket.id);

        // Kullanıcının mesaj göndermesi
        socket.on('sendMessage', async (message) => {
            console.log("Received message:", message);

            // sohbet dosyasının yolunu oluştur
            const chatId = uuidv4(); // her sohbet için benzersiz id
            const chatFilePath = path.join(__dirname, "..", "public", "chats", `chat_${chatId}.txt`);

            //mesajı dosyaya ekle
            fs.appendFileSync(chatFilePath, `${message.sender}: ${message.text}\n`);


            // Mesajı veritabanına kaydet
            const newMessage = new Message({
                participants: [message.sender, message.receiver],
                chatFilePath: chatFilePath
            });
            await newMessage.save();

            // Mesajı diğer kullanıcıya ilet
            socket.broadcast.emit('messageReceived', message);
        });

        socket.on("disconnect", () => {
            console.log("user disconnected : ", socket.id);
        });


    });

    return io;// Eğer başka yerlerde io nesnesine ihtiyaç duyarsanız.
};