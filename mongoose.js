import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const config = process.env;

/// The MongoDB Atlas password is in the .env file
const atlas_pass = config.ATLAS_PASS;
const uri = "mongodb+srv://root:" + atlas_pass + "@bus-ticket-app.tak6kcz.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri)
.then(() => console.log("Database connected!"))
.catch(err => console.log("Mongoose errors are the following " + err));

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name'],
        lowercase: true
    },
    email: {
        type: String,
        //unique: [true, 'email is taken'],
        lowercase: true,
    },
    passwordHashed: {
        type: String,
        required: [true, 'Please enter password'],
        minLength: [5, 'at least 5 characters'],
        maxLength: [100, 'too many characters']
    },
    phoneNumber: {
        type: String,
        required: [false],
        minLength: [10, "no should have minimum 10 digits"],
        maxLength: [10, "no should have maximum 10 digits"]
    }
})

const User = mongoose.model('user', userSchema);

export default User;
