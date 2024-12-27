import mongoose from 'mongoose';

const userAdmin = new mongoose.Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['admin','user'],
        default: 'user'
    },

    image: {
        type: String,
        required: false
    },
    content: [
        {
            taskName: {
                type: String,
            },
            startTime: {
                type: Date,  
                required: false
            },
            endTime: {
                type: Date,  
                required: false
            },
            totalTime: {
                type: String,  
                required: false
            }
        }
    ],
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'productModel'
        }
    ],
   
    orders: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'productModel', 
            },
            quantity: {
                type: Number,
                 
            },
        },
    ],
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'productModel', 
            },
            quantity: {
                type: Number,
                default: 1, 
            },
        },
    ],
})

export const userAdminModel = mongoose.model("userAdminModel", userAdmin);




