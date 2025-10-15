const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");

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


app.get("/",(req,res)=>{
    res.send("Hey! I am the root");
})

app.get("/testlisting",async(req,res)=>{
     let sampletesting=new Listing({
      title:"My new Villa",
      description:"By the Beach",
      price:1200,
      location:"Calangute,Goa",
      country:"India",
  });
  await sampletesting.save();
  console.log("Database was saved");
  res.send("Successful Testing");
});

app.listen(6060,()=>{
    console.log("Port is working succesfully");
});