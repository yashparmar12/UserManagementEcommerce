import mongoose from "mongoose";

const product = new mongoose.Schema({
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
})

export const productsModel = mongoose.model("productsModel", product);
