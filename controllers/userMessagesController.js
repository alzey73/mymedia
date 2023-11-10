

const Message = require("../Models/messageModel");
const fs = require("fs");

exports.getUserMessages = async (req, res) => {
    try {
        const userId = req.user.userId; // JWT middleware ile eklenen user bilgisi
        const messages = await Message.find({ participants: userId });
       
        if (messages.length === 0) {
            return res.status(200).json({ message: "No messages found for this user.", messages: [] });
        } 
    
        // kullanıcının tüm sohbet dosyalarını oku
        let allMessages=[];
        for(let message of messages){
            const chatContent=fs.readFileSync(message.chatFilePath,"utf8");
            allMessages.push({
                sender:message._id,
                text:chatContent
            });

           // console.log(allMessages);
        }
        res.status(200).json(allMessages);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

