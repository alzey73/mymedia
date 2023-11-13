

const Message = require("../Models/messageModel");
const fs = require("fs");

exports.getUserMessages = async (req, res) => {
    try {
        const userId = req.user.userId; // JWT middleware ile eklenen user bilgisi
        const messages = await Message.find({ participants: userId });

        if (messages.length === 0) {
            return res.status(200).json({ message: "No messages found for this user.", messages: [] });
        }

        // kullanıcının tüm sohbet dosyalarını oku ve satır satır ayır
        let allMessages = [];
        for (let message of messages) {
            const chatContent = fs.readFileSync(message.chatFilePath, "utf8");
            const chatLines = chatContent.split('\n'); // Satırlara ayır
            chatLines.forEach((line) => {
                if (line) {
                    allMessages.push({
                        sender: message._id,
                        text: line
                    });
                }

            });

            // console.log(allMessages);
        }
        res.status(200).json(allMessages);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.sendMessages = async (req, res) => {
try {
    console.log("ss");
    const {text,sender,receiver}=req.body;
    //socket.emit('sendMessage', {
        const newMessage= new Message({
        text,
        sender,
        receiver
    });

    console.log(newMessage);

    const savedMessage=await newMessage.save();

    res.status(200).send({message:"Message sent",data:savedMessage});
} 
    catch (error) {
        console.error(error);  // Hata detaylarını yazdır
        res.status(500).send(error.message);
}
};

