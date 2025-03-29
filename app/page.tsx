import Header from "@/components/header/Header";
import MainView from "@/components/MainView";
import { db } from "@/db/drizzle";
import { CalendarEventType } from "@/lib/store";
import dayjs from "dayjs";
import { Event } from "@/utils/constants";
import { fetchEvents } from "@/utils/api";


const getEventsData = async () => {

  try {
    const data: Event[] = await fetchEvents();
    console.log("Fetched data:", data);
    return data.map((event) => ({
      ...event,
      date: dayjs(event.plannedStartTime).toISOString(), // Convert Dayjs to string
    }));
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return [];
  }
};

export default async function Home() {
  const dbEvents = await getEventsData();

  return (
    <div className="">
      <Header />
      <MainView eventsData={dbEvents as unknown as CalendarEventType[]} />
    </div>
  );
}
