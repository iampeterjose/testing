import { NextResponse } from "next/server";
import { connectToDB } from "../../../utils/database";
import bcrypt from 'bcryptjs';
import User from "../../../models/user";

export async function POST(req) {
    try {
        await connectToDB();

        const { email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ email, password: hashedPassword })

        return NextResponse.json({message: 'User registered successfully.'}, {status:201});
    } catch (error) {
        return NextResponse.json({message: 'Error occured while registering the user.'}, {status:500});
    }
}