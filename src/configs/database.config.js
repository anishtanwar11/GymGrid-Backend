import { connect } from 'mongoose';

export const dbConnect = () => {
    connect(process.env.MONGODB_ATLAS_URI)
    .then( () => {
        console.log("MongoDB connected Successfully")
    })
    .catch(error => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    });
};