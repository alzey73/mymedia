const socketIo=require("socket.io");

module.exports=(server)=>{
    const io = socketIo(server, {
        cors: {
            origin: "*",  // Tüm kökenlere izin verir. İhtiyacınıza göre bu değeri değiştirebilirsiniz.
            methods: ["GET", "POST"]
        }
    });
    

    io.on("connection",(socket)=>{
        console.log("Someone connected : ",socket.id);

        socket.on("disconnect",()=>{
            console.log("user disconnected : ",socket.id);
        });

        // Diğer socket olaylarınızı burada tanımlayabilirsiniz.
    });

    return io;// Eğer başka yerlerde io nesnesine ihtiyaç duyarsanız.
};