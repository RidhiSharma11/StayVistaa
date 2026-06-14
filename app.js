const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const expressError = require("./utils/expressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const Listing = require("./models/listing.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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