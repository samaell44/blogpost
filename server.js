const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./route/product.route.js');
const productUserRoutes = require('./route/product.route.user.js');
const bcrypt = require('bcrypt');
const app = express();
const joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// Middleware to parse JSON bodies
app.use(express.json());    
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

const reqschema = joi.object({
  title: joi.string().min(3).max(30).required(),
  content: joi.string().min(3).max(100).required(),
  author: joi.string().min(3).max(30).required(),
});

const userSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(), // This ensures the value must be in email format
  password: joi.string().min(6).required().pattern(/^[a-zA-Z0-9]{6,30}$/)
});

// Use product routes
app.use('/posts', productRoutes);

// Use user routes
app.use('/users', productUserRoutes);

app.get('/', (req, res) => {
    reqschema.validateAsync(req.body)
    .then(() => {
        console.log('Request body is valid');
    })
    .catch((err) => {
        console.error('Validation error:', err.details[0].message);
        return res.status(400).json({message: err.message});
    });
});

app.get('/users', async (req, res) => {
    userSchema.validateAsync(req.body)
    .then(() => {
        console.log('User data is valid');
    })
    .catch((err) => {
        console.error('Validation error:', err.details[0].message);
        return res.status(400).json({message: err.message});
    });
});


mongoose.set('strictQuery', false);

mongoose.connect(
  'mongodb+srv://aragon123x:pagecorp@cluster1.colklx3.mongodb.net/Node1?retryWrites=true&w=majority&appName=Cluster1',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


// Export the app for testing purposes
module.exports = app;


app.post('/users/logins', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.status(200).send(`${user.name} authorized successfully`);
        } else {
            res.status(401).send('Invalid password');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    const username = req.body.name;
    const user = { user: username };
    const accessToken = jwt.sign(user, process.env.RANDOM_SECRET_KEY);
    res.json({ accessToken: accessToken }); 
});
