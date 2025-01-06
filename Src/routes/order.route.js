import express from "express";
import { allOrders, orderPost, } from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/orders", orderPost);
router.get("/allOrders", allOrders);



export default router;