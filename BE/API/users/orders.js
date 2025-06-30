let Order = require('../../Models/order.model');
let Cart = require('../../Models/cart.model');
const express = require('express');

const router = express.Router();


//Create order based on cart
router.post('/create', async (req, res) => {   
    try{
        const cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart || cart.products.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        let address = req.body.address
        let paymentDetails = req.body.payment_details

        const order = new Order({
            userId: req.user.userId,
            products: cart.products,
            total: cart.totalPrice,
            isFulfilled: false,
            address:address,
            paymentDetails:paymentDetails,
            paymentStatus: 'paid',
            isCancelled: false
        });

        await order.save();

        // Clear the cart after creating the order
        await Cart.findOneAndUpdate(
            { userId: req.user.userId },
            { products: [], totalPrice: 0 },
            { new: true }
        );


        res.status(201).json({ message: 'Order created successfully', order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

})


//Cancel order
router.post('/cancel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.isFulfilled || order.isCancelled) {
            return res.status(400).json({ message: 'Order cannot be cancelled' });
        }

        order.isCancelled = true;
        order.paymentStatus = 'refunded'; 
        await order.save();
        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//get orders for the user
router.get('/list', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user', orders: [] });
        }
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//get cancelled orders
router.get('/list/cancelled', async (req, res) => {
    try {
        const cancelledOrders = await Order.find({ userId: req.user.userId, isCancelled: true }).sort({ createdAt: -1 });
        if (!cancelledOrders || cancelledOrders.length === 0) {
            return res.status(404).json({ message: 'No cancelled orders found for this user', orders: [] });
        }
        res.status(200).json(cancelledOrders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;