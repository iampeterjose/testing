import Order from "../../../../models/order";
import { connectToDB } from "../../../../utils/database";

export const POST = async (request) => {

    try {
        await connectToDB();

        const { creator, orders, price, orderId } = await request.json();
        const newOrder = new Order({ creator, orders, price, orderId });

        await newOrder.save();
        
        return new Response(JSON.stringify(newOrder), {status: 201});
    } catch (error) {
        return new Response('Failed to create the order', {status: 500});
    }
}