const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();

app.use(express.json());


mongoose.set('strictQuery', true);
const port = 8000;



const db = 'mongodb+srv://jpsultan:qtqFRO2inJjiRhAB@cluster0.ia7v1tn.mongodb.net/?retryWrites=true&w=majority'
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to MongoDB"))
    .catch((e) => console.log(e));


// const userSchema = new mongoose.Schema({
//     firstName: String,
//     email: String,
//     password: String,
// });
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    }, 
    password: String,

});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(bodyParser.json());
app.post('/signup', async (req, res) => {
    const { firstName, email, password } = req.body;

    const newUser = new User({
        name: firstName,
        email,
        password,
    });
    try {
        // Save the user data to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        // console.log("this page is running");
        res.status(500).json({ error: 'Error saving user data' });
    }
});

// Assuming you already have the required imports and server setup

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Post tak toh aa gye");
    try {
      // Check if the user exists in the database
      const user = await User.findOne({ email });
      console.log("User check ho ra hai");
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Validate the password
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // If the email and password are correct, send a success message
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.log('Error logging in:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  



app.listen(port, () => {
    console.log("port Connected");
});

