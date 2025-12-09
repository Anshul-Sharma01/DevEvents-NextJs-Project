"use server";

import { Event } from "@/database";
import connectDB from "../mongodb";


export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();

    const sanitizedSlug = slug?.trim().toLowerCase();
    if (!sanitizedSlug) return [];

    const event = await Event.findOne({ slug: sanitizedSlug }).lean();
    if (!event || !Array.isArray(event.tags) || event.tags.length === 0) return [];

    return await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();
  } catch (err) {
    return [];
  }
};








