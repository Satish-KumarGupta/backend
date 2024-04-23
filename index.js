// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://satish:satish@cluster0.7stdrez.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.post('/api/v1/register', async (req, res) => {
    const { email, password } = req.body;
    console.log(email,password);
    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for user login
app.post('/api/v1/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email,password);

    try {
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // const passwordMatches = await bcrypt.compare(password, user.password);

        if (user.password !== password) {
          return res.status(401).json({ error: 'Invalid password credentials' });
        }
      
        // const isPasswordValid = await user.comparePassword(password);
        // if (!isPasswordValid) {
        //     return res.status(401).json({ message: 'Invalid email or password' });
        // }

        res.json({ message: 'Login successful',success:true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
