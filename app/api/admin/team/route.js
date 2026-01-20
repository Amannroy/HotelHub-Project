import dbConnect from "@/utils/dbConnect";

import { NextResponse } from "next/server";

import Team from "@/model/team";


// Get function to fetch all the team entries from the database
export async function GET(){
    // Ensure database is connected before performing any operations
    await dbConnect();

    try{
        const team = await Team.find({}); 

        return NextResponse.json(team);

    }catch(error){
        return NextResponse.json({err: error.message}, {status: 500});
    }
}

// Post function to create a entry in the database
export async function POST(req){
    await dbConnect();

    // Parse the incoming request bodies that you got in JSON format from the client
    const body = await req.json();
         const {name, image, position} = body;
    try{
         const team = await Team.create({
            name, image, position,
         });

         console.log("team", team);

    return NextResponse.json(team);
         
    }catch(error){

        return NextResponse.json({err: error.messsage}, {status: 500});

    }
}


