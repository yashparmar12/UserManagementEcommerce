import mongoose from 'mongoose';

const razorpaySchema = new mongoose.Schema({
    orderId: { 
        type: String,
        // required: true,
    },
    paymentId: { 
        type: String,
        // required: true,
    },
    signature: { 
        type: String,
        // required: true,
    },
    amount: { 
        type: Number,
        // required: true,
    },
    currency: { 
        type: String,
        default: 'INR',
    },
    status: { 
        type: String,
        enum: ['created', 'paid', 'failed'],
        default: 'created',
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userAdminModel',
        // required: true,
    },
    product: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productModel',
            // required: true,
        },
    ],
    createdAt: { 
        type: Date,
        default: Date.now,
    },
    updatedAt: { 
        type: Date,
        default: Date.now,
    },
});

export const razorpayModel = mongoose.model('razorpayModel', razorpaySchema);
