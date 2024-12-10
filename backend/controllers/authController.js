const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const SECRET_KEY = "your_jwt_secret";

const executeQuery = (query, values = []) =>
    new Promise((resolve, reject) => {
        db.query(query, values, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

// Register User
exports.registerUser = async (req, res) => {
    const { fullName, email, password, mobile_number, grade, address } = req.body;
    const profile_picture = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (fullName, email, password, mobile_number, grade, address, profile_picture) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await executeQuery(query, [fullName, email, hashedPassword, mobile_number, grade, address, profile_picture]);
        res.status(201).send("User registered successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering user");
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = "SELECT * FROM users WHERE email = ?";
        const results = await executeQuery(query, [email]);

        if (results.length === 0) return res.status(404).send("User not found");

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).send("Invalid credentials");

        const token = jwt.sign({ id: user.id, fullName: user.fullName }, SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

// Get User Data
exports.getUser = async (req, res) => {
    const { id } = req.user;

    try {
        const query = "SELECT fullName, email, mobile_number, grade, address, profile_picture FROM users WHERE id = ?";
        const results = await executeQuery(query, [id]);
        res.status(200).json(results[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching user data");
    }
};

// Update User Data
exports.updateUser = async (req, res) => {
    const { fullName, mobile_number, grade, address } = req.body;
    const { id } = req.user;

    try {
        const query = `UPDATE users SET fullName = ?, mobile_number = ?, grade = ?, address = ? WHERE id = ?`;
        await executeQuery(query, [fullName, mobile_number, grade, address, id]);
        res.status(200).send("User updated successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating user");
    }
};
