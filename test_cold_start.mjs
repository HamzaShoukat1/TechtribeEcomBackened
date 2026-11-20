import { app } from "./dist/app.js";
import http from "http";

const server = http.createServer(app);
server.listen(0, () => {
  const port = server.address().port;
  http.get(`http://localhost:${port}/`, (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => {
      console.log("Status:", res.statusCode);
      console.log("Body:", data);
      server.close();
    });
  }).on("error", (e) => {
    console.error("HTTP Error:", e.message);
    server.close();
  });
});
