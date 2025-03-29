import Header from "@/components/header/Header";
import MainView from "@/components/MainView";
import { db } from "@/db/drizzle";
import { CalendarEventType } from "@/lib/store";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Event } from "@/utils/constants";
import { fetchEvents } from "@/utils/api";


dayjs.extend(utc);
dayjs.extend(timezone);

const getEventsData = async () => {

  try {
    const data: Event[] = await fetchEvents();
    console.log("Fetched data:", data);
    return data.map((event) => ({
      ...event,
      date: dayjs.utc(event.plannedStartTime).tz("Asia/Kolkata").format(),
      plannedStartTime: dayjs.utc(event.plannedStartTime).tz("Asia/Kolkata").format(),
      plannedEndTime: event.plannedEndTime ? dayjs.utc(event.plannedEndTime).tz("Asia/Kolkata").format() : null,
      actualStartTime: event.actualStartTime ? dayjs.utc(event.actualStartTime).tz("Asia/Kolkata").format() : null,
      actualEndTime: event.actualEndTime ? dayjs.utc(event.actualEndTime).tz("Asia/Kolkata").format() : null,
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
