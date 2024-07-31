import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/vercel";
import fs from "fs";
// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  title: "Frog Frame",
});

app.frame("/", (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;
  return c.res({
    imageOptions: { format: "svg" },
    headers: {
      // "Content-Type": "image/svg+xml"
    },
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <img src="/hope-start.gif" alt="gif" />
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter custom fruit..." />,
      <Button value="apples">Apples</Button>,
      <Button.AddCastAction action="/foo/bar">Action</Button.AddCastAction>,
      <Button.AddCastAction action="/foo/act">Action</Button.AddCastAction>,
      // <Button value="bananas">Bananas</Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});
app.castAction(
  "/foo/bar",
  (c) => {
    return c.message({ message: "Action Succeeded" });
  },
  {
    name: "My Action",
    icon: "log",
  }
);
app.composerAction(
  "/foo/act",
  (c) => {
    return c.res({
      title: "My Composr Action",
      url: "https://example.com",
    });
  },
  {
    name: "Some Composer Action",
    description: "Cool Composer Action",
    icon: "image",
    imageUrl: "https://frog.fm/logo-light.svg",
  }
);

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
