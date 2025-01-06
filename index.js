import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./Src/db/index.js";
import userRouter from "./Src/routes/user.route.js";
import postRouter from "./Src/routes/post.route.js";
import orderRouter from "./Src/routes/order.route.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc";
const app = express()
const port = process.env.PORT || 5000
app.use(cors({
    origin:"https://backend-hackathon-nu.vercel.app/",
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())

app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/admin",orderRouter)

app.get("/", (req, res) => {
    res.send("Hello World!")
})

// Swagger setup
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'User API',
        version: '1.0.0',
        description: 'API for managing user authentication, registration, and more',
        contact: {
            name:"muhammad farhan",
            email:"farhansmit0318@gmail.com",
            phone:"03182127256"
        }
      },
      servers: [
        {
          url: process.env.NODE_ENV === 'production' ? 'https://backend-hackathon-nu.vercel.app/' : 'http://localhost:5000', // Automatically switch URLs
        },
      ],
    },
    apis: ['./Src/routes/*.js'], // Correct path to routes
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

connectDB()
.then(()=>{
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
})
.catch((error)=>{
    console.error("Error connecting to MongoDB:", error);
})
