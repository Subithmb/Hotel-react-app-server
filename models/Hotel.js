const mongoose=require("mongoose"); 

// user sign-up schema

const hotelSchema = new mongoose.Schema({
  Name: {
      type: "String",
      required: true
    },
    categoryname: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'category',
      required: true,
    },
    review: [{
      rating:{type:'number'},
      feedback:{type:'string'},
      userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
      },
      createdAt:{type:Date,
        default:Date.now()

      }
    }],
    Description: {
        type: "String",
        required: true
    },
    phone: {
        type: "number",
        required: true
    },
    Pin: {
        type: "number",
        required: true
    },
    noofrooms: {
        type: "number",
        required: true
    },
    Rate: {
        type: "number",
        required: true
    },
    Town: {
      type: "String",
      required: true
    },
    proof: {
      type: "String",
      required: true
    },
    district: {
      type: "String",
      required: true
    },
    gust: {
      type: "number",
      required: true
    },
   
    Images: {type:Array},

  Facilities: [{
    AC:{
        type:Boolean,
        default:true
    },
    FOOD:{
        type:Boolean,
        default:true
    },
    TV:{
        type:Boolean,
        default:true
    },
    PETS:{
        type:Boolean,
        default:true
    },
    PARTYHALL:{
        type:Boolean,
        default:true
    },
    FISHING:{
        type:Boolean,
        default:true
    },

    GAMES:{
        type:Boolean,
        default:true
    },
    WIFI:{
        type:Boolean,
        default:true
    }
     }],
    
    status: {
      type: "boolean",
      default:false
    },
    adminStatus: {
      type: "boolean",
      default:false
    },
    proofstatus: {
      type: "boolean",
      default:false
    },
   
   vendor:{
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref:'Vendor'

   }          
    
  },{timestamps:true}
  );
  //{Name,Description,phone,Town,Pin,noofrooms,Rate,gust,district}


 module.exports = mongoose.model("Hotel",hotelSchema);

