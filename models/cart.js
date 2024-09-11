import { Schema, model, models } from "mongoose";

// Define a schema for individual order items
const orderItemSchema = new Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
}, { _id: false });

const CartSchema = new Schema({
    creator: {
        type: String,
        ref: 'User',
        required: true,
        unique: true,
    },
    items: [orderItemSchema]
});

const Cart = models.Cart || model('Cart', CartSchema);
export default Cart;