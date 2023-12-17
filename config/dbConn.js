import mongoose from 'mongoose';

export const connectDB = async () => {
  try{
    await mongoose.connect(process.env.URL);
  }
  catch(err){
    console.log(err)
  }
}