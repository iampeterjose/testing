import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
    creator: {
        type: String,
        ref: 'User',
        required: true,
    },
    orders: [{
        type: Map,
        of: Schema.Types.Mixed,
        required: true,
    }],
    orderId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const Order = models.Order || model('Order', OrderSchema);
export default Order;