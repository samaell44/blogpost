const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./route/product.route.js');
const app = express();
const joi = require('joi');

// Middleware to parse JSON bodies
app.use(express.json());    
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

const reqschema = joi.object({
  title: joi.string().min(3).max(30).required(),
  content: joi.string().min(3).max(100).required(),
  author: joi.string().min(3).max(30).required(),
});

// Use product routes
app.use('/posts', productRoutes);

app.post('/', (req, res) => {
    reqschema.validateAsync(req.body)
    .then(() => {
        console.log('Request body is valid');
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