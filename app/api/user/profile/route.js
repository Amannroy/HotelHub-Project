
import { NextResponse } from "next/server"; // Used to send json response from backend

import dbConnect from "@/utils/dbConnect";

import User from "@/model/user";


import bcrypt from "bcrypt";


import { getServerSession } from "next-auth/next";

import { authOptions } from "@/utils/authOptions";

// Function to update logged-in admin profile
export async function POST(req){
    await dbConnect();

    const session = await getServerSession(authOptions);

    const {name, email, password, profileImage, mobileNumber, address, country} = await req.json();

    console.log({name, email, password, profileImage, mobileNumber, address, country});
    

    try{
       
        if(!session?.user?._id){
            return NextResponse.json({err:"Not authenticated"}, {status:401});
        }


        let updatedUser = await User.findByIdAndUpdate(
            session?.user?._id,
            {
                name,
                password: await bcrypt.hash(password, 10),
                image: profileImage,
                mobileNumber,
                address,
                country,
            }, 
            {new: true}
        );


        if(!updatedUser){
            return NextResponse.json({err: "User not found"}, {status: 404})
        }

        console.log("updatedUser", updatedUser);
        
        return NextResponse.json({msg: "User Updated Successfully"},
            {status: 200}
        )
    }catch(error){
       return NextResponse.json({err:error.message}, {status:500})
    }
}

// Get Function handler to fetch the logged-in admin profile
export async function GET(req){

    await dbConnect();


    const session = await getServerSession(authOptions);

    try{
        
        if(!session?.user?._id){
            return NextResponse.json({err:"Not Authenticated"}, {status: 401})
        }

        // Query database to get the user info by ID from the session
        const user = await User.findOne({_id: session?.user?._id});

        return NextResponse.json(user);
    }catch(error){
        return NextResponse.json({err: error.message}, {status: 500})
    }
}