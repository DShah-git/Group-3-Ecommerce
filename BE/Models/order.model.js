const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [
        {
            product: Object,
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    total: { type: Number, required: true, min: 0 },
    isFulfilled: { type: Boolean, default: false },
    paymentStatus: {
        type: String,
        enum: [ 'paid', 'failed', 'refunded'],
        default: 'paid'
    },
    isCancelled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);