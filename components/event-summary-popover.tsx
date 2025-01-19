'use client';

import React, { useRef, useEffect, useState, useTransition, useMemo } from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { IoCloseSharp } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarEventType } from "@/lib/store";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FiClock } from "react-icons/fi";
import { createEvent, deleteEvent, updateEventField } from "@/app/actions/event-actions";
import AddTime from "./add-time";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

interface EventSummaryPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEventType;
}
interface Task {
  id: number;
  title: string;
  description: string;
  status: string,
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

const breakCategories = [
  "Essential", // Breaks that are absolutely necessary (e.g., meal, rest).
  "Unessential", // Breaks that are not necessary (e.g., social media, shorts, movie).
  "Optional",  // Breaks that can be taken but are not mandatory.
  "Planned",   // Scheduled breaks (e.g., meetings, tasks, etc.).
  "Unplanned", // Unscheduled or spontaneous breaks.
  "Urgent",    // Breaks needed immediately due to emergencies or high priority.
];

const statuses = ["Pending", "In Progress", "Completed"];

function getStatusColor(status : string) {
  switch (status) {
    case "Pending":
      return "bg-blue-200 text-blue-700";
    case "In Progress":
      return "bg-yellow-200 text-yellow-700";
    case "Completed":
      return "bg-green-200 text-green-700";
    default:
      return ""; // Or a default color class
  }
}

export function EventSummaryPopover({ isOpen, onClose, event }: EventSummaryPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [editableEvent, setEditableEvent] = useState<CalendarEventType>(event);
  const [isEditMode, setIsEditMode] = useState(false); // Add edit mode state
  const [startShift, setStartShift] = useState(false); // Add edit mode state
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [updatedData , setUpdatedData] = useState({});
  const [isBreakBoxActive , setIsBreakBoxActive] = useState(false);
  const [breaksObj , setBreaksObj] = useState({ remark : '' , category : breakCategories[0]});
  const [showBreaks, setShowBreaks] = useState(false);

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
    let updatedValue = value;
    if(field =='plannedEndTime' || field =='plannedStartTime' ){
      updatedValue = `${event?.[field]?.format("YYYY-MM-DD")}T${value}:00`
    }
    if(field =='actualEndTime' || field == 'actualStartTime'){
      updatedValue = (new Date()).toString();
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

  const handleSave = (updatedData : any) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        const result = await updateEventField(+event.id, updatedData);
        if ("error" in result) {
          setError(result.error);
        } else if (result.success) {
          setSuccess(result.success);
          onClose();
        }
      } catch {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const handleDelete = () => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        const result = await deleteEvent(+event.id);
        if ("error" in result) {
          setError(result.error);
        } else if (result.success) {
          setSuccess(result.success);
          onClose();
        }
      } catch {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const handleTaskChange = (id: number, field: keyof Task, value: string) => {
    let updatedTasks = editableEvent.subTasks?.map((task) => task.id === id ? { ...task, [field]: value } : task ) || [];
    handleChange('subTasks' , updatedTasks );
  };

  const handleRemoveTask = (id: number) => {
    handleChange('subTasks' , editableEvent.subTasks.filter((task) => task.id !== id) );
  };

  const handleAddBreakSave = () => {
    let breaksData = [...event.breaks];
    if( breakData.state == 'Pause'){
      breaksData = [...breaksData, { startTime : new Date() , endTime : null , remark : breaksObj.remark , category : breaksObj.category }]
    }else if(breakData.state == 'Resume'){
      breaksData[breaksData.length-1].endTime = new Date();
      breaksData[breaksData.length-1].remark = breaksObj.remark;
      breaksData[breaksData.length-1].category = breaksObj.category;
    }
    handleSave({breaks : breaksData});
  }

  const handlePauseAndResumeBreak = (breakData : any) => {
    setBreaksObj({...breakData});
    setIsBreakBoxActive(true);
  }

  const breakData = useMemo(() => {
    if(event.breaks.length > 0){
      let lastBreakData = event.breaks[event.breaks.length-1];
      if(lastBreakData.endTime == null && lastBreakData.startTime !== null){
        return {...lastBreakData, state : "Resume"};
      }else{
        return { remark : '' , category : breakCategories[0] , startTime : null , endTime : null , state : "Pause"};
      }
    } else {
      return { remark : '' , category : breakCategories[0] , startTime : null , endTime : null , state : "Pause"};
    }
  }, [event.breaks])

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
          <Button onClick={handleDelete}>Delete</Button>
          <Button onClick={() => setIsEditMode(!isEditMode)}>{!isEditMode ? "Edit" : "View"}</Button>
          <Button disabled={!!event.actualEndTime} onClick={() => { handleSave({[!event.actualStartTime ? "actualStartTime": "actualEndTime"] : (new Date()).toString()}) }}>{!event.actualStartTime ? "Start" : "End"}</Button>
          {!!event.actualStartTime && !event.actualEndTime  && <Button disabled={isBreakBoxActive} onClick={() => { handlePauseAndResumeBreak(breakData); }}>{ breakData.state }</Button> }
        </div>
        {isBreakBoxActive && 
          <div className="m-3 border rounded-md border-gray-200 py-2 px-2 mb-2">
            <select // Use lowercase 'select' for the native HTML element
              value={breaksObj.category}
              onChange={(e) => {setBreaksObj({...breaksObj, category : e.target.value})}}
              className="w-full mb-2 border rounded p-2 " // Basic styling
            >
              {breakCategories.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
            <Textarea
              value={breaksObj.remark}
              onChange={(e) => {setBreaksObj({...breaksObj, remark : e.target.value})}}
              placeholder="Add a remark..."
            />
            <div className="flex justify-end space-x-2 mt-2">
              <Button variant="ghost" onClick={() => {setIsBreakBoxActive(false)}}>
                Cancel
              </Button>
              <Button onClick={() => {handleAddBreakSave()}} disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        }
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

              {/* Task section */}
              { editableEvent.type == 'event' &&
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">
                      Tasks
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-blue-600"
                      onClick={() => {
                        handleChange('subTasks' , [...editableEvent?.subTasks , { id: Number(Date.now()), title: "", description: "", status: "pending" }] ) 
                      }}
                    >
                      Add Task
                    </Button>
                  </div>
                  <div className="space-y-4 mt-2">
                    {editableEvent?.subTasks?.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start space-x-3 border p-2 rounded-lg"
                      > 
                        <div className="w-full">
                          <Input
                            type="text"
                            placeholder="Task Title"
                            value={task.title}
                            onChange={(e) =>
                              handleTaskChange(task.id, "title", e.target.value)
                            }
                            className="flex-1"
                          />
                          <Textarea
                            placeholder="Description"
                            value={task.description}
                            onChange={(e : any) =>
                              handleTaskChange(task.id, "description", e.target.value)
                            }
                            className="flex-1 "
                          />
                        </div>
                        <div className="flex-col justify-start items-end ">
                          <select // Use lowercase 'select' for the native HTML element
                            value={task.status}
                            onChange={(e) => handleTaskChange(task.id, "status", e.target.value)}
                            className="w-full mt-0 border rounded p-2 " // Basic styling
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTask(task.id)}
                            className="ml-auto"
                          >
                            <IoCloseSharp className="h-4 w-4 text-red-500 " />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              }

              {/* footer buttons */}
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={() => {handleSave(updatedData)}} disabled={isPending}>
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
                  {editableEvent.subTasks.map((subTask) => (
                    <li key={subTask.id} className="border rounded-md border-gray-200 py-2 px-4 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{subTask.title}</span>
                        {/* Conditionally display status with background color */}
                        <span
                          className={`ml-2 text-sm font-medium px-2 py-1 rounded-md ${getStatusColor(
                            subTask.status
                          )}`}
                        >
                          {subTask.status}
                        </span>
                      </div>
                      <p className="text-gray-500 ml-3">{subTask.description}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong onClick={() => {setShowBreaks(!showBreaks)}}>Breaks</strong>
                { showBreaks && <ul className="list-disc pl-5">
                  {editableEvent.breaks.map((val : any) => (
                    <li  className="border rounded-md border-gray-200 py-2 px-4 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{dayjs(val.startTime).format("HH:mm")}</span>
                        <span className="font-medium">{dayjs(val.startTime).format("HH:mm")}</span>
                        {/* Conditionally display status with background color */}
                        <span
                          className={`ml-2 text-sm font-medium px-2 py-1 rounded-md ${getStatusColor(
                            val.status
                          )}`}
                        >
                          {val.category}
                        </span>
                      </div>
                      <p className="text-gray-500 ml-3">{val.remark}</p>
                    </li>
                  ))}
                </ul>}
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
