import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from "../../../../utils/database";
import GoogleUser from "../../../../models/googleuser";
import CredentialsProvider from 'next-auth/providers/credentials';
import User from "../../../../models/user";
import bcrypt from 'bcryptjs';


const handler = NextAuth({
    providers: [
        GoogleProvider({
            name: 'Google',
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},

            async authorize (credentials) {
                const { email, password } = credentials;
                try {
                    await connectToDB();

                    const user = await User.findOne({email});

                    if(!user){
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if(!passwordsMatch){
                        return null;
                    }

                    return user;

                } catch (error) {
                    console.log('Error during credentials authorization: ', error);
                }
            }
        })
    ],
    callbacks: {
        async session({ session }){
            try {
                await connectToDB();
                //fetch user by email
                const googleUser = await GoogleUser.findOne({
                    email: session.user.email
                });

                if(googleUser){
                    session.user.id = googleUser._id.toString(); 
                }
                else{
                    // Check if user is a regular User
                    const user = await User.findOne({ email: session.user.email });

                    if (user) {
                        session.user.id = user._id.toString();
                    }
                }
            } catch (error) {
                console.log(`Error fetching session user: `, error);
            }
            
            return session;
        },
        async signIn({ profile, account, credentials }){
            if(account?.provider === 'google'){
                try {
                    await connectToDB();
    
                    // Remove spaces from username and ensure it fits the criteria
                    const sanitizedUsername = profile.name.replace(/\s+/g, '').toLowerCase();
        
                    // check if user already exist
                    const googleUserExist = await GoogleUser.findOne({
                        email: profile.email
                    })
        
                    // if not, create new user
                    if(!googleUserExist){
                        await GoogleUser.create({
                            email: profile.email,
                            username: sanitizedUsername,
                            image: profile.picture
                        });
                    }
                    return true;
                 } catch (error) {
                    console.log(`Error during Google sign in: `, error);
                    return false;
                 }
            }
            else{
                try {
                    await connectToDB();

                    const user = await User.findOne({
                        email: credentials.email
                    });
                    if(user){
                        return true;
                    }

                    return false;
                } catch (error) {
                    console.log(`Error during Credentials sign in: `, error);
                }
            }
        }
    }
    
});

export { handler as GET, handler as POST };