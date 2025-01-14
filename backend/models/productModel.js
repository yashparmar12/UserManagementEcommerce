import mongoose from "mongoose";

const product = new mongoose.Schema({
    category: { type: String, enum: ['mobile', 'laptop', 'tv', 'tablet'] },
   
    brandName:{
        type: String,
        // required: true
    },
    modelName:{
        type: String
    },
    image:{
        type: String
    },
    

    // ----Mobiles----
    ram:{
        type: String
    },
    memory:{
        type: String
    },
    battery:{
        type: String
    },
    frontCamera:{
        type: String
    },
    backCamera:{
        type: String
    },
    simType:{
        type: String
    },
    displaySize:{
        type: String
    },
    price:{
        type: Number
    },
    productQuantity: {
        type: Number, 
             
    },
    warranty: {
        type: String,     
    },
    processor: {
        type: String,     
    },
    windows: {
        type: String,     
    },

})

export const productsModel = mongoose.model("productsModel", product);
