import express, {Application, Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import { EventRouter } from "./routers/event.router";
import { TicketRouter } from "./routers/ticket.router";
import { TransactionRouter } from "./routers/transaction.router";
import { UserRouter } from "./routers/user.router"
import { OrganizerRouter } from "./routers/organizer.router"
import { AuthRouter } from "./routers/auth.router"

const PORT: number = 8000
const app: Application = express()

app.use(express.json());
app.use(cors());
export const upload = multer({ storage: multer.memoryStorage() });

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Connect to api");
});

const eventRouter = new EventRouter();
const ticketRouter = new TicketRouter();
const transactionRouter = new TransactionRouter();
const userRouter = new UserRouter()
const organizerRouter = new OrganizerRouter()
const authRouter = new AuthRouter()

app.use("/api/events", eventRouter.getRouter());
app.use("/api/tickets", ticketRouter.getRouter());
app.use("/api/transactions", transactionRouter.getRouter());
app.use("/api/users", userRouter.getRouter())
app.use("/api/organizers", organizerRouter.getRouter())
app.use("/api/auth", authRouter.getRouter())

app.listen(PORT, () =>
  console.log(`Server running in --> http://localhost:${PORT}/api`)
);