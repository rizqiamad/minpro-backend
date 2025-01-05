import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller";
import { GraphController } from "../controllers/dashboard.controller";
import { verifyToken } from "../middlewares/verify";

export class GraphRouter {
  private router: Router;
  private graphController: GraphController;

  constructor() {
    this.router = Router();
    this.graphController = new GraphController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/eventaktif",
      verifyToken,
      this.graphController.getActiveEvent
    );
    this.router.get(
      "/graphevent",
      verifyToken,
      this.graphController.getCourses
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
