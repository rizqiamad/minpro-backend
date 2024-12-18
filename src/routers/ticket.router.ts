import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller";

export class TicketRouter {
  private router: Router;
  private ticketController: TicketController;

  constructor() {
    this.router = Router();
    this.ticketController = new TicketController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/:eventId", this.ticketController.getTickets);
    this.router.post("/:eventId", this.ticketController.createTicket);
  }

  getRouter(): Router {
    return this.router;
  }
}
