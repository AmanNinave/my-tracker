'use client';

import React, { useRef, useEffect, useState, useTransition } from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { IoCloseSharp } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarEventType } from "@/lib/store";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FiClock } from "react-icons/fi";
import { createEvent, updateEventField } from "@/app/actions/event-actions";
import AddTime from "./add-time";

interface EventSummaryPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEventType;
}

const categories = [
  "Work",
  "Personal",
  "Health",
  "Finance",
  "Education",
  "Shopping",
  "Travel",
  "Entertainment",
  "Family",
  "Other",
];

const subcategories = [
  "Urgent",
  "Important",
  "Optional",
  "Planned",
  "Unplanned",
  "Meeting",
  "Deadline",
  "Follow-up",
  "Relaxation",
  "Miscellaneous",
];

const statuses = ["Pending", "In Progress", "Completed"];

export function EventSummaryPopover({ isOpen, onClose, event }: EventSummaryPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [editableEvent, setEditableEvent] = useState<CalendarEventType>(event);
  const [isEditMode, setIsEditMode] = useState(false); // Add edit mode state
  const [startShift, setStartShift] = useState(false); // Add edit mode state
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [updatedData , setUpdatedData] = useState({});

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange = (field: keyof CalendarEventType, value: any) => {
    debugger;
    let updatedValue = value;
    if(field=='actualEndTime' || field == 'actualStartTime' || field =='plannedEndTime' || field =='plannedStartTime' ){
      updatedValue = `${event?.[field]?.format("YYYY-MM-DD")}T${value}:00`
    }
    setUpdatedData((prev : any) => ({
      ...prev,
      [field] : updatedValue
    }))
    setEditableEvent((prev : any) => ({
      ...prev,
      [field]: updatedValue,
    }));
  };

  const handleSave = () => {
    setError(null);
    setSuccess(null);
    console.log(editableEvent)
    startTransition(async () => {
      try {
        const result = await updateEventField(+event.id, updatedData);
        if ("error" in result) {
          setError(result.error);
        } else if (result.success) {
          setSuccess(result.success);
        }
      } catch {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        ref={popoverRef}
        className="w-full max-w-md rounded-lg bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between rounded-md bg-slate-100 p-1">
          {/* <HiOutlineMenuAlt4 /> */}
          <div className="flex items-center space-x-3 text-sm">
              <FiClock className="size-5 text-gray-600 ml-1" />
              <p>{dayjs(editableEvent.plannedStartTime).format("dddd, MMMM D YYYY")}</p>
          </div>
          <p><strong>{editableEvent.type}</strong> </p>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={onClose}
          >
            <IoCloseSharp className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-center gap-1">
          <Button onClick={() => {}}>Delete</Button>
          <Button onClick={() => setIsEditMode(!isEditMode)}>{!isEditMode ? "Edit" : "View"}</Button>
          <Button onClick={() => setStartShift(!startShift)}>{startShift ? "Start" : "End"}</Button>
          <Button onClick={() => setStartShift(!startShift)}>{startShift ? "Pause" : "Resume"}</Button>
        </div>
        <div className="p-6 space-y-4">
          {isEditMode ? (
            <>
              {/* Title */}
              <div>
                <Input
                  type="text"
                  name="title"
                  placeholder="Event Title"
                  value={editableEvent.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="my-4 rounded-none border-0 border-b text-2xl focus-visible:border-b-2 focus-visible:border-b-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            
              {/* Planned start Time */}
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-3">
                  <div>{editableEvent.type == 'event' ? "Start Time" : "Time"}</div>
                  <div className="flex items-center space-x-3 text-sm">
                    <AddTime value={dayjs(editableEvent.plannedStartTime).format("HH:mm")} onTimeSelect={(time) => {handleChange("plannedStartTime", time)}} />
                  </div>
                </div>
                {editableEvent.type == 'event' && 
                  <div className="flex items-center space-x-3">
                    <div>End Time</div>
                    <div className="flex items-center space-x-3 text-sm">
                      <AddTime value={dayjs(editableEvent.plannedEndTime).format("HH:mm")} onTimeSelect={(time) => {handleChange("plannedEndTime", time)}} />
                    </div>
                  </div>
                }
              </div>

              {/* category & subcategory */}
              <div className="flex justify-between gap-3">
                {/* category */}
                <select
                  value={editableEvent.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-md h-7"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {/* subcategory */}
                <select
                  value={editableEvent.subCategory}
                  onChange={(e) => handleChange("subCategory", e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-md h-7"
                >
                  {subcategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* description */}
              <Textarea
                value={editableEvent.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Add a description..."
              />

              {/* footer buttons */}
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isPending}>
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>


              {error && <p className="mt-2 px-6 text-red-500">{error}</p>}
              {success && <p className="mt-2 px-6 text-green-500">Success</p>}
            </>
          ) : (
            <>
              <div className="flex justify-between"><p><strong>Time:</strong> {dayjs(editableEvent.plannedStartTime).format("HH:mm")} - {dayjs(editableEvent.plannedEndTime).format("HH:mm")}</p> <p>{editableEvent.category} - {editableEvent.subCategory}</p></div>
              <div>
                <strong>{editableEvent.title}</strong> 
                <p className="ml-3">{editableEvent.description}</p>
              </div>
              <div>
                <strong>Tasks</strong>
                <ul className="list-disc pl-5">
                  {editableEvent.subTasks.map((subTask : any) => (
                    <li key={subTask.id}>
                      <strong>{subTask.title}</strong> 
                      <p className="ml-3">{subTask.description}</p> 
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
