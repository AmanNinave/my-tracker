'use server';

import { db } from "@/db/drizzle";
import { eventsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string,
}

// Function to create an event or task
export async function createEvent(formData: FormData, tasks : Task[]): Promise<{ error: string } | { success: boolean }> {
  const type = formData.get('type') as string; // task or event
  const date = formData.get('date') as string;
  const category = formData.get('category') as string ;
  const subCategory = formData.get('subCategory') as string;
  const status = formData.get('status') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const remark = formData.get('remark') as string;
  const rating = formData.get('rating') ? parseInt(formData.get('rating') as string, 10) : null;
  const breaks = formData.get('breaks') ? JSON.parse(formData.get('breaks') as string) : [];
  
  const actualStartTime = formData.get('actualStartTime') as string;
  const actualEndTime = formData.get('actualEndTime') as string;
  
  const plannedStartTime = formData.get('plannedStartTime')  as string;
  const plannedStartDateTime = new Date(`${date}T${plannedStartTime}:00`);
  
  const plannedEndTime = formData.get('plannedEndTime') as string;
  const plannedEndDateTime = plannedEndTime ? new Date(`${date}T${plannedEndTime}:00`) : null;
  
  // Validate required fields
  if (!type || !plannedStartDateTime || !category || !title || !description) {
    return { error: 'Required fields are missing' };
  }

  try {
    await db.insert(eventsTable).values({
      type,
      plannedStartTime: plannedStartDateTime,
      plannedEndTime: plannedEndDateTime,
      actualStartTime: actualStartTime ? new Date(actualStartTime) : null,
      actualEndTime: actualEndTime ? new Date(actualEndTime) : null,
      category,
      subCategory: subCategory || null,
      title,
      description,
      remark: remark || null,
      rating: rating || null,
      breaks: breaks.length > 0 ? breaks : [],
      subTasks: tasks,
      status
    });

    // Revalidate the path and return a success response
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error('Error creating event:', error);
    return { error: 'Failed to create event' };
  }
}

export async function updateEventField(
  eventId: number,
  updates: Partial<{
    type: string;
    date: string;
    plannedStartTime: string;
    plannedEndTime: string;
    actualStartTime: string;
    actualEndTime: string;
    category: string;
    subCategory: string;
    title: string;
    description: string;
    remark: string;
    rating: number | null;
    breaks: any[];
    status: string;
    subTasks: any[];
  }>
): Promise<{ success: boolean } | { error: string }> {
  if (!eventId || Object.keys(updates).length === 0) {
    return { error: "Event ID and at least one update field are required." };
  }

  const formattedUpdates: Record<string, any> = { ...updates };

  // Format date/time fields if present
  if (updates.plannedStartTime) {
    formattedUpdates.plannedStartTime = new Date(updates.plannedStartTime);
  }
  if (updates.plannedEndTime) {
    formattedUpdates.plannedEndTime = new Date(updates.plannedEndTime);
  }
  if (updates.actualStartTime) {
    formattedUpdates.actualStartTime = new Date(updates.actualStartTime);
  }
  if (updates.actualEndTime) {
    formattedUpdates.actualEndTime = new Date(updates.actualEndTime);
  }

  try {
    await db.update(eventsTable)
      .set(formattedUpdates)
      .where(eq(eventsTable.id, eventId));

    // Revalidate the path to refresh data on the frontend
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error updating event:", error);
    return { error: "Failed to update event." };
  }
}


// function to delete an event or task
export async function deleteEvent(eventId: number): Promise<{ error: string } | { success: boolean }> {
  if (!eventId) {
    return { error: 'Event ID is required' };
  }

  try {
    await db.delete(eventsTable).where(eq(eventsTable.id, eventId));

    // Revalidate the path and return a success response
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { error: 'Failed to delete event' };
  }
}
