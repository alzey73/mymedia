const socketIo = require("socket.io");
const Message = require("../Models/messagesModel");

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
        socket.on('sendMessage', (message) => {
            // Mesajı veritabanına kaydet
            const newMessage = new Message({
                sender: message.sender,
                receiver: message.receiver,
                text: message.text
            });
            newMessage.save();

            // Mesajı diğer kullanıcıya ilet
            socket.broadcast.emit('messageReceived', message);
        });

        socket.on("disconnect", () => {
            console.log("user disconnected : ", socket.id);
        });


    });

    return io;// Eğer başka yerlerde io nesnesine ihtiyaç duyarsanız.
};