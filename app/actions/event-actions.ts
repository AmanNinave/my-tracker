'use server';

import { db } from "@/db/drizzle";
import { eventsTable } from "@/db/schema";
import { revalidatePath } from "next/cache";

// Function to create an event or task
export async function createEvent(formData: FormData): Promise<{ error: string } | { success: boolean }> {
  const type = formData.get('type') as string || "work"; // task or event
  const plannedStartTime = formData.get('plannedStartTime')  as string;
  const plannedEndTime = formData.get('plannedEndTime') as string;
  const actualStartTime = formData.get('actualStartTime') as string;
  const actualEndTime = formData.get('actualEndTime') as string;
  const category = formData.get('category') as string || "test";
  const subCategory = formData.get('subCategory') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const remark = formData.get('remark') as string;
  const rating = formData.get('rating') ? parseInt(formData.get('rating') as string, 10) : null;
  const breaks = formData.get('breaks') ? JSON.parse(formData.get('breaks') as string) : [];


  const date = formData.get('date') as string;
  const time = formData.get('time') as string;

  const dateTime = new Date(`${date}T${time}:00`);

  // Validate required fields
  if (!type || !dateTime || !category || !title || !description) {
    return { error: 'Required fields are missing' };
  }

  try {
    await db.insert(eventsTable).values({
      type,
      plannedStartTime: dateTime,
      plannedEndTime: plannedEndTime ? new Date(plannedEndTime) : null,
      actualStartTime: actualStartTime ? new Date(actualStartTime) : null,
      actualEndTime: actualEndTime ? new Date(actualEndTime) : null,
      category,
      subCategory: subCategory || null,
      title,
      description,
      remark: remark || null,
      rating: rating || null,
      breaks: breaks.length > 0 ? breaks : [],
    });

    // Revalidate the path and return a success response
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error('Error creating event:', error);
    return { error: 'Failed to create event' };
  }
}

// Function to delete an event or task
// export async function deleteEvent(eventId: string): Promise<{ error: string } | { success: boolean }> {
//   if (!eventId) {
//     return { error: 'Event ID is required' };
//   }

//   try {
//     await db.delete(eventsTable).where(eventsTable.id.eq(eventId));

//     // Revalidate the path and return a success response
//     revalidatePath("/");

//     return { success: true };
//   } catch (error) {
//     console.error('Error deleting event:', error);
//     return { error: 'Failed to delete event' };
//   }
// }
