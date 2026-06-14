const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");
const Listing=require("../models/listing.js");


const validateListing = (req,res,next) =>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new expressError(400, errMsg);
  }
  else{
    next();
  }
};

// Index Route
router.get("/", async (req,res)=>{
  let { location } = req.query;

  let filter = {};

  if(location){
    filter = {
      $or: [
        { location: { $regex: location, $options: "i" } },
        { country: { $regex: location, $options: "i" } },
        { title: { $regex: location, $options: "i" } }
      ]
    };
  }

  const allListings = await Listing.find(filter);

  console.log("SEARCH:", location);
  console.log("RESULTS:", allListings.length);

  res.render("listings/index.ejs",{allListings});
});


//New Route
router.get("/new",wrapAsync(async(req,res)=>{
  res.render("listings/new.ejs");
}));

//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs",{listing});
  console.log(listing.reviews);
}));

//Create Route
router.post("/", validateListing,
  wrapAsync(async(req,res,next)=>{
  const newListing=new Listing (req.body.listing);
  await newListing.save();
  res.redirect("/listings");
})
);

//Edit Route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/:id", validateListing, 
  wrapAsync(async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

router.delete("/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  let deletedlisting=await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  res.redirect("/listings");
}));

module.exports=router;