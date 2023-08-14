const Admin=require('../models/Admin')
const vendor=require('../models/Vendor')
const Hotel=require('../models/Hotel');
const category=require('../models/category');
const jwt = require("jsonwebtoken");
const cloudinary = require('../middleWare/cloudinary')
const Booking=require('../models/Booking');
// .............................category............................
const Addcategory=async(req,res)=>{
    try {
      
            const AdminId = req.id;
            
            const AdminData = await Admin.findOne({ _id: AdminId });
             
            if (AdminData) {
               
                const{newCategory}=req.body
               
                 const  categoryData=new category({
                    categoryname:newCategory
                     })
                     await categoryData.save();
                     
                     if(!categoryData){
                        return res.status(500).json({message:"unable to add category"}) 
                     }
                    return res.status(201).json({categoryData})
                  }else{
                     return res.status(500).json({message:"unable to add category"})
                  }
        
    } catch (error) {
        console.log(error.message);
    }
}
// ...........................get category...........................

const getCategory=async(req,res)=>{
    try {
                 const  categoryData=await category.find().populate()
                     
                     if(!categoryData){
                        return res.status(500).json({message:"unable to find category"}) 
                     }
                    return res.status(201).json({categoryData})

            } catch (error) {
                console.log(error.message);
                
            }
        }

// ...................................add hotel.....................

const AddHotel=async(req,res)=>{
    try {
       
      
            const vendorId = req.id;
            
            const Vendor = await vendor.findOne({ _id: vendorId,proofstatus:true});
                 
            if (Vendor) {
                const Images=[]
              
                const licenseResult = await cloudinary.uploader.upload(req.files.license[0].path) 
                if(!licenseResult){
                    return res.status(500).json({message:"unable to add Hotel proof is not added"}) 
                }
            
                const imageFilenames = req.files?.images
                if(!imageFilenames){
                    return res.status(500).json({message:"unable to add Hotel image is not added"}) 
                }
                for (const image of imageFilenames) {
                    const result = await cloudinary.uploader.upload(image.path);
                    if (result && result.secure_url) {
                        
                        Images.push(result.secure_url);
                    } }
                  
                    const{Name,categoryname,Description,phone,Town,Pin,noofrooms,Rate,AC,FOOD,TV,PETS,PARTYHALL,FISHING,GAMES,WIFI,gust,district}=req.body
            const  HotelData=new Hotel({
                Name,categoryname,Description,phone,Town,Pin,noofrooms,Rate,Images,gust,district,
                Facilities: [{AC,FOOD,TV,PETS,PARTYHALL,FISHING,GAMES,WIFI }],
                vendor:vendorId,proof:licenseResult.secure_url
                })
                const NewHotelData= await HotelData.save() 
                if(!NewHotelData){
                   return res.status(500).json({message:"unable to add Hotel"}) 
                }
               return res.status(201).json({NewHotelData,message:"Hotel Added"})
             }else{
                return res.status(500).json({message:"unable to add Hotel vendor is not verified"})
             }   
    } catch (error) {
        console.log(error.message);
        
    }
}

// ....................................get hoteldata......................................

