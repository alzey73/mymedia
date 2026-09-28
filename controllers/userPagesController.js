const UserPage = require("../Models/userPagesModel");

exports.getUserFiles = async (req, res) => {
    try {
        const userId = req.user.userId; // JWT middleware ile eklenen user bilgisi
        const userFiles = await UserPage.find({ userId: userId }).sort({ timestamp: -1 });
        res.json(userFiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.userUpload = async (req, res) => {
    try {
        // Dosya yüklenip yüklenmediğini kontrol et
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const newFile = new UserPage({
            userId: req.user.userId, // JWT'den alınan kullanıcı ID'si
            type: req.file.mimetype.startsWith("video/") ? "video" : "image", // Tür, dosyanın kendisinden belirlenir
            description: typeof req.body.description === "string" ? req.body.description.slice(0, 500) : "",
            path: `/public/${req.file.filename}` // Tarayıcının erişebileceği URL
        });

        const savedFile = await newFile.save();
        res.status(201).json({ message: "File uploaded successfully.", file: savedFile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
