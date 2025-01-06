import orderModels from "../models/order.models.js";
import postModels from "../models/post.models.js";
import userModels from "../models/user.models.js";

export const orderPost = async (req, res) => {
    const { autorId, products } = req.body;

    try {
        // Validate required fields
        if (!autorId || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid input: autorId and products are required." });
        }

        // Fetch user
        const user = await userModels.findById(autorId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Fetch product details and calculate total amount
        const items = [];
        let totalAmount = 0;

        for (const product of products) {
            const post = await postModels.findById(product.productId); // Assuming `productId` is in `products`
            if (!post) {
                return res.status(404).json({ message: `Product with ID ${product.productId} not found.` });
            }

            const quantity = product.quantity || 1; // Default quantity is 1 if not provided
            totalAmount += post.price * quantity;

            items.push({
                product: post._id,
                name: post.name,
                price: post.price,
                quantity,
            });
        }

        // Create order
        const order = await orderModels.create({
            user: user._id,
            items,
            totalAmount,
            orderStatus: "Pending", // Default status can be changed as needed
        });

        // Send success response
        res.status(201).json({
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


 export const allOrders = async (req,res)=>{
    try{

        const orders = await orderModels.find();
        
        res.status(200).json({
            orders
        })
    }
    catch (error){
res.status(400).json({
    massage:"Order not founds"
})
console.log(error);

    }
    
}

