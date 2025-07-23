import * as t from "drizzle-orm/pg-core";

export const sexEnum = t.pgEnum('sex', ['male', 'female']);

export const student = t.pgTable("student", {
  id: t.bigint({ mode: "number" }).primaryKey().notNull(),
  firstName: t.varchar("first_name", { length: 255 }).notNull(),
  lastName: t.varchar("last_name", { length: 255 }).notNull(),
  studentID: t.varchar("student_id", { length: 255 }).notNull(),
  birthDay: t.varchar("birth_day", { length: 255 }).notNull(),
  sex: sexEnum("sex").notNull()
});