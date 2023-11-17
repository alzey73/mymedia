

const Message = require("../Models/messageModel");
const fs = require("fs");
const path = require('path');
const mongoose = require("mongoose");
const { sendMessage } = require('../configs/socketConfig');

exports.getUserMessages = async (req, res) => {
    try {
        const userId = req.user.userId; // JWT middleware ile eklenen user bilgisi
        const messages = await Message.find({ participants: userId })
            .populate("participants", "email");

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
                        //sender: message.participants[0].email,
                        sender: message.participants[0],
                        receiver: message.participants[1],
                        text: line
                    });
                }

            });

            console.log(allMessages);
        }
        res.status(200).json(allMessages);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.sendMessages = async (req, res) => {
    try {
        //console.log("ss");
        const { text, sender, receiver } = req.body;
        // const chatId = [sender, receiver].sort().join("_");
        // const chatFilePath = path.join(__dirname, "../../public/chat", `chat_${chatId}.txt`);

        // var olan sohbeti bul veya yeni bir tane oluştur

        // let message = await Message.findOne({ chatId });
        // if (message) {
        //     // sohbet zaten var, sadece son mesajı güncelle
        //     message.lastMessage = text;
        //     message.lastMessageTime = new Date();

        //     const updatedMassage = await message.save();
        //     res.status(200).send({ message: "Message sent", data: updatedMassage });


        // } else {
        
            const message = {
                text,
                sender,
                receiver
            };
            
            await sendMessage(message);
            
            res.status(200).send({ message: "Message sent", data: message });
        }
    
    catch (error) {
        console.error(error);  // Hata detaylarını yazdır
        res.status(500).send(error.message);
    }
};

