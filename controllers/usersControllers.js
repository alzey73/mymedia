const User = require("../Models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

exports.listUsers = async (req, res) => {
    try {
        const users = await User.find({}, { email: 1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ message: "A valid email address is required" });
        }
        if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
        }

        // Email adresinin zaten var olup olmadığını kontrol et
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(409).json({ message: "Email address already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({ email, password: hashedPassword });

        res.status(201).json({ _id: user._id, email: user.email });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Email address already exists" });
        }
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Kullanıcıyı bul
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Şifreyi kontrol et
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Token oluştur
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({
            message: 'Login successful!',
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
