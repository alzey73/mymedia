const mongoose = require("mongoose");
const Message = require("../Models/messageModel");

// Giriş yapan kullanıcının mesajlarını döner. ?with=<userId> verilirse sadece o kişiyle olan sohbet.
exports.getUserMessages = async (req, res) => {
    try {
        const userId = req.user.userId; // JWT middleware ile eklenen user bilgisi
        const otherId = req.query.with;

        let filter = { $or: [{ sender: userId }, { receiver: userId }] };
        if (otherId) {
            if (!mongoose.isValidObjectId(otherId)) {
                return res.status(400).json({ message: "Invalid user id" });
            }
            filter = {
                $or: [
                    { sender: userId, receiver: otherId },
                    { sender: otherId, receiver: userId }
                ]
            };
        }

        const messages = await Message.find(filter).sort({ createdAt: 1 }).limit(500);
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
