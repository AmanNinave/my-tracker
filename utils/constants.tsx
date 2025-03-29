export interface Task {
  id: number;
  title: string;
  description: string;
  status: string,
}


export interface Break{ 
  startTime : Date | null , 
  endTime : Date | null , 
  remark : string , 
  category : string 
}

export interface Event {
  id: number;
  type: string;
  plannedStartTime: string;
  plannedEndTime?: string;
  category: string;
  subCategory?: string;
  title: string;
  description: string;
  remark?: string;
  rating?: number;
  breaks?: number;
  subTasks?: string[];
  status: string;
}

export interface EventUpdates {
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

export const categories = [
  "Work",
  "Personal",
  "Routine",
  "Health",
  "Finance",
  "Education",
  "Shopping",
  "Travel",
  "Entertainment",
  "Family",
  "Other",
];

export const subcategories = [
  "Important",
  "Optional",
  "Urgent",
  "Planned",
  "Unplanned",
  "Meeting",
  "Deadline",
  "Follow-up",
  "Relaxation",
  "Miscellaneous",
];

export const breakCategories = [
  "Important", // Breaks that are absolutely necessary (e.g., meal, rest).
  "Optional",  // Breaks that can be taken but are not mandatory.
  "Urgent",    // Breaks needed immediately due to emergencies or high priority.
  "Planned",   // Scheduled breaks (e.g., meetings, tasks, etc.).
  "Unplanned", // Unscheduled or spontaneous breaks.
];

export const statuses = ["Pending", "In Progress", "Completed"];
