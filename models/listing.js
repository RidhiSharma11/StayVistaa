const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listSchema=new Schema({
    title:{
        type:String,
        default:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1720884413532-59289875c3e1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735",
        set:(v)=>v===" "?"https://images.unsplash.com/photo-1720884413532-59289875c3e1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735":v,
    },
    price:Number,
    location:String,
    country:String,
});

const listing=mongoose.model("Listing",listingSchema);
module.exports="Listing";