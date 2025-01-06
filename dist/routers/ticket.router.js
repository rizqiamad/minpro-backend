"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRouter = void 0;
const express_1 = require("express");
const ticket_controller_1 = require("../controllers/ticket.controller");
class TicketRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.ticketController = new ticket_controller_1.TicketController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/:eventId", this.ticketController.getTickets);
        this.router.post("/:eventId", this.ticketController.createTicket);
    }
    getRouter() {
        return this.router;
    }
}
exports.TicketRouter = TicketRouter;
