let Cart = require('../../Models/cart.model');
const express = require('express');
const Product = require('../../Models/product.model');   

const router = express.Router();


//retrieve cart for the user
router.get('/', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.userId })
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//add product to cart
router.post('/add', async (req, res) => {
    try {
        const { product, quantity } = req.body;

        if (!product || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        //find cart of the user
        let cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            //if cart does not exist, create a new one
            cart = new Cart({
                userId: req.user.userId,
                products: [],
                totalPrice: 0
            });
        }

        //check if the product already exists in the cart
        const existingProductIndex = cart.products.findIndex(item => item.product._id.toString() === product._id.toString());

        if (existingProductIndex !== -1) {
        
            cart.products[existingProductIndex].quantity += quantity;
        } else {
    
            cart.products.push({ product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                description: product.description,
                category: product.category
            }, quantity });
        }

        let newTotalPrice = 0;

        //update total price
        for(const item of cart.products) {
            newTotalPrice += item.product.price * item.quantity;
        }

        cart.totalPrice = Math.round(newTotalPrice * 100) / 100;

        await cart.save();
        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//update product quantity in cart
router.post('/update', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        const cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId.toString());
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        if (quantity <= 0) {
            cart.products.splice(productIndex, 1);
        } else {
            cart.products[productIndex].quantity = quantity;
        }

        let newTotalPrice = 0;
        for(const item of cart.products) {
            newTotalPrice += item.product.price * item.quantity;
        }
        
        cart.totalPrice = Math.round(newTotalPrice * 100) / 100;

        await cart.save();
        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;