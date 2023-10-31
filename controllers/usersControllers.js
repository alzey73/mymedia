const User = require("../Models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const saltRounds = 10;

exports.listUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }

};

exports.createUser = async (req, res) => {

    try {
        // Email adresinin zaten var olup olmadığını kontrol et

        const existingUser = await User.findOne({ email: req.body.email });
        if(existingUser){
            return res.status(409).send("Email address already exists");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        let user = new User({
            //name:req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        user = await user.save();

        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Kullanıcıyı bul
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        // Şifreyi kontrol et
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        // Token oluştur
        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" });

        // Başarılı yanıtı gönder
        res.status(200).send({
            message: 'Login successful!',
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
};


