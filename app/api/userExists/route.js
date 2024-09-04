import { NextResponse } from "next/server";
import User from "../../../models/user";
import { connectToDB } from "../../../utils/database";
import GoogleUser from "../../../models/googleuser";


export async function POST(req){
    try {
        await connectToDB();

        const { email } = await req.json();
        const user = await User.findOne({ email }).select('_id');
        const googleUser = await GoogleUser.findOne({ email }).select('_id');

        console.log(`User: ${user} \n GoogleUser: ${googleUser}`);

        return NextResponse.json({user, googleUser});
    } catch(error){
        console.log(error);
        
    }
}