const hotelData=async(req,res)=>{
    try {
    
            const vendorId = req.id
        
            if (vendorId) {
        const hotels=await Hotel.find({vendor:vendorId})
       console.log(hotels);
       if(hotels){
           return res.status(201).json({hotels})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    }else{
        return res.status(500).json({message:"unable to get Hotel details of this vendor"})
    }

    } catch (error) {
        console.log(error.message);
        
    }
}

// ....................................get Singlehoteldata......................................

const singlehotelData=async(req,res)=>{
    try {
    
            const vendorId = req.id
        
            if (vendorId) {
        const hotels=await Hotel.findById({_id:req.query.id})
       console.log(hotels);
       if(hotels){
           return res.status(201).json({hotels})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    }else{
        return res.status(500).json({message:"unable to get Hotel details of this vendor"})
    }

    } catch (error) {
        console.log(error.message);
        
    }
}
// ....................................get hoteldata request to admin......................................

const hotelDatarequestAdmin=async(req,res)=>{
    try {    
        const hotels=await Hotel.find({proofstatus:false})
       if(hotels){
           return res.status(201).json({hotels})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    } catch (error) {
        console.log(error.message);    
    }
}
// ....................................get hoteldata  to admin......................................

const hotelDataAdmin=async(req,res)=>{
    try {
        
        const hotels=await Hotel.find({proofstatus:true})
       if(hotels){
           return res.status(201).json({hotels})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    } catch (error) {
        console.log(error.message);
        
    }
}
// ....................................get hotelStatus change  by admin......................................

const hotelStatusChange=async(req,res)=>{
    try {
        const id = req.query.id;
        const hotelStatus=await Hotel.findOne({_id:id})
        hotelStatus.status=!hotelStatus.status
        const hotels = await hotelStatus.save();

       if(hotels){
           return res.status(201).json({hotels})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    } catch (error) {
        console.log(error.message);
        
    }
}
// ....................................get hoteldata  to user......................................

const hotelDataUser=async(req,res)=>{
    try {
       
           
       const hotels=await Hotel.find({proofstatus:true,status:false,adminStatus:false}).populate('review')
       if(hotels){
       const categoryData=await category.find({})
           return res.status(201).json({hotels,categoryData})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    } catch (error) {
        console.log(error.message);     
    }
}
// ....................................get hoteldata  to user single view......................................

const singleHotelData=async(req,res)=>{
    try {
       
      
            const userId =req.id;
        const id =req.params.id
       const hotels=await Hotel.find({_id:id,proofstatus:true,status:false}).populate('review.userId')
       if(hotels){
  
           return res.status(201).json({hotels})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    } catch (error) {
        console.log(error.message);     
    }
}
// ....................................get hoteldata  to admin......................................

const updateproofstatus=async(req,res)=>{
    try {
        const id=req.body.id
        const hotels=await Hotel.findByIdAndUpdate({_id:id},{$set:{proofstatus:true}})
       if(hotels){
           return res.status(201).json({hotels})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    } catch (error) {
        console.log(error.message);    
    }
}


// ...........................get booking for vendor..............................



  
// .......................get bookingCount of hotels.......................



const getHotelCounts = async (req, res) => {
    try {
      const { mindate, maxDate } = req.query;
  
      const startDate = mindate;
      const endDate = maxDate;
  
     
  
      const result = await Booking.aggregate([
        {
          $match: {
            BookingStatus: { $ne: "cancelled" },
            paymentStatus: true,
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          },
        },
        {
          $group: {
            _id: "$hotelID",
            count: { $sum: 1 },
          },
        },
      ]);
  
      const hotelIds = result.map(item => item._id);
  
      const hotelsInfo = await Hotel.aggregate([
        {
          $match: {
            _id: { $in: hotelIds },
          },
        },
        {
          $project: {
            Name: 1,
            Images: 1,
            Rate: 1,
            Town: 1,
          },
        },
      ]);
  
      const combinedResults = result.map(item => {
        const hotelInfo = hotelsInfo.find(hotel => hotel._id.toString() === item._id.toString());
        return {
          hotelID: item._id,
          count: item.count,
          Name: hotelInfo ? hotelInfo.Name : null,
          Images: hotelInfo ? hotelInfo.Images : null,
          Rate: hotelInfo ? hotelInfo.Rate : null,
          Town: hotelInfo ? hotelInfo.Town : null,
        };
      });
  
      const sortedCounts = combinedResults.sort((a, b) => b.count - a.count);
  
      res.status(201).json({ mostBooked:sortedCounts });
    } catch (error) {
      console.error('Error getting hotel counts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

// ...........................................
const getHotelsByPlaceAndName = async (req, res) => {
    try {
        const { searchplace, mindate, maxDate } = req.query
    //   const { place, name, startDate, endDate } = req.query;
    const startDate=mindate
        const endDate = maxDate
        // const name = searchplace
        const place = searchplace
  
      const hotelQuery = {
        // $and: [
        //   { Name: { $regex: new RegExp(name, 'i') } },
        //   { 
            Town: { $regex: new RegExp(place, 'i') }
        //  }
        // ],
      };
  
      const hotels = await Hotel.find(hotelQuery);
  
      if (hotels.length < 1) {
        return res.status(404).json({ message: 'Data not found' });
      }
  
      const hotelIds = hotels.map(hotel => hotel._id);
  
      const bookingResult = await Booking.aggregate([
        {
          $match: {
            hotelID: { $in: hotelIds },
            $or: [
              { checkIn: { $gte: new Date(startDate), $lte: new Date(endDate) } },
              { checkOut: { $gte: new Date(startDate), $lte: new Date(endDate) } },
              { $and: [{ checkIn: { $lte: new Date(startDate) } }, { checkOut: { $gte: new Date(endDate) } }] }
            ],
          },
        },
        {
          $group: {
            _id: '$hotelID',
            count: { $sum: 1 },
          },
        },
      ]);
  
    //   if (!bookingResult || bookingResult.length === 0) {
    //     return res.status(404).json({ message: 'No bookings found' });
    //   }
  
      res.status(200).json({ hotels, bookingResult });
    } catch (error) {
      console.error('Error getting hotels:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
 
  

const getHotelsWithReviewCounts = async (req, res) => {
    try {
        console.log(req.query)
        const{mindate,maxDate}=req.query
        
        const startDate = mindate
        const endDate = maxDate
      const hotels = await Hotel.find({});
      const Cancelledhotels = await Booking.find({
        BookingStatus: 'cancelled',
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });
  
      if (hotels.length < 1) {
        return res.status(404).json({ message: 'Data not found' });
      }
  
      const hotelIds = hotels.map(hotel => hotel._id);
  
      const ratingResult = await Hotel.aggregate([
        {
          $match: {
            _id: { $in: hotelIds },
          },
        },
        {
          $project: {
            Name: 1,
            Town: 1,
            Images: 1,
           count: {
              $sum: {
                $map: {
                  input: '$review',
                  as: 'review',
                  in: '$$review.rating',
                },
              },
            },
          },
        },
      ]);
  
      if (!ratingResult || ratingResult.length === 0) {
        return res.status(404).json({ message: 'No reviews found' });
      }
  
 
    const hotelCancellationCounts = {};

    for (const cancelledHotel of Cancelledhotels) {
      const hotelDetail = await Hotel.findOne({ _id: cancelledHotel.hotelID });
      if (hotelDetail) {
        if (!hotelCancellationCounts[cancelledHotel.hotelID]) {
          hotelCancellationCounts[cancelledHotel.hotelID] = {
            count: 1,
            Images: hotelDetail.Images,
            Name: hotelDetail.Name,
            Town: hotelDetail.Town,
          };
        } else {
          hotelCancellationCounts[cancelledHotel.hotelID].count++;
        }
      }
    }

    const cancelledHotelDetails = Object.entries(hotelCancellationCounts).map(([hotelID, data]) => ({
      ...data,
      _id: hotelID,
    }));

    res.status(200).json({ hotels: ratingResult, Cancelledhotels: cancelledHotelDetails });
    } catch (error) {
      console.error('Error getting hotels with rating sum:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // ..............................edit hotel ...............................


  
const EditHotel=async(req,res)=>{
  try {
     
          const vendorId = req.id;
          const id=req.query.id
       
          const Vendor = await vendor.findOne({ _id: vendorId,proofstatus:true});
               
          if (Vendor) {
           
              const NewHotelData= await Hotel.findById({_id:id})
              console.log(NewHotelData,'newhotelData');
                if(NewHotelData){

                  const{Name,categoryname,Description,phone,Town,Pin,noofrooms,Rate,AC,FOOD,TV,PETS,PARTYHALL,FISHING,GAMES,WIFI,gust,district}=req.body
         
            NewHotelData.Name=Name
            NewHotelData.categoryname = categoryname
            NewHotelData.Description = Description
            NewHotelData.phone = phone
            NewHotelData.Town = Town
            NewHotelData.Pin = Pin
            NewHotelData.noofrooms = noofrooms
            NewHotelData.Rate = Rate
            NewHotelData.gust = gust
            NewHotelData.district = district
            NewHotelData.Facilities= [{AC,FOOD,TV,PETS,PARTYHALL,FISHING,GAMES,WIFI }]
             
            
               NewHotelData.save() 
               
               return res.status(201).json({NewHotelData,message:"Hotel Updated"})
                }
              else{

                return res.status(500).json({message:"unable to update Hotel"}) 
              }
              
           }else{
              return res.status(500).json({message:"unable to update.. vendor is not verified"})
           }   
  } catch (error) {
      console.log(error.message);
      
  }
}
  
  
  




module.exports={
    AddHotel,
    hotelData,
    Addcategory,
    getCategory,
    hotelDatarequestAdmin,
    hotelDataAdmin,
    updateproofstatus,
    hotelDataUser,
    singleHotelData,
    hotelStatusChange,
    getHotelCounts,
    getHotelsByPlaceAndName,
    getHotelsWithReviewCounts,
    EditHotel,
    singlehotelData
    

}