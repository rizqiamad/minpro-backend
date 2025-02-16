import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import { EventRouter } from "./routers/event.router";
import { TicketRouter } from "./routers/ticket.router";
import { TransactionRouter } from "./routers/transaction.router";
import { UserProfileRouter } from "./routers/userProfile.router";
import { OrganizerProfileRouter } from "./routers/organizerProfile.router";
import { UserAuthRouter } from "./routers/userAuth.router";
import { OrganizerAuthRouter } from "./routers/organizerAuth.routes";
import { GraphRouter } from "./routers/dashboard.router";
import { ReviewRouter } from "./routers/review.router";
import { MetadataRouter } from "./routers/metadata.router";

const PORT: number = 8000;
const app: Application = express();

app.use(express.json());
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    origin: process.env.BASE_URL_FE,
    credentials: true,
  })
);
export const upload = multer({ storage: multer.memoryStorage() });

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Connect to api");
});

const eventRouter = new EventRouter();
const ticketRouter = new TicketRouter();
const transactionRouter = new TransactionRouter();
const userProfileRouter = new UserProfileRouter();
const organizerProfileRouter = new OrganizerProfileRouter();
const userAuthRouter = new UserAuthRouter();
const organizerAuthRouter = new OrganizerAuthRouter();
const graphRouter = new GraphRouter();
const reviewRouter = new ReviewRouter();
const metadataRouter = new MetadataRouter();

app.use("/api/events", eventRouter.getRouter());
app.use("/api/tickets", ticketRouter.getRouter());
app.use("/api/transactions", transactionRouter.getRouter());
app.use("/api/users", userProfileRouter.getRouter());
app.use("/api/organizers", organizerProfileRouter.getRouter());
app.use("/api/auth/user", userAuthRouter.getRouter());
app.use("/api/auth/organizer", organizerAuthRouter.getRouter());
app.use("/api/graph", graphRouter.getRouter());
app.use("/api/reviews", reviewRouter.getRouter());
app.use("/api/metadata", metadataRouter.getRouter());

app.listen(PORT, () =>
  console.log(`Server running on --> http://localhost:${PORT}/api`)
);

export default app;
