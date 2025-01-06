import express from "express";
import orderPost, { allOrders } from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/orders", orderPost);
router.get("/allOrders", allOrders);



export default router;