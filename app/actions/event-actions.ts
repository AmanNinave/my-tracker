'use server';

import { db } from "@/db/drizzle";
import { eventsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Break, Task } from "@/utils/constants";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API + "/events";

export async function createEvent(
  formData: FormData,
  tasks: Task[]
): Promise<{ error: string } | { success: boolean }> {
  const type = formData.get("type") as string;
  const date = formData.get("date") as string;
  const category = formData.get("category") as string;
  const subCategory = formData.get("subCategory") as string;
  const status = formData.get("status") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const remark = formData.get("remark") as string;
  const rating = formData.get("rating") ? parseInt(formData.get("rating") as string, 10) : 0;
  const breaks = formData.get("breaks") ? JSON.parse(formData.get("breaks") as string) : [];

  const plannedStartTime = formData.get("plannedStartTime") as string;
  const plannedEndTime = formData.get("plannedEndTime") as string;
  const actualStartTime = formData.get("actualStartTime") as string;
  const actualEndTime = formData.get("actualEndTime") as string;

  const plannedStartDateTime = new Date(`${date}T${plannedStartTime}:00`).toISOString();
  const plannedEndDateTime = plannedEndTime ? new Date(`${date}T${plannedEndTime}:00`).toISOString() : null;
  const actualStartDateTime = actualStartTime ? new Date(actualStartTime).toISOString() : null;
  const actualEndDateTime = actualEndTime ? new Date(actualEndTime).toISOString() : null;

  if (!type || !plannedStartDateTime || !category || !title || !description) {
    return { error: "Required fields are missing" };
  }

  const requestBody: Record<string, any> = {
    type,
    planned_start_time: plannedStartDateTime,
    planned_end_time: plannedEndDateTime,
    actual_start_time: actualStartDateTime,
    actual_end_time: actualEndDateTime,
    category,
    title,
    description,
    status,
    sub_category:subCategory,
    remark,
    rating,
    breaks,
    sub_tasks: tasks,
  };

  try {
    const res = await fetch(`${API_URL}/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) throw new Error(`Failed to create event. Status: ${res.status}`);

    return res.json();
  } catch (error) {
    console.error("Error creating event:", error);
    return { error: "Failed to create event" };
  }
}


interface EventUpdates {
  type: string | null;
  date: string | Date | null;
  plannedStartTime: string | Date | null;
  plannedEndTime: string | Date | null;
  actualStartTime: string | Date | null;
  actualEndTime: string | Date | null;
  category: string;
  subCategory: string;
  title: string;
  description: string;
  remark: string;
  rating: number | null;
  breaks: Array<Break>;
  status: string;
  subTasks: Task[];
}

export async function updateEventField(
  eventId: number,
  updates: Partial<EventUpdates>
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
