import express, { Request, Response } from "express";
import cors from "cors";
import { EventRouter } from "./routers/event.router";

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(cors());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Connect to api");
});

const eventRouter = new EventRouter();

app.use("/api/events", eventRouter.getRouter());

app.listen(PORT, () =>
  console.log(`Server running in --> http://localhost:${PORT}/api`)
);
