import Cart from "../../../models/cart";
import { connectToDB } from "../../../utils/database";

export async function GET(request) {
    try {
        await connectToDB();

        // Extract creator from query parameters
        const url = new URL(request.url);
        const creator = url.searchParams.get('creator');

        if(!creator){
            return new Response('Invalid data', {status: 400});
        }

        const cart = await Cart.findOne({ creator });

        if(cart){
            return new Response(JSON.stringify(cart), {status: 200});
        }
        else{
            return new Response('Cart not found', {status: 404});
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
        return new Response('Error Internal Server', {status: 500});
    }
}

export async function POST(request) {
    try {
        await connectToDB(); // Ensure database connection

        const { creator, items } = await request.json();

        if (!creator || !items || !Array.isArray(items)) {
            return new Response('Invalid data', { status: 400 });
        }

        // Fetch the existing cart for the creator
        const existingCart = await Cart.findOne({ creator });

        if (existingCart) {
            // Loop through each item in the request
            for (const item of items) {
                // Check if item with the same id already exists in the cart
                const existingItemIndex = existingCart.items.findIndex(cartItem => cartItem.id === item.id);

                if (existingItemIndex !== -1) {
                    // If item exists, update its quantity
                    existingCart.items[existingItemIndex].quantity += item.quantity;
                } else {
                    // If item does not exist, add it to the cart
                    existingCart.items.push(item);
                }
            }

            // Save the updated cart
            await existingCart.save();
        } else {
            // If cart doesn't exist, create a new one with the items
            const newCart = new Cart({ creator, items });
            await newCart.save();
        }

        return new Response('Item added to cart DB', { status: 200 });
    } catch (error) {
        console.error('Error handling POST request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectToDB(); // Ensure database connection

        const { creator, itemId, quantity } = await request.json();

        if (!creator || itemId === undefined || quantity === undefined) {
            return new Response('Invalid data', { status: 400 });
        }

        // Convert itemId to number if it’s not already
        const itemIdNumber = parseInt(itemId, 10);
        if (isNaN(itemIdNumber)) {
            return new Response('Invalid item ID format', { status: 400 });
        }

        const cart = await Cart.findOne({ creator });

        if (!cart) {
            return new Response('Cart not found', { status: 404 });
        }

        // Find the item index in the cart
        const itemIndex = cart.items.findIndex(item => item.id === itemIdNumber);

        if (itemIndex === -1) {
            return new Response('Item not found in cart', { status: 404 });
        }

        // Update the item quantity
        if (quantity < 1) {
            // Remove item if quantity is 0
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = Number(quantity);
        }

        await cart.save();

        return new Response('Cart updated successfully', { status: 200 });
    } catch (error) {
        console.error('Error updating cart item:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}


export async function DELETE(request) {
    try {
        await connectToDB(); // Ensure database connection

        const { creator } = await request.json();

        if (!creator) {
            return new Response('Invalid data', { status: 400 });
        }

        await Cart.findOneAndUpdate(
            { creator },
            { $set: { items: [] } } // Set items to an empty array
        );

        return new Response('All items removed from cart', { status: 200 });
    } catch (error) {
        console.error('Error handling DELETE request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

