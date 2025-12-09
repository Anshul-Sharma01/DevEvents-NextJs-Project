import { Event, IEvent } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


type RouteParams = {
    params : Promise < { slug : string } >;
};


export async function GET( req : NextRequest, { params } : RouteParams ) : Promise < NextResponse >{
    try{
        await connectDB();
        
        const { slug } = await params;

        if(!slug || typeof slug !== 'string' || slug.trim() === ''){
            return NextResponse.json({ message : "Invalid or missing slug parameter" }, { status : 400 });
        };

        const sanitizedSlug = slug.trim().toLowerCase();

        const event : IEvent | null = await Event.findOne({ slug : sanitizedSlug }).lean();

        if(!event){
            return NextResponse.json({ message : `Event with slug ${sanitizedSlug} not found` }, { status : 404 });
        }
        return NextResponse.json({ message : "Event Fetched Successfully !!", event }, { status : 200 });



    }catch(err){
        if(err instanceof Error){
            if(err.message.includes('MONGODB_URI')){
                return NextResponse.json({ message : "Database Configuration Error !!" }, { status : 500 });
            }
            return NextResponse.json({ message : "Failed to fetch event", error : err.message });
        }

        return NextResponse.json({ message : "An unexpected error occurred" },  { status : 500});

    }
}

