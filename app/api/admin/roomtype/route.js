// NextResponse is used to send responses from Next.js API routes
import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import RoomType from "@/model/roomtype";

// Mongoose model for Room collection
import Room from "@/model/room";


// ===================== GET REQUEST =====================
// Purpose: Fetch all room types from the database
export async function GET() {

  // Ensure database connection before any DB operation
  await dbConnect();

  try {
    // Fetch all documents from RoomType collection
    const roomtype = await RoomType.find({});

    // Send fetched room types as JSON response
    return NextResponse.json(roomtype);

  } catch (error) {
    // If any error occurs, send error message with 500 status
    return NextResponse.json(
      { err: error.message },
      { status: 500 }
    );
  }
}


// ===================== POST REQUEST =====================
// Purpose: Create a new room type and a room linked to it
export async function POST(req) {

  // Ensure database connection
  await dbConnect();

  // Read request body (coming from client)
  const body = await req.json();

  // Extract "name" from request body
  const { name } = body;

  try {
    // Create a new room type document
    const roomtype = await RoomType.create({ name });

    // Create a room and link it with roomtype using ObjectId
    const room = await Room.create({
      roomtype_id: roomtype?._id // optional chaining for safety
    });

    // Log created room (useful for debugging)
    console.log("Room", room);

    // Send both created roomtype and room as response
    return NextResponse.json({
      roomtype,
      room,
    });

  } catch (error) {
    // Handle any server or database errors
    return NextResponse.json(
      { err: error.message },
      { status: 500 }
    );
  }
}
