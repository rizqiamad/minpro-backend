import express, { Request, Response } from "express";
import cors from "cors";
import { EventRouter } from "./routers/event.router";
import multer from "multer";
import { TicketRouter } from "./routers/ticket.router";
import { TransactionRouter } from "./routers/transaction.router";

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(cors());
export const upload = multer({ storage: multer.memoryStorage() });

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Connect to api");
});

const eventRouter = new EventRouter();
const ticketRouter = new TicketRouter();
const transactionRouter = new TransactionRouter();

app.use("/api/events", eventRouter.getRouter());
app.use("/api/tickets", ticketRouter.getRouter());
app.use("/api/transactions", transactionRouter.getRouter());

app.listen(PORT, () =>
  console.log(`Server running in --> http://localhost:${PORT}/api`)
);
