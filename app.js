const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("../models/listing.js");

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

app.get("/testlisting",(req,res)=>{
     let sampletesting=new Listing({
      
  })
});

app.listen(6060,()=>{
    console.log("Port is working succesfully");
});