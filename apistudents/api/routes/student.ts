import { Hono } from "hono";
import drizzle from "../db/drizzle";
import { student } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const studentRouter = new Hono();

const studentSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  studentID: z.string().min(1),
  birthDay: z.string().min(1),
  sex: z.enum(["male", "female"]),
});

// GET all students
studentRouter.get("/", async (c) => {
  const allStudents = await drizzle.select().from(student);
  return c.json(allStudents);
});

// GET student by id
studentRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.select().from(student).where(eq(student.id, id));
  if (!result || result.length === 0) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json(result[0]);
});

// POST create student
studentRouter.post(
  "/",
  zValidator("json", studentSchema),
  async (c) => {
    const data = c.req.valid("json") as z.infer<typeof studentSchema>;
    const result = await drizzle
      .insert(student)
      .values(data)
      .returning();
    return c.json({ success: true, student: result[0] }, 201);
  }
);

// PATCH update student (partial update)
studentRouter.patch(
  "/:id",
  zValidator(
    "json",
    studentSchema.partial()
  ),
  async (c) => {
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json") as Partial<z.infer<typeof studentSchema>>;
    const updated = await drizzle.update(student).set(data).where(eq(student.id, id)).returning();
    if (updated.length === 0) {
      return c.json({ error: "Student not found" }, 404);
    }
    return c.json({ success: true, student: updated[0] });
  }
);

// DELETE student
studentRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await drizzle.delete(student).where(eq(student.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json({ success: true, student: deleted[0] });
});

export default studentRouter;