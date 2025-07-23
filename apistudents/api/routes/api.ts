import { Hono } from "hono";
import studentsRouter from "./student.js";
import { bearerAuth } from "hono/bearer-auth";
import { env } from "hono/adapter";

const apiRouter = new Hono();

apiRouter.get("/", (c) => {
  return c.json({ message: "Student API" });
});

// apiRouter.use(
//   "*",
//   bearerAuth({
//     verifyToken: async (token, c) => {
//       const { API_SECRET } = env<{ API_SECRET: string }>(c);
//       return token === API_SECRET;
//     },
//   })
// );

apiRouter.route("/student", studentsRouter);

export default apiRouter;