/** @jsxImportSource frog/jsx */
import { Button, Frog } from "frog";
import { handle } from "frog/next";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { addTeleportAction } from "./action/add-teleport";
import { addMapAction } from "./action/add-map";
import { State } from "./utils";
import { getCurBaseUrl } from "@/app/utils";

const isDev = process.env.NODE_ENV === "development";

const app = new Frog<{ State: State }>({
  imageOptions: { format: "svg" },
  title: "farpg",
  basePath: "/api",
  browserLocation: "/",
  initialState: {
    count: 0,
    power: 0,
  },
});

app.frame("/", (c) => {
  return c.res({
    image: `${getCurBaseUrl()}/home.png`,
    intents: [
      <Button.AddCastAction action="/add-teleport">
        Add Teleport
      </Button.AddCastAction>,
      <Button.AddCastAction action="/add-map">Add Map</Button.AddCastAction>,
    ],
  });
});

app.castAction("/add-teleport", (c) => addTeleportAction(c), {
  name: "Aetolia Teleport",
  icon: "log",
});
app.castAction("/add-map", (c) => addMapAction(c), {
  name: "Aetolia Map",
  icon: "log",
});

devtools(app, { serveStatic });

// for development environment , use nodejs
// export const runtime = 'edge'
export const GET = handle(app);
export const POST = handle(app);
