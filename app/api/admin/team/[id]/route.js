import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Team from "@/model/team";

// PUT method for updating an existing team members in the database
export async function PUT(req, context){

    await dbConnect();

    // Extract the team member ID from the parameters
    const {id} = await context?.params;

    if(!id){
        return NextResponse.json({error:"Team member id required"});
    }

    try{
       
        // Parse the incoming request for JSON data then containing updating fields
         const body = await req.json(); // You need to get all this data from the client side in the model

         // Find the team member by ID and update the document within the new data
         const updatingTeam = await Team.findByIdAndUpdate(
            id, body, {
                new: true
        });

        // If no team member is found within a given array then return 404 not found response to the client side
        if(!updatingTeam){
            return NextResponse.json({error: "Team member not found"});
        }

        return NextResponse.json(updatingTeam);

    }catch(error){

        return NextResponse.json({error: error.message}, {status: 500});

    }
}

export async function DELETE(req, context){
    await dbConnect();

    try{
        
        // Find the team member by id from the keyword parameter in the document
        const deletingTeam = await Team.findByIdAndDelete(context.params.id);

        // Return the deleted document as a confirmation in the resposne to the client side
        return NextResponse.json(deletingTeam);

    }catch(error){

        return NextResponse.json({
            error: error.message
        }, {status: 500});
        
    }
}