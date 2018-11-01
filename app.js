const express = require('express');
const app = express(); //instance of express
const morgan = require('morgan');  //logger for requests
const bodyParser = require('body-parser'); //extract json data and makes it readable
const mongoose = require('mongoose'); //for mongodb database

//Instances for different route files
const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

mongoose.connect('mongodb://rest_shop:' + process.env.MONGO_ATLAS_PASSWORD + '@cluster1-shard-00-00-v3qdq.mongodb.net:27017,cluster1-shard-00-01-v3qdq.mongodb.net:27017,cluster1-shard-00-02-v3qdq.mongodb.net:27017/test?ssl=true&replicaSet=Cluster1-shard-0&authSource=admin&retryWrites=true',
    {
        useNewUrlParser: true
    });
mongoose.Promise = global.Promise;

//Handling CORS(cross-origin-resource-sharing)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // * can be changed to domain name etc.
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') { //browser always sends options response first
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes which should handle requests
app.use('/products', productRoutes);  //.use is http request method/ .products is path on the server /productRoutes is the func executed when the route is matched.
app.use('/orders', ordersRoutes);


//ERROR HANDLING

//for router errors
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//other
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    });
});

module.exports = app;