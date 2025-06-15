import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono().basePath("/v1");

app.use(logger());

app.get("/health", (c) => c.text("OK"));

export { app };

export type APpType = typeof app;
