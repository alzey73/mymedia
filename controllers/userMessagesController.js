

const Messages = require("../Models/messagesModel");

exports.getUserMessages = async (req, res) => {
    try {
        const sender = req.user.userId; // JWT middleware ile eklenen user bilgisi
        const messages = await Messages.find({ sender: sender });
        // console.log("userid",userId);
       if (messages.length === 0) {
            res.status(200).json({ message: "No messages found for this user.", messages: [] });
        } else {
            res.send(messages);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// exports.userUploadMessages=async (req,res)=>{
//     try {
//         // Dosya yüklenip yüklenmediğini kontrol et
//         if (!req.file) {
//             return res.status(400).send({ message: "No file uploaded." });
//         }

//         const newFile = new UserPage({
//             userId: req.user.userId, // JWT'den alınan kullanıcı ID'si
//             type: req.body.type, // Formdan alınan dosya tipi (video, image, message)
//             description: req.body.description, // Formdan alınan açıklama
//             path: req.file.path // Multer tarafından otomatik olarak eklenen dosya yolu
//         });

//         const savedFile = await newFile.save();
//         res.status(201).send({ message: "File uploaded successfully.", file: savedFile });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };
