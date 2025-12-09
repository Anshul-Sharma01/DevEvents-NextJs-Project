import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req : NextRequest){
    try{

        await connectDB();
        
        const formData = await req.formData();

        let event;

        try{
            event = Object.fromEntries(formData.entries());
        }catch(err){
            return NextResponse.json({ message : "Invalid JSON Data Format !!" }, {status : 400});
        }

        const createdEvent = await Event.create(event);
        return NextResponse.json({ message : "Event Created Successfully !!", event : createdEvent }, { status : 201 });

    }catch(err){
        console.error(err);
        return NextResponse.json({ message : "Event Creation Failed !!", error : err instanceof Error ? err.message : "Unknown" }, { status : 500});
    }
}









