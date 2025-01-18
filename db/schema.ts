// import { pgTable, text, timestamp, serial } from 'drizzle-orm/pg-core';


// // Events table schema
// export const eventsTable = pgTable('events', {
//   id: serial('id').primaryKey(),  
//   date: timestamp('date').notNull(), 
//   title: text('title').notNull(),  
//   description: text('description').notNull(),  
// });


import { pgTable, text, timestamp, serial, integer, jsonb } from 'drizzle-orm/pg-core';

// Updated Events/Tasks table schema
export const eventsTable = pgTable('tasks', {
  id: serial('id').primaryKey(),  // Unique identifier
  type: text('type').notNull(),  // Type -> 'task' or 'event'
  plannedStartTime: timestamp('planned_start_time').notNull(),  // Planned start time
  plannedEndTime: timestamp('planned_end_time'),  // Planned end time (optional)
  actualStartTime: timestamp('actual_start_time'),  // Actual start time (optional)
  actualEndTime: timestamp('actual_end_time'),  // Actual end time (optional)
  category: text('category').notNull(),  // Category (e.g., 'work', 'personal')
  subCategory: text('sub_category'),  // Sub-category (optional)
  title: text('title').notNull(),  // Title
  description: text('description').notNull(),  // Description
  remark: text('remark'),  // Remarks (optional)
  rating: integer('rating'),  // Rating (optional, numeric)
  breaks: jsonb('breaks').default([]),  // Breaks as an array of objects [{ start-time, end-time, remark }]
  createdAt: timestamp('created_at').defaultNow().notNull(),  // Timestamp of creation
  updatedAt: timestamp('updated_at').defaultNow().notNull(),  // Timestamp of last update
});
