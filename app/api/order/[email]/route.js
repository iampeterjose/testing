import Order from "../../../../models/order";
import { connectToDB } from "../../../../utils/database"; 

export const GET = async (request, { params }) => {
    const { email } = params;

    try {
        await connectToDB();

        const orders = await Order.find({creator: email});

        return new Response(JSON.stringify(orders), {status: 201});
    } catch (error) {
        console.log(`Error fetching orders: `, error);
        return new Response(`Failed to fetch orders!`, {status: 500});
    }
};