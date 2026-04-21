const mongoose=require("mongoose");
const { listingSchema } = require("../schema");
const Schema=mongoose.Schema;
const Review = require("./review.js");

const listSchema=new Schema({
    title:{
        type:String,
        default:true,
    },
    description:String,
image: {
  filename: {
    type: String,
    default: "listingimage"
  },
  url: {
    type: String,
    default: "https://images.unsplash.com/photo-1720884413532-59289875c3e1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735"
  }
},

    price:Number,
    location:String,
    country:String,
    reviews: [
      {
        type:Schema.Types.ObjectId,
        ref:"Review"
      },
    ],
});

// listingSchema.post("findOneAndDelete",async(listing)=>{
//   if(listing){
//     await Review.deleteMany({_id: { $in: listing.reviews}});
//   }
// });

const Listing=mongoose.model("Listing",listSchema);
module.exports=Listing;