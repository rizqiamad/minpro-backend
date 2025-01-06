"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const event_router_1 = require("./routers/event.router");
const ticket_router_1 = require("./routers/ticket.router");
const transaction_router_1 = require("./routers/transaction.router");
const userProfile_router_1 = require("./routers/userProfile.router");
const organizerProfile_router_1 = require("./routers/organizerProfile.router");
const userAuth_router_1 = require("./routers/userAuth.router");
const organizerAuth_routes_1 = require("./routers/organizerAuth.routes");
const dashboard_router_1 = require("./routers/dashboard.router");
const review_router_1 = require("./routers/review.router");
const metadata_router_1 = require("./routers/metadata.router");
const PORT = 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.BASE_URL_FE,
    credentials: true,
}));
exports.upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
app.get("/api", (req, res) => {
    res.status(200).send("Connect to api");
});
const eventRouter = new event_router_1.EventRouter();
const ticketRouter = new ticket_router_1.TicketRouter();
const transactionRouter = new transaction_router_1.TransactionRouter();
const userProfileRouter = new userProfile_router_1.UserProfileRouter();
const organizerProfileRouter = new organizerProfile_router_1.OrganizerProfileRouter();
const userAuthRouter = new userAuth_router_1.UserAuthRouter();
const organizerAuthRouter = new organizerAuth_routes_1.OrganizerAuthRouter();
const graphRouter = new dashboard_router_1.GraphRouter();
const reviewRouter = new review_router_1.ReviewRouter();
const metadataRouter = new metadata_router_1.MetadataRouter();
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
app.listen(PORT, () => console.log(`Server running on --> http://localhost:${PORT}/api`));
exports.default = app;
