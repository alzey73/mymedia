

const UserPage = require("../Models/userPagesModel");

exports.getUserFiles = async (req, res) => {
    try {
        const userId = req.user.userId; // JWT middleware ile eklenen user bilgisi
        const userFiles = await UserPage.find({ userId: userId });
        // console.log("userid",userId);
       if (userFiles.length === 0) {
            res.status(200).json({ message: "No files found for this user.", files: [] });
        } else {
            res.send(userFiles);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.userUpload=async (req,res)=>{
    try {
        // Dosya yüklenip yüklenmediğini kontrol et
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
        }

        const newFile = new UserPage({
            userId: req.user.userId, // JWT'den alınan kullanıcı ID'si
            type: req.body.type, // Formdan alınan dosya tipi (video, image, message)
            description: req.body.description, // Formdan alınan açıklama
            path: req.file.path // Multer tarafından otomatik olarak eklenen dosya yolu
        });

        const savedFile = await newFile.save();
        res.status(201).send({ message: "File uploaded successfully.", file: savedFile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
