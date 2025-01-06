import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    
    role: {
        type: String,
        required: true,
        
    },
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ],

    orders:[[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }
]

    ]

    
});


export default mongoose.model("User", userSchema);