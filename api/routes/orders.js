const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');  //create object 'Product' by import product.js


//GET REQUEST

router.get('/', async (req, res, next) => {

    try {
        const docs = await Order.find().select('-__v').exec();
        res.status(200).json({
            count: docs.length,
            order: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id,
                        }
                    }
                }
            )
        });
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
});


//POST REQUEST
router.post('/', async (req, res, next) => {
    const checkProduct = Product.findById(req.body.product);

    if (checkProduct != null) { //check if the product exists
        const order = new Order({  //if the product exist, create new order
            _id: mongoose.Types.ObjectId(),
            product: req.body.product,
            quantity: req.body.quantity
        });

        try {
            const result = await order.save();
            if (result) {
                console.log(result);
                res.status(201).json({
                    message: 'Order was created',
                    createdProduct: {
                        product: result.product,
                        quantity: result.quantity
                    },
                    url: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id,
                    }
                });
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({err: e});
        }

    } else {
        res.status(500).json({
            message: 'Product not found',
        });
    }
});

//GET REQUEST BY ID
router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});


//DELETE REQUEST
router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order is deleted',
        orderId: req.params.orderId
    });
});

module.exports = router;