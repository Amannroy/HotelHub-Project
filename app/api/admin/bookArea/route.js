// This is a Next.js API Route that stores and fetches “Promo / Book Area” data from MongoDB.
// Example promo:
// Title, Description, Image, Link

import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import BookArea from "@/model/bookarea";

// Frontend calls API, DB connects, Promo fetched, Empty object if not found, Data sent back
export async function GET(req) {
  await dbConnect();

  try {
    let promo = await BookArea.findOne();

    if (!promo) {
      promo = {
        shortTitle: "",
        mainTitle: "",
        shortDesc: "",
        linkUrl: "",

        photoUrl: "",
      };
    }

    return NextResponse.json(promo);
  } catch (error) {
    return NextResponse.json({ err: error.mesaage }, { status: 500 });
  }
}

// Admin submits form, Data sent in request body, DB connects, Promo updated OR created, Success response sent
export async function PUT(req) {
  await dbConnect();

  try {
    const body = await req.json();

    const { shortTitle, mainTitle, shortDesc, linkUrl, photoUrl } = body;

    let promo = await BookArea.findOne();

    if (promo) {
      ((promo.shortTitle = shortTitle),
        (promo.mainTitle = mainTitle),
        (promo.shortDesc = shortDesc),
        (promo.linkUrl = linkUrl),
        (promo.photoUrl = photoUrl),
        await promo.save());
    } else {
      promo = await BookArea.create({
        shortTitle,
        mainTitle,
        shortDesc,
        linkUrl,
        photoUrl,
      });
    }

    return NextResponse.json({ message: "Promo updated successfully", promo });
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
