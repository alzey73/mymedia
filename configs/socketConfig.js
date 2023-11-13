const socketIo = require("socket.io");
const Message = require("../Models/messageModel");
const fs = require("fs");
const path = require("path");
//const { v4: uuidv4 } = require("uuid");

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
            const participants = [message.sender, message.receiver].sort();
            const chatId = participants.join("_");
            const chatFilePath = path.join(__dirname, "..", "public", "chats", `chat_${chatId}.txt`);

            //mesajı dosyaya ekle
            fs.appendFileSync(chatFilePath, `${message.sender}: ${message.text}\n`);


            // Veritabanında sohbet yolu var mı diye kontrol et
            let chat = await Message.findOne({ chatId: chatId });
            if (!chat) {
                // Eğer yoksa yeni bir kayıt oluştur
                chat = new Message({
                    chatId: chatId,
                    participants: participants,
                    chatFilePath: chatFilePath,
                    lastMessage:message.text,
                    lastMessageTime: new Date()// Son mesajın zamanını da kaydedebilirsiniz
                });
                
            }else{
                // Eğer varsa, son mesaj bilgilerini güncelle
                chat.lastMessage=message.text;
                chat.lastMessageTime=new Date();
            }
            await chat.save();
            
                // Mesajı diğer kullanıcıya ilet
                socket.broadcast.emit('messageReceived', message);
                
            });

        socket.on("disconnect", () => {
            console.log("user disconnected : ", socket.id);
        });


    });

    return io;// Eğer başka yerlerde io nesnesine ihtiyaç duyarsanız.
};