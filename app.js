const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const review = require("./models/review.js");

const MONGO_URL="mongodb://127.0.0.1:27017/StayVistaa"

main()
  .then(()=>{
    console.log("connected to DB");
  })
  .catch(err=>{
    console.log(err);
  });

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.engine("ejs", ejsMate);
app.set("view engine","ejs");
app.use(express.json());
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

app.get("/", wrapAsync(async (req, res) => {
  const featured = await Listing.find({}).limit(3);
  res.render("listings/home.ejs", { featured });
}));

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

const validateReview = (req,res,next) =>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new expressError(400, errMsg);
  }
  else{
    next();
  }
};

// Index Route
app.get("/listings",wrapAsync(async(req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
}));

app.get("/login",(req,res)=>{
res.render("listings/login.ejs");
});

app.get("/signup",(req,res)=>{
res.render("listings/signup.ejs");
});

app.post("/signup", async (req,res)=>{
   res.redirect("/");  
});


app.post("/login", async (req,res)=>{
   res.redirect("/"); 
});

//New Route
app.get("/listings/new",wrapAsync(async(req,res)=>{
  res.render("listings/new.ejs");
}));

//Show Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs",{listing});
  console.log(listing.reviews);
}));

//Create Route
app.post("/listings", validateListing,
  wrapAsync(async(req,res,next)=>{
  const newListing=new Listing (req.body.listing);
  await newListing.save();
  res.redirect("/listings");
})
);

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.put("/listings/:id", validateListing, 
  wrapAsync(async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  let deletedlisting=await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  res.redirect("/listings");
}));

//Reviews
//Post Routes
app.post("/listings/:id/reviews", validateReview,
  wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    await newReview.save();          
    listing.reviews.push(newReview._id);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
    console.log("BODY:", req.body);
}));

//Review Delete Post
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
  );

app.use((req,res,next)=>{
  next(new expressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
  let{statusCode = 500,message = "Something went wrong!"} = err;
  res.render("error.ejs",{message});
  // res.status(statusCode).send(message);
});


app.listen(6060,()=>{
    console.log("Port is working succesfully");
});







// app.get("/testlisting",async(req,res)=>{
//      let sampletesting=new Listing({
//       title:"My new Villa",
//       description:"By the Beach",
//       price:1200,
//       location:"Calangute,Goa",
//       country:"India",
//   });
//   await sampletesting.save();
//   console.log("Database was saved");
//   res.send("Successful Testing");
// });

