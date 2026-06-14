const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/StayVistaa";

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


const initDB = async () => {
    await Listing.deleteMany({});

const updatedData = initData.data.map((obj) => {
    let title = obj.title.toLowerCase();

    if (title.includes("beach") || title.includes("island")) {
        obj.category = "trending";
    } 
    else if (title.includes("mountain") || title.includes("cabin")) {
        obj.category = "mountains";
    } 
    else if (title.includes("city") || title.includes("downtown") || title.includes("apartment")) {
        obj.category = "cities";
    } 
    else if (title.includes("pool") || title.includes("villa")) {
        obj.category = "pools";
    } 
    else if (title.includes("camp") || title.includes("treehouse")) {
        obj.category = "camping";
    } 
    else if (title.includes("farm") || title.includes("cottage")) {
        obj.category = "farms";
    } 
    else if (title.includes("snow") || title.includes("ski")) {
        obj.category = "snow";
    } 
    else if (title.includes("boat") || title.includes("ship")) {
        obj.category = "ships";
    } 
    else if (title.includes("dome")) {
        obj.category = "domes";
    } 
    else {
        obj.category = "room";
    }

    return obj;
});

    await Listing.insertMany(updatedData);
    console.log("Database is initialized with categories");
};
initDB();