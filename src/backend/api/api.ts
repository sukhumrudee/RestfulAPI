import { Hono } from "hono";
import booksApi from "./bookapi";
import menuApi from "./menuapi";
import ordersApi from "./orderapi";

const apiRouter = new Hono();

apiRouter.route('/v1/books', booksApi);
apiRouter.route('/v1/menu', menuApi);
apiRouter.route('/v1/orders', ordersApi);

export default apiRouter;