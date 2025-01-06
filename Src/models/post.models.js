import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
     
      images:{
        type:String
      },
      
      
      createdAt: {
        type: Date,
        default: Date.now,
      },
      autorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

export default mongoose.model("Post", postSchema);