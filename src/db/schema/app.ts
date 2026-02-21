import { desc, relations } from "drizzle-orm";
import { pgTable, integer, text, varchar, timestamp } from "drizzle-orm/pg-core";

const timestamps = {
    createdAt: timestamp("created_at").notNull().defaultNow(),  //defaultNow() → sets timestamp on insert
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()).notNull(), 
    // $onUpdate() → automatically updates timestamp on record update
}

export const departments = pgTable("departments", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    code: varchar("code", { length: 10 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    ...timestamps,
})

export const subjects = pgTable("subjects", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    departmentId: integer("department_id").notNull().references(() => departments.id, { onDelete: "restrict" }),
     // foreign key to departments table, restrict deletion if referenced
    code: varchar("code", { length: 10 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    ...timestamps,
})

export const departmentRelations = relations(departments, ({ many }) => ({
    subjects: many(subjects)  // one-to-many relationship: one department has many subjects
}))

export const subjectRelations = relations(subjects, ({one, many}) => ({
    department: one(departments, {       // many-to-one relationship: each subject belongs to one department
        fields: [subjects.departmentId], // foreign key in subjects table
        references: [departments.id],    // references primary key in departments table
    }),
}));

export type Department = typeof departments.$inferSelect;  // infers the type of a department record when selected from the database
export type NewDepartment = typeof departments.$inferInsert; // infers the type of a new department record when inserting into the database (excludes auto-generated fields like id and timestamps)

export type Subjects = typeof subjects.$inferSelect;  // infers the type of a subject record when selected from the database
export type NewSubject = typeof subjects.$inferInsert;  // infers the type of a new subject record when inserting into the database (excludes auto-generated fields like id and timestamps)