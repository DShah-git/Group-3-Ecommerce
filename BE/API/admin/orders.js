let Order = require('../../Models/order.model');
const express = require('express');

const router = express.Router();


//get paginated orders for admin
router.get('/all-orders', async (req, res) => {
    try {
        const { page = 1, limit = 25, filter = "pending" } = req.query;
        const skip = (page - 1) * limit;

        let filterQuery = {}

        if(filter=="pending"){
            filterQuery = { isCancelled: { $ne: true}, isFulfilled:{ $ne: true}  }
        }else if(filter =="fulfilled"){
            filterQuery = { isFulfilled: true }
        }else if(filter == "cancelled"){
            filterQuery = {isCancelled: true}
        }

        const orders = await Order.find(filterQuery)
            .select('-paymentDetails')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const totalOrders = await Order.countDocuments();

        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: Number(page)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




//mark order as fulfilled
router.post('/fulfill/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await
        Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.isFulfilled) {
            return res.status(400).json({ message: 'Order is already fulfilled' });
        }
        order.isFulfilled = true;
        await order.save();

        res.status(200).json({ message: 'Order fulfilled successfully', order });
    } catch (err) {

        res.status(500).json({ message: err.message });
    }
});



module.exports = router;