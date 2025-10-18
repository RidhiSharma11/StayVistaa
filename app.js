const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");

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

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("Hey! I am the root");
})

//Index Route
app.get("/listings",async(req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
})

//Show Route
app.get("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
})

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

app.listen(6060,()=>{
    console.log("Port is working succesfully");
});