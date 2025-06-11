const express = require('express');
const app = express();
var cors = require('cors')
const env = require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const adminMiddleWare = require('./Middleware/admin.middleware');
const userMiddleware = require('./Middleware/user.middleware');

const userAPI = require('./API/userAuth');



let appSetup = () => {
    const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    allowedHeaders: 'Content-Type,Authorization,x-auth',
    credentials: true
    };

    app.use(express.json());
    app.use(cors(corsOptions))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true })); 
}


let mongoConnect = () => {
    mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('Database connected successfully');
    });
}


let connectAPIS = () => {
  app.use('/user', userAPI);
  app.use('/admin/product', adminMiddleWare,require('./API/admin/products'));
  app.use('/user/products', require('./API/users/products'));
  app.use('/user/cart', userMiddleware, require('./API/users/cart'));
}

appSetup();
mongoConnect();
connectAPIS();


app.get('/', (req, res) => {
  res.send('Server test');
});



app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}/`);
});