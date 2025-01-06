import postModels from "../models/post.models.js";
import userModels from "../models/user.models.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_CLOUD,
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size
});

const uploadImageToCloudinary = async (localpath) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(localpath, {
            resource_type: "auto", // Automatically detect file type (image, video, etc.)
        });
        fs.unlinkSync(localpath); // Delete local file after upload
        return uploadResult.url; // Return the image URL
    } catch (error) {
        fs.unlinkSync(localpath); // Cleanup if upload fails
        console.error("Cloudinary upload error:", error);
        return null;
    }
};

// Get all posts
export const getAllPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Ensuring page is an integer
    const limit = parseInt(req.query.limit) || 10; // Ensuring limit is an integer
  
    const skip = (page - 1) * limit;

    try {
        // Fetch the posts with pagination
        const posts = await postModels.find().skip(skip).limit(limit);

        // Count the total number of posts in the database (for pagination purposes)
        const totalPosts = await postModels.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalPosts / limit);

        // Send posts along with pagination info
        res.json({
            posts,
            totalPages,
            currentPage: page,
            totalPosts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get post by ID
export const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await postModels.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const productImage =async(req,res)=>{
    if (!req.file || !req.file.path) {
        return res.status(400).json({ message: "No image file uploaded" });
    }

    console.log("File uploaded:", req.file.path);

        const uploadResult = await uploadImageToCloudinary(req.file.path);
        if (!uploadResult) {
            console.error("Cloudinary upload error:", uploadResult);
            await fs.unlink(req.file.path); // Cleanup if upload fails
            return res.status(500).json({ message: "Error occurred while uploading image" });
        }

        const post = await postModels.create({

            images: uploadResult, // Store the image URL in the post
            autorId,
        });



}


export const createPost = async (req, res) => {
    const { name, description, price, category, stock, autorId } = req.body;

    if (!name || !description || !price || !autorId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // if (!req.file || !req.file.path) {
    //     return res.status(400).json({ message: "No image file uploaded" });
    // }

    try {
        // console.log("File uploaded:", req.file.path);

        // const uploadResult = await uploadImageToCloudinary(req.file.path);
        // if (!uploadResult) {
        //     console.error("Cloudinary upload error:", uploadResult);
        //     await fs.unlink(req.file.path); // Cleanup if upload fails
        //     return res.status(500).json({ message: "Error occurred while uploading image" });
        // }

        // Find the user by autorId
        const User = await userModels.findById(autorId);
        if (!User) {
            console.error("User not found for autorId:", autorId);
            return res.status(404).json({ message: "User not found" });
        }

        // Log the user and post creation process
        console.log("User found:", User);

        // Create the post with the image URL
        const post = await postModels.create({
            name,
            description,
            price,
            category,
            stock,
            // images: uploadResult, // Store the image URL in the post
            autorId,
        });

        // Add the post reference to the user
        User.posts.push(post);
        await User.save();

        // Success response
        console.log("Post created successfully:", post);
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        // Log any errors for debugging
        console.error("Error in createPost:", error);

        // Cleanup local file on error
        try {
            await fs.unlink(req.file.path);
        } catch (unlinkError) {
            console.error("Error deleting local file after failure:", unlinkError);
        }

        res.status(500).json({ message: error.message });
    }
};
;

// Edit a post
export const editPost = async (req, res) => {
    const {id} = req.params
    const { name, description, price, } = req.body;

    try {
        const post = await postModels.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Update post details
        post.name = name || post.name;
        post.description = description || post.description;
        post.price = price || post.price;

        await post.save();
        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await postModels.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export { upload };
