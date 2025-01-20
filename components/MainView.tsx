"use client";
import {
  CalendarEventType,
  useDateStore,
  useEventStore,
  useViewStore,
} from "@/lib/store";
import MonthView from "./month-view";
import SideBar from "./sidebar/SideBar";
import WeekView from "./week-view";
import DayView from "./day-view";
import EventPopover from "./event-popover";
import {EventSummaryPopover}  from "./event-summary-popover";
import { useEffect } from "react";
import dayjs from "dayjs";

export default function MainView({
  eventsData,
}: {
  eventsData: CalendarEventType[];
}) {
  const { selectedView } = useViewStore();

  const {
    isPopoverOpen,
    closePopover,
    isEventSummaryOpen,
    closeEventSummary,
    selectedEvent,
    setEvents,
  } = useEventStore();

  const { userSelectedDate } = useDateStore();
  
  useEffect(() => {
    const mappedEvents: CalendarEventType[] = eventsData.map((event) => ({
      id: event.id,
      type: event.type, // "event" or "task"
      plannedStartTime: dayjs(event.plannedStartTime),
      plannedEndTime: dayjs(event.plannedEndTime),
      actualStartTime: event.actualStartTime ? dayjs(event.actualStartTime) : null,
      actualEndTime: event.actualEndTime ? dayjs(event.actualEndTime) : null,
      category: event.category,
      subCategory: event.subCategory,
      status: event.status, // "pending", "completed", etc.
      title: event.title,
      description: event.description,
      remark: event.remark || null,
      rating: event.rating || null,
      breaks: event.breaks || [], // Array of break descriptions or times
      subTasks: event.subTasks?.map((subTask) => ({
        id: subTask.id,
        title: subTask.title,
        status: subTask.status,
        description: subTask.description,
      })) || [],
      createdAt: dayjs(event.createdAt),
      updatedAt: dayjs(event.updatedAt),
      date: dayjs(event.plannedStartTime), // Event date
    }));       

    setEvents(mappedEvents);
  }, [eventsData, setEvents]);

  return (
    <div className="flex">
      {/* SideBar */}
      <SideBar />

      <div className="w-full flex-1">
        {selectedView === "month" && <MonthView />}
        {selectedView === "week" && <WeekView />}
        {selectedView === "day" && <DayView />}
      </div>
      {isPopoverOpen && (
        <EventPopover
          isOpen={isPopoverOpen}
          onClose={closePopover}
          date={userSelectedDate.format("YYYY-MM-DD")}
        />
      )}

      {isEventSummaryOpen && selectedEvent && (
        <EventSummaryPopover
          isOpen={isEventSummaryOpen}
          onClose={closeEventSummary}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
