import "@dotenvx/dotenvx/config"

import { serve } from "@hono/node-server";
import { app } from "./app";

serve(
  {
    port: 2027,
    fetch: app.fetch,
  },
  (info) => console.log(`Server started on http://localhost:${info.port}`)
);
