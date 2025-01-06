import express from "express";
import { createPost, getAllPosts, getPostById, deletePost, editPost, productImage,  } from "../controllers/post.controllers.js";
import { upload } from "../middlewere/multer.middlewere.js";

const router = express.Router();

router.post("/imageupload",upload.single("image"), productImage);
router.post("/create", createPost);
router.get("/all", getAllPosts);
router.get("/:id", getPostById);
router.delete("/:id",  deletePost);
router.put("/:id",  editPost);

export default router;