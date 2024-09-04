import { Schema, model, models } from "mongoose";

const GoogleUserSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'Email already exists!'],
        required: [true, 'Email is required!']
    },
    username: {
        type: String,
        unique: [true, 'Username already exists!'],
        required: [true, 'Username is required!'],
        match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 8-20 alphanumeric letters and be unique!"]
    },
    image: {
        image: String
    },
}, { timestamps: true }
);

const GoogleUser = models.GoogleUser || model('GoogleUser', GoogleUserSchema);
export default GoogleUser;