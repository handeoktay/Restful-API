const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Product = require('../models/product');  //create object 'Product' by import product.js


//GET REQUEST
router.get('/', async (req, res, next) => {

    try {
        const docs = await Product.find().select('-__v').exec();  //fetch the data from response with select()
        const result = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id,
                    }
                }
            })
        };
        console.log(docs);
        res.status(200).json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({error: e});
    }
});


//GET REQUEST BY PRODUCT ID
router.get('/:productId', async (req, res, next) => {
    const id = req.params.productId;

    try {
        const result = await Product.findOne({_id: id}).select('-__v').exec();
        console.log("From database: " + result);
        if (result) {
            res.status(200).json({
                product: result,
                description: 'Get all products:',
                url: 'http://localhost:3000/products/',
            });
        }
    } catch (e) {
        console.log(e);
        res.status(404).json({message: "No vaid entry for provided ID"});
    }
});


//POST REQUEST
router.post('/', async (req, res, next) => {

    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    try {
        const result = await product.save();
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id,
                }
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({err: e});
    }
});


//PATCH REQUEST
router.patch('/:productId', async (req, res, next) => {
    const props = req.body;
    try {
        const result = await Product.update({_id: req.params.productId}, props).exec();
        console.log(result);
        res.status(200).json({
            message: 'Product updated.',
            url: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + req.params.productId,
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
});


//DELETE REQUEST
router.delete('/:productId', async (req, res, next) => {

    try {
        await Product.remove({_id: req.params.productId}).exec();
        res.status(200).json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: e
        })
    }
});

module.exports = router;