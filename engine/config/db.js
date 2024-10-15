import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `Connected to MongoDB: ${connect.connection.host}`.cyan.underline,
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